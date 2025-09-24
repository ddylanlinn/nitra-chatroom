<template>
  <div class="app-header">
    <div class="app-header__content">
      <div class="app-header__brand">
        <q-icon name="smart_toy" class="app-header__brand-icon" />
        <span class="app-header__brand-text">Nitra AI</span>
        <q-icon name="edit" class="app-header__edit-icon" />
      </div>
      
      <div class="app-header__actions">
        <q-btn
          flat
          round
          icon="close"
          color="white"
          class="app-header__close-btn"
          @click="handleClose"
        />
      </div>
    </div>
    
    <div class="app-header__subtitle">
      Hi there, How can we help?
    </div>
  </div>
</template>

<script setup lang="ts">
const handleClose = () => {
  // Handle close action - could emit event to parent
  console.log('Close clicked')
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #2d5a5a 0%, #1e4040 100%);
  color: white;
  padding: 16px 20px 12px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__brand-icon {
  font-size: 24px;
  color: white;
}

.app-header__brand-text {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.app-header__edit-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease;
}

.app-header__edit-icon:hover {
  color: white;
}

.app-header__actions {
  display: flex;
  align-items: center;
}

.app-header__close-btn {
  width: 32px;
  height: 32px;
}

.app-header__subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
}

/* Responsive Design */
/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .app-header {
    padding: 14px 16px 10px;
  }

  .app-header__brand-text {
    font-size: 16px;
  }

  .app-header__brand-icon {
    font-size: 20px;
  }

  .app-header__subtitle {
    font-size: 13px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .app-header {
    padding: 15px 18px 11px;
  }

  .app-header__brand-text {
    font-size: 17px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-header {
    padding: 16px 24px 12px;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .app-header {
    padding: 18px 48px 14px;
  }

  .app-header__brand-text {
    font-size: 20px;
  }

  .app-header__subtitle {
    font-size: 15px;
  }
}
</style>
