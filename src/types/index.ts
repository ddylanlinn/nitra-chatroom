// Core interfaces for the chat application

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  id?: string
}

export interface ChatResponse {
  message: {
    role: 'assistant'
    content: string
    timestamp: string
  }
}

export type MockData = Record<string, ChatResponse>

export interface ProductInfo {
  name: string
  price: string
  unitOfMeasure?: string
  vendor: string
  brand?: string
  productLink?: string
  imageLink?: string
}

export interface ParsedMessage {
  message: Message
  products?: ProductInfo[]
  suggestedQuestion?: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentTypingMessage?: Message
}

// Typing animation related types
export interface TypingConfig {
  speed?: number // characters per second
  delay?: number // delay before starting animation
}

export interface TypingState {
  isTyping: boolean
  currentIndex: number
  fullText: string
  displayedText: string
}
