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
  overflow: hidden;
}
</style>
