<template>
  <div
    :class="[
      'message-bubble',
      {
        'message-bubble--user': message.role === 'user',
        'message-bubble--assistant': message.role === 'assistant',
      },
    ]"
  >
    <!-- Avatar for assistant messages (on the left) -->
    <div v-if="message.role === 'assistant'" class="message-bubble__avatar">
      <q-avatar
        color="secondary"
        text-color="white"
        size="32px"
        icon="smart_toy"
      />
    </div>

    <div class="message-bubble__content">
      <!-- Message text with typing animation for assistant -->
      <div
        v-if="message.role === 'assistant' && shouldUseTypingAnimation"
        class="message-bubble__text"
        @click="skipAnimation"
        :class="{ 'message-bubble__text--clickable': !typing.isCompleted }"
      >
        <span v-html="formattedTypingContent"></span>
        <span v-if="!typing.isCompleted" class="message-bubble__cursor">|</span>
      </div>

      <!-- Static message text for user or when animation is disabled -->
      <div v-else class="message-bubble__text" v-html="formattedContent"></div>

      <!-- Timestamp -->
      <div class="message-bubble__timestamp">
        {{ formatTimestamp(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useTypingAnimation } from "../../composables/useTypingAnimation";
import type { Message } from "../../types";

interface Props {
  message: Message;
  enableTypingAnimation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  enableTypingAnimation: true,
});

// Typing animation setup
const shouldUseTypingAnimation = computed(() => {
  return props.message.role === "assistant" && props.enableTypingAnimation;
});

const typing = useTypingAnimation(props.message.content, {
  speed: 30, // 30ms per character for smooth typing
  delay: 300, // 300ms delay before starting
});

// Format markdown content
const formatMarkdown = (content: string) => {
  let formatted = content;

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert [text](url) to <a>
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
};

// Format typing content with markdown support
const formattedTypingContent = computed(() => {
  return formatMarkdown(typing.displayedText.value);
});

// Format message content with basic markdown support
const formattedContent = computed(() => {
  return formatMarkdown(props.message.content);
});

// Animation control
const startAnimation = () => {
  if (shouldUseTypingAnimation.value) {
    typing.startTyping();
  }
};

const skipAnimation = () => {
  if (shouldUseTypingAnimation.value && !typing.isCompleted.value) {
    typing.skipTyping();
  }
};

// Lifecycle
onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  typing.cleanup();
});

// Format timestamp for display
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    // Show time only if within 24 hours
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    // Show date if older
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};
</script>

<style scoped>
.message-bubble {
  display: flex;
  margin-bottom: 16px;
  max-width: 100%;
}

.message-bubble--user {
  justify-content: flex-end;
}

.message-bubble--assistant {
  justify-content: flex-start;
}

.message-bubble__content {
  max-width: 70%;
  min-width: 120px;
}

.message-bubble--user .message-bubble__content {
  margin-left: auto;
}

.message-bubble--assistant .message-bubble__content {
  margin-right: auto;
}

/* Message bubble styling */
.message-bubble--user .message-bubble__content {
  background: var(--q-primary);
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
}

.message-bubble--assistant .message-bubble__content {
  background: #f5f5f5;
  color: #333;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
}

.message-bubble__text {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-bubble__text :deep(strong) {
  font-weight: 600;
}

.message-bubble__text :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.message-bubble__text :deep(a:hover) {
  opacity: 0.8;
}

.message-bubble__text--clickable {
  cursor: pointer;
  user-select: none;
}

.message-bubble__cursor {
  color: var(--q-primary);
  animation: blink 1s infinite;
  font-weight: normal;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.message-bubble__timestamp {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.message-bubble--assistant .message-bubble__timestamp {
  text-align: left;
}

.message-bubble__avatar {
  margin-right: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .message-bubble__content {
    max-width: 65%;
    min-width: 160px;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    padding: 14px 20px;
  }

  .message-bubble__text {
    font-size: 16px;
    line-height: 1.5;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .message-bubble__content {
    max-width: 70%;
    min-width: 140px;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    padding: 12px 18px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .message-bubble__content {
    max-width: 75%;
    min-width: 120px;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    padding: 12px 16px;
  }

  .message-bubble__avatar {
    margin-right: 8px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .message-bubble__content {
    max-width: 80%;
    min-width: 100px;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    padding: 10px 14px;
  }

  .message-bubble__text {
    font-size: 14px;
    line-height: 1.4;
  }

  .message-bubble__timestamp {
    font-size: 10px;
  }

  .message-bubble__avatar {
    margin-right: 6px;
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .message-bubble {
    margin-bottom: 12px;
  }

  .message-bubble__content {
    max-width: 85%;
    min-width: 80px;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    padding: 10px 12px;
    margin: 0;
  }

  .message-bubble__text {
    font-size: 14px;
    line-height: 1.4;
  }

  .message-bubble__timestamp {
    font-size: 10px;
    margin-top: 2px;
  }

  .message-bubble__avatar {
    margin-right: 4px;
  }

  .message-bubble__avatar .q-avatar {
    width: 28px !important;
    height: 28px !important;
    font-size: 14px !important;
  }
}
</style>
