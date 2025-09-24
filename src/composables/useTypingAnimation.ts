import { ref, computed } from 'vue'
import type { TypingConfig, TypingState } from '../types'

export function useTypingAnimation(
  fullText: string,
  config: TypingConfig = {}
) {
  // Configuration with defaults
  const {
    speed = 50, // milliseconds per character
    delay = 200, // delay before starting animation
  } = config

  // State
  const currentIndex = ref(0)
  const isTyping = ref(false)
  const isCompleted = ref(false)
  const startTime = ref<number | null>(null)

  // Computed
  const displayedText = computed(() => {
    return fullText.slice(0, currentIndex.value)
  })

  const progress = computed(() => {
    if (fullText.length === 0) return 1
    return currentIndex.value / fullText.length
  })

  const remainingTime = computed(() => {
    if (!isTyping.value || isCompleted.value) return 0
    const remainingChars = fullText.length - currentIndex.value
    return remainingChars * speed
  })

  // State object for external access
  const state = computed<TypingState>(() => ({
    isTyping: isTyping.value,
    currentIndex: currentIndex.value,
    fullText,
    displayedText: displayedText.value
  }))

  // Animation logic
  let animationId: number | null = null
  let delayTimeout: number | null = null

  const startTyping = () => {
    if (isTyping.value || isCompleted.value) return

    // Reset state
    currentIndex.value = 0
    isCompleted.value = false
    startTime.value = Date.now()

    // Start with delay if specified
    if (delay > 0) {
      delayTimeout = window.setTimeout(() => {
        delayTimeout = null
        beginTyping()
      }, delay)
    } else {
      beginTyping()
    }
  }

  const beginTyping = () => {
    isTyping.value = true

    const typeNextChar = () => {
      if (currentIndex.value < fullText.length) {
        currentIndex.value++
        animationId = window.setTimeout(typeNextChar, speed)
      } else {
        completeTyping()
      }
    }

    typeNextChar()
  }

  const completeTyping = () => {
    currentIndex.value = fullText.length
    isTyping.value = false
    isCompleted.value = true

    if (animationId) {
      clearTimeout(animationId)
      animationId = null
    }
  }

  const pauseTyping = () => {
    if (animationId) {
      clearTimeout(animationId)
      animationId = null
    }
    isTyping.value = false
  }

  const resumeTyping = () => {
    if (!isTyping.value && !isCompleted.value && currentIndex.value < fullText.length) {
      beginTyping()
    }
  }

  const skipTyping = () => {
    completeTyping()
  }

  const resetTyping = () => {
    // Clear all timers
    if (animationId) {
      clearTimeout(animationId)
      animationId = null
    }
    if (delayTimeout) {
      clearTimeout(delayTimeout)
      delayTimeout = null
    }

    // Reset state
    currentIndex.value = 0
    isTyping.value = false
    isCompleted.value = false
    startTime.value = null
  }

  // Cleanup on unmount
  const cleanup = () => {
    resetTyping()
  }

  return {
    // State
    state,

    // Computed
    displayedText,
    progress,
    remainingTime,
    isTyping: computed(() => isTyping.value),
    isCompleted: computed(() => isCompleted.value),

    // Methods
    startTyping,
    pauseTyping,
    resumeTyping,
    skipTyping,
    resetTyping,
    cleanup
  }
}
