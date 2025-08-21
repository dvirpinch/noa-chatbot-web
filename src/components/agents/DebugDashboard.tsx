/**
 * Debug Dashboard - Comprehensive agent insights and analytics
 * Shows detailed breakdown of agent reasoning and decisions
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useChatStore } from '@/stores/chatStore'

interface DebugDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function DebugDashboard({ isOpen, onClose }: DebugDashboardProps) {
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null)

  const {
    messages,
    agentLogs,
    readinessHistory,
    planHistory,
    purchaseHistory,
    currentPlan
  } = useChatStore()

  if (!isOpen) return null

  const assistantMessages = messages.filter(m => m.role === 'assistant')
  const latestReadiness = readinessHistory[readinessHistory.length - 1]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">🔍 Debug Dashboard</CardTitle>
              <p className="text-gray-600 mt-1">Complete agent insights and conversation analytics</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✖️ Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">📊 Overview</TabsTrigger>
              <TabsTrigger value="messages">💬 Messages</TabsTrigger>
              <TabsTrigger value="readiness">📈 Readiness</TabsTrigger>
              <TabsTrigger value="plans">🎯 Plans</TabsTrigger>
              <TabsTrigger value="purchase">💰 Purchase</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>📊 Readiness: {latestReadiness?.readiness_percentage || 0}%</div>
                      <div>🎯 Strategy: {currentPlan?.strategy || 'None'}</div>
                      <div>⚡ Level: {currentPlan?.escalation_level || 0}/5</div>
                      <div>📈 Trend: {latestReadiness?.trend || 'new'}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>💬 Messages: {messages.length}</div>
                      <div>🤖 Agent Calls: {agentLogs.length}</div>
                      <div>📋 Plans Created: {planHistory.length}</div>
                      <div>💸 Purchase Requests: {purchaseHistory.length}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Latest Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {latestReadiness?.buying_signals?.map((signal, i) => (
                        <Badge key={i} variant="secondary" className="text-xs mr-1">
                          {signal}
                        </Badge>
                      )) || <span className="text-xs text-gray-500">No signals detected</span>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Message Analysis</h3>
                {assistantMessages.map((message, index) => (
                  <Card key={message.id} className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => setSelectedMessageIndex(index)}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Message {index + 1}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.content}</p>
                      {selectedMessageIndex === index && agentLogs.length > index * 3 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <strong>Readiness:</strong><br/>
                              {JSON.stringify(agentLogs[index * 3]?.output || {}, null, 2).slice(0, 100)}...
                            </div>
                            <div>
                              <strong>Plan:</strong><br/>
                              {JSON.stringify(agentLogs[index * 3 + 1]?.output || {}, null, 2).slice(0, 100)}...
                            </div>
                            <div>
                              <strong>Response:</strong><br/>
                              {JSON.stringify(agentLogs[index * 3 + 2]?.output || {}, null, 2).slice(0, 100)}...
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="readiness" className="space-y-4">
              <h3 className="font-semibold">Readiness History</h3>
              <div className="space-y-2">
                {readinessHistory.map((assessment, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{assessment.readiness_percentage}%</span>
                        <Badge variant={assessment.trend === 'improving' ? 'default' : assessment.trend === 'declining' ? 'destructive' : 'secondary'}>
                          {assessment.trend}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>Signals:</strong> {assessment.buying_signals.join(', ') || 'None'}</div>
                        <div><strong>Timing:</strong> {assessment.timing_recommendation}</div>
                        <div><strong>Insight:</strong> {assessment.strategic_insight}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <h3 className="font-semibold">Strategic Plans</h3>
              <div className="space-y-2">
                {planHistory.map((plan, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{plan.strategy}</span>
                        <Badge>{plan.plan_status}</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>Target:</strong> {plan.target_product}</div>
                        <div><strong>Approach:</strong> {plan.approach_style}</div>
                        <div><strong>Level:</strong> {plan.escalation_level}/5</div>
                        <div><strong>Sequence:</strong> {plan.planned_sequence?.join(' → ') || 'None'}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
              <h3 className="font-semibold">Purchase History</h3>
              <div className="space-y-2">
                {purchaseHistory.map((purchase, index) => (
                  <Card key={purchase.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">${purchase.request.price} - {purchase.request.content}</span>
                        <Badge variant={purchase.decision === 'accepted' ? 'default' : 
                                     purchase.decision === 'declined' ? 'destructive' : 'secondary'}>
                          {purchase.decision}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div><strong>Description:</strong> {purchase.request.description}</div>
                        <div><strong>Time:</strong> {new Date(purchase.timestamp).toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {purchaseHistory.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No purchase requests yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
