<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HeaderContent from '@/app/shared/components/header-content.vue'
import RoleToolbar from '@/app/shared/components/role-toolbar.vue'
import FooterContent from '@/app/shared/components/footer-content.vue'

const route = useRoute()

// Check if current route should hide the main layout
const shouldHideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--no-layout': shouldHideLayout }">
    <!-- Only show main layout components if hideLayout is false -->
    <template v-if="!shouldHideLayout">
      <HeaderContent />
      <RoleToolbar />
    </template>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <!-- Only show footer if hideLayout is false -->
    <FooterContent v-if="!shouldHideLayout" />
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

/* When no layout is needed (auth pages), remove background */
.app-shell--no-layout {
  background: transparent;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>