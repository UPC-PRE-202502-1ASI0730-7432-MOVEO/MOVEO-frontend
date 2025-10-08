<template>
  <section class="rental-page">
    <header class="header">
      <h1 class="title">Explora Vehículos</h1>
      <div class="actions">
        <button class="btn" @click="reload" :disabled="loading">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>
    </header>


    <div v-if="error" class="alert error">{{ error }}</div>

    <vehicle-list
      v-if="vehicles.length"
      :vehicles="vehicles"
      :selected-id="state.selectedVehicleId"
      @select="selectVehicle"
    />
    <p v-else-if="!loading" class="empty">No hay vehículos disponibles.</p>

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
import { state, loadVehicles, selectVehicle, selectedVehicle } from '@/app/rental/application/rental.store.js'
import VehicleList from '@/app/rental/presentation/components/vehicle-list.vue'
import VehicleDetailContent from '@/app/rental/presentation/components/vehicle-detail-content.vue'

const loading = ref(false)
const loadingSim = ref(false)
const createdRental = ref(null)

const vehicles = computed(() => state.vehicles)
const error = computed(() => state.error)

async function reload() {
  loading.value = true
  await loadVehicles()
  loading.value = false
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
.rental-page { display:grid; gap:1.25rem; }
.header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.75rem; }
.title { font-size:1.75rem; margin:0; font-weight:600; }
.empty { text-align:center; padding:2rem; opacity:.7; }
.btn { border:none; background:#607d8b; color:#fff; padding:.55rem 1rem; border-radius:8px; cursor:pointer; font-weight:500; }
.btn.primary { background:#3f51b5; }
.btn:disabled { opacity:.6; cursor:default; }
.alert { padding:.6rem .9rem; border-radius:8px; font-size:.75rem; margin-top:.5rem; }
.alert.error { background:#ffebee; color:#c62828; }
.alert.success { background:#e8f5e9; color:#2e7d32; }
.detail-actions { margin-top:1rem; display:flex; flex-direction:column; align-items:flex-start; }
</style>

