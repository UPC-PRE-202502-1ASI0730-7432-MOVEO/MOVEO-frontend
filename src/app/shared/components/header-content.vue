<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-icon">🚗</span>
          <span class="logo-text">MOVEO</span>
        </router-link>

        <!-- Navigation Desktop -->
        <nav class="nav-desktop" :class="{ open: mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            {{ $t('nav.home') }}
          </router-link>
          <router-link to="/rentals" class="nav-link" @click="closeMobileMenu">
            {{ $t('nav.rentals') }}
          </router-link>
          <router-link to="/register" class="nav-link" @click="closeMobileMenu">
            {{ $t('nav.register') }}
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <!-- Language Switcher -->
          <LanguageSelector />

          <!-- Mobile Menu Toggle -->
          <button 
            class="mobile-menu-toggle" 
            @click="toggleMobileMenu"
            :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          >
            <span class="hamburger" :class="{ open: mobileMenuOpen }">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import LanguageSelector from './language-selector.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  letter-spacing: 1px;
}

/* Navigation Desktop */
.nav-desktop {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: opacity 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link:hover {
  opacity: 0.8;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .nav-desktop {
    position: fixed;
    top: 70px;
    right: 0;
    width: 280px;
    height: calc(100vh - 70px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .nav-desktop.open {
    transform: translateX(0);
  }

  .nav-link {
    font-size: 1.2rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.2rem;
  }

  .lang-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
