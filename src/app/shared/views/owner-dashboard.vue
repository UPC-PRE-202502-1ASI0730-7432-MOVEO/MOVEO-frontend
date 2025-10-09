<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'
import { useRentalStore } from '@/app/rental/application/rental.store'

const userStore = useUserStore()
const rentalStore = useRentalStore()

const user = computed(() => userStore.currentUser.value)

// Cargar datos al montar
onMounted(async () => {
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
})

// Vehículos del owner
const ownerVehicles = computed(() => {
  if (!user.value) return []
  return rentalStore.state.vehicles.filter(vehicle => vehicle.ownerId === user.value.id)
})

// Alquileres de los vehículos del owner
const ownerRentals = computed(() => {
  if (!user.value) return []
  const vehicleIds = ownerVehicles.value.map(v => v.id)
  return rentalStore.state.rentals.filter(rental => vehicleIds.includes(rental.vehicleId))
})

// Solicitudes pendientes (status: pending)
const pendingRequests = computed(() => {
  return ownerRentals.value.filter(rental => rental.status === 'pending')
})

// Alquileres activos
const activeRentals = computed(() => {
  return ownerRentals.value.filter(rental => rental.status === 'active')
})

// Calcular total ganado (alquileres completados)
const totalEarned = computed(() => {
  return ownerRentals.value
    .filter(rental => rental.status === 'completed')
    .reduce((total, rental) => total + (rental.totalPrice || 0), 0)
})

// Stats funcionales
const stats = computed(() => ({
  totalEarned: totalEarned.value,
  activeRentals: activeRentals.value.length,
  totalVehicles: ownerVehicles.value.length,
  pendingRequests: pendingRequests.value.length
}))

// Obtener datos del vehículo
function getVehicleData(vehicleId) {
  return ownerVehicles.value.find(v => v.id === vehicleId)
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
      <div class="empty-state" v-if="pendingRequests.length === 0">
        <p>No tienes solicitudes pendientes</p>
      </div>
      <div v-else>
        <div class="alert-box">
          <p>⚠️ Tienes <strong>{{ stats.pendingRequests }}</strong> solicitudes esperando tu respuesta</p>
          <router-link to="/rental-requests" class="btn-primary">Revisar Solicitudes</router-link>
        </div>
        
        <!-- Mostrar últimas 3 solicitudes -->
        <div class="requests-grid">
          <div 
            v-for="rental in pendingRequests.slice(0, 3)" 
            :key="rental.id" 
            class="request-card"
          >
            <div class="request-header">
              <div class="request-status">⏳ Pendiente</div>
              <span class="request-date">{{ formatDate(rental.createdAt) }}</span>
            </div>
            <div class="vehicle-info">
              <h3>{{ getVehicleData(rental.vehicleId)?.brand }} {{ getVehicleData(rental.vehicleId)?.model }}</h3>
              <p class="vehicle-plate">{{ getVehicleData(rental.vehicleId)?.licensePlate }}</p>
            </div>
            <div class="request-dates">
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
            <div class="request-price">
              <span class="price">${{ rental.totalPrice }}</span>
            </div>
            <div class="request-actions">
              <button class="btn-accept">✓ Aceptar</button>
              <button class="btn-decline">✗ Rechazar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mis Vehículos -->
    <div class="section">
      <div class="section-header">
        <h2>Mis Vehículos</h2>
        <router-link to="/add-vehicle" class="btn-secondary">+ Agregar Vehículo</router-link>
      </div>
      <div class="empty-state" v-if="ownerVehicles.length === 0">
        <p>No tienes vehículos publicados</p>
        <router-link to="/add-vehicle" class="btn-primary">+ Agregar Vehículo</router-link>
      </div>
      <div v-else class="vehicles-grid">
        <div 
          v-for="vehicle in ownerVehicles.slice(0, 4)" 
          :key="vehicle.id" 
          class="vehicle-card"
        >
          <div class="vehicle-image-placeholder">
            <i class="pi pi-car"></i>
          </div>
          <div class="vehicle-details">
            <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <p class="vehicle-year">{{ vehicle.year }} • {{ vehicle.color }}</p>
            <div class="vehicle-specs">
              <span><i class="pi pi-users"></i> {{ vehicle.seats }}</span>
              <span><i class="pi pi-cog"></i> {{ vehicle.transmission }}</span>
            </div>
            <div class="vehicle-price">
              <span class="price">${{ vehicle.dailyPrice }}</span>
              <span class="price-unit">/día</span>
            </div>
            <div class="vehicle-status" :class="vehicle.status">
              {{ vehicle.status === 'active' ? '✓ Activo' : '⏸ Pausado' }}
            </div>
          </div>
          <router-link 
            :to="`/vehicles/${vehicle.id}`" 
            class="btn-view-vehicle"
          >
            Ver Detalles
          </router-link>
        </div>
        
        <router-link 
          v-if="ownerVehicles.length > 4" 
          to="/my-vehicles" 
          class="view-all-card"
        >
          <i class="pi pi-arrow-right"></i>
          <span>Ver todos ({{ ownerVehicles.length }})</span>
        </router-link>
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

/* Requests Grid */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.request-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #FF6F00;
  transition: transform 0.2s, box-shadow 0.2s;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.request-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #FFF3E0;
  color: #FF6F00;
}

.request-date {
  font-size: 0.75rem;
  color: var(--neutral-gray);
}

.vehicle-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.vehicle-plate {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0;
  font-family: monospace;
}

.request-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 1rem 0;
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

.request-dates > .pi-arrow-right {
  color: var(--neutral-gray);
  font-size: 0.75rem;
}

.request-price {
  margin: 1rem 0;
}

.request-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.request-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-accept,
.btn-decline {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept {
  background: #4CAF50;
  color: white;
}

.btn-accept:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.btn-decline {
  background: #f5f7fa;
  color: #d32f2f;
}

.btn-decline:hover {
  background: #ffebee;
  transform: translateY(-1px);
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.vehicle-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.vehicle-image-placeholder {
  height: 160px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image-placeholder i {
  font-size: 4rem;
  color: white;
  opacity: 0.8;
}

.vehicle-details {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.vehicle-year {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.vehicle-specs i {
  color: var(--accent-orange);
}

.vehicle-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.vehicle-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.vehicle-price .price-unit {
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.vehicle-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
}

.vehicle-status.active {
  background: #E8F5E9;
  color: #2E7D32;
}

.vehicle-status.paused {
  background: #FFF3E0;
  color: #FF6F00;
}

.btn-view-vehicle {
  display: block;
  padding: 0.75rem;
  background: var(--accent-orange);
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-view-vehicle:hover {
  background: #e65100;
}

.view-all-card {
  background: #f5f7fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-decoration: none;
  color: var(--accent-orange);
  transition: all 0.2s;
  border: 2px dashed var(--accent-orange);
}

.view-all-card:hover {
  background: #FFF3E0;
  transform: translateY(-4px);
}

.view-all-card i {
  font-size: 2rem;
}

.view-all-card span {
  font-weight: 600;
  font-size: 1rem;
}
</style>
