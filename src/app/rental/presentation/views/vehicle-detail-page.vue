<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'
import VehicleRentalHistory from '../components/vehicle-rental-history.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const vehicle = ref(null)
const loading = ref(true)

const vehicleId = computed(() => parseInt(route.params.id))

onMounted(async () => {
  await loadVehicle()
})

async function loadVehicle() {
  try {
    loading.value = true
    vehicle.value = await RentalApi.getVehicle(vehicleId.value)
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/my-vehicles')
}
</script>

<template>
  <div class="vehicle-detail-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.vehicleDetail.loading') }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="vehicle" class="content">
      <!-- Header -->
      <div class="page-header">
        <button @click="goBack" class="btn-back">
          <i class="pi pi-arrow-left"></i>
          {{ t('rental.vehicleDetail.backToMyVehicles') }}
        </button>
      </div>

      <!-- Vehicle Info Card -->
      <div class="vehicle-info-card">
        <div class="vehicle-image">
          <i class="pi pi-car"></i>
        </div>
        
        <div class="vehicle-details">
          <div class="vehicle-header">
            <h1>{{ vehicle.brand }} {{ vehicle.model }}</h1>
            <span :class="['status-badge', vehicle.status]">
              {{ vehicle.status === 'active' ? t('rental.myVehicles.vehicleCard.available') : t('rental.myVehicles.vehicleCard.unavailable') }}
            </span>
          </div>
          
          <div class="vehicle-specs">
            <div class="spec-item">
              <i class="pi pi-calendar"></i>
              <span>{{ vehicle.year }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-palette"></i>
              <span>{{ vehicle.color }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-users"></i>
              <span>{{ vehicle.seats }} {{ t('rental.vehicleDetail.features.seats') }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-cog"></i>
              <span>{{ vehicle.transmission }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-bolt"></i>
              <span>{{ vehicle.fuelType }}</span>
            </div>
          </div>

          <div class="pricing">
            <div class="price-item">
              <span class="label">{{ t('rental.vehicleDetail.pricePerDay') }}:</span>
              <span class="price">S/ {{ vehicle.dailyPrice }}</span>
            </div>
            <div class="price-item">
              <span class="label">{{ t('rental.addVehicle.fields.dailyPrice') }}:</span>
              <span class="price">S/ {{ vehicle.depositAmount }}</span>
            </div>
          </div>

          <div class="location">
            <i class="pi pi-map-marker"></i>
            <div>
              <p class="district">{{ vehicle.location.district }}</p>
              <p class="address">{{ vehicle.location.address }}</p>
            </div>
          </div>

          <div v-if="vehicle.features && vehicle.features.length" class="features">
            <h3>Características:</h3>
            <div class="features-list">
              <span v-for="(feature, index) in vehicle.features" :key="index" class="feature-tag">
                <i class="pi pi-check"></i>
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de Alquileres -->
      <VehicleRentalHistory :vehicle-id="vehicleId" />
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <i class="pi pi-exclamation-triangle"></i>
      <p>No se pudo cargar el vehículo</p>
      <button @click="goBack" class="btn-primary">Volver</button>
    </div>
  </div>
</template>

<style scoped>
.vehicle-detail-page {
  min-height: calc(100vh - 100px);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i, .error-state i {
  font-size: 3rem;
  color: var(--accent-orange);
}

.page-header {
  margin-bottom: 2rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f5f5f5;
  border-color: var(--accent-orange);
  color: var(--accent-orange);
}

.vehicle-info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.vehicle-image {
  height: 300px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image i {
  font-size: 6rem;
  color: white;
  opacity: 0.9;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
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

.vehicle-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  font-weight: 500;
}

.spec-item i {
  color: var(--accent-orange);
}

.pricing {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.price-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-item .label {
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.price-item .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.location {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.location i {
  font-size: 1.5rem;
  color: var(--accent-orange);
}

.district {
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.address {
  color: var(--neutral-gray);
  margin: 0;
  font-size: 0.95rem;
}

.features h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.75rem;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.feature-tag i {
  color: #4caf50;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .vehicle-info-card {
    grid-template-columns: 1fr;
  }
  
  .vehicle-image {
    height: 200px;
  }
}
</style>