import { ref, computed, onUnmounted } from 'vue'
import type { TypingConfig } from '../types'

enum TypingStatus {
  IDLE = 'idle',
  DELAYING = 'delaying',
  TYPING = 'typing',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export function useTypingAnimation(
  fullText: string,
  config: TypingConfig = {}
) {
  const {
    speed = 50,
    delay = 200,
  } = config

  // State
  const currentIndex = ref(0)
  const status = ref(TypingStatus.IDLE)
  const startTime = ref<number | null>(null)

  // Computed
  const displayedText = computed(() => {
    return fullText.slice(0, currentIndex.value)
  })

  const progress = computed(() => {
    if (!fullText || fullText.length === 0) return 1
    return currentIndex.value / fullText.length
  })

  const remainingTime = computed(() => {
    if (status.value !== TypingStatus.TYPING) return 0
    const remainingChars = fullText.length - currentIndex.value
    return remainingChars * speed
  })

  const isTyping = computed(() => status.value === TypingStatus.TYPING)
  const isCompleted = computed(() => status.value === TypingStatus.COMPLETED)
  const isPaused = computed(() => status.value === TypingStatus.PAUSED)

  // Animation handles
  let animationId: number | null = null
  let delayTimeout: number | null = null
  let lastFrameTime = 0

  const cleanup = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    if (delayTimeout) {
      clearTimeout(delayTimeout)
      delayTimeout = null
    }
  }

  const startTyping = () => {
    if (status.value === TypingStatus.TYPING || status.value === TypingStatus.COMPLETED) {
      return
    }

    // Edge case: empty text
    if (!fullText || fullText.length === 0) {
      status.value = TypingStatus.COMPLETED
      return
    }

    // Reset state
    currentIndex.value = 0
    status.value = TypingStatus.DELAYING
    startTime.value = Date.now()

    // Handle delay
    if (delay > 0) {
      delayTimeout = window.setTimeout(() => {
        delayTimeout = null
        if (status.value === TypingStatus.DELAYING) {
          beginTyping()
        }
      }, delay)
    } else {
      beginTyping()
    }
  }

  const beginTyping = () => {
    if (currentIndex.value >= fullText.length) {
      completeTyping()
      return
    }

    status.value = TypingStatus.TYPING
    lastFrameTime = performance.now()
    typeNextChar()
  }

  const typeNextChar = () => {
    const animate = (currentTime: number) => {
      if (status.value !== TypingStatus.TYPING) {
        animationId = null
        return
      }

      if (currentTime - lastFrameTime >= speed) {
        if (currentIndex.value < fullText.length) {
          currentIndex.value++
          lastFrameTime = currentTime
        }

        if (currentIndex.value >= fullText.length) {
          completeTyping()
          return
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
  }

  const completeTyping = () => {
    cleanup()
    currentIndex.value = fullText.length
    status.value = TypingStatus.COMPLETED
  }

  const pauseTyping = () => {
    if (status.value === TypingStatus.TYPING) {
      cleanup()
      status.value = TypingStatus.PAUSED
    }
  }

  const resumeTyping = () => {
    if (status.value === TypingStatus.PAUSED && currentIndex.value < fullText.length) {
      beginTyping()
    }
  }

  const skipTyping = () => {
    completeTyping()
  }

  const resetTyping = () => {
    cleanup()
    currentIndex.value = 0
    status.value = TypingStatus.IDLE
    startTime.value = null
  }

  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    displayedText,
    progress,
    remainingTime,
    isTyping,
    isCompleted,
    isPaused,
    
    // Actions
    startTyping,
    pauseTyping,
    resumeTyping,
    skipTyping,
    resetTyping,
    cleanup
  }
}