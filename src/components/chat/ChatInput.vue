<template>
  <div class="chat-input">
    <q-form @submit="handleSubmit" class="chat-input__form">
      <div class="chat-input__container">
        <q-input
          v-model="message"
          ref="inputRef"
          :placeholder="placeholder"
          :loading="isLoading"
          :disable="isLoading"
          outlined
          autogrow
          :maxlength="maxLength"
          class="chat-input__field"
          @keydown="handleKeydown"
        >
          <template v-slot:prepend>
            <q-icon name="chat" color="primary" />
          </template>

          <template v-slot:append>
            <q-btn
              :icon="sendIcon"
              :color="isValid ? 'primary' : 'grey'"
              :disable="!isValid || isLoading"
              flat
              round
              type="submit"
              class="chat-input__send-btn"
            >
              <q-tooltip
                :disable="!isValid"
                anchor="top middle"
                self="bottom middle"
              >
                Send message (Enter)
              </q-tooltip>
            </q-btn>
          </template>
        </q-input>

        <!-- Character count (optional) -->
        <div
          v-if="showCharCount && message.length > maxLength * 0.8"
          class="chat-input__char-count"
        >
          {{ message.length }}/{{ maxLength }}
        </div>
      </div>
    </q-form>

    <!-- Suggested questions (if provided) -->
    <div v-if="suggestedQuestion" class="chat-input__suggestions">
      <q-chip
        :label="suggestedQuestion"
        color="primary"
        outline
        clickable
        @click="handleSuggestionClick"
        class="chat-input__suggestion-chip"
      >
        <q-icon name="lightbulb" />
        <q-tooltip>Suggested question</q-tooltip>
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  placeholder?: string
  maxLength?: number
  showCharCount?: boolean
  suggestedQuestion?: string
  isLoading?: boolean
}

interface Emits {
  (e: 'send', message: string): void
  (e: 'suggestion-click', question: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type your message...',
  maxLength: 1000,
  showCharCount: false,
  suggestedQuestion: undefined,
  isLoading: false
})

const emit = defineEmits<Emits>()

const message = ref('')
const inputRef = ref()

const isValid = computed(() => {
  const trimmed = message.value.trim()
  return trimmed.length > 0 && trimmed.length <= props.maxLength
})

const sendIcon = computed(() => {
  if (props.isLoading) return 'hourglass_empty'
  return 'send'
})

const handleSubmit = () => {
  if (!isValid.value || props.isLoading) return

  const trimmedMessage = message.value.trim()
  emit('send', trimmedMessage)
  message.value = ''

  // Focus back to input after sending
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const handleSuggestionClick = () => {
  if (props.suggestedQuestion) {
    emit('suggestion-click', props.suggestedQuestion)
  }
}

// Expose focus method for parent components
const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus
})
</script>

<style scoped>
.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input__container {
  position: relative;
}

.chat-input__field {
  border-radius: 24px;
}

.chat-input__field :deep(.q-field__control) {
  border-radius: 24px;
  padding: 0 8px;
}

.chat-input__field :deep(.q-field__native) {
  border-radius: 24px;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.4;
}

.chat-input__send-btn {
  margin-right: 8px;
}

.chat-input__char-count {
  position: absolute;
  bottom: 8px;
  right: 80px;
  font-size: 11px;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 8px;
  z-index: 1;
}

.chat-input__suggestions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.chat-input__suggestion-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-input__suggestion-chip:hover {
  transform: translateY(-1px);
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .chat-input {
    padding: 12px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .chat-input__char-count {
    right: 70px;
    font-size: 10px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .chat-input {
    background: #1a1a1a;
    border-top-color: #333;
  }

  .chat-input__char-count {
    background: rgba(26, 26, 26, 0.9);
    color: #ccc;
  }
}
</style>
