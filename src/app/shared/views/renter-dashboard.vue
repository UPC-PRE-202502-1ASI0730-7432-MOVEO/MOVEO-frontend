<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'
import { useRentalStore } from '@/app/rental/application/rental.store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userStore = useUserStore()
const rentalStore = useRentalStore()

const user = computed(() => userStore.currentUser.value)

// Cargar datos al montar
onMounted(async () => {
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
})

// Filtrar alquileres del usuario actual
const userRentals = computed(() => {
  if (!user.value) return []
  return rentalStore.state.rentals.filter(rental => rental.renterId === user.value.id)
})

// Alquileres activos (status: active, pending, confirmed)
const activeRentals = computed(() => {
  return userRentals.value.filter(rental => 
    ['active', 'pending', 'confirmed'].includes(rental.status)
  )
})

// Alquileres completados
const completedRentals = computed(() => {
  return userRentals.value.filter(rental => rental.status === 'completed')
})

// Calcular total gastado
const totalSpent = computed(() => {
  return userRentals.value
    .filter(rental => rental.status === 'completed')
    .reduce((total, rental) => total + (rental.totalPrice || 0), 0)
})

// Stats funcionales
const stats = computed(() => ({
  activeRentals: activeRentals.value.length,
  completedRentals: completedRentals.value.length,
  totalSpent: totalSpent.value,
  favorites: 0 // TODO: implementar favoritos
}))

// Obtener datos del vehículo para mostrar en las tarjetas
function getVehicleData(vehicleId) {
  return rentalStore.state.vehicles.find(v => v.id === vehicleId)
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script>

<template>
  <div class="renter-dashboard">
    <div class="dashboard-header">
      <h1>{{ t('dashboard.renter.welcome', { name: user?.firstName }) }} 👋</h1>
      <p>{{ t('dashboard.renter.summary') }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>{{ stats.activeRentals }}</h3>
          <p>{{ t('dashboard.renter.activeRentals') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ stats.completedRentals }}</h3>
          <p>{{ t('dashboard.renter.completedTrips') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>${{ stats.totalSpent.toFixed(2) }}</h3>
          <p>{{ t('dashboard.renter.totalSpent') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <h3>{{ stats.favorites }}</h3>
          <p>{{ t('dashboard.renter.favorites') }}</p>
        </div>
      </div>
    </div>

    <!-- Próximos Viajes -->
    <div class="section">
      <h2>{{ t('dashboard.renter.upcomingTrips') }}</h2>
      <div class="empty-state" v-if="activeRentals.length === 0">
        <p>{{ t('dashboard.renter.noUpcomingTrips') }}</p>
        <router-link to="/rentals" class="btn-primary">{{ t('dashboard.renter.exploreVehicles') }}</router-link>
      </div>
      <div v-else class="rentals-grid">
        <div 
          v-for="rental in activeRentals" 
          :key="rental.id" 
          class="rental-card"
        >
          <div class="rental-status" :class="rental.status">
            {{ rental.status === 'pending' ? t('dashboard.renter.status.pending') : rental.status === 'confirmed' ? t('dashboard.renter.status.confirmed') : t('dashboard.renter.status.active') }}
          </div>
          <div class="vehicle-info">
            <h3>{{ getVehicleData(rental.vehicleId)?.brand }} {{ getVehicleData(rental.vehicleId)?.model }}</h3>
            <p class="vehicle-year">{{ getVehicleData(rental.vehicleId)?.year }}</p>
          </div>
          <div class="rental-dates">
            <div class="date-item">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(rental.startDate) }}</span>
            </div>
            <i class="pi pi-arrow-right"></i>
            <div class="date-item">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(rental.endDate) }}</span>
            </div>
          </div>
          <div class="rental-price">
            <span class="price">${{ rental.totalPrice }}</span>
            <span class="price-label">{{ t('dashboard.renter.total') }}</span>
          </div>
          <router-link 
            :to="`/my-rentals`" 
            class="btn-view"
          >
            {{ t('dashboard.renter.viewDetails') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mis Favoritos -->
    <div class="section">
      <h2>{{ t('dashboard.renter.myFavorites') }}</h2>
      <div class="empty-state">
        <p>{{ t('dashboard.renter.noFavorites') }}</p>
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

/* Rentals Grid */
.rentals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.rental-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rental-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.rental-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
}

.rental-status.pending {
  background: #FFF3E0;
  color: #FF6F00;
}

.rental-status.confirmed {
  background: #E8F5E9;
  color: #2E7D32;
}

.rental-status.active {
  background: #E3F2FD;
  color: #1976D2;
}

.vehicle-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.vehicle-year {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0.25rem 0 0 0;
}

.rental-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.date-item i {
  color: var(--accent-orange);
}

.rental-dates > .pi-arrow-right {
  color: var(--neutral-gray);
  font-size: 0.75rem;
}

.rental-price {
  display: flex;
  flex-direction: column;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.rental-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.rental-price .price-label {
  font-size: 0.75rem;
  color: var(--neutral-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-view {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-view:hover {
  background: var(--accent-orange);
  color: white;
  transform: translateY(-1px);
}
</style>
