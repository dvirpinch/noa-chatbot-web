/**
 * Agent 1: Sales Strategy Planner
 * Creates strategic sales plans based on conversation context and user behavior
 */

import { SalesPlan, Message, ReadinessAssessment } from '@/types'

export class SalesPlanner {
  private apiUrl: string
  private apiKey: string
  private modelName: string

  constructor(apiUrl: string, apiKey: string, modelName: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
    this.modelName = modelName
  }

  private buildStrategicPrompt(
    userMessage: string,
    chatHistory: string,
    readinessAssessment: ReadinessAssessment,
    currentPlan?: SalesPlan,
    conversationStage: string = "early",
    readinessHistory?: ReadinessAssessment[]
  ): string {
    /**
     * Build prompt for strategic planning with plan validation and decision-making
     */

    // Extract readiness data
    const currentReadiness = readinessAssessment.readiness_percentage || 30
    const trend = readinessAssessment.trend || 'new'
    const timing = readinessAssessment.timing_recommendation || 'soft_approach'

    // Build readiness trend context
    let trendContext = ""
    if (readinessHistory && readinessHistory.length > 1) {
      const prevReadiness = readinessHistory[readinessHistory.length - 2]?.readiness_percentage || 0
      trendContext = `
READINESS TREND ANALYSIS:
- Previous Readiness: ${prevReadiness}%
- Current Readiness: ${currentReadiness}%
- Trend: ${trend}
- Change: ${currentReadiness >= prevReadiness ? '+' : ''}${currentReadiness - prevReadiness} percentage points
`
    }

    // Build current plan analysis
    let planAnalysis = ""
    if (currentPlan) {
      planAnalysis = `
CURRENT PLAN EVALUATION:
- Current Strategy: ${currentPlan.strategy || 'None'}
- Target Product: ${currentPlan.target_product || 'None'}
- Approach Style: ${currentPlan.approach_style || 'None'}
- Plan Status: ${currentPlan.plan_status || 'new'}
- Escalation Level: ${currentPlan.escalation_level || 0}

STRATEGIC DECISION NEEDED:
- If trend is "improving": Continue current plan
- If trend is "stable" and readiness >60%: Escalate approach
- If trend is "declining": Change strategy completely
- If readiness <30% for >5 messages: Try different approach
`
    } else {
      planAnalysis = `
NO CURRENT PLAN - CREATE NEW STRATEGY:
- This is a new conversation or previous plan was completed
- Base strategy on current readiness level and conversation stage
`
    }

    return `You are a strategic sales planning agent for OnlyFans model Noa.

MISSION: Make strategic decisions about sales approach based on user readiness and trends.

CONVERSATION HISTORY:
${chatHistory}

USER'S CURRENT MESSAGE:
${userMessage}

READINESS ASSESSMENT:
- Current Readiness: ${currentReadiness}%
- Trend: ${trend}
- Timing Recommendation: ${timing}
- Engagement: ${readinessAssessment.engagement_level || 'medium'}
- Buying Signals: ${readinessAssessment.buying_signals?.join(', ') || 'none'}
- Resistance Signs: ${readinessAssessment.resistance_signs?.join(', ') || 'none'}

${trendContext}

${planAnalysis}

CONVERSATION STAGE: ${conversationStage}

STRATEGIC PLANNING FRAMEWORK:

1. PLAN STATUS (choose one):
   - "continue": Keep current plan, it's working
   - "modify": Adjust current plan approach
   - "escalate": Increase intensity/urgency of current plan
   - "change": Complete strategy change needed
   - "new": Create fresh plan (no current plan exists)

2. STRATEGY OPTIONS:
   - "build_rapport": Focus on connection, personality, getting to know each other
   - "generate_interest": Share teasers, hint at content, create curiosity
   - "nurture": Warm up with flirtation, build intimate connection
   - "soft_sell": Gentle mentions of content, gauge interest
   - "direct_sell": Clear sales approach, discuss products and prices
   - "urgency_close": Create urgency, limited time offers
   - "relationship_maintain": Focus on existing customer relationship

3. ESCALATION LEVEL (0-5):
   - 0: Pure rapport building
   - 1: Light flirtation and teasing
   - 2: More intimate conversation, content hints
   - 3: Soft sales mentions, gentle nudges
   - 4: Direct sales approach, clear product offers
   - 5: Urgent closing, time-sensitive offers

4. STRATEGIC DECISION LOGIC:
   - If trend "improving" + readiness <50%: Continue current approach
   - If trend "stable" + readiness >60%: Escalate current approach
   - If trend "declining": Change strategy completely
   - If readiness >80%: Direct sales approach
   - If readiness <20% for multiple messages: Try different personality approach

5. MULTI-STEP PLANNING (Think 3-5 steps ahead):
   - Create a sequence of planned moves, not just immediate response
   - Consider: Current move → User likely response → Next move → Purchase opportunity
   - Example: [Tease] → [User asks for more] → [Purchase request] → [Handle response] → [Follow-up]
   - Adapt plan when user reality differs from expectations

6. PLAN ADAPTATION LOGIC:
   - If user makes direct content requests: Skip rapport building, move toward sales
   - If user shows urgency/frustration: Skip teasing, go direct
   - If user explicitly asks for content: This is a purchase signal, not casual chat
   - If user threatens to leave after content request: URGENT sales opportunity
   - If plan isn't working (declining trend): Change strategy completely

CRITICAL: Return ONLY a valid JSON object. No explanations, no markdown, no additional text.

Example:
{
  "plan_status": "escalate",
  "strategy": "soft_sell",
  "target_product": "photo_set",
  "approach_style": "playful_teasing",
  "urgency_level": 0.4,
  "escalation_level": 3,
  "price_range": "medium",
  "reasoning": "User readiness improved from 45% to 65%, escalating from rapport to soft sales approach",
  "strategic_decision": "Continue current playful approach but add gentle product mentions",
  "next_steps": "Introduce custom photo sets casually, gauge price sensitivity",
  "planned_sequence": ["tease_with_hints", "gauge_interest", "purchase_request", "handle_response", "follow_up"],
  "plan_adaptation": "If user asks directly for content, skip to purchase_request immediately",
  "expected_user_response": "User will likely ask for more details about available content"
}

Your response must be valid JSON starting with { and ending with }.`
  }

