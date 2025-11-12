<template>
  <div class="route-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>Cargando detalles de la ruta...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !currentRoute" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h2>Ruta no encontrada</h2>
      <p>{{ error || 'No se pudo cargar la información de la ruta' }}</p>
      <button @click="goBack" class="btn-back-error">
        <i class="pi pi-arrow-left"></i>
        Volver a Rutas
      </button>
    </div>

    <!-- Route Content -->
    <div v-else class="route-content">
      <!-- Hero Section -->
      <section class="route-hero">
        <button @click="goBack" class="btn-back-float">
          <i class="pi pi-arrow-left"></i>
          Volver
        </button>
        
        <img :src="currentRoute.imageUrl || defaultImage" :alt="currentRoute.name" class="hero-image" />
        
        <div class="hero-overlay">
          <div class="hero-content">
            <div class="hero-badges">
              <span class="badge type-badge" :class="`type-${currentRoute.type}`">
                {{ currentRoute.typeIcon }} {{ currentRoute.typeLabel }}
              </span>
              <span v-if="currentRoute.featured" class="badge featured-badge">
                <i class="pi pi-star-fill"></i>
                Destacada
              </span>
            </div>
            
            <h1 class="hero-title">{{ currentRoute.name }}</h1>
            
            <div class="hero-meta">
              <div class="meta-item">
                <i class="pi pi-map-marker"></i>
                <span>{{ currentRoute.fullRoute }}</span>
              </div>
              <div class="meta-item">
                <i class="pi pi-star-fill"></i>
                <span>{{ currentRoute.rating.toFixed(1) }} ({{ currentRoute.reviewsCount }} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="route-main">
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Description -->
            <div class="section-card">
              <h2 class="section-title">
                <i class="pi pi-align-left"></i>
                Descripción
              </h2>
              <p class="route-description">{{ currentRoute.description }}</p>
            </div>

            <!-- Key Points -->
            <div class="section-card" v-if="currentRoute.keyPoints && currentRoute.keyPoints.length > 0">
              <h2 class="section-title">
                <i class="pi pi-map"></i>
                Puntos Clave del Itinerario
              </h2>
              <div class="key-points-list">
                <div v-for="(point, index) in currentRoute.keyPoints" :key="index" class="key-point-item">
                  <div class="point-number">{{ index + 1 }}</div>
                  <div class="point-content">
                    <h4>{{ point.name || point }}</h4>
                    <p v-if="point.description">{{ point.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Highlights -->
            <div class="section-card" v-if="currentRoute.highlights && currentRoute.highlights.length > 0">
              <h2 class="section-title">
                <i class="pi pi-star"></i>
                Aspectos Destacados
              </h2>
              <div class="highlights-grid">
                <div v-for="(highlight, index) in currentRoute.highlights" :key="index" class="highlight-item">
                  <i class="pi pi-check-circle"></i>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>

            <!-- Recommended Vehicles -->
            <div class="section-card" v-if="recommendedVehicles.length > 0">
              <h2 class="section-title">
                <i class="pi pi-car"></i>
                Vehículos Recomendados para esta Ruta
              </h2>
              <p class="section-subtitle">Selecciona el vehículo perfecto para tu aventura</p>
              
              <div class="vehicles-grid">
                <div v-for="vehicle in recommendedVehicles" :key="vehicle.id" class="vehicle-card" @click="viewVehicle(vehicle.id)">
                  <img :src="vehicle.imageUrl || '/placeholder-car.jpg'" :alt="vehicle.fullName" class="vehicle-image" />
                  <div class="vehicle-info">
                    <h4 class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</h4>
                    <p class="vehicle-specs">{{ vehicle.year }} · {{ vehicle.transmission }}</p>
                    <div class="vehicle-footer">
                      <span class="vehicle-price">S/. {{ vehicle.dailyPrice }}/día</span>
                      <button class="btn-select-vehicle">
                        Ver Detalles
                        <i class="pi pi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (Sidebar) -->
          <div class="right-column">
            <!-- Info Card -->
            <div class="info-card sticky-card">
              <h3 class="info-title">Información de la Ruta</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <i class="pi pi-calendar"></i>
                  <div>
                    <span class="info-label">Duración</span>
                    <span class="info-value">{{ currentRoute.formattedDuration }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-compass"></i>
                  <div>
                    <span class="info-label">Distancia</span>
                    <span class="info-value">{{ currentRoute.formattedDistance }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-chart-line"></i>
                  <div>
                    <span class="info-label">Dificultad</span>
                    <span class="info-value">{{ currentRoute.difficultyLevel }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-dollar"></i>
                  <div>
                    <span class="info-label">Costo Estimado</span>
                    <span class="info-value">{{ currentRoute.formattedCost }}</span>
                  </div>
                </div>

                <div class="info-item" v-if="currentRoute.bestSeason">
                  <i class="pi pi-sun"></i>
                  <div>
                    <span class="info-label">Mejor Época</span>
                    <span class="info-value">{{ currentRoute.bestSeason }}</span>
                  </div>
                </div>
              </div>

              <div class="info-tags" v-if="currentRoute.tags && currentRoute.tags.length > 0">
                <span v-for="(tag, index) in currentRoute.tags" :key="index" class="tag">
                  {{ tag }}
                </span>
              </div>

              <button @click="startAdventure" class="btn-start-adventure">
                <i class="pi pi-play"></i>
                Comenzar Aventura
              </button>

              <p class="info-note">
                <i class="pi pi-info-circle"></i>
                Los vehículos se alquilan por separado según disponibilidad
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdventureRoutesStore } from '../../application/adventure-routes.store.js'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const router = useRouter()
const route = useRoute()
const store = useAdventureRoutesStore()

const { currentRoute, loading, error, fetchRoute } = store
const recommendedVehicles = ref([])

const defaultImage = computed(() => {
  if (!currentRoute.value) return ''
  const images = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
    mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    cultural: 'https://images.unsplash.com/photo-1555791018-6572a7ad7e0e?w=1600',
    gastronomic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600',
    adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600',
    scenic: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600'
  }
  return images[currentRoute.value.type] || images.scenic
})

onMounted(async () => {
  const routeId = route.params.id
  await fetchRoute(routeId)
  
  if (currentRoute.value && currentRoute.value.recommendedVehicles) {
    await loadRecommendedVehicles()
  }
})

async function loadRecommendedVehicles() {
  try {
    const allVehicles = await RentalApi.listVehicles()
    recommendedVehicles.value = allVehicles
      .filter(v => currentRoute.value.recommendedVehicles.includes(v.id))
      .slice(0, 3)
  } catch (err) {
    console.error('Error loading recommended vehicles:', err)
  }
}

function goBack() {
  router.push({ name: 'adventure-routes' })
}

function viewVehicle(vehicleId) {
  router.push({ name: 'rental-vehicle-detail', params: { id: vehicleId } })
}

function startAdventure() {
  if (recommendedVehicles.value.length > 0) {
    viewVehicle(recommendedVehicles.value[0].id)
  } else {
    router.push({ name: 'rental-browse' })
  }
}
</script>

<style scoped>
.route-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Loading & Error States */
.loading-container,
.error-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-icon {
  font-size: 4rem;
  color: #3A5E5E;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-container h2 {
  font-size: 2rem;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.error-container p {
  color: #666;
  margin: 0 0 2rem 0;
}

.btn-back-error {
  padding: 1rem 2rem;
  background: #3A5E5E;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-back-error:hover {
  background: #2C5050;
  transform: translateY(-2px);
}

/* Hero Section */
.route-hero {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-back-float {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-back-float:hover {
  background: white;
  transform: translateX(-4px);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
}

.hero-content {
  width: 100%;
  padding: 3rem 2rem;
  color: white;
}

.hero-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.625rem 1.25rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.type-badge {
  background: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
}

.type-badge.type-beach {
  background: rgba(255, 140, 0, 0.95);
  color: white;
}

.type-badge.type-mountain {
  background: rgba(65, 105, 225, 0.95);
  color: white;
}

.type-badge.type-cultural {
  background: rgba(139, 69, 19, 0.95);
  color: white;
}

.featured-badge {
  background: rgba(255, 215, 0, 0.95);
  color: #2C3E50;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.meta-item i {
  font-size: 1.25rem;
  color: #FFD700;
}

/* Main Content */
.route-main {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3A5E5E;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0 0 1.5rem 0;
}

.route-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin: 1rem 0 0 0;
}

/* Key Points */
.key-points-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.key-point-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.point-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.point-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.point-content p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Highlights */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #2C3E50;
  font-weight: 500;
}

.highlight-item i {
  color: #22c55e;
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.vehicle-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.vehicle-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.vehicle-info {
  padding: 1.25rem;
}

.vehicle-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.vehicle-specs {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
}

.vehicle-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.vehicle-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3A5E5E;
}

.btn-select-vehicle {
  padding: 0.625rem 1rem;
  background: #FF6F00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-select-vehicle:hover {
  background: #E66500;
}

/* Right Column (Sidebar) */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.sticky-card {
  position: sticky;
  top: 2rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 1.5rem 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.info-item i {
  font-size: 1.5rem;
  color: #3A5E5E;
  flex-shrink: 0;
}

.info-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 2px solid #f0f0f0;
  border-bottom: 2px solid #f0f0f0;
}

.tag {
  padding: 0.5rem 1rem;
  background: #e9ecef;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2C3E50;
}

.btn-start-adventure {
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 111, 0, 0.3);
  margin-bottom: 1rem;
}

.btn-start-adventure:hover {
  background: linear-gradient(135deg, #E66500 0%, #E67E00 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.info-note {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-note i {
  color: #3A5E5E;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sticky-card {
    position: static;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .route-hero {
    height: 400px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-content {
    padding: 2rem 1.5rem;
  }

  .route-main {
    padding: 2rem 1rem;
  }

  .section-card {
    padding: 1.5rem;
  }

  .vehicles-grid {
    grid-template-columns: 1fr;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
