<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

// Stats de ejemplo (después conectarás con API)
const stats = computed(() => ({
  totalEarned: user.value?.stats?.totalEarned || 0,
  activeRentals: user.value?.stats?.activeRentals || 0,
  totalVehicles: 3, // Temporal
  pendingRequests: 2 // Temporal
}))
</script>

<template>
  <div class="owner-dashboard">
    <div class="dashboard-header">
      <h1>Panel de Propietario 🚀</h1>
      <p>Gestiona tus vehículos y solicitudes</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card highlight">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <h3>${{ stats.totalEarned.toFixed(2) }}</h3>
          <p>Total Ganado</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>{{ stats.totalVehicles }}</h3>
          <p>Vehículos Publicados</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>{{ stats.activeRentals }}</h3>
          <p>Alquileres Activos</p>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>{{ stats.pendingRequests }}</h3>
          <p>Solicitudes Pendientes</p>
        </div>
      </div>
    </div>

    <!-- Solicitudes Pendientes -->
    <div class="section">
      <div class="section-header">
        <h2>Solicitudes Pendientes</h2>
        <router-link to="/rental-requests" class="link">Ver todas →</router-link>
      </div>
      <div class="empty-state" v-if="stats.pendingRequests === 0">
        <p>No tienes solicitudes pendientes</p>
      </div>
      <div v-else class="alert-box">
        <p>⚠️ Tienes <strong>{{ stats.pendingRequests }}</strong> solicitudes esperando tu respuesta</p>
        <router-link to="/rental-requests" class="btn-primary">Revisar Solicitudes</router-link>
      </div>
    </div>

    <!-- Mis Vehículos -->
    <div class="section">
      <div class="section-header">
        <h2>Mis Vehículos</h2>
        <router-link to="/add-vehicle" class="btn-secondary">+ Agregar Vehículo</router-link>
      </div>
      <div class="empty-state">
        <p>Tus vehículos publicados aparecerán aquí</p>
        <router-link to="/my-vehicles" class="btn-primary">Ver Mis Vehículos</router-link>
      </div>
    </div>

    <!-- Ganancias Recientes -->
    <div class="section">
      <h2>Historial de Ganancias</h2>
      <div class="empty-state">
        <p>Aún no tienes transacciones completadas</p>
        <router-link to="/earnings" class="link">Ver Detalles →</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owner-dashboard {
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

.stat-card.highlight {
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
}

.stat-card.highlight .stat-content h3,
.stat-card.highlight .stat-content p {
  color: white;
}

.stat-card.warning {
  border-left: 4px solid #FF6F00;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.link {
  color: var(--accent-orange);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link:hover {
  color: #e65100;
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

.alert-box {
  background: #FFF3E0;
  border-left: 4px solid var(--accent-orange);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-box p {
  color: var(--primary-dark);
  margin: 0;
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
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background: var(--accent-orange);
  color: white;
}
</style>
