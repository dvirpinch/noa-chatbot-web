/**
 * Chat Store - Manages conversation state and agent interactions
 * Replaces Streamlit session state with modern state management
 */

import { create } from 'zustand'
import { 
  Message, 
  PersonalitySettings, 
  ReadinessAssessment, 
  SalesPlan, 
  PurchaseRequest, 
  PurchaseDecision, 
  AgentLog,
  DEFAULT_PERSONALITY
} from '@/types'

interface ChatState {
  // Messages and conversation
  messages: Message[]
  agentLogs: AgentLog[]
  
  // Agent system state
  currentPlan: SalesPlan | null
  readinessHistory: ReadinessAssessment[]
  planHistory: SalesPlan[]
  
  // Purchase system
  pendingPurchaseRequest: PurchaseRequest | null
  purchaseHistory: PurchaseDecision[]
  lastPurchaseDetails: PurchaseRequest | null
  purchaseRequestTimestamp: number | null
  
  // UI state
  showAdvancedSettings: boolean
  showDebugPanel: boolean
  selectedPersonality: string
  personalitySettings: PersonalitySettings
  
  // Purchase interaction
  showCommentTrigger: boolean
  
  // Security
  password: string
  isPasswordValid: boolean
  settingsPassword: string
  isSettingsPasswordValid: boolean
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  addAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void
  updateCurrentPlan: (plan: SalesPlan) => void
  addReadinessAssessment: (assessment: ReadinessAssessment) => void
  setPendingPurchaseRequest: (request: PurchaseRequest | null) => void
  addPurchaseDecision: (decision: PurchaseDecision) => void
  updatePersonalitySettings: (settings: Partial<PersonalitySettings>) => void
  setShowAdvancedSettings: (show: boolean) => void
  setShowDebugPanel: (show: boolean) => void
  setSelectedPersonality: (personality: string) => void
  setShowCommentTrigger: (show: boolean) => void
  setPassword: (password: string) => void
  setPasswordValid: (valid: boolean) => void
  setSettingsPassword: (password: string) => void
  setSettingsPasswordValid: (valid: boolean) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: [],
  agentLogs: [],
  currentPlan: null,
  readinessHistory: [],
  planHistory: [],
  pendingPurchaseRequest: null,
  purchaseHistory: [],
  lastPurchaseDetails: null,
  purchaseRequestTimestamp: null,
  showAdvancedSettings: false,
  showDebugPanel: false,
  selectedPersonality: 'Chen',
  personalitySettings: DEFAULT_PERSONALITY,
  showCommentTrigger: false,
  password: '',
  isPasswordValid: false,
  settingsPassword: '',
  isSettingsPasswordValid: false,

  // Actions
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }
    set(state => ({
      messages: [...state.messages, newMessage]
    }))
  },

  addAgentLog: (log) => {
    const newLog: AgentLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }
    set(state => ({
      agentLogs: [...state.agentLogs, newLog]
    }))
  },

  updateCurrentPlan: (plan) => {
    set(state => ({
      currentPlan: plan,
      planHistory: [...state.planHistory, plan]
    }))
  },

  addReadinessAssessment: (assessment) => {
    set(state => ({
      readinessHistory: [...state.readinessHistory, assessment]
    }))
  },

  setPendingPurchaseRequest: (request) => {
    set({
      pendingPurchaseRequest: request,
      purchaseRequestTimestamp: request ? Date.now() : null,
      lastPurchaseDetails: request || get().lastPurchaseDetails
    })
  },

  addPurchaseDecision: (decision) => {
    set(state => ({
      purchaseHistory: [...state.purchaseHistory, decision],
      pendingPurchaseRequest: null,
      purchaseRequestTimestamp: null
    }))
  },

  updatePersonalitySettings: (settings) => {
    set(state => ({
      personalitySettings: { ...state.personalitySettings, ...settings }
    }))
  },

  setShowAdvancedSettings: (show) => {
    set({ showAdvancedSettings: show })
  },

  setShowDebugPanel: (show) => {
    set({ showDebugPanel: show })
  },

  setSelectedPersonality: (personality) => {
    set({ selectedPersonality: personality })
  },

  setShowCommentTrigger: (show) => {
    set({ showCommentTrigger: show })
  },

  setPassword: (password) => {
    set({ password })
  },

  setPasswordValid: (valid) => {
    set({ isPasswordValid: valid })
  },

  setSettingsPassword: (password) => {
    set({ settingsPassword: password })
  },

  setSettingsPasswordValid: (valid) => {
    set({ isSettingsPasswordValid: valid })
  },

  clearChat: () => {
    set({
      messages: [],
      agentLogs: [],
      currentPlan: null,
      readinessHistory: [],
      planHistory: [],
      pendingPurchaseRequest: null,
      purchaseHistory: [],
      lastPurchaseDetails: null,
      purchaseRequestTimestamp: null,
      showCommentTrigger: false
    })
  }
}))

// Selector hooks for specific state slices
export const useMessages = () => useChatStore(state => state.messages)
export const useCurrentPlan = () => useChatStore(state => state.currentPlan)
export const useReadinessHistory = () => useChatStore(state => state.readinessHistory)
export const usePendingPurchaseRequest = () => useChatStore(state => state.pendingPurchaseRequest)
export const usePersonalitySettings = () => useChatStore(state => state.personalitySettings)
export const useShowAdvancedSettings = () => useChatStore(state => state.showAdvancedSettings)
export const useShowDebugPanel = () => useChatStore(state => state.showDebugPanel)
