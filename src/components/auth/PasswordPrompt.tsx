/**
 * Password Protection Component
 * Secure access control for AI agent system
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'

export function PasswordPrompt() {
  const [inputPassword, setInputPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const { setPassword, setPasswordValid } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Simple validation - real check happens on backend
    if (inputPassword.trim()) {
      setPassword(inputPassword)
      
      // Test the password by making a dummy API call
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: 'test',
            chatHistory: [],
            personalitySettings: {},
            password: inputPassword
          })
        })

        if (response.ok) {
          setPasswordValid(true)
        } else {
          setError('Invalid access code. Please try again.')
          setInputPassword('')
        }
      } catch {
        setError('Connection error. Please try again.')
      }
    } else {
      setError('Please enter the access code.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-purple-200 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Secure Access
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your access code to continue to the AI chat system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter access code..."
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="pr-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                disabled={isSubmitting}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Access Chat System'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
