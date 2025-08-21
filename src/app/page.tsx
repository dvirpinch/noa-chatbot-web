/**
 * Main Chat Page - Modern Noa Multi-Agent Chatbot
 * Replaces the Streamlit interface with a modern web application
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useChatStore } from '@/stores/chatStore'
import { useAgents } from '@/hooks/useAgents'
import { AdvancedSettings } from '@/components/settings/AdvancedSettings'
import { DebugDashboard } from '@/components/agents/DebugDashboard'
import { PasswordPrompt } from '@/components/auth/PasswordPrompt'

export default function ChatPage() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    personalitySettings,
    selectedPersonality,
    showAdvancedSettings,
    showDebugPanel,
    readinessHistory,
    currentPlan,
    pendingPurchaseRequest,
    isPasswordValid,
    setShowAdvancedSettings,
    setShowDebugPanel,
    clearChat,
    setPendingPurchaseRequest,
    addPurchaseDecision,
    setShowCommentTrigger
  } = useChatStore()

  const { processMessage } = useAgents()

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Security: Show password prompt if not authenticated
  if (!isPasswordValid) {
    return <PasswordPrompt />
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    setIsLoading(true)
    const messageToSend = inputValue.trim()
    setInputValue('')

    // Process with real multi-agent system
    try {
      await processMessage(messageToSend)
    } catch (error) {
      console.error('Failed to process message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchaseAction = (action: 'accepted' | 'declined' | 'ignored') => {
    if (!pendingPurchaseRequest) return

    // Record the decision
    addPurchaseDecision({
      request: pendingPurchaseRequest,
      decision: action,
      timestamp: Date.now(),
      id: `decision_${Date.now()}`
    })

    // Clear pending request
    setPendingPurchaseRequest(null)

    // Show comment trigger
    setShowCommentTrigger(true)

    // Send feedback message to agent
    const feedbackMessage = action === 'accepted'
      ? `User accepted your purchase request for $${pendingPurchaseRequest.price} - ${pendingPurchaseRequest.content}`
      : action === 'declined'
      ? `User declined your purchase request for $${pendingPurchaseRequest.price} - ${pendingPurchaseRequest.content}`
      : `User ignored your purchase request for $${pendingPurchaseRequest.price} - ${pendingPurchaseRequest.content}`

    // Process feedback as a new message
    setTimeout(() => {
      processMessage(feedbackMessage)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 Noa Multi-Agent Chatbot
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                v2.0 Modern Web
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                ⚙️ Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
              >
                🔍 Debug
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
              >
                🗑️ Clear
              </Button>
            </div>
          </div>
          
          {/* Agent Status Bar */}
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>🎭 {selectedPersonality}</span>
            <span>📊 {readinessHistory.length > 0 ? `${readinessHistory[readinessHistory.length - 1].readiness_percentage}% ready` : 'Ready to chat'}</span>
            <span>🎯 Level {currentPlan?.escalation_level || 0}/5</span>
            <span>⚡ {currentPlan?.strategy || 'Agents Active'}</span>
          </div>
        </div>
      </header>

      {/* Advanced Settings Modal */}
      <AdvancedSettings 
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
      />

      {/* Debug Dashboard */}
      <DebugDashboard
        isOpen={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg">💬 Chat with Noa</CardTitle>
          </CardHeader>
          
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-4">👋</div>
                <h3 className="text-lg font-medium mb-2">Welcome to Modern Noa!</h3>
                <p className="text-sm">
                  Powered by 3 specialized agents + exact V4 prompt engineering<br/>
                  Start a conversation below...
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                          Noa
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Purchase Request Card */}
                {pendingPurchaseRequest && (
                  <div className="flex justify-center my-4">
                    <Card className="w-full max-w-md border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">💸 Purchase Request</CardTitle>
                          <Badge variant="secondary">${pendingPurchaseRequest.price}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold mb-2">{pendingPurchaseRequest.content}</h3>
                        <p className="text-sm text-gray-600 mb-4">{pendingPurchaseRequest.description}</p>
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handlePurchaseAction('accepted')}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            ✅ Accept
                          </Button>
                          <Button 
                            onClick={() => handlePurchaseAction('declined')}
                            variant="destructive"
                            className="flex-1"
                          >
                            ❌ Decline
                          </Button>
                          <Button 
                            onClick={() => handlePurchaseAction('ignored')}
                            variant="outline"
                            className="flex-1"
                          >
                            👻 Ignore
                          </Button>
                        </div>
                        
                        <div className="text-xs text-center mt-2 text-gray-500">
                          ⏱️ Click any button to respond
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
            
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Noa
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Agents thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6"
              >
                Send
              </Button>
            </div>
        </div>
        </Card>
      </main>

      {/* Floating Settings Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setShowAdvancedSettings(true)}
          className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
          title="Quick Settings"
        >
          ⚙️
        </Button>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        Powered by 3 specialized agents (1, 2, 5) + exact V4 prompt engineering 🚀
      </footer>
    </div>
  )
}