<template>
  <div class="rental-requests-page">
    <div class="page-header">
      <div class="header-content">
        <div class="icon-wrapper">
          <i class="pi pi-inbox"></i>
        </div>
        <h1>{{ t('rental.rentalRequests.title') }}</h1>
        <p class="subtitle">{{ t('rental.rentalRequests.subtitle') }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.rentalRequests.loading') }}</p>
    </div>

    <div v-else class="content-container">
      <!-- Tabs de filtrado -->
      <div class="filter-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
          <span class="badge" v-if="getCountByStatus(tab.value) > 0">
            {{ getCountByStatus(tab.value) }}
          </span>
        </button>
      </div>

      <!-- Lista de solicitudes -->
      <div v-if="filteredRequests.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>{{ t('rental.rentalRequests.empty.title') }}</h3>
        <p>{{ t('rental.rentalRequests.empty.message') }}</p>
      </div>

      <div v-else class="requests-grid">
        <div 
          v-for="request in filteredRequests" 
          :key="request.id"
          class="request-card"
          :class="`status-${request.status}`"
        >
          <!-- Header del card -->
          <div class="card-header">
            <div class="vehicle-info">
              <img 
                :src="request.vehicle?.images?.[0] || 'https://via.placeholder.com/80'" 
                alt="Vehicle"
                class="vehicle-thumbnail"
              />
              <div>
                <h3>{{ request.vehicle?.brand }} {{ request.vehicle?.model }}</h3>
                <p class="plate">{{ request.vehicle?.licensePlate }}</p>
              </div>
            </div>
            <span :class="`status-badge status-${request.status}`">
              {{ statusLabels[request.status] }}
            </span>
          </div>

          <!-- Información del solicitante -->
          <div class="card-body">
            <div class="info-row">
              <i class="pi pi-user"></i>
              <div>
                <span class="label">Solicitante:</span>
                <span class="value">{{ request.renter?.firstName }} {{ request.renter?.lastName }}</span>
              </div>
            </div>

            <div class="info-row">
              <i class="pi pi-calendar"></i>
              <div>
                <span class="label">Período:</span>
                <span class="value">
                  {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
                </span>
              </div>
            </div>

            <div class="info-row">
              <i class="pi pi-clock"></i>
              <div>
                <span class="label">Duración:</span>
                <span class="value">{{ calculateDays(request.startDate, request.endDate) }} días</span>
              </div>
            </div>

            <div class="info-row">
              <i class="pi pi-dollar"></i>
              <div>
                <span class="label">Total:</span>
                <span class="value price">S/ {{ request.totalAmount?.toFixed(2) }}</span>
              </div>
            </div>

            <div v-if="request.message" class="info-row message">
              <i class="pi pi-comment"></i>
              <div>
                <span class="label">Mensaje:</span>
                <p class="value">{{ request.message }}</p>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="card-actions" v-if="request.status === 'pending'">
            <pv-button 
              label="Rechazar" 
              severity="danger"
              outlined
              icon="pi pi-times"
              @click="handleReject(request)"
              :loading="processingId === request.id"
            />
            <pv-button 
              label="Aceptar" 
              severity="success"
              icon="pi pi-check"
              @click="handleAccept(request)"
              :loading="processingId === request.id"
            />
          </div>

          <div class="card-footer" v-else>
            <small>
              <i class="pi pi-info-circle"></i>
              <template v-if="request.status === 'confirmed'">
                Confirmada el {{ formatDate(request.acceptedAt) }}
              </template>
              <template v-else-if="request.status === 'active'">
                Alquiler en curso desde {{ formatDate(request.startDate) }}
              </template>
              <template v-else-if="request.status === 'completed'">
                Completada el {{ formatDate(request.endDate) }}
              </template>
              <template v-else-if="request.status === 'rejected'">
                Rechazada el {{ formatDate(request.respondedAt) }}
              </template>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)
const requests = ref([])
const activeTab = ref('all')
const processingId = ref(null)

const tabs = [
  { label: t('rental.rentalRequests.tabs.all'), value: 'all', icon: 'pi pi-list' },
  { label: t('rental.rentalRequests.tabs.pending'), value: 'pending', icon: 'pi pi-clock' },
  { label: t('rental.rentalRequests.tabs.confirmed'), value: 'confirmed', icon: 'pi pi-check-circle' },
  { label: t('rental.rentalRequests.tabs.active'), value: 'active', icon: 'pi pi-play-circle' },
  { label: t('rental.rentalRequests.tabs.completed'), value: 'completed', icon: 'pi pi-check' },
  { label: t('rental.rentalRequests.tabs.rejected'), value: 'rejected', icon: 'pi pi-times-circle' }
]

const statusLabels = {
  all: '',
  pending: t('rental.rentalRequests.tabs.pending'),
  confirmed: t('rental.rentalRequests.tabs.confirmed'),
  active: t('rental.rentalRequests.tabs.active'),
  completed: t('rental.rentalRequests.tabs.completed'),
  rejected: t('rental.rentalRequests.tabs.rejected')
}

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return requests.value
  return requests.value.filter(r => r.status === activeTab.value)
})

function getCountByStatus(status) {
  if (status === 'all') return requests.value.length
  return requests.value.filter(r => r.status === status).length
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

function calculateDays(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

async function handleAccept(request) {
  if (!confirm(`¿Aceptar la solicitud de ${request.renter?.firstName}?`)) return
  
  try {
    processingId.value = request.id
    
    // Determinar el estado según si el alquiler ya empezó
    const now = new Date()
    const startDate = new Date(request.startDate)
    const endDate = new Date(request.endDate)
    
    let newStatus = 'confirmed' // Por defecto, alquiler confirmado para el futuro
    
    // Si la fecha de inicio ya pasó y aún no terminó, está activo
    if (now >= startDate && now <= endDate) {
      newStatus = 'active'
    }
    
    await apiClient.patch(`/rentals/${request.id}`, {
      status: newStatus,
      acceptedAt: new Date().toISOString()
    })
    
    // Actualizar localmente
    const idx = requests.value.findIndex(r => r.id === request.id)
    if (idx !== -1) {
      requests.value[idx].status = newStatus
      requests.value[idx].acceptedAt = new Date().toISOString()
    }
    
    const statusMessage = newStatus === 'active' ? 'activado' : 'confirmado'
    alert(`✅ Solicitud aceptada y alquiler ${statusMessage} exitosamente`)
  } catch (error) {
    console.error('Error accepting request:', error)
    alert('Error al aceptar la solicitud')
  } finally {
    processingId.value = null
  }
}

async function handleReject(request) {
  if (!confirm(`¿Rechazar la solicitud de ${request.renter?.firstName}?`)) return
  
  try {
    processingId.value = request.id
    
    await apiClient.patch(`/rentals/${request.id}`, {
      status: 'rejected',
      respondedAt: new Date().toISOString()
    })
    
    // Actualizar localmente
    const idx = requests.value.findIndex(r => r.id === request.id)
    if (idx !== -1) {
      requests.value[idx].status = 'rejected'
      requests.value[idx].respondedAt = new Date().toISOString()
    }
    
    alert('Solicitud rechazada')
  } catch (error) {
    console.error('Error rejecting request:', error)
    alert('Error al rechazar la solicitud')
  } finally {
    processingId.value = null
  }
}

async function loadRequests() {
  try {
    loading.value = true
    
    // Obtener todos los rentals
    const allRentals = await apiClient.get('/rentals')
    
    // Obtener vehículos del propietario
    const vehicles = await apiClient.get('/vehicles')
    const myVehicles = vehicles.filter(v => 
      Number(v.ownerId) === Number(userStore.currentUser.value?.id)
    )
    const myVehicleIds = myVehicles.map(v => v.id)
    
    // Filtrar rentals de mis vehículos
    const myRentals = allRentals.filter(r => myVehicleIds.includes(Number(r.vehicleId)))
    
    // Obtener información completa de usuarios
    const users = await apiClient.get('/users')
    
    // Enriquecer los datos
    requests.value = myRentals.map(rental => {
      const vehicle = myVehicles.find(v => v.id === Number(rental.vehicleId))
      const renter = users.find(u => u.id === Number(rental.renterId))
      
      return {
        ...rental,
        vehicle,
        renter
      }
    })
    
    // Ordenar por fecha (más recientes primero)
    requests.value.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.startDate)
      const dateB = new Date(b.createdAt || b.startDate)
      return dateB - dateA
    })
    
  } catch (error) {
    console.error('Error loading rental requests:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequests()
})
</script>

<style scoped>
.rental-requests-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 111, 0, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.icon-wrapper i {
  font-size: 2.5rem;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
  background: linear-gradient(135deg, #2C3E50 0%, #FF6F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--neutral-gray);
  font-size: 1.125rem;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i {
  font-size: 4rem;
  color: var(--accent-orange);
}

.content-container {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--neutral-gray);
  transition: all 0.3s;
  position: relative;
}

.tab:hover {
  color: var(--accent-orange);
  background: rgba(255, 111, 0, 0.05);
}

.tab.active {
  color: var(--accent-orange);
  border-bottom-color: var(--accent-orange);
}

.tab .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  background: var(--accent-orange);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state i {
  font-size: 5rem;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--neutral-gray);
  margin: 0;
}

.requests-grid {
  display: grid;
  gap: 1.5rem;
}

.request-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.request-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.request-card.status-pending {
  border-left: 4px solid #FFA726;
}

.request-card.status-accepted {
  border-left: 4px solid #66BB6A;
}

.request-card.status-rejected {
  border-left: 4px solid #EF5350;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f5f5f5;
}

.vehicle-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.vehicle-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.vehicle-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.plate {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  font-weight: 600;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #FFF3E0;
  color: #F57C00;
}

.status-badge.status-confirmed {
  background: #E3F2FD;
  color: #1565C0;
}

.status-badge.status-active {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-badge.status-completed {
  background: #F3E5F5;
  color: #6A1B9A;
}

.status-badge.status-rejected {
  background: #FFEBEE;
  color: #C62828;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-row i {
  font-size: 1.25rem;
  color: var(--accent-orange);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.info-row .label {
  font-weight: 600;
  color: var(--neutral-gray);
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.25rem;
}

.info-row .value {
  color: var(--primary-dark);
  font-size: 1rem;
}

.info-row .value.price {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--accent-orange);
}

.info-row.message {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
}

.info-row.message p {
  margin: 0;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.card-footer {
  padding-top: 1rem;
  border-top: 2px solid #f5f5f5;
  text-align: center;
}

.card-footer small {
  color: var(--neutral-gray);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .rental-requests-page {
    padding: 1rem;
  }

  .content-container {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .icon-wrapper i {
    font-size: 2rem;
  }

  .filter-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
  }

  .vehicle-info {
    width: 100%;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions button {
    width: 100%;
  }
}

/* PrimeVue Overrides */
:deep(.p-button) {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-2px);
}
</style>
