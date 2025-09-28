<template>
  <q-page class="chat-page">
    <ChatContainer />
  </q-page>
</template>

<script setup lang="ts">
import ChatContainer from '../components/chat/ChatContainer.vue'
</script>

<style scoped>
.chat-page {
  padding: 0;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  overflow: hidden;
  position: relative;
  background: #ffffff;
}

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .chat-page {
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }
}

/* Mobile adjustments */
@media (max-width: 479px) {
  .chat-page {
    /* Ensure proper height on mobile with address bars */
    height: 100vh;
    height: 100dvh;
    /* Handle iOS safe areas */
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}

/* Landscape orientation on mobile */
@media (max-width: 767px) and (orientation: landscape) {
  .chat-page {
    height: 100vh;
    height: 100dvh;
  }
}
</style>
