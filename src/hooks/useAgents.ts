/**
 * useAgents Hook - Handles multi-agent message processing
 */

import { useChatStore } from '@/stores/chatStore'
import { AgentResponse } from '@/types'

export function useAgents() {
  const {
    messages,
    personalitySettings,
    currentPlan,
    readinessHistory,
    addMessage,
    addAgentLog,
    updateCurrentPlan,
    addReadinessAssessment,
    setPendingPurchaseRequest
  } = useChatStore()

  const processMessage = async (userMessage: string): Promise<void> => {
    try {
      // Add user message immediately
      addMessage({
        role: 'user',
        content: userMessage
      })

      // Process with multi-agent system
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage,
          chatHistory: messages,
          personalitySettings,
          currentPlan,
          readinessHistory
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success) {
          const agentResponse: AgentResponse = data.response
          const agentData = data.agentData

          // Add assistant message
          addMessage({
            role: 'assistant',
            content: agentResponse.message
          })

          // Update agent logs
          addAgentLog({
            agent: 'readiness',
            input: { userMessage, previousReadiness: readinessHistory[readinessHistory.length - 1] },
            output: agentData.readinessAssessment,
            processing_time_ms: agentData.processingTime
          })

          addAgentLog({
            agent: 'planner',
            input: { readinessAssessment: agentData.readinessAssessment, currentPlan },
            output: agentData.strategicPlan,
            processing_time_ms: agentData.processingTime
          })

          addAgentLog({
            agent: 'writer',
            input: { userMessage, salesContext: agentData },
            output: { message: agentResponse.message, purchaseRequest: agentResponse.purchase_request },
            processing_time_ms: agentData.processingTime
          })

          // Update state
          updateCurrentPlan(agentData.strategicPlan)
          addReadinessAssessment(agentData.readinessAssessment)

          // Handle purchase request if present
          if (agentResponse.purchase_request) {
            setPendingPurchaseRequest(agentResponse.purchase_request)
          }
        } else {
          // Handle API error
          addMessage({
            role: 'assistant',
            content: data.response?.message || "Sorry, I'm having trouble right now. Please try again."
          })
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Agent processing error:', error)
      addMessage({
        role: 'assistant',
        content: "Sorry, I'm having technical difficulties. Please try again in a moment."
      })
    }
  }

  return {
    processMessage,
    isAgentsReady: true  // Always ready since we're using direct API calls
  }
}
