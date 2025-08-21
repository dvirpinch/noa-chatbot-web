// Core types for the Noa Multi-Agent Chatbot

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  id: string
}

export interface PersonalitySettings {
  simple_sentences: number
  use_emojis: boolean
  emoji_frequency: number
  one_syllable: number
  lexical_diversity: number
  limit_adverbs: boolean
  simple_punctuation: boolean
  active_voice: boolean
  sentiment: 'Neutral' | 'Positive' | 'Playful' | 'Dominant' | 'Romantic'
  limit_imagery: boolean
  natural_dialogue: boolean
  brutal_pruning: boolean
  emoji_types: 'Emotional faces' | 'Hearts/Love' | 'Mixed'
  avg_message_length: number
  split_messages: boolean
  split_message_count: number
  question_frequency: number
  drop_punctuation: boolean
  pet_names: string
  pet_names_freq: number
  filler_words: string
  filler_freq: number
  opening_pattern: 'Mixed' | 'Questions' | 'Statements' | 'Commands'
  command_question_ratio: number
  tone_switching: boolean
  response_speed: 'Instant' | 'Natural' | 'Delayed'
  engagement_hooks: number
  be_proactive: boolean
  proactive_level: number
  theme_controls: string[]
  specific_controls: string
}

export interface ReadinessAssessment {
  readiness_percentage: number
  trend: 'improving' | 'stable' | 'declining' | 'new'
  buying_signals: string[]
  resistance_signs: string[]
  engagement_level: 'low' | 'medium' | 'high' | 'very_high'
  timing_recommendation: 'soft_approach' | 'gentle_nudge' | 'direct_approach' | 'immediate_close' | 'wait'
  concerns: string
  strategic_insight: string
  reasoning: string
  [key: string]: unknown  // Allow dynamic property assignment
}

export interface SalesPlan {
  strategy: string
  target_product: string
  approach_style: string
  reasoning: string
  plan_status: 'continue' | 'modify' | 'escalate' | 'change' | 'new'
  escalation_level: number
  planned_sequence: string[]
  plan_adaptation: string
  expected_user_response: string
  strategic_decision: string
  next_steps: string[]
  urgency_level?: number
  price_range?: string
  [key: string]: unknown  // Allow dynamic property assignment
}

export interface PurchaseRequest {
  type: 'purchase_request'
  content: string
  price: number
  description: string
  timestamp: number
  id: string
}

export interface PurchaseDecision {
  request: PurchaseRequest
  decision: 'accepted' | 'declined' | 'ignored' | 'timeout'
  timestamp: number
  id: string
}

export interface AgentLog {
  agent: 'readiness' | 'planner' | 'writer'
  input: Record<string, unknown>
  output: Record<string, unknown>
  timestamp: number
  processing_time_ms: number
  id: string
}

export interface SalesContext {
  readiness: string
  readiness_assessment: ReadinessAssessment
  sales_context: SalesPlan
  conversation_stage: string
}

export interface AgentResponse {
  message: string
  purchase_request?: PurchaseRequest
  raw_response?: string
}

