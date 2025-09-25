import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Message, ChatState, ParsedMessage } from "../types";
import { parseMockData } from "../composables/useMockDataParser";

export const useChatStore = defineStore("chat", () => {
  // State
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const currentTypingMessage = ref<Message | undefined>(undefined);

  // Getters
  const chatState = computed<ChatState>(() => ({
    messages: messages.value,
    isLoading: isLoading.value,
    currentTypingMessage: currentTypingMessage.value,
  }));

  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1];
  });

  // Actions
  const addMessage = (message: Message) => {
    messages.value.push({
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  };

  const updateTypingMessage = (message: Message | undefined) => {
    currentTypingMessage.value = message;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    // Set loading state
    setLoading(true);

    try {
      // Simulate AI response time (1-2 seconds)
      const responseTime = Math.random() * 1000 + 1000; // 1-2 seconds
      await new Promise((resolve) => setTimeout(resolve, responseTime));

      // Parse mock data to get response
      const parsedResponse = parseMockData(userMessage);

      if (parsedResponse) {
        // Add assistant message
        addMessage(parsedResponse.message);

        // Calculate typing animation time based on message length
        const typingTime = Math.max(
          parsedResponse.message.content.length * 30,
          2000
        ); // 30ms per character, min 2s
        await new Promise((resolve) => setTimeout(resolve, typingTime));
      } else {
        // Default response if no match found
        const defaultMsg: Message = {
          role: "assistant",
          content:
            "I'm sorry, I couldn't find a specific response for that question. Please try asking about medical supplies like gloves, ultrasound gel, antibiotic ointments, surgical scissors, or masks.",
          timestamp: new Date().toISOString(),
        };
        addMessage(defaultMsg);

        // Calculate typing animation time for default message
        const typingTime = Math.max(defaultMsg.content.length * 30, 2000);
        await new Promise((resolve) => setTimeout(resolve, typingTime));
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMsg: Message = {
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMsg);

      // Calculate typing animation time for error message
      const typingTime = Math.max(errorMsg.content.length * 30, 2000);
      await new Promise((resolve) => setTimeout(resolve, typingTime));
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
    currentTypingMessage,

    // Getters
    chatState,
    lastMessage,

    // Actions
    addMessage,
    updateTypingMessage,
    setLoading,
    sendMessage,
    clearMessages,
  };
});
