<template>
  <div class="chat-input">
    <q-form @submit="handleSubmit" class="chat-input__form">
      <div class="chat-input__container">
        <q-input
          v-model="message"
          ref="inputRef"
          :placeholder="isLoading ? 'AI is responding...' : placeholder"
          :loading="isLoading"
          :disable="isLoading"
          :readonly="isLoading"
          outlined
          autogrow
          :maxlength="maxLength"
          class="chat-input__field"
          @keydown="handleKeydown"
          @input="handleInput"
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
              @click="handleSubmit"
            >
              <q-tooltip
                :disable="!isValid || isLoading"
                anchor="top middle"
                self="bottom middle"
              >
                {{ isLoading ? "AI is responding..." : "Send message (Enter)" }}
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
    <div v-if="suggestedQuestion && !isLoading" class="chat-input__suggestions">
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
import { ref, computed, nextTick } from "vue";

interface Props {
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  suggestedQuestion?: string;
  isLoading?: boolean;
}

interface Emits {
  (e: "send", message: string): void;
  (e: "suggestion-click", question: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Type your message...",
  maxLength: 1000,
  showCharCount: false,
  suggestedQuestion: undefined,
  isLoading: false,
});

const emit = defineEmits<Emits>();

const message = ref("");
const inputRef = ref();

const isValid = computed(() => {
  const trimmed = message.value.trim();
  return trimmed.length > 0 && trimmed.length <= props.maxLength;
});

const sendIcon = computed(() => {
  if (props.isLoading) return "hourglass_empty";
  return "send";
});

const handleSubmit = () => {
  if (!isValid.value || props.isLoading) return;

  const trimmedMessage = message.value.trim();
  emit("send", trimmedMessage);
  message.value = "";

  // Focus back to input after sending
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  // Block all input when loading
  if (props.isLoading) {
    event.preventDefault();
    return;
  }

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (isValid.value) {
      handleSubmit();
    }
  }
};

const handleInput = () => {
  // Block input changes when loading
  if (props.isLoading) {
    // Revert the input value
    nextTick(() => {
      // Find the previous valid value
      const trimmed = message.value.trim();
      if (trimmed.length === 0) {
        message.value = "";
      }
    });
  }
};

const handleSuggestionClick = () => {
  if (props.suggestedQuestion) {
    emit("suggestion-click", props.suggestedQuestion);
  }
};

// Expose focus method for parent components
const focus = () => {
  inputRef.value?.focus();
};

defineExpose({
  focus,
});
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
  padding: 12px 16px;
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

  .chat-input__suggestions {
    margin-top: 16px;
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

  .chat-input__char-count {
    right: 75px;
    font-size: 11px;
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

  .chat-input__char-count {
    right: 65px;
    font-size: 10px;
    bottom: 6px;
  }

  .chat-input__send-btn {
    margin-right: 4px;
    padding: 8px;
  }

  .chat-input__suggestions {
    margin-top: 10px;
  }
}

/* Force light theme regardless of system preference */
@media (prefers-color-scheme: dark) {
  .chat-input {
    background: #ffffff !important;
    border-top-color: #e0e0e0 !important;
    color: #333333 !important;
  }

  .chat-input__char-count {
    background: rgba(255, 255, 255, 0.9) !important;
    color: #666666 !important;
  }

  .chat-input__field :deep(.q-field__control) {
    background: #ffffff !important;
    color: #333333 !important;
  }

  .chat-input__field :deep(.q-field__native) {
    color: #333333 !important;
  }
}
</style>
