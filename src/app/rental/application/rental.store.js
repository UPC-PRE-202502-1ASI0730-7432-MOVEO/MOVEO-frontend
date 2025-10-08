import { reactive, computed } from 'vue'
import { RentalApi } from '../infrastructure/rental-api.js'

export const state = reactive({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
})

// Helper: Check if a rental is currently active
function isRentalActive(rental) {
  const now = new Date()
  const start = new Date(rental.startDate)
  const end = new Date(rental.endDate)
  
  // Status must be 'active' or 'pending' and dates must overlap with now
  return (rental.status === 'active' || rental.status === 'pending') && now >= start && now <= end
}

// Helper: Check if vehicle is available (not rented right now)
function isVehicleCurrentlyAvailable(vehicleId) {
  return !state.rentals.some(rental => 
    rental.vehicleId === vehicleId && isRentalActive(rental)
  )
}

export async function loadVehicles() {
  state.loading = true
  state.error = null
  try {
    // Load both vehicles and rentals to determine availability
    const [vehicles, rentals] = await Promise.all([
      RentalApi.listVehicles(),
      RentalApi.listRentals()
    ])
    
    state.vehicles = vehicles
    state.rentals = rentals
    
    // Mark vehicles as unavailable if they have active rentals
    state.vehicles.forEach(vehicle => {
      if (!isVehicleCurrentlyAvailable(vehicle.id)) {
        vehicle.isAvailable = false
      }
    })
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
