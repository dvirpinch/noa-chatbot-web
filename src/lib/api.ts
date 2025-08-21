/**
 * API Configuration and Client
 * Handles communication with DeepSeek API and environment setup
 */

import { PersonalityWriter } from './agents/personalityWriter'
import { ReadinessAssessor } from './agents/readinessAssessor'
import { SalesPlanner } from './agents/salesPlanner'

// API Configuration
export const API_CONFIG = {
  DEEPSEEK_API_URL: "https://api.deepseek.com/v1/chat/completions",
  DEEPSEEK_MODEL_NAME: "deepseek-chat",
  // API key will be loaded from environment variables
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || "sk-89e5eaa024324e2d9fffa71b7904330c"
}

// Agent instances (singleton pattern)
let personalityWriter: PersonalityWriter | null = null
let readinessAssessor: ReadinessAssessor | null = null
let salesPlanner: SalesPlanner | null = null

export function initializeAgents() {
  if (!personalityWriter) {
    personalityWriter = new PersonalityWriter(
      API_CONFIG.DEEPSEEK_API_URL,
      API_CONFIG.DEEPSEEK_API_KEY,
      API_CONFIG.DEEPSEEK_MODEL_NAME
    )
  }
  
  if (!readinessAssessor) {
    readinessAssessor = new ReadinessAssessor(
      API_CONFIG.DEEPSEEK_API_URL,
      API_CONFIG.DEEPSEEK_API_KEY,
      API_CONFIG.DEEPSEEK_MODEL_NAME
    )
  }
  
  if (!salesPlanner) {
    salesPlanner = new SalesPlanner(
      API_CONFIG.DEEPSEEK_API_URL,
      API_CONFIG.DEEPSEEK_API_KEY,
      API_CONFIG.DEEPSEEK_MODEL_NAME
    )
  }
  
  return {
    personalityWriter,
    readinessAssessor,
    salesPlanner
  }
}

export function getAgents() {
  if (!personalityWriter || !readinessAssessor || !salesPlanner) {
    return initializeAgents()
  }
  
  return {
    personalityWriter,
    readinessAssessor,
    salesPlanner
  }
}
