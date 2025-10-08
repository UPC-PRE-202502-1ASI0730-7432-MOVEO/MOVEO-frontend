<script setup>
import HeaderContent from '@/app/shared/components/header-content.vue'
import FooterContent from '@/app/shared/components/footer-content.vue'
</script>

<template>
  <div class="app-shell">
    <HeaderContent />
    <main class="app-main">
      <router-view />
    </main>
    <FooterContent />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  color: #222;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
