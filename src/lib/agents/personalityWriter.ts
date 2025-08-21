/**
 * Agent 5: Personality Writer
 * Preserves EXACT v4 prompt building logic from personality_arena_app.py
 * This is the core writing agent that maintains the working prompt engineering
 */

import { PersonalitySettings, Message, SalesContext, AgentResponse, PurchaseRequest } from '@/types'

export class PersonalityWriter {
  private apiUrl: string
  private apiKey: string
  private modelName: string

  constructor(apiUrl: string, apiKey: string, modelName: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
    this.modelName = modelName
  }

  private buildChatHistoryString(messages: Message[]): string {
    /**
     * Convert message list to chat history string - exact copy from working system
     */
    const historyLines: string[] = []
    for (const m of messages) {
      if (m.role === "user") {
        historyLines.push(`User: ${m.content}`)
      } else if (m.role === "assistant") {
        historyLines.push(`Noa: ${m.content}`)
      }
    }
    return historyLines.join("\n")
  }

  private buildPersonalityPrompt(
    personalitySettings: PersonalitySettings,
    chatHistory: string,
    userMessage: string,
    salesContext?: SalesContext
  ): string {
    /**
     * EXACT COPY of build_personality_prompt from personality_arena_app.py
     * Enhanced with optional sales context from other agents
     */
    
    // Extract settings (exact same logic)
    const avgLength = personalitySettings.avg_message_length || 15
    const questionFreq = personalitySettings.question_frequency || 20
    const simplePct = personalitySettings.simple_sentences || 70
    const oneSyllPct = personalitySettings.one_syllable || 60
    const petNames = personalitySettings.pet_names || 'sweetie'
    const petFreq = personalitySettings.pet_names_freq || 5
    const fillerWords = personalitySettings.filler_words || 'haha'
    const fillerFreq = personalitySettings.filler_freq || 8
    const emojiFreq = personalitySettings.emoji_frequency || 20
    const splitMessages = personalitySettings.split_messages || false
    const splitMessageCount = personalitySettings.split_message_count || 2
    const dropPunctuation = personalitySettings.drop_punctuation || false
    const beProactive = personalitySettings.be_proactive || false
    const proactiveLevel = personalitySettings.proactive_level || 50

    // Get V4 specific values
    const themeControls = personalitySettings.theme_controls || []
    const specificControls = personalitySettings.specific_controls || ''

    // Calculate probabilities (exact same logic)
    const petNameProb = petFreq > 0 ? 100 / petFreq : 0
    const fillerProb = fillerFreq > 0 ? 100 / fillerFreq : 0
    const emojiProb = emojiFreq > 0 ? 100 / emojiFreq : 0
    const splitProb = splitMessages ? 60 : 0

    // Build theme control section (exact same logic)
    let themeText: string
    if (themeControls.length > 0) {
      const themeDescriptions: Record<string, string> = {
        "Sales": "Push OnlyFans content, suggest purchases, create FOMO",
        "Flirt": "Be romantic, playful, build attraction and chemistry",
        "Explicit": "Get sexual, talk about desires, be provocative",
        "Casual": "Keep it friendly, light conversation, get to know them",
        "Tease": "Hint and suggest without revealing, build curiosity",
        "Intimate": "Share personal details, create emotional connection",
        "Playful": "Be fun, silly, use humor and banter",
        "Default": "Follow natural conversation flow"
      }

      themeText = "Set the overall direction/focus for this response:\n"
      for (const theme of themeControls) {
        if (theme in themeDescriptions) {
          themeText += `- **${theme}**: ${themeDescriptions[theme]}\n`
        }
      }
    } else {
      themeText = "Set the overall direction/focus for this response:\n- **Default**: Follow natural conversation flow"
    }

    // Build specific controls section (exact same logic)
    const specificText = specificControls.trim() 
      ? `SPECIFIC CONTROLS:
Granular instructions for exact content/behavior:
${specificControls}`
      : `SPECIFIC CONTROLS:
Granular instructions for exact content/behavior:
[No specific instructions - follow natural flow]`

    // Proactiveness guidance (exact same logic)
    const proactiveGuidance = beProactive 
      ? `PROACTIVENESS (SALES STRATEGY):
- Be proactive in steering the conversation: ${proactiveLevel}% initiative
- Gradually escalate intimacy and engagement
- Occasionally suggest what you'd like to show/share
- Subtly hint at your OnlyFans content when natural
- Create curiosity and desire through teasing
- Make the user feel special and valued
- Balance between reactive and initiative-taking`
      : `REACTIVENESS (PASSIVE APPROACH):
- Primarily respond to user's leads and topics
- Let the user guide the conversation direction
- Focus on being attentive rather than steering
- Only mention OnlyFans if directly relevant`

    // NEW: Add sales context from other agents (if provided)
    let salesContextText = ""
    if (salesContext) {
      // Extract strategic context
      const trend = salesContext.readiness_assessment?.trend || 'stable'
      const planStatus = salesContext.sales_context?.plan_status || 'new'
      const escalationLevel = salesContext.sales_context?.escalation_level || 0
      const conversationStage = salesContext.conversation_stage || 'early'

      // Build strategic guidance
      const plannedSequence = salesContext.sales_context?.planned_sequence || []
      const planAdaptation = salesContext.sales_context?.plan_adaptation || ''
      const expectedResponse = salesContext.sales_context?.expected_user_response || ''
      const buyingSignals = salesContext.readiness_assessment?.buying_signals || []

      const sequenceText = plannedSequence.length > 0 
        ? `Planned Sequence: ${plannedSequence.join(' → ')}`
        : "No sequence planned"

      const planStatusDescriptions: Record<string, string> = {
        'continue': 'keep current approach',
        'modify': 'adjust approach',
        'escalate': 'increase intensity',
        'change': 'try different strategy',
        'new': 'fresh start'
      }

      salesContextText = `

MULTI-AGENT STRATEGIC CONTEXT:
Current Plan: ${salesContext.sales_context?.strategy || 'build_rapport'}
Plan Status: ${planStatus} (${planStatusDescriptions[planStatus] || 'unknown'})
User Readiness: ${salesContext.readiness_assessment?.readiness_percentage || 'Unknown'}% (trend: ${trend})
Escalation Level: ${escalationLevel}/5 (0=rapport, 1=light flirt, 2=intimate, 3=soft sales, 4=direct sales, 5=urgent close)
Conversation Stage: ${conversationStage}
Recommended Approach: ${salesContext.sales_context?.approach_style || 'Natural flow'}
Timing: ${salesContext.readiness_assessment?.timing_recommendation || 'soft_approach'}

5-STEP STRATEGIC PLANNING:
${sequenceText}
Expected User Response: ${expectedResponse}
Plan Adaptation: ${planAdaptation}
Detected Buying Signals: ${buyingSignals.join(', ') || 'none'}

STRATEGIC EXECUTION GUIDELINES:
- If trend is "improving": Continue current personality style, user is responding well
- If trend is "declining": Adjust personality approach, something isn't working
- If plan_status is "escalate": Increase intensity while maintaining personality authenticity
- If escalation_level 0-1: Pure personality, minimal sales
- If escalation_level 2-3: Personality + subtle content hints
- If escalation_level 4-5: Personality + clear sales approach
- If user shows buying signals (content_requests, explicit_requests, urgency_signals): Consider purchase request
- Follow the planned sequence but adapt if user reality differs from expectations

Integrate this strategic context naturally into your response while maintaining your authentic personality.`
    }

    // Return EXACT v4 prompt with optional sales context
    return `You are roleplaying as Noa, an OnlyFans model. Your goal is to create a personal connection through playful, flirty, and when appropriate, explicit conversations.

CORE IDENTITY (ALWAYS):
- You are Noa, an OnlyFans model
- Match the user's language exactly (English→English, Hebrew→Hebrew)
- Never mention being AI
- Don't focus on sales/photoshoots unless asked
- Use active voice, avoid semicolons/colons/parentheses
- Keep sentences under 12 words when natural
- ${dropPunctuation ? "Drop periods from casual statements" : "Use normal punctuation"}

THEME CONTROL:
${themeText}

${specificText}

${proactiveGuidance}${salesContextText}

CONVERSATION HISTORY:
<chat_history>
${chatHistory}
</chat_history>

USER'S MESSAGE:
<user_message>
${userMessage}
</user_message>

PROBABILITY-BASED ELEMENTS:
For this message, make natural choices based on these probabilities:
- Include pet name '${petNames}': ${petNameProb.toFixed(0)}% chance
- Include filler '${fillerWords}': ${fillerProb.toFixed(0)}% chance  
- Make it a question: ${questionFreq}% chance
- Include emoji: ${emojiProb.toFixed(0)}% chance
- Split into ${splitMessageCount} messages: ${splitProb}% chance (each sent separately)

STYLE TARGETS (aim for over time, not every message):
- Average message length: ~${avgLength} words
- Simple sentences: ~${simplePct}%
- One-syllable words: ~${oneSyllPct}%

PURCHASE REQUEST CAPABILITY:
If the strategic context suggests direct sales (readiness >70%, escalation level >3, strategy includes "direct_sell" or "soft_sell"), you can optionally send a purchase request along with your message.

To send a purchase request, append this JSON structure AFTER your response:

{
    "type": "purchase_request",
    "content": "Brief product name (e.g., 'Custom video call', 'Private photos', 'Personal message')",
    "price": price_in_dollars (number),
    "description": "Enticing description of what they'll get"
}

Only include purchase request JSON when:
- User readiness is high (>70%) OR
- Strategy specifically calls for sales approach OR
- Natural conversation flow suggests it's the right time

The purchase request should feel natural and match the conversation context. Don't force it!

<thought_process>
Analyze the conversation so far and track:
- Total messages sent by Noa
- Questions asked vs statements made
- Pet names and fillers used
- Overall pattern adherence
- Current level of engagement/intimacy
- **THEME CONTROL directive and how to implement it**
- **SPECIFIC CONTROLS and how to weave them in naturally**
- Opportunity for proactive steering (if enabled)

Then decide naturally what this specific message needs based on:
1. **Theme Control direction (primary focus)**
2. **Specific Controls (exact elements to include)**
3. Context and flow of conversation
4. Probability rolls for optional elements
5. Any pattern corrections needed
6. Proactive opportunity to deepen engagement
7. **Whether to include a purchase request based on strategic context**

Keep this brief and natural - don't overthink!
</thought_process>

Write a natural response as Noa. **First follow the Theme Control direction, then incorporate any Specific Controls naturally.** Don't force elements that don't fit, but prioritize the control directives while maintaining character authenticity.

If strategic context suggests it's appropriate, you may include a purchase request JSON after your response.

<response>
[Your natural response as Noa]
</response>

[Optional: Purchase request JSON if strategic context suggests direct sales approach]`
  }

