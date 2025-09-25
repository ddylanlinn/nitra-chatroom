<template>
  <div class="chat-container">
    <!-- Header Section -->
    <div class="chat-container__header">
      <div class="chat-container__header-content">
        <div class="chat-container__brand">
          <q-icon name="smart_toy" class="chat-container__brand-icon" />
          <span class="chat-container__brand-text">Nitra AI</span>
          <q-icon name="edit" class="chat-container__edit-icon" />
        </div>

        <div class="chat-container__actions">
          <q-btn
            flat
            round
            icon="close"
            color="white"
            class="chat-container__close-btn"
            @click="handleClose"
          />
        </div>
      </div>

      <div class="chat-container__subtitle">Hi there, How can we help?</div>
    </div>

    <!-- Chat Messages Area -->
    <div ref="messagesRef" class="chat-container__messages">
      <div v-if="messages.length === 0" class="chat-container__empty">
        <div class="chat-container__welcome">
          <q-avatar
            size="80px"
            color="secondary"
            icon="smart_toy"
            class="chat-container__avatar"
          />
          <h5 class="text-secondary q-mt-md">Welcome to Nitra AI!</h5>
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

// Handle close button click
const handleClose = () => {
  console.log("Close clicked");
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
  width: 100%;
  max-width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

.chat-container__header {
  background: linear-gradient(135deg, #2d5a5a 0%, #1e4040 100%);
  color: white;
  padding: 16px 20px 12px;
  flex-shrink: 0;
}

.chat-container__header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chat-container__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-container__brand-icon {
  font-size: 24px;
  color: white;
}

.chat-container__brand-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.chat-container__edit-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease;
}

.chat-container__edit-icon:hover {
  color: white;
}

.chat-container__actions {
  display: flex;
  align-items: center;
}

.chat-container__close-btn {
  width: 32px;
  height: 32px;
}

.chat-container__subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
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
    max-width: 85vw;
    width: 85vw;
    height: 100vh;
  }

  .chat-container__header {
    padding: 20px 32px 16px;
  }

  .chat-container__messages {
    padding: 24px 32px;
  }

  .chat-container__welcome {
    max-width: 600px;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .chat-container {
    max-width: 88vw;
    width: 88vw;
    height: 100vh;
  }

  .chat-container__header {
    padding: 18px 24px 14px;
  }

  .chat-container__messages {
    padding: 20px 24px;
  }

  .chat-container__welcome {
    max-width: 500px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .chat-container {
    max-width: 100%;
    width: 100%;
    height: 100vh;
  }

  .chat-container__header {
    padding: 16px 18px 12px;
  }

  .chat-container__messages {
    padding: 16px;
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
  .chat-container {
    max-width: 100%;
    width: 100%;
    height: 100vh;
  }

  .chat-container__header {
    padding: 14px 16px 10px;
  }

  .chat-container__messages {
    padding: 14px;
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
    width: 100%;
    max-width: 100%;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile browsers */
    border-radius: 0;
    box-shadow: none;
  }

  .chat-container__header {
    padding: 12px 16px 8px;
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

/* Force light theme regardless of system preference */
@media (prefers-color-scheme: dark) {
  .chat-container {
    background: #ffffff !important;
    color: #333333 !important;
  }

  .chat-container__messages {
    background: #ffffff !important;
    color: #333333 !important;
  }

  .chat-container__welcome h5 {
    color: var(--q-secondary) !important;
  }

  .chat-container__welcome p {
    color: #666666 !important;
  }

  .chat-container__typing-dots {
    background: #f5f5f5 !important;
    border-color: #e0e0e0 !important;
  }

  .chat-container__typing-dots span {
    background: #999 !important;
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
