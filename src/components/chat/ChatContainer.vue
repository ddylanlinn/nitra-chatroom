<template>
  <div class="chat-container">
    <!-- Chat Messages Area -->
    <div ref="messagesRef" class="chat-container__messages">
      <div v-if="messages.length === 0" class="chat-container__empty">
        <div class="chat-container__welcome">
          <q-avatar
            size="80px"
            color="primary"
            icon="smart_toy"
            class="chat-container__avatar"
          />
          <h5 class="text-primary q-mt-md">Welcome to Nitra AI Chatroom</h5>
          <p class="text-grey-7 q-mt-sm text-center">
            Ask me about medical supplies like gloves, ultrasound gel,<br />
            antibiotic ointments, surgical scissors, or masks.
          </p>
        </div>
      </div>

      <!-- Messages List -->
      <div v-else class="chat-container__message-list">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :enable-typing-animation="true"
          class="chat-container__message"
        />

        <!-- Loading indicator (only when waiting for response) -->
        <div
          v-if="isLoading && messages.length === 0"
          class="chat-container__loading"
        >
          <div class="chat-container__loading-bubble">
            <q-avatar size="32px" color="primary" icon="smart_toy" />
            <div class="chat-container__loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggested Questions -->
    <SuggestedQuestions
      :questions="suggestedQuestions.suggestedQuestions"
      @question-click="handleSuggestedQuestionClick"
      class="chat-container__suggestions"
    />

    <!-- Chat Input -->
    <ChatInput
      ref="inputRef"
      :is-loading="isLoading"
      @send="handleSendMessage"
      class="chat-container__input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { useChatStore } from "../../stores/chat";
import MessageBubble from "./MessageBubble.vue";
import ChatInput from "./ChatInput.vue";
import SuggestedQuestions from "./SuggestedQuestions.vue";
import { useSuggestedQuestions } from "../../composables/useSuggestedQuestions";
import type { Message } from "../../types";

const chatStore = useChatStore();
const suggestedQuestions = useSuggestedQuestions();

// Refs
const messagesRef = ref<HTMLElement>();
const inputRef = ref();

// Computed
const messages = computed(() => chatStore.messages);
const isLoading = computed(() => chatStore.isLoading);

// Handle suggested question click
const handleSuggestedQuestionClick = (question: string) => {
  handleSendMessage(question);
};

// Methods
const handleSendMessage = async (message: string) => {
  await chatStore.sendMessage(message);
};

// Auto-scroll to bottom when new messages arrive
const scrollToBottom = async () => {
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
};

// Watch for new messages and scroll
watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

// Watch for loading state changes
watch(
  () => isLoading.value,
  () => {
    if (!isLoading.value) {
      // Scroll when loading completes (message finished)
      setTimeout(scrollToBottom, 100);
    }
  }
);

// Watch for new messages to parse suggested questions
watch(
  () => messages.value.length,
  () => {
    const lastMessage = messages.value[messages.value.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      suggestedQuestions.parseSuggestedQuestions(lastMessage.content);
    }
  }
);

// Watch for new assistant messages to update suggestions
watch(
  () => messages.value,
  (newMessages) => {
    const lastAssistantMessage = [...newMessages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (lastAssistantMessage) {
      suggestedQuestions.parseSuggestedQuestions(lastAssistantMessage.content);
    }
  },
  { deep: true }
);

// Scroll to bottom on mount
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.chat-container__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.chat-container__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-container__welcome {
  text-align: center;
  max-width: 400px;
}

.chat-container__avatar {
  margin: 0 auto;
}

.chat-container__message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-container__message {
  animation: messageSlideIn 0.3s ease-out;
}

.chat-container__loading {
  margin: 16px 0;
}

.chat-container__loading-bubble {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-container__loading-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 18px 18px 18px 4px;
  border: 1px solid #e0e0e0;
}

.chat-container__loading-dots span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typingDot 1.4s infinite ease-in-out;
}

.chat-container__loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-container__loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-container__suggestions {
  flex-shrink: 0;
}

.chat-container__input {
  flex-shrink: 0;
}

/* Animations */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typingDot {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .chat-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .chat-container__messages {
    padding: 24px 48px;
  }

  .chat-container__welcome {
    max-width: 500px;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .chat-container__messages {
    padding: 20px 32px;
  }

  .chat-container__welcome {
    max-width: 450px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .chat-container__messages {
    padding: 16px 24px;
  }

  .chat-container__welcome {
    max-width: 400px;
  }

  .chat-container__welcome h5 {
    font-size: 1.3rem;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .chat-container__messages {
    padding: 14px 20px;
  }

  .chat-container__welcome {
    max-width: 320px;
  }

  .chat-container__welcome h5 {
    font-size: 1.2rem;
  }

  .chat-container__welcome p {
    font-size: 14px;
    line-height: 1.5;
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .chat-container {
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile browsers */
  }

  .chat-container__messages {
    padding: 12px 16px;
  }

  .chat-container__welcome {
    max-width: 280px;
  }

  .chat-container__welcome h5 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .chat-container__welcome p {
    font-size: 13px;
    line-height: 1.4;
  }

  .chat-container__avatar {
    width: 60px !important;
    height: 60px !important;
    font-size: 1.5rem !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .chat-container {
    background: #121212;
  }

  .chat-container__messages {
    background: #121212;
  }

  .chat-container__typing-dots {
    background: #2a2a2a;
    border-color: #333;
  }

  .chat-container__typing-dots span {
    background: #666;
  }
}

/* Scrollbar styling */
.chat-container__messages::-webkit-scrollbar {
  width: 6px;
}

.chat-container__messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-container__messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.chat-container__messages::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