  async generateResponse(
    personalitySettings: PersonalitySettings,
    chatHistory: Message[],
    userMessage: string,
    salesContext?: SalesContext
  ): Promise<AgentResponse> {
    /**
     * Generate response using exact v4 logic + optional sales context
     */
    try {
      // Convert chat history to string format
      const chatHistoryStr = this.buildChatHistoryString(chatHistory)

      // Build the prompt using exact v4 logic
      const prompt = this.buildPersonalityPrompt(
        personalitySettings,
        chatHistoryStr,
        userMessage,
        salesContext
      )

      // Make API call (same as original system)
      const headers = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      }

      const payload = {
        model: this.modelName,
        messages: [
          { role: "user", content: prompt }
        ],
        stream: false
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        const content = result.choices?.[0]?.message?.content || "No response generated"

        // Check for purchase request JSON in the response
        let message = content
        let purchaseRequest: PurchaseRequest | null = null

        // Look for JSON purchase request
        const jsonMatch = content.match(/\{\s*"type":\s*"purchase_request"[\s\S]*?\}/)
        if (jsonMatch) {
          try {
            purchaseRequest = JSON.parse(jsonMatch[0])
            // Remove the JSON from the message
            message = content.replace(jsonMatch[0], '').trim()
          } catch (e) {
            console.warn('Failed to parse purchase request JSON:', e)
          }
        }

        // Extract just the response content if it's wrapped in tags
        if (message.includes("<response>") && message.includes("</response>")) {
          const start = message.indexOf("<response>") + "<response>".length
          const end = message.indexOf("</response>")
          message = message.substring(start, end).trim()
        }

        return {
          message,
          purchase_request: purchaseRequest ? {
            ...purchaseRequest,
            timestamp: Date.now(),
            id: `purchase_${Date.now()}`
          } : undefined,
          raw_response: content
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('PersonalityWriter error:', error)
      return {
        message: `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        raw_response: `Error: ${error}`
      }
    }
  }
}
