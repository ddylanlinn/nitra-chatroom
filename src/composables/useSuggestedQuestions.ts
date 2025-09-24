import { ref, computed } from 'vue'

export function useSuggestedQuestions() {
  const suggestedQuestions = ref<string[]>([])

  // Parse suggested questions from assistant message content
  const parseSuggestedQuestions = (content: string) => {
    const questions: string[] = []

    // Look for "Suggested Question:" pattern
    const suggestedMatch = content.match(/Suggested Question:\s*(.+?)(?:\n|$)/i)
    if (suggestedMatch) {
      const questionText = suggestedMatch[1].trim()

      // Clean up the question text
      let cleanedQuestion = questionText

      // Remove common prefixes that might appear
      cleanedQuestion = cleanedQuestion.replace(/^Here is\s+/i, '')
      cleanedQuestion = cleanedQuestion.replace(/^Would you like/i, 'Would you like')

      // Split multiple questions if they exist (separated by ? or .)
      const questionParts = cleanedQuestion.split(/[?.]\s*/)
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => {
          // Add question mark if missing
          return part.endsWith('?') ? part : part + '?'
        })

      questions.push(...questionParts)
    }

    suggestedQuestions.value = questions
    return questions
  }

  // Clear suggested questions
  const clearSuggestedQuestions = () => {
    suggestedQuestions.value = []
  }

  // Check if there are any suggested questions
  const hasSuggestedQuestions = computed(() => suggestedQuestions.value.length > 0)

  return {
    suggestedQuestions: computed(() => suggestedQuestions.value),
    hasSuggestedQuestions,
    parseSuggestedQuestions,
    clearSuggestedQuestions
  }
}