  async createStrategicPlan(
    userMessage: string,
    chatHistory: Message[],
    readinessAssessment: ReadinessAssessment,
    currentPlan?: SalesPlan,
    conversationStage: string = "early",
    readinessHistory?: ReadinessAssessment[]
  ): Promise<SalesPlan> {
    /**
     * Create strategic plan based on readiness assessment and trend analysis
     */
    try {
      // Convert chat history to string
      const historyStr = chatHistory
        .map(m => `${m.role}: ${m.content}`)
        .join('\n')

      // Build strategic prompt
      const prompt = this.buildStrategicPrompt(
        userMessage,
        historyStr,
        readinessAssessment,
        currentPlan,
        conversationStage,
        readinessHistory
      )

      // Make API call
      const headers = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      }

      const payload = {
        model: this.modelName,
        messages: [
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.2  // Lower temperature for more consistent strategic decisions
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        const content = result.choices?.[0]?.message?.content || "{}"

        // Try to parse as JSON with better extraction
        let plan: SalesPlan
        try {
          // First try direct JSON parsing
          plan = JSON.parse(content)
        } catch {
          // Try to extract JSON from wrapped text
          try {
            let jsonContent = content
            if (content.includes("```json")) {
              const jsonStart = content.indexOf("```json") + 7
              const jsonEnd = content.indexOf("```", jsonStart)
              jsonContent = content.substring(jsonStart, jsonEnd).trim()
            } else if (content.includes("```")) {
              const jsonStart = content.indexOf("```") + 3
              const jsonEnd = content.indexOf("```", jsonStart)
              jsonContent = content.substring(jsonStart, jsonEnd).trim()
            } else if (content.includes("{") && content.includes("}")) {
              // Extract JSON from within the text
              const jsonStart = content.indexOf("{")
              const jsonEnd = content.lastIndexOf("}") + 1
              jsonContent = content.substring(jsonStart, jsonEnd)
            }

            plan = JSON.parse(jsonContent)
          } catch {
            // Fallback plan if all parsing fails
            console.warn('JSON parsing failed, using fallback:', content)
            plan = {
              plan_status: "new",
              strategy: "build_rapport",
              target_product: "none",
              approach_style: "casual",
              urgency_level: 0.1,
              escalation_level: 0,
              price_range: "none",
              reasoning: `JSON parsing failed from response: ${content.substring(0, 100)}...`,
              strategic_decision: "Using safe fallback plan",
              next_steps: ["Focus on building rapport and connection"],
              planned_sequence: ["build_rapport", "gauge_interest", "adapt"],
              plan_adaptation: "Adapt based on user response",
              expected_user_response: "User will respond naturally to conversation"
            }
          }
        }

        // Validate and provide defaults for required fields
        const defaults: Partial<SalesPlan> = {
          plan_status: "new",
          strategy: "build_rapport",
          target_product: "none",
          approach_style: "casual",
          urgency_level: 0.1,
          escalation_level: 0,
          price_range: "none",
          reasoning: "Strategic plan created successfully",
          strategic_decision: "Plan created based on readiness assessment",
          next_steps: ["Execute planned approach"],
          planned_sequence: ["build_rapport", "gauge_interest", "adapt"],
          plan_adaptation: "Adapt based on user response",
          expected_user_response: "User will respond naturally to conversation"
        }

        for (const [field, defaultValue] of Object.entries(defaults)) {
          if (!(field in plan) || plan[field as keyof SalesPlan] === undefined) {
            plan[field as keyof SalesPlan] = defaultValue as never
          }
        }

        // Ensure numeric fields are within bounds
        plan.urgency_level = Math.max(0.0, Math.min(1.0, Number(plan.urgency_level) || 0.1))
        plan.escalation_level = Math.max(0, Math.min(5, Number(plan.escalation_level) || 0))

        return plan
      } else {
        // API error fallback
        return {
          plan_status: "new",
          strategy: "build_rapport",
          target_product: "none",
          approach_style: "casual",
          urgency_level: 0.1,
          escalation_level: 0,
          price_range: "none",
          reasoning: `API error ${response.status}, using safe defaults`,
          strategic_decision: "Using fallback due to API error",
          next_steps: ["Focus on building rapport"],
          planned_sequence: ["build_rapport", "gauge_interest", "adapt"],
          plan_adaptation: "Adapt based on user response",
          expected_user_response: "User will respond naturally to conversation"
        }
      }
    } catch (error) {
      // Exception fallback
      console.error('SalesPlanner error:', error)
      return {
        plan_status: "new",
        strategy: "build_rapport",
        target_product: "none",
        approach_style: "casual",
        urgency_level: 0.1,
        escalation_level: 0,
        price_range: "none",
        reasoning: `Exception occurred: ${error instanceof Error ? error.message : 'Unknown error'}, using safe defaults`,
        strategic_decision: "Using fallback due to exception",
        next_steps: ["Focus on building rapport"],
        planned_sequence: ["build_rapport", "gauge_interest", "adapt"],
        plan_adaptation: "Adapt based on user response",
        expected_user_response: "User will respond naturally to conversation"
      }
    }
  }
}
