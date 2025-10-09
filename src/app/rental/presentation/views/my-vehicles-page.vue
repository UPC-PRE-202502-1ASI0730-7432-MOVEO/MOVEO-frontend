<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/app/iam/application/user.store'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const router = useRouter()
const userStore = useUserStore()

const vehicles = ref([])
const loading = ref(true)

const user = computed(() => userStore.currentUser.value)

onMounted(async () => {
  await loadVehicles()
})

async function loadVehicles() {
  try {
    loading.value = true
    const allVehicles = await RentalApi.listVehicles()
    // Filtrar solo vehículos del usuario actual
    vehicles.value = allVehicles.filter(v => v.ownerId === user.value?.id)
  } catch (error) {
    console.error('Error loading vehicles:', error)
  } finally {
    loading.value = false
  }
}

function viewVehicleDetail(vehicleId) {
  router.push(`/rental/vehicles/${vehicleId}`)
}

function editVehicle(vehicleId, event) {
  event.stopPropagation()
  router.push(`/rental/edit-vehicle/${vehicleId}`)
}

function goToAddVehicle() {
  router.push('/rental/add-vehicle')
}
</script>

<template>
  <div class="my-vehicles-page">
    <div class="page-header">
      <div>
        <h1>Mis Vehículos</h1>
        <p>Gestiona tu flota de vehículos</p>
      </div>
      <button @click="goToAddVehicle" class="btn-add">
        <i class="pi pi-plus"></i>
        Agregar Vehículo
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando vehículos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="vehicles.length === 0" class="empty-state">
      <i class="pi pi-car"></i>
      <h2>No tienes vehículos publicados</h2>
      <p>Empieza a ganar dinero compartiendo tu auto</p>
      <button @click="goToAddVehicle" class="btn-primary">
        <i class="pi pi-plus"></i>
        Agregar mi primer vehículo
      </button>
    </div>

    <!-- Vehicles Grid -->
    <div v-else class="vehicles-grid">
      <div 
        v-for="vehicle in vehicles" 
        :key="vehicle.id"
        class="vehicle-card"
        @click="viewVehicleDetail(vehicle.id)"
      >
        <div class="vehicle-image">
          <i class="pi pi-car"></i>
        </div>
        
        <div class="vehicle-info">
          <div class="vehicle-header">
            <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <span :class="['status-badge', vehicle.status]">
              {{ vehicle.status === 'active' ? 'Activo' : 'Pausado' }}
            </span>
          </div>
          
          <p class="vehicle-year">{{ vehicle.year }} • {{ vehicle.color }}</p>
          
          <div class="vehicle-specs">
            <span><i class="pi pi-users"></i> {{ vehicle.seats }}</span>
            <span><i class="pi pi-cog"></i> {{ vehicle.transmission }}</span>
            <span><i class="pi pi-bolt"></i> {{ vehicle.fuelType }}</span>
          </div>

          <div class="vehicle-location">
            <i class="pi pi-map-marker"></i>
            <span>{{ vehicle.location.district }}</span>
          </div>

          <div class="vehicle-price">
            <span class="price">S/ {{ vehicle.dailyPrice }}</span>
            <span class="price-label">/día</span>
          </div>
        </div>

        <div class="vehicle-actions">
          <button @click="editVehicle(vehicle.id, $event)" class="btn-edit">
            <i class="pi pi-pencil"></i>
            Editar
          </button>
          <button class="btn-view">
            Ver Detalles
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-vehicles-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--neutral-gray);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-orange);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #e65100;
  transform: translateY(-2px);
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i,
.empty-state i {
  font-size: 4rem;
  color: var(--accent-orange);
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.empty-state p {
  color: var(--neutral-gray);
  margin-bottom: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--accent-orange);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #e65100;
  transform: translateY(-2px);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 1400px) {
  .vehicles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .vehicles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
}

.vehicle-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.vehicle-image {
  height: 180px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image i {
  font-size: 4rem;
  color: white;
  opacity: 0.9;
}

.vehicle-info {
  padding: 1.5rem;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.vehicle-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.paused {
  background: #fff3e0;
  color: #ff6f00;
}

.vehicle-year {
  color: var(--neutral-gray);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.vehicle-specs i {
  color: var(--accent-orange);
}

.vehicle-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.vehicle-location i {
  color: var(--accent-orange);
}

.vehicle-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.vehicle-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.vehicle-price .price-label {
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.vehicle-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn-edit {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: #3B82F6;
  border: 2px solid #3B82F6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background: #3B82F6;
  color: white;
}

.btn-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view:hover {
  background: var(--accent-orange);
  color: white;
}
</style>