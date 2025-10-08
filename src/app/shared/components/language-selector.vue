<script setup lang="js">
/**
 * @summary Shared language selector component (Composition API)
 * @author Andreow Santiago U202317362
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const options = [
  { label: 'EN', value: 'en', flag: '🇺🇸', fullName: 'English' },
  { label: 'ES', value: 'es', flag: '🇪🇸', fullName: 'Español' }
]

const selectedLanguage = computed({
  get: () => {
    return options.find(option => option.value === locale.value) || options[0]
  },
  set: (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      locale.value = selectedOption.value
    }
  }
})

function selectLanguage(option) {
  selectedLanguage.value = option
}
</script>

<template>
  <div class="language-selector-wrapper">
    <div class="language-buttons">
      <button
        v-for="option in options"
        :key="option.value"
        :class="[
          'lang-button',
          { 'active': selectedLanguage.value === option.value }
        ]"
        @click="selectLanguage(option)"
        :aria-label="`Switch to ${option.fullName}`"
        :title="option.fullName"
      >
        <span class="flag-icon">{{ option.flag }}</span>
        <span class="lang-text">{{ option.label }}</span>
        <div class="button-glow"></div>
      </button>
    </div>
    <div class="selector-bg"></div>
  </div>
</template>

<style scoped>
.language-selector-wrapper {
  position: relative;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 4px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.language-selector-wrapper:hover {
  transform: translateY(-1px);
  box-shadow:
    0 8px 25px rgba(59, 130, 246, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.language-buttons {
  display: flex;
  gap: 2px;
  position: relative;
  z-index: 2;
}

.lang-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.875rem;
  color: #64748b;
  overflow: hidden;
  min-width: 60px;
  justify-content: center;
}

.lang-button:hover {
  transform: translateY(-1px) scale(1.02);
  color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%);
}

.lang-button.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow:
    0 4px 12px rgba(59, 130, 246, 0.4),
    0 2px 4px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px) scale(1.02);
}

.lang-button.active:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 6px 20px rgba(59, 130, 246, 0.5),
    0 4px 8px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.flag-icon {
  font-size: 1.1rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.lang-button:hover .flag-icon {
  transform: scale(1.1) rotate(5deg);
}

.lang-button.active .flag-icon {
  transform: scale(1.05);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.lang-text {
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.lang-button.active .lang-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  opacity: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.lang-button:hover .button-glow {
  opacity: 1;
  animation: pulse 2s infinite;
}

.selector-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 197, 253, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.language-selector-wrapper:hover .selector-bg {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .language-selector-wrapper {
    padding: 3px;
    border-radius: 14px;
  }

  .lang-button {
    padding: 6px 10px;
    min-width: 50px;
    gap: 4px;
  }

  .flag-icon {
    font-size: 1rem;
  }

  .lang-text {
    font-size: 0.8rem;
  }
}

/* Dark theme compatibility */
@media (prefers-color-scheme: dark) {
  .language-selector-wrapper {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(59, 130, 246, 0.2);
  }

  .lang-button {
    color: #cbd5e1;
  }

  .lang-button:hover {
    color: #93c5fd;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 197, 253, 0.2) 100%);
  }
}
</style>
