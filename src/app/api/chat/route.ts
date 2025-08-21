/**
 * Chat API Route - Handles message processing with multi-agent system
 */

import { NextRequest, NextResponse } from 'next/server'
import { PersonalityWriter } from '@/lib/agents/personalityWriter'
import { ReadinessAssessor } from '@/lib/agents/readinessAssessor'
import { SalesPlanner } from '@/lib/agents/salesPlanner'
import { Message, PersonalitySettings, ReadinessAssessment, SalesPlan } from '@/types'

// API Configuration (temporarily hardcoded - will move to env)
const API_CONFIG = {
  DEEPSEEK_API_URL: "https://api.deepseek.com/v1/chat/completions",
  DEEPSEEK_API_KEY: "sk-89e5eaa024324e2d9fffa71b7904330c",
  DEEPSEEK_MODEL_NAME: "deepseek-chat"
}

// Initialize agents
const personalityWriter = new PersonalityWriter(
  API_CONFIG.DEEPSEEK_API_URL,
  API_CONFIG.DEEPSEEK_API_KEY,
  API_CONFIG.DEEPSEEK_MODEL_NAME
)

const readinessAssessor = new ReadinessAssessor(
  API_CONFIG.DEEPSEEK_API_URL,
  API_CONFIG.DEEPSEEK_API_KEY,
  API_CONFIG.DEEPSEEK_MODEL_NAME
)

const salesPlanner = new SalesPlanner(
  API_CONFIG.DEEPSEEK_API_URL,
  API_CONFIG.DEEPSEEK_API_KEY,
  API_CONFIG.DEEPSEEK_MODEL_NAME
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userMessage,
      chatHistory,
      personalitySettings,
      currentPlan,
      readinessHistory,
      password
    }: {
      userMessage: string
      chatHistory: Message[]
      personalitySettings: PersonalitySettings
      currentPlan?: SalesPlan
      readinessHistory?: ReadinessAssessment[]
      password?: string
    } = body

    // Security: Check password before processing
    const REQUIRED_PASSWORD = "anotherme"
    if (!password || password !== REQUIRED_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: "Authentication required",
        response: {
          message: "Please enter the access code to continue.",
          raw_response: "Authentication failed"
        }
      }, { status: 401 })
    }

    const startTime = Date.now()

    // Step 1: Assess user readiness (Agent 2)
    console.log('🔍 Agent 2: Assessing user readiness...')
    const previousReadiness = readinessHistory && readinessHistory.length > 0 
      ? readinessHistory[readinessHistory.length - 1] 
      : undefined

    const readinessAssessment = await readinessAssessor.assessReadiness(
      userMessage,
      chatHistory,
      currentPlan,
      previousReadiness
    )

    // Step 2: Create/update strategic plan (Agent 1)
    console.log('🎯 Agent 1: Creating strategic plan...')
    const conversationStage = chatHistory.length < 3 ? 'early' : 
                             chatHistory.length < 10 ? 'developing' : 'established'

    const strategicPlan = await salesPlanner.createStrategicPlan(
      userMessage,
      chatHistory,
      readinessAssessment,
      currentPlan,
      conversationStage,
      readinessHistory
    )

    // Step 3: Generate personality response (Agent 5)
    console.log('💬 Agent 5: Generating personality response...')
    const salesContext = {
      readiness: `${readinessAssessment.readiness_percentage}%`,
      readiness_assessment: readinessAssessment,
      sales_context: strategicPlan,
      conversation_stage: conversationStage
    }

    const agentResponse = await personalityWriter.generateResponse(
      personalitySettings,
      chatHistory,
      userMessage,
      salesContext
    )

    const processingTime = Date.now() - startTime

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      response: agentResponse,
      agentData: {
        readinessAssessment,
        strategicPlan,
        processingTime,
        conversationStage
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: {
          message: "Sorry, I'm having trouble thinking right now. Can you try again?",
          raw_response: `Error: ${error}`
        }
      },
      { status: 500 }
    )
  }
}
