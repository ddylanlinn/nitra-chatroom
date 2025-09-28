import type { Message } from '../types'

export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const createMessage = (role: 'user' | 'assistant', content: string): Message => ({
  id: generateMessageId(),
  role,
  content,
  timestamp: new Date().toISOString(),
})

// Error message constants
export const ERROR_MESSAGES = {
  DEFAULT:
    "I'm sorry, I couldn't find a specific response for that question. Please try asking about medical supplies like gloves, ultrasound gel, antibiotic ointments, surgical scissors, or masks.",
  PROCESSING_ERROR: 'Sorry, there was an error processing your request. Please try again.',
} as const
