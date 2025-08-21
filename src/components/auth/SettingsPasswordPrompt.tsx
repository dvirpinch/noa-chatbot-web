/**
 * Settings Password Component
 * Protects advanced settings tabs from unauthorized access
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'

export function SettingsPasswordPrompt() {
  const [inputPassword, setInputPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const { setSettingsPassword, setSettingsPasswordValid } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validate password securely via backend
    try {
      const response = await fetch('/api/validate-settings-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setSettingsPassword(inputPassword)
          setSettingsPasswordValid(true)
        } else {
          setError('Invalid access code for advanced settings.')
          setInputPassword('')
        }
      } else {
        setError('Connection error. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Advanced Settings Access
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Enter the admin code to access detailed personality controls
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin code..."
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="pr-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                disabled={isSubmitting}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-orange-100"
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
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                'Unlock Advanced Controls'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>💡 Contact admin for advanced settings access</p>
      </div>
    </div>
  )
}
