<template>
  <div class="chat-input">
    <q-form @submit="handleSubmit" class="chat-input__form">
      <div class="chat-input__container">
        <q-input
          v-model="message"
          ref="inputRef"
          :placeholder="isLoading ? 'AI is responding...' : placeholder"
          :disable="isLoading"
          :readonly="isLoading"
          outlined
          autogrow
          :maxlength="maxLength"
          class="chat-input__field"
          @keydown="handleKeydown"
          @input="handleInput"
        >
          <template v-slot:append>
            <q-btn
              :icon="sendIcon"
              :color="isValid ? 'primary' : 'grey'"
              :disable="!isValid || isLoading"
              flat
              round
              type="submit"
              class="chat-input__send-btn"
              @click="handleSubmit"
            >
            </q-btn>
          </template>
        </q-input>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  placeholder?: string
  maxLength?: number
  showCharCount?: boolean
  isLoading?: boolean
}

interface Emits {
  (e: 'send', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type your message...',
  maxLength: 1000,
  showCharCount: false,
  isLoading: false,
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

  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.isLoading) {
    event.preventDefault()
    return
  }

  // Don't interfere with composition events (for Chinese, Japanese, Korean input)
  if (event.isComposing) {
    return
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (isValid.value) {
      handleSubmit()
    }
  }
}

const handleInput = () => {
  if (props.isLoading) {
    nextTick(() => {
      const trimmed = message.value.trim()
      if (trimmed.length === 0) {
        message.value = ''
      }
    })
  }
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})
</script>

<style scoped lang="scss">
@import '../../css/app.scss';

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

.chat-input__field[disabled] {
  pointer-events: none;
  opacity: 0.6;
}

.chat-input__field :deep(.q-field__control) {
  border-radius: 24px;
  padding: 0 8px;
}

.chat-input__field :deep(.q-field__native) {
  border-radius: 24px;
  padding: 12px;
  font-size: 16px;
  line-height: 1.4;
}

.chat-input__send-btn {
  margin-right: 8px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1;
  position: relative;
}

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .chat-input {
    padding: 20px 48px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 16px 20px;
    font-size: 16px;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .chat-input {
    padding: 18px 32px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 14px 18px;
    font-size: 16px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .chat-input {
    padding: 16px 24px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 12px 16px;
    font-size: 16px;
  }

  .chat-input__send-btn {
    margin-right: 6px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .chat-input {
    padding: 14px 20px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 12px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .chat-input__send-btn {
    margin-right: 6px;
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .chat-input {
    padding: 12px 16px;
    /* Ensure input area is always visible above mobile keyboards */
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }

  .chat-input__field {
    border-radius: 20px;
  }

  .chat-input__field :deep(.q-field__control) {
    border-radius: 20px;
    padding: 0 6px;
  }

  .chat-input__field :deep(.q-field__native) {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
    line-height: 1.3;
  }

  .chat-input__send-btn {
    margin-right: 4px;
    padding: 8px;
  }
}
</style>
