<template>
  <div id="app" class="min-h-screen bg-light-bg text-primary-dark font-main">
    <header class="p-4 shadow-md bg-primary-dark text-light-bg flex justify-between items-center">
      <h1 class="text-2xl font-semibold tracking-wide">MOVEO</h1>

      <nav class="space-x-4">
        <RouterLink to="/home" class="hover:text-accent-coral">Inicio</RouterLink>
        <RouterLink to="/about" class="hover:text-accent-coral">Sobre Nosotros</RouterLink>
        <RouterLink to="/adventures" class="hover:text-accent-coral">Aventuras</RouterLink>
      </nav>
    </header>

    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from "vue-router";
import "./app/shared/styles/colors.css";
import "./app/shared/styles/typography.css";
</script>

<style scoped>
/* Puedes añadir ajustes adicionales si deseas */
</style>
