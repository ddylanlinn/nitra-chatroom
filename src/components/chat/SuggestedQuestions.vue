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

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .suggested-questions {
    margin: 20px 48px 0;
    padding: 18px 20px;
    border-radius: 16px;
  }

  .suggested-questions__list {
    gap: 10px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 14px;
    padding: 8px 12px;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .suggested-questions {
    margin: 18px 32px 0;
    padding: 16px 18px;
  }

  .suggested-questions__list {
    gap: 9px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 13px;
    padding: 7px 11px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .suggested-questions {
    margin: 16px 24px 0;
    padding: 16px;
  }

  .suggested-questions__list {
    gap: 8px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 13px;
    padding: 6px 10px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .suggested-questions {
    margin: 14px 20px 0;
    padding: 14px;
  }

  .suggested-questions__list {
    gap: 7px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .suggested-questions {
    margin: 12px 16px 0;
    padding: 12px;
    border-radius: 10px;
  }

  .suggested-questions__header {
    margin-bottom: 10px;
  }

  .suggested-questions__title {
    font-size: 13px;
  }

  .suggested-questions__list {
    gap: 6px;
  }

  .suggested-questions__chip {
    font-size: 11px;
  }

  .suggested-questions__chip :deep(.q-chip__content) {
    font-size: 11px;
    padding: 5px 8px;
    line-height: 1.3;
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
