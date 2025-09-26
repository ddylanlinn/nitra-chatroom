<template>
  <div class="chat-container">
    <!-- Header Section -->
    <div class="chat-container__header">
      <div class="chat-container__header-content">
        <div class="chat-container__brand">
          <img src="icons/Emblems.png" alt="Nitra AI" class="chat-container__brand-icon" />
          <span class="chat-container__brand-text">Nitra AI</span>
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
          <div class="chat-container__welcome-icon-wrapper">
            <img src="icons/Emblems.png" alt="Nitra AI" class="chat-container__welcome-icon" />
          </div>
          <h6 class="q-ma-none q-mt-md">Welcome to Nitra AI!</h6>
          <p class="text-grey-7 q-mt-none text-center">
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
          @typing-progress="scrollToBottom"
          @typing-complete="scrollToBottom"
        />

        <!-- Thinking Animation -->
        <MessageBubble
          v-if="isThinking"
          :message="{
            id: 'thinking',
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
          }"
          :is-thinking="true"
          class="chat-container__message"
        />
      </div>
    </div>

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
import type { Message } from "../../types";

const chatStore = useChatStore();

const messagesRef = ref<HTMLElement>();
const inputRef = ref();

const messages = computed(() => chatStore.messages);
const isLoading = computed(() => chatStore.isLoading);
const isThinking = computed(() => chatStore.isThinking);

const handleClose = () => console.log("Close clicked");

const handleSendMessage = async (message: string) => {
  await chatStore.sendMessage(message);
};

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

// Scroll to bottom on mount
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped lang="scss">
@import "../../css/app.scss";

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
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.chat-container__brand-text {
  font-size: 28px;
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

.chat-container__welcome-icon-wrapper {
  width: 80px;
  height: 80px;
  background: $teal-700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.chat-container__welcome-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.chat-container__message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Thinking Animation */
.chat-container__thinking {
  display: flex;
  justify-content: flex-start;
  margin: 16px 0;
}

.chat-container__thinking-content {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 18px 18px 18px 4px;
  padding: 12px;
  max-width: 200px;
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
  border-top: 1px solid red;
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
    margin-bottom: 12px;
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
