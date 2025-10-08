import { reactive, computed } from 'vue'
import { RentalApi } from '../infrastructure/rental-api.js'

export const state = reactive({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
})

export async function loadVehicles() {
  state.loading = true
  state.error = null
  try {
    state.vehicles = await RentalApi.listVehicles()
  } catch (e) {
    state.error = e.message
  } finally { state.loading = false }
}

export async function loadRentals() {
  state.loading = true
  state.error = null
  try {
    state.rentals = await RentalApi.listRentals()
  } catch (e) { state.error = e.message } finally { state.loading = false }
}

export function selectVehicle(id) { state.selectedVehicleId = id }

export const selectedVehicle = computed(() => state.vehicles.find(v => v.id === state.selectedVehicleId) || null)

export function useRentalStore() {
  return {
    state,
    loadVehicles,
    loadRentals,
    selectVehicle,
    selectedVehicle,
  }
}
