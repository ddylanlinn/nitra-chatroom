<template>
  <div v-if="questions.length > 0" class="suggested-questions">
    <div class="suggested-questions__header">
      <q-icon name="lightbulb" size="sm" color="primary" />
      <span class="suggested-questions__title">Suggested questions</span>
    </div>

    <div class="suggested-questions__list">
      <q-chip
        v-for="(question, index) in questions"
        :key="index"
        :label="question"
        color="primary"
        outline
        clickable
        @click="handleQuestionClick(question)"
        class="suggested-questions__chip"
        size="sm"
      >
        <q-tooltip>{{ question }}</q-tooltip>
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  questions: string[]
}

interface Emits {
  (e: 'question-click', question: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleQuestionClick = (question: string) => {
  emit('question-click', question)
}
</script>

<style scoped>
.suggested-questions {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.suggested-questions__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.suggested-questions__title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.suggested-questions__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggested-questions__chip {
  cursor: pointer;
  transition: all 0.2s ease;
  border-color: var(--q-primary);
  color: var(--q-primary);
}

.suggested-questions__chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.suggested-questions__chip :deep(.q-chip__content) {
  font-size: 13px;
  line-height: 1.4;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .suggested-questions {
    margin-top: 12px;
    padding: 12px;
  }

  .suggested-questions__list {
    gap: 6px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .suggested-questions {
    background: #2a2a2a;
    border-color: #404040;
  }

  .suggested-questions__title {
    color: #e0e0e0;
  }
}
</style>
