import { reactive, computed } from 'vue'
import { RentalRepository } from '../infrastructure/RentalRepository.js'

const state = reactive({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
})

export function useRentalStore() {
  async function loadVehicles() {
    state.loading = true
    state.error = null
    try {
      state.vehicles = await RentalRepository.listVehicles()
    } catch (e) {
      state.error = e.message
    } finally { state.loading = false }
  }

  async function loadRentals() {
    state.loading = true
    state.error = null
    try {
      state.rentals = await RentalRepository.listRentals()
    } catch (e) { state.error = e.message } finally { state.loading = false }
  }

  function selectVehicle(id) { state.selectedVehicleId = id }

  const selectedVehicle = computed(() => state.vehicles.find(v => v.id === state.selectedVehicleId) || null)

  return {
    state,
    loadVehicles,
    loadRentals,
    selectVehicle,
    selectedVehicle,
  }
}

