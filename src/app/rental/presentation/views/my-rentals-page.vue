<template>
  <section class="my-rentals-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Mis Alquileres</h1>
        <p class="page-subtitle">Gestiona todos tus alquileres en un solo lugar</p>
      </header>

      <div class="rentals-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 class="empty-title">No tienes alquileres {{ statusLabel }}</h3>
        <p class="empty-message">Cuando realices un alquiler, aparecerá aquí.</p>
        <router-link to="/rentals" class="btn btn-primary">
          <span class="icon">🔍</span>
          Buscar Vehículos
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('active')

const tabs = [
  { value: 'active', label: 'Activos', icon: '🚗', count: 0 },
  { value: 'upcoming', label: 'Próximos', icon: '📅', count: 0 },
  { value: 'completed', label: 'Completados', icon: '✅', count: 0 },
  { value: 'cancelled', label: 'Cancelados', icon: '❌', count: 0 }
]

const statusLabel = computed(() => {
  const labels = {
    active: 'activos',
    upcoming: 'próximos',
    completed: 'completados',
    cancelled: 'cancelados'
  }
  return labels[activeTab.value]
})
</script>

<style scoped>
.my-rentals-page {
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.page-subtitle {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.rentals-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background: var(--bg-base);
  color: var(--text-primary);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  color: var(--text-secondary-2);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.4);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.empty-message {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  color: var(--text-secondary-2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 94, 94, 0.4);
}

.btn .icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .rentals-tabs {
    justify-content: flex-start;
  }

  .tab-label {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
  }
}
</style>
