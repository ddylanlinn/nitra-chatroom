<template>
  <div
    :class="[
      'message-bubble',
      {
        'message-bubble--user': message.role === 'user',
        'message-bubble--assistant': message.role === 'assistant'
      }
    ]"
  >
    <div class="message-bubble__content">
      <!-- Message text with markdown support -->
      <div
        class="message-bubble__text"
        v-html="formattedContent"
      ></div>

      <!-- Timestamp -->
      <div class="message-bubble__timestamp">
        {{ formatTimestamp(message.timestamp) }}
      </div>
    </div>

    <!-- Avatar for assistant messages -->
    <div
      v-if="message.role === 'assistant'"
      class="message-bubble__avatar"
    >
      <q-avatar
        color="primary"
        text-color="white"
        size="32px"
        icon="smart_toy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../../types'

interface Props {
  message: Message
}

const props = defineProps<Props>()

// Format message content with basic markdown support
const formattedContent = computed(() => {
  let content = props.message.content

  // Convert **bold** to <strong>
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Convert [text](url) to <a>
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Convert line breaks to <br>
  content = content.replace(/\n/g, '<br>')

  return content
})

// Format timestamp for display
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 24) {
    // Show time only if within 24 hours
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    // Show date if older
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}
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
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .message-bubble__content {
    max-width: 85%;
  }

  .message-bubble--user .message-bubble__content,
  .message-bubble--assistant .message-bubble__content {
    margin: 0;
  }
}
</style>
