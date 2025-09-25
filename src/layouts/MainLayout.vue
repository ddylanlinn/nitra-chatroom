<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Chat interface is now a self-contained component
</script>

<style scoped>
.main-page-container {
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-height: 100vh;
  padding: 0;
  width: 100%;
  max-width: none;
}

/* Override Quasar's default page container styles for tablet/mobile */
@media (max-width: 1023px) {
  .main-page-container {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: none !important;
  }

  /* Ensure q-page-container doesn't limit width */
  .main-page-container :deep(.q-page-container) {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: none !important;
  }
}

/* Desktop: Minimal padding for maximum width usage */
@media (min-width: 1024px) {
  .main-page-container {
    padding: 0 20px;
  }
}

/* Large Desktop: Minimal padding for maximum width usage */
@media (min-width: 1440px) {
  .main-page-container {
    padding: 0 30px;
  }
}
</style>
