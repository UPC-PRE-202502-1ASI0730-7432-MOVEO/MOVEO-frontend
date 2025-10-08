import { reactive, computed } from 'vue'
import { RentalApi } from '../infrastructure/rental-api.js'

export const state = reactive({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
  filters: {
    district: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 100,
    transmission: '',
    minSeats: 0,
    fuelType: ''
  },
  sortBy: 'createdAt', // 'price-asc', 'price-desc', 'rating-desc', 'createdAt'
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

// Helper: Check if vehicle is available in date range
function isVehicleAvailableInDateRange(vehicleId, startDate, endDate) {
  if (!startDate || !endDate) return true // No date filter, consider available
  
  const searchStart = new Date(startDate)
  const searchEnd = new Date(endDate)
  
  // Check if vehicle has any rental that overlaps with the search dates
  const hasConflict = state.rentals.some(rental => {
    if (rental.vehicleId !== vehicleId) return false
    
    // Only check active, pending, or confirmed rentals
    if (!['active', 'pending', 'confirmed'].includes(rental.status)) return false
    
    const rentalStart = new Date(rental.startDate)
    const rentalEnd = new Date(rental.endDate)
    
    // Check for date overlap
    return searchStart <= rentalEnd && searchEnd >= rentalStart
  })
  
  return !hasConflict
}

// Filter vehicles based on criteria
function applyFilters(vehicles, filters) {
  return vehicles.filter(vehicle => {
    // Filter by district
    if (filters.district && vehicle.location?.district !== filters.district) {
      return false
    }
    
    // Filter by date availability
    if (filters.startDate && filters.endDate) {
      if (!isVehicleAvailableInDateRange(vehicle.id, filters.startDate, filters.endDate)) {
        return false
      }
    }
    
    // Filter by price range
    if (vehicle.dailyPrice < filters.minPrice || vehicle.dailyPrice > filters.maxPrice) {
      return false
    }
    
    // Filter by transmission
    if (filters.transmission && vehicle.transmission !== filters.transmission) {
      return false
    }
    
    // Filter by minimum seats
    if (filters.minSeats > 0 && vehicle.seats < filters.minSeats) {
      return false
    }
    
    // Filter by fuel type
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
      return false
    }
    
    // Filter by vehicle status (exclude paused vehicles)
    if (vehicle.status === 'paused') {
      return false
    }
    
    return true
  })
}

// Sort vehicles based on criteria
function sortVehicles(vehicles, sortBy) {
  const sorted = [...vehicles]
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.dailyPrice - b.dailyPrice)
    
    case 'price-desc':
      return sorted.sort((a, b) => b.dailyPrice - a.dailyPrice)
    
    case 'rating-desc':
      // TODO: Add rating field to vehicles, for now use year as proxy
      return sorted.sort((a, b) => b.year - a.year)
    
    case 'createdAt':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
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

// Computed: Get filtered and sorted vehicles
export const filteredVehicles = computed(() => {
  let vehicles = applyFilters(state.vehicles, state.filters)
  vehicles = sortVehicles(vehicles, state.sortBy)
  return vehicles
})

// Set filters
export function setFilters(filters) {
  state.filters = { ...state.filters, ...filters }
}

// Set sort criteria
export function setSortBy(sortBy) {
  state.sortBy = sortBy
}

// Clear all filters
export function clearFilters() {
  state.filters = {
    district: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 100,
    transmission: '',
    minSeats: 0,
    fuelType: ''
  }
}

export function useRentalStore() {
  return {
    state,
    loadVehicles,
    loadRentals,
    selectVehicle,
    selectedVehicle,
    filteredVehicles,
    setFilters,
    setSortBy,
    clearFilters,
  }
}
