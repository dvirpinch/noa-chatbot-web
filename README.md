# 🤖 Noa Multi-Agent Chatbot - Modern Web Version

A sophisticated multi-agent chatbot system with advanced personality controls and real-time conversation analytics.

## ✨ Features

- **🎯 Multi-Agent System**: 3 specialized AI agents working in harmony
  - **Agent 1**: Sales Strategy Planner
  - **Agent 2**: User Readiness Assessor  
  - **Agent 5**: Personality Writer (V4 Prompt Engineering)

- **🎨 Advanced Personality Controls**: 25+ granular settings with preset management
- **💸 Interactive Purchase System**: Beautiful purchase request cards with real-time feedback
- **🔍 Debug Dashboard**: Comprehensive agent insights and conversation analytics
- **📱 Modern UI/UX**: 2025 design language with mobile-first responsive design

## 🚀 Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: Zustand
- **AI**: DeepSeek API with multi-agent orchestration
- **Design**: Glass-morphism, gradients, professional UX

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## 📊 Agent System

### Readiness Assessment Agent
- Analyzes user purchase readiness (0-100%)
- Tracks buying signals and resistance patterns
- Provides strategic timing recommendations

### Sales Planning Agent  
- Creates multi-step strategic plans
- Adapts approach based on user trends
- Manages escalation levels (0-5)

### Personality Writer Agent
- Preserves exact V4 prompt engineering
- Dynamic personality controls
- Probability-based response generation

## 🎨 Personality Presets

- **Chen**: Playful, teasing, casual (85% simple sentences)
- **Stacy**: Dominant, direct, sales-focused (95% simple sentences)
- **Juva**: Romantic, descriptive, professional (60% simple sentences)
- **Custom**: Fully customizable personality

## 🔧 Advanced Controls

- **Basic**: Message length, emoji usage, sentence complexity
- **Structure**: Message splitting, punctuation, question frequency
- **Patterns**: Pet names, filler words, frequency controls
- **Dynamic**: Tone switching, response speed, engagement hooks
- **Language**: Vocabulary complexity, voice preference
- **Tone**: Sentiment, imagery, dialogue style
- **Sales**: Proactiveness, engagement strategy

## 📈 Analytics & Debug

- **Real-time readiness tracking**
- **Strategic plan evolution**
- **Purchase request analytics**
- **Message-by-message agent reasoning**
- **Trend analysis and insights**

## 🚀 Deployment

This app is deployed on Railway with automatic deployments from GitHub.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes     │    │   Agents        │
│   (Next.js)     │───▶│   (/api/chat)    │───▶│   (TypeScript)  │
│                 │    │                  │    │                 │
│ • Chat UI       │    │ • Agent orchestr.│    │ • Readiness     │
│ • Settings      │    │ • Error handling │    │ • Planning      │
│ • Debug Panel   │    │ • Response format│    │ • Personality   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📄 License

Private project - All rights reserved

---

**🎯 Built with modern web technologies for professional AI conversation management**