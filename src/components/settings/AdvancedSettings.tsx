/**
 * Advanced Settings Modal - Complete V4 Personality Controls
 * All 25+ controls from the original Streamlit version
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/chatStore'
import { PERSONALITY_PRESETS } from '@/types'

interface AdvancedSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AdvancedSettings({ isOpen, onClose }: AdvancedSettingsProps) {
  const { personalitySettings, updatePersonalitySettings, setSelectedPersonality } = useChatStore()

  if (!isOpen) return null

  const handlePresetApply = (presetName: string) => {
    const preset = PERSONALITY_PRESETS[presetName]
    if (preset) {
      updatePersonalitySettings(preset)
      setSelectedPersonality(presetName)
    }
  }

  const quickPresets = [
    "Be more flirty and playful",
    "Ask about their day",
    "Mention your workout routine", 
    "Suggest a custom video",
    "Create urgency about limited content",
    "Be slightly bratty"
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">🎨 Advanced Personality Settings</CardTitle>
              <p className="text-gray-600 mt-1">Complete granular control over personality behavior</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✖️ Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preset Management */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🎯 Preset Management</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(PERSONALITY_PRESETS).map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetApply(preset)}
                  className="w-full"
                >
                  Apply {preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Theme & Specific Controls */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">🎯 Theme Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Sales", "Flirt", "Explicit", "Casual", "Tease", "Intimate", "Playful", "Default"].map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={theme}
                      checked={personalitySettings.theme_controls.includes(theme)}
                      onCheckedChange={(checked) => {
                        const newThemes = checked
                          ? [...personalitySettings.theme_controls, theme]
                          : personalitySettings.theme_controls.filter(t => t !== theme)
                        updatePersonalitySettings({ theme_controls: newThemes })
                      }}
                    />
                    <label htmlFor={theme} className="text-sm">{theme}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">📝 Specific Controls</h3>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {quickPresets.map((preset, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs p-2 h-auto"
                    onClick={() => {
                      const current = personalitySettings.specific_controls
                      const newControls = current ? `${current}\n- ${preset}` : `- ${preset}`
                      updatePersonalitySettings({ specific_controls: newControls })
                    }}
                  >
                    + {preset.slice(0, 15)}...
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="- Mention your new workout routine&#10;- Ask about their weekend plans&#10;- Suggest a custom video"
                value={personalitySettings.specific_controls}
                onChange={(e) => updatePersonalitySettings({ specific_controls: e.target.value })}
                className="h-24"
              />
            </div>
          </div>

          {/* Advanced Controls Tabs */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="basic">📱 Basic</TabsTrigger>
              <TabsTrigger value="structure">📊 Structure</TabsTrigger>
              <TabsTrigger value="patterns">🎯 Patterns</TabsTrigger>
              <TabsTrigger value="dynamic">🔄 Dynamic</TabsTrigger>
              <TabsTrigger value="language">📝 Language</TabsTrigger>
              <TabsTrigger value="tone">🎭 Tone</TabsTrigger>
              <TabsTrigger value="sales">💰 Sales</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Simple sentences %</label>
                  <Slider
                    value={[personalitySettings.simple_sentences]}
                    onValueChange={([value]) => updatePersonalitySettings({ simple_sentences: value })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{personalitySettings.simple_sentences}%</span>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message Length</label>
                  <Slider
                    value={[personalitySettings.avg_message_length]}
                    onValueChange={([value]) => updatePersonalitySettings({ avg_message_length: value })}
                    min={3}
                    max={25}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{personalitySettings.avg_message_length} words</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="use_emojis"
                      checked={personalitySettings.use_emojis}
                      onCheckedChange={(checked) => updatePersonalitySettings({ use_emojis: !!checked })}
                    />
                    <label htmlFor="use_emojis" className="text-sm">Use emojis</label>
                  </div>
                  
                  {personalitySettings.use_emojis && (
                    <div>
                      <label className="text-sm font-medium">Emoji frequency</label>
                      <Slider
                        value={[personalitySettings.emoji_frequency]}
                        onValueChange={([value]) => updatePersonalitySettings({ emoji_frequency: value })}
                        min={10}
                        max={50}
                        step={5}
                        className="mt-2"
                      />
                      <span className="text-xs text-gray-500">1 per {personalitySettings.emoji_frequency} words</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Emoji Types</label>
                                      <Select 
                      value={personalitySettings.emoji_types}
                      onValueChange={(value) => updatePersonalitySettings({ emoji_types: value as 'Emotional faces' | 'Hearts/Love' | 'Mixed' })}
                    >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emotional faces">Emotional faces</SelectItem>
                      <SelectItem value="Hearts/Love">Hearts/Love</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="split_messages"
                      checked={personalitySettings.split_messages}
                      onCheckedChange={(checked) => updatePersonalitySettings({ split_messages: !!checked })}
                    />
                    <label htmlFor="split_messages" className="text-sm">Split Messages</label>
                  </div>
                  
                  {personalitySettings.split_messages && (
                    <div>
                      <label className="text-sm font-medium">Split Count</label>
                      <Slider
                        value={[personalitySettings.split_message_count]}
                        onValueChange={([value]) => updatePersonalitySettings({ split_message_count: value })}
                        min={2}
                        max={4}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-xs text-gray-500">{personalitySettings.split_message_count} messages</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="drop_punctuation"
                      checked={personalitySettings.drop_punctuation}
                      onCheckedChange={(checked) => updatePersonalitySettings({ drop_punctuation: !!checked })}
                    />
                    <label htmlFor="drop_punctuation" className="text-sm">Drop Punctuation</label>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Question Frequency %</label>
                    <Slider
                      value={[personalitySettings.question_frequency]}
                      onValueChange={([value]) => updatePersonalitySettings({ question_frequency: value })}
                      max={80}
                      step={5}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">{personalitySettings.question_frequency}%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pet Names</label>
                  <Input
                    value={personalitySettings.pet_names}
                    onChange={(e) => updatePersonalitySettings({ pet_names: e.target.value })}
                    className="mt-2"
                  />
                  <div className="mt-2">
                    <label className="text-sm font-medium">Pet Names Frequency</label>
                    <Slider
                      value={[personalitySettings.pet_names_freq]}
                      onValueChange={([value]) => updatePersonalitySettings({ pet_names_freq: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">Every {personalitySettings.pet_names_freq} messages</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Filler Words</label>
                  <Input
                    value={personalitySettings.filler_words}
                    onChange={(e) => updatePersonalitySettings({ filler_words: e.target.value })}
                    className="mt-2"
                  />
                  <div className="mt-2">
                    <label className="text-sm font-medium">Filler Frequency</label>
                    <Slider
                      value={[personalitySettings.filler_freq]}
                      onValueChange={([value]) => updatePersonalitySettings({ filler_freq: value })}
                      min={1}
                      max={15}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">Every {personalitySettings.filler_freq} messages</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dynamic" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tone_switching"
                      checked={personalitySettings.tone_switching}
                      onCheckedChange={(checked) => updatePersonalitySettings({ tone_switching: !!checked })}
                    />
                    <label htmlFor="tone_switching" className="text-sm">Tone Switching</label>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Response Speed</label>
                    <Select 
                      value={personalitySettings.response_speed}
                      onValueChange={(value) => updatePersonalitySettings({ response_speed: value as 'Instant' | 'Natural' | 'Delayed' })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instant">Instant</SelectItem>
                        <SelectItem value="Natural">Natural</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Engagement Hooks %</label>
                  <Slider
                    value={[personalitySettings.engagement_hooks]}
                    onValueChange={([value]) => updatePersonalitySettings({ engagement_hooks: value })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{personalitySettings.engagement_hooks}%</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="language" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">One-syllable words %</label>
                  <Slider
                    value={[personalitySettings.one_syllable]}
                    onValueChange={([value]) => updatePersonalitySettings({ one_syllable: value })}
                    min={30}
                    max={90}
                    step={5}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{personalitySettings.one_syllable}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Lexical diversity</label>
                  <Slider
                    value={[personalitySettings.lexical_diversity * 100]}
                    onValueChange={([value]) => updatePersonalitySettings({ lexical_diversity: value / 100 })}
                    min={10}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{(personalitySettings.lexical_diversity * 100).toFixed(0)}%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="limit_adverbs"
                      checked={personalitySettings.limit_adverbs}
                      onCheckedChange={(checked) => updatePersonalitySettings({ limit_adverbs: !!checked })}
                    />
                    <label htmlFor="limit_adverbs" className="text-sm">Limit adverbs/adjectives</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="simple_punctuation"
                      checked={personalitySettings.simple_punctuation}
                      onCheckedChange={(checked) => updatePersonalitySettings({ simple_punctuation: !!checked })}
                    />
                    <label htmlFor="simple_punctuation" className="text-sm">Simple punctuation</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active_voice"
                      checked={personalitySettings.active_voice}
                      onCheckedChange={(checked) => updatePersonalitySettings({ active_voice: !!checked })}
                    />
                    <label htmlFor="active_voice" className="text-sm">Prefer active voice</label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tone" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sentiment</label>
                  <Select 
                    value={personalitySettings.sentiment}
                    onValueChange={(value) => updatePersonalitySettings({ sentiment: value as 'Neutral' | 'Positive' | 'Playful' | 'Dominant' | 'Romantic' })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Playful">Playful</SelectItem>
                      <SelectItem value="Dominant">Dominant</SelectItem>
                      <SelectItem value="Romantic">Romantic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="limit_imagery"
                      checked={personalitySettings.limit_imagery}
                      onCheckedChange={(checked) => updatePersonalitySettings({ limit_imagery: !!checked })}
                    />
                    <label htmlFor="limit_imagery" className="text-sm">Minimal imagery</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="natural_dialogue"
                      checked={personalitySettings.natural_dialogue}
                      onCheckedChange={(checked) => updatePersonalitySettings({ natural_dialogue: !!checked })}
                    />
                    <label htmlFor="natural_dialogue" className="text-sm">Natural dialogue</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="brutal_pruning"
                      checked={personalitySettings.brutal_pruning}
                      onCheckedChange={(checked) => updatePersonalitySettings({ brutal_pruning: !!checked })}
                    />
                    <label htmlFor="brutal_pruning" className="text-sm">Concise writing</label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="be_proactive"
                      checked={personalitySettings.be_proactive}
                      onCheckedChange={(checked) => updatePersonalitySettings({ be_proactive: !!checked })}
                    />
                    <label htmlFor="be_proactive" className="text-sm">Be Proactive</label>
                  </div>

                  {personalitySettings.be_proactive && (
                    <div>
                      <label className="text-sm font-medium">Proactiveness Level %</label>
                      <Slider
                        value={[personalitySettings.proactive_level]}
                        onValueChange={([value]) => updatePersonalitySettings({ proactive_level: value })}
                        min={10}
                        max={90}
                        step={5}
                        className="mt-2"
                      />
                      <span className="text-xs text-gray-500">{personalitySettings.proactive_level}%</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Engagement Hooks %</label>
                  <Slider
                    value={[personalitySettings.engagement_hooks]}
                    onValueChange={([value]) => updatePersonalitySettings({ engagement_hooks: value })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{personalitySettings.engagement_hooks}%</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose} className="bg-green-500 hover:bg-green-600">
              💾 Apply All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
