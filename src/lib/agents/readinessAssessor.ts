/**
 * Agent 2: User Readiness Assessor
 * Determines user readiness to purchase in percentages and provides buying indicators
 */

import { ReadinessAssessment, Message, SalesPlan } from '@/types'

export class ReadinessAssessor {
  private apiUrl: string
  private apiKey: string
  private modelName: string

  constructor(apiUrl: string, apiKey: string, modelName: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
    this.modelName = modelName
  }

  private buildAssessmentPrompt(
    userMessage: string,
    chatHistory: string,
    currentPlan?: SalesPlan,
    previousReadiness?: ReadinessAssessment
  ): string {
    /**
     * Build prompt for readiness assessment with trend analysis
     */

    // Build current plan context
    let planContext = ""
    if (currentPlan) {
      planContext = `
CURRENT SALES PLAN IN PROGRESS:
- Strategy: ${currentPlan.strategy || 'None'}
- Target Product: ${currentPlan.target_product || 'None'}
- Approach: ${currentPlan.approach_style || 'None'}
- Plan Status: ${currentPlan.plan_status || 'new'}

Consider: Is this plan working? Is user responding positively to current strategy?
`
    }

    // Build trend analysis context
    let trendContext = ""
    if (previousReadiness) {
      const prevReadiness = previousReadiness.readiness_percentage || 0
      trendContext = `
PREVIOUS READINESS ASSESSMENT:
- Previous Readiness: ${prevReadiness}%
- Previous Engagement: ${previousReadiness.engagement_level || 'unknown'}
- Previous Signals: ${previousReadiness.buying_signals?.join(', ') || 'none'}

TREND ANALYSIS REQUIRED:
- Compare current vs previous readiness
- Determine if user is becoming more or less interested
- Identify if current approach is working
`
    }

    return `You are a user readiness assessment agent for an OnlyFans model named Noa.

MISSION: Analyze user's readiness to purchase content AND track progress/trends.

${planContext}

${trendContext}

CONVERSATION HISTORY:
${chatHistory}

USER'S CURRENT MESSAGE:
${userMessage}

ASSESSMENT FRAMEWORK:

1. READINESS PERCENTAGE (0-100):
- 0-20%: Just curious, browsing
- 21-40%: Showing interest, needs warming up
- 41-60%: Engaged, considering purchase
- 61-80%: Very interested, ready for soft sell
- 81-100%: Hot lead, ready for direct approach

CRITICAL PURCHASE INTENT SIGNALS (should result in 70%+ readiness):
- Direct content requests: "what can you show me?", "show me something", "let me see"
- Explicit requests: "show me your [body part]", sexual content requests
- Urgency indicators: "show me or I leave", "just show me", frustration with teasing
- Purchase exploration: "what do you have?", "what's available?", pricing questions

Return ONLY valid JSON:
{
  "readiness_percentage": 65,
  "trend": "improving",
  "buying_signals": ["content_requests"],
  "resistance_signs": [],
  "engagement_level": "high",
  "timing_recommendation": "direct_approach",
  "concerns": "None identified",
  "strategic_insight": "User showing strong interest",
  "reasoning": "User asking for content indicates purchase intent"
}`
  }

  async assessReadiness(
    userMessage: string,
    chatHistory: Message[],
    currentPlan?: SalesPlan,
    previousReadiness?: ReadinessAssessment
  ): Promise<ReadinessAssessment> {
    try {
      // Convert chat history to string
      const historyStr = chatHistory
        .map(m => `${m.role}: ${m.content}`)
        .join('\n')

      // Build prompt with trend analysis
      const prompt = this.buildAssessmentPrompt(userMessage, historyStr, currentPlan, previousReadiness)

      // Make API call
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: "user", content: prompt }],
          stream: false,
          temperature: 0.2
        })
      })

      if (response.ok) {
        const result = await response.json()
        const content = result.choices?.[0]?.message?.content || "{}"

        // Parse JSON response
        let assessment: ReadinessAssessment
        try {
          assessment = JSON.parse(content)
        } catch {
          // Extract JSON from wrapped text
          let jsonContent = content
          if (content.includes("```json")) {
            const jsonStart = content.indexOf("```json") + 7
            const jsonEnd = content.indexOf("```", jsonStart)
            jsonContent = content.substring(jsonStart, jsonEnd).trim()
          } else if (content.includes("{") && content.includes("}")) {
            const jsonStart = content.indexOf("{")
            const jsonEnd = content.lastIndexOf("}") + 1
            jsonContent = content.substring(jsonStart, jsonEnd)
          }
          
          try {
            assessment = JSON.parse(jsonContent)
          } catch {
            // Final fallback
            assessment = {
              readiness_percentage: 30,
              trend: 'new',
              buying_signals: [],
              resistance_signs: [],
              engagement_level: 'medium',
              timing_recommendation: 'soft_approach',
              concerns: "Assessment parsing failed",
              strategic_insight: "Using fallback assessment",
              reasoning: "JSON parsing failed"
            }
          }
        }

        // Ensure required fields and bounds
        return {
          readiness_percentage: Math.max(0, Math.min(100, assessment.readiness_percentage || 30)),
          trend: assessment.trend || 'new',
          buying_signals: assessment.buying_signals || [],
          resistance_signs: assessment.resistance_signs || [],
          engagement_level: assessment.engagement_level || 'medium',
          timing_recommendation: assessment.timing_recommendation || 'soft_approach',
          concerns: assessment.concerns || "No concerns identified",
          strategic_insight: assessment.strategic_insight || "Assessment completed",
          reasoning: assessment.reasoning || "Standard assessment"
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error('ReadinessAssessor error:', error)
      return {
        readiness_percentage: 20,
        trend: 'new',
        buying_signals: [],
        resistance_signs: ["system_error"],
        engagement_level: 'low',
        timing_recommendation: 'wait',
        concerns: `System error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        strategic_insight: "Error occurred during assessment",
        reasoning: "Using fallback due to error"
      }
    }
  }
}