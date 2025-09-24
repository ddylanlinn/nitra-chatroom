<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="main-header">
      <AppHeader />
    </q-header>

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
</script>

<style scoped>
.main-header {
  background: transparent;
  box-shadow: none;
}

.main-page-container {
  background: #ffffff;
}
</style>
