<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

// Stats de ejemplo (después conectarás con API)
const stats = computed(() => ({
  activeRentals: user.value?.stats?.activeRentals || 0,
  completedRentals: user.value?.stats?.completedRentals || 0,
  totalSpent: user.value?.stats?.totalSpent || 0,
  favorites: 5 // Temporal
}))
</script>

<template>
  <div class="renter-dashboard">
    <div class="dashboard-header">
      <h1>Bienvenido, {{ user?.firstName }} 👋</h1>
      <p>Aquí está el resumen de tu actividad</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>{{ stats.activeRentals }}</h3>
          <p>Alquileres Activos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ stats.completedRentals }}</h3>
          <p>Viajes Completados</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>${{ stats.totalSpent.toFixed(2) }}</h3>
          <p>Total Gastado</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <h3>{{ stats.favorites }}</h3>
          <p>Favoritos</p>
        </div>
      </div>
    </div>

    <!-- Próximos Viajes -->
    <div class="section">
      <h2>Próximos Viajes</h2>
      <div class="empty-state" v-if="stats.activeRentals === 0">
        <p>No tienes viajes programados</p>
        <router-link to="/rentals" class="btn-primary">Explorar Vehículos</router-link>
      </div>
      <!-- Aquí irán las tarjetas de viajes -->
    </div>

    <!-- Mis Favoritos -->
    <div class="section">
      <h2>Mis Favoritos</h2>
      <div class="empty-state">
        <p>Aún no tienes vehículos favoritos</p>
        <router-link to="/rentals" class="btn-secondary">Ver Catálogo</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.renter-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: var(--neutral-gray);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  color: var(--neutral-gray);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-orange);
  color: white;
}

.btn-primary:hover {
  background: #e65100;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
}

.btn-secondary:hover {
  background: var(--accent-orange);
  color: white;
}
</style>