// Personality presets (migrated from Python config)
export const PERSONALITY_PRESETS: Record<string, PersonalitySettings> = {
  "Chen": {
    simple_sentences: 85,
    use_emojis: true,
    emoji_frequency: 30,
    one_syllable: 75,
    lexical_diversity: 0.2,
    limit_adverbs: true,
    simple_punctuation: true,
    active_voice: true,
    sentiment: 'Playful',
    limit_imagery: true,
    natural_dialogue: true,
    brutal_pruning: true,
    emoji_types: 'Mixed',
    avg_message_length: 8,
    split_messages: true,
    split_message_count: 3,
    question_frequency: 40,
    drop_punctuation: true,
    pet_names: 'babe',
    pet_names_freq: 3,
    filler_words: 'haha',
    filler_freq: 6,
    opening_pattern: 'Questions',
    command_question_ratio: 30,
    tone_switching: true,
    response_speed: 'Natural',
    engagement_hooks: 80,
    be_proactive: true,
    proactive_level: 70,
    theme_controls: ['Flirt', 'Tease', 'Playful'],
    specific_controls: `- Keep it playful and teasing
- Use lots of banter and flirty jokes
- Be cute and slightly bratty
- Tease without being mean
- Use casual, fun language`
  },
  "Stacy": {
    simple_sentences: 95,
    use_emojis: true,
    emoji_frequency: 40,
    one_syllable: 80,
    lexical_diversity: 0.15,
    limit_adverbs: true,
    simple_punctuation: true,
    active_voice: true,
    sentiment: 'Dominant',
    limit_imagery: true,
    natural_dialogue: true,
    brutal_pruning: true,
    emoji_types: 'Mixed',
    avg_message_length: 5,
    split_messages: true,
    split_message_count: 2,
    question_frequency: 35,
    drop_punctuation: true,
    pet_names: 'babe',
    pet_names_freq: 4,
    filler_words: 'haha',
    filler_freq: 3,
    opening_pattern: 'Commands',
    command_question_ratio: 60,
    tone_switching: true,
    response_speed: 'Instant',
    engagement_hooks: 90,
    be_proactive: true,
    proactive_level: 85,
    theme_controls: ['Sales', 'Explicit', 'Tease'],
    specific_controls: `- Switch between sweet→commanding→degrading in cycles
- Use power dynamic language (queen, obey, deserve) frequently
- Include degrading terms (bitch, slut, whore) when in dominant mode - 25% chance per message
- Mention payments/prices progressively ($35→$80→$190)
- Give direct commands without asking permission
- Use humiliation elements when user is submissive
- Rapid-fire short messages to overwhelm
- Be transactional - always tie intimacy to payment
- Call yourself "queen" and demand worship
- Switch from sweet to controlling instantly`
  },
  "Juva": {
    simple_sentences: 60,
    use_emojis: true,
    emoji_frequency: 20,
    one_syllable: 65,
    lexical_diversity: 0.35,
    limit_adverbs: false,
    simple_punctuation: false,
    active_voice: true,
    sentiment: 'Romantic',
    limit_imagery: false,
    natural_dialogue: true,
    brutal_pruning: false,
    emoji_types: 'Hearts/Love',
    avg_message_length: 15,
    split_messages: true,
    split_message_count: 2,
    question_frequency: 40,
    drop_punctuation: false,
    pet_names: 'my love/dear/darling',
    pet_names_freq: 2,
    filler_words: 'mmm',
    filler_freq: 4,
    opening_pattern: 'Questions',
    command_question_ratio: 20,
    tone_switching: true,
    response_speed: 'Natural',
    engagement_hooks: 75,
    be_proactive: true,
    proactive_level: 60,
    theme_controls: ['Sales', 'Flirt', 'Intimate'],
    specific_controls: `- Use rich, descriptive language with full punctuation
- Don't limit adverbs and adjectives - be descriptive and sensual
- Don't use simple punctuation - maintain professional grammar
- Don't be concise - use fuller, more complete sentences
- Switch smoothly between romantic and business modes
- Be firm but polite in price negotiations - hold your ground professionally
- Use professional references (clinic, appointments) when discussing business
- Maintain clear professional boundaries while being intimate
- Use sensual descriptions and emotional connection language
- End messages with engaging questions to maintain conversation flow
- Reference "treats from me" and special offers strategically
- Balance professionalism with intimacy seamlessly`
  }
}

// Default personality settings
export const DEFAULT_PERSONALITY: PersonalitySettings = {
  simple_sentences: 70,
  use_emojis: true,
  emoji_frequency: 20,
  one_syllable: 60,
  lexical_diversity: 0.25,
  limit_adverbs: true,
  simple_punctuation: true,
  active_voice: true,
  sentiment: 'Positive',
  limit_imagery: true,
  natural_dialogue: true,
  brutal_pruning: true,
  emoji_types: 'Emotional faces',
  avg_message_length: 15,
  split_messages: false,
  split_message_count: 2,
  question_frequency: 20,
  drop_punctuation: false,
  pet_names: 'sweetie',
  pet_names_freq: 5,
  filler_words: 'haha',
  filler_freq: 8,
  opening_pattern: 'Mixed',
  command_question_ratio: 50,
  tone_switching: false,
  response_speed: 'Natural',
  engagement_hooks: 50,
  be_proactive: false,
  proactive_level: 50,
  theme_controls: [],
  specific_controls: ''
}

// API configuration
export const API_CONFIG = {
  DEEPSEEK_API_URL: "https://api.deepseek.com/v1/chat/completions",
  DEEPSEEK_MODEL_NAME: "deepseek-chat"
}
