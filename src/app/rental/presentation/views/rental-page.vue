<template>
  <section class="rental-page">
    <header class="header">
      <h1 class="title">Explora Vehículos</h1>
      <div class="actions">
        <button class="btn" @click="reload" :disabled="loading">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>
    </header>

    <!-- Filtros de búsqueda -->
    <search-filters 
      :result-count="filteredVehicles.length"
      @filter-change="handleFilterChange"
    />

    <!-- Controles de ordenamiento -->
    <div class="sort-controls">
      <label for="sortBy" class="sort-label">Ordenar por:</label>
      <select id="sortBy" v-model="currentSortBy" class="sort-select" @change="handleSortChange">
        <option value="createdAt">Más recientes</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="rating-desc">Mejor calificados</option>
      </select>
    </div>

    <div v-if="error" class="alert error">{{ error }}</div>

    <vehicle-list
      v-if="filteredVehicles.length"
      :vehicles="filteredVehicles"
      :selected-id="state.selectedVehicleId"
      @select="selectVehicle"
    />
    <p v-else-if="!loading" class="empty">
      {{ state.vehicles.length === 0 ? 'No hay vehículos disponibles.' : 'No se encontraron vehículos con esos filtros.' }}
    </p>

    <vehicle-detail-content :vehicle="selectedVehicle">
      <template #actions>
        <div class="detail-actions">
          <button class="btn primary" @click="simulateRental" :disabled="loadingSim || !selectedVehicle">
            {{ loadingSim ? 'Creando...' : 'Solicitar Alquiler (demo)' }}
          </button>
          <div v-if="createdRental" class="alert success">Alquiler creado id {{ createdRental.id }} (demo)</div>
        </div>
      </template>
    </vehicle-detail-content>
  </section>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { state, loadVehicles, selectVehicle, selectedVehicle, filteredVehicles, setFilters, setSortBy } from '@/app/rental/application/rental.store.js'
import VehicleList from '@/app/rental/presentation/components/vehicle-list.vue'
import VehicleDetailContent from '@/app/rental/presentation/components/vehicle-detail-content.vue'
import SearchFilters from '@/app/rental/presentation/components/search-filters.vue'

const loading = ref(false)
const loadingSim = ref(false)
const createdRental = ref(null)
const currentSortBy = ref('createdAt')

const error = computed(() => state.error)

async function reload() {
  loading.value = true
  await loadVehicles()
  loading.value = false
}

function handleFilterChange(filters) {
  setFilters(filters)
}

function handleSortChange() {
  setSortBy(currentSortBy.value)
}

function simulateRental() {
  if (!selectedVehicle.value) return
  loadingSim.value = true
  createdRental.value = { id: Math.floor(Math.random()*10000), vehicleId: selectedVehicle.value.id }
  setTimeout(()=> loadingSim.value = false, 600)
}

onMounted(() => { reload() })
</script>
<style scoped>
.rental-page { 
  display: grid; 
  gap: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}
.header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.75rem; }
.title { 
  font-family: var(--font-family-primary);
  font-size: 1.75rem; 
  margin: 0; 
  font-weight: 600;
  color: var(--text-primary);
}
.empty { 
  text-align: center; 
  padding: 2rem; 
  color: var(--text-secondary);
  font-family: var(--font-family-primary);
}
.btn { 
  border: none; 
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
  padding: .55rem 1rem; 
  border-radius: 8px; 
  cursor: pointer; 
  font-family: var(--font-family-primary);
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn:hover {
  opacity: 0.9;
}
.btn.primary { 
  background: var(--brand-green);
}
.btn:disabled { 
  opacity: .6; 
  cursor: default; 
}
.alert { 
  padding: .6rem .9rem; 
  border-radius: 8px; 
  font-size: .875rem; 
  font-family: var(--font-family-primary);
  margin-top: .5rem; 
}
.alert.error { 
  background: #ffebee; 
  color: #c62828; 
}
.alert.success { 
  background: #e8f5e9; 
  color: #2e7d32; 
}
.detail-actions { 
  margin-top: 1rem; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
}

/* Sort controls */
.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-base);
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
}

.sort-label {
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.sort-select {
  font-family: var(--font-family-primary);
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--bg-muted);
  border-radius: 6px;
  background: white;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--brand-green);
}

@media (max-width: 768px) {
  .sort-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .rental-page {
    padding: 1rem;
  }
}
</style>

