# Nitra AI Chatroom

An AI-powered chatroom interface for smart medical supply procurement, built with Vue 3 and Quasar Framework.

## Quick Start

### Installation & Development

```bash
# Install dependencies
yarn

# Start development server
yarn dev
```

The application will be available at `http://localhost:9000`

### Build for Production

```bash
yarn build
```

## Project Structure

```
src/
├── components/
│   └── chat/
│       ├── ChatContainer.vue      # Main chat interface
│       ├── ChatInput.vue          # Message input component
│       └── MessageBubble.vue      # Message display component
├── composables/
│   ├── useMockDataParser.ts       # Mock data parsing logic
│   └── useTypingAnimation.ts      # Typing animation effect
├── stores/
│   └── chat.ts                    # Pinia store for chat state
├── types/
│   └── index.ts                   # TypeScript interfaces
├── css/
│   ├── app.scss                   # Global styles
│   └── quasar.variables.scss      # Quasar theme variables
└── mock/
    └── messages.js                # Mock response data
```

## Architecture & Logic

### Core Features

1. **Mock Data Processing**
   - Parses predefined JSON responses
   - Supports exact and fuzzy keyword matching
   - Extracts product information from markdown content

2. **Chat Interface**
   - Real-time typing animation for AI responses
   - Message history management
   - Responsive design for all devices

3. **State Management**
   - Pinia store for centralized chat state
   - Message persistence during session
   - Loading and thinking states

### Key Components

- **ChatContainer**: Main chat interface with message list and input
- **MessageBubble**: Individual message display with typing animation
- **ChatInput**: Input field with validation and send functionality

### Data Flow

1. User types message → ChatInput
2. Message sent to ChatStore
3. Store processes message through MockDataParser
4. AI response displayed with typing animation
5. Message history updated
