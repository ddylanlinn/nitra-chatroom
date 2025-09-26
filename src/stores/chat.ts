import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, ChatState } from "../types";
import { parseMockData } from "../composables/useMockDataParser";
import { createMessage, ERROR_MESSAGES } from "../utils/messageUtils";

export const useChatStore = defineStore("chat", () => {
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isThinking = ref(false);
  const currentTypingMessage = ref<Message | undefined>(undefined);

  const chatState = computed<ChatState>(() => ({
    messages: messages.value,
    isLoading: isLoading.value,
    isThinking: isThinking.value,
    currentTypingMessage: currentTypingMessage.value,
  }));

  const lastMessage = computed((): Message | undefined => {
    return messages.value[messages.value.length - 1];
  });

  // Actions
  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setThinking = (thinking: boolean) => {
    isThinking.value = thinking;
  };

  const handleAssistantResponse = async (
    userMessage: string
  ): Promise<void> => {
    // Start thinking animation
    setThinking(true);

    // Simulate AI response time (1-2 seconds)
    const responseTime = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, responseTime));

    // Stop thinking animation
    setThinking(false);

    // Parse mock data to get response
    const parsedResponse = parseMockData(userMessage);

    if (parsedResponse) {
      addMessage(parsedResponse.message);
    } else {
      // Default response if no match found
      const defaultMsg = createMessage("assistant", ERROR_MESSAGES.DEFAULT);
      addMessage(defaultMsg);
    }
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg = createMessage("user", userMessage);
    addMessage(userMsg);

    setLoading(true);

    try {
      await handleAssistantResponse(userMessage);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMsg = createMessage(
        "assistant",
        ERROR_MESSAGES.PROCESSING_ERROR
      );
      addMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    messages.value = [];
    currentTypingMessage.value = undefined;
  };

  return {
    // State
    messages,
    isLoading,
    isThinking,
    currentTypingMessage,

    // Getters
    chatState,
    lastMessage,

    // Actions
    addMessage,
    setLoading,
    setThinking,
    sendMessage,
    clearMessages,
  };
});
