import { reactive, computed } from 'vue'
import { RentalApi } from '../infrastructure/rental-api.js'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

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
    maxPrice: 1000,
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
    // Normalize numeric fields to avoid string/number mismatches from the API
    const normalizeVehicle = v => ({
      ...v,
      id: Number(v.id),
      ownerId: v.ownerId != null ? Number(v.ownerId) : v.ownerId
    })

    const normalizeRental = r => ({
      ...r,
      id: Number(r.id),
      vehicleId: r.vehicleId != null ? Number(r.vehicleId) : r.vehicleId,
      renterId: r.renterId != null ? Number(r.renterId) : r.renterId,
      ownerId: r.ownerId != null ? Number(r.ownerId) : r.ownerId,
      totalPrice: r.totalPrice != null ? Number(r.totalPrice) : r.totalPrice
    })

    state.vehicles = vehicles.map(normalizeVehicle)
    state.rentals = rentals.map(normalizeRental)
    
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
    const rentals = await RentalApi.listRentals()
    // Normalize numeric fields
    state.rentals = Array.isArray(rentals) ? rentals.map(r => ({
      ...r,
      id: Number(r.id),
      vehicleId: r.vehicleId != null ? Number(r.vehicleId) : r.vehicleId,
      renterId: r.renterId != null ? Number(r.renterId) : r.renterId,
      ownerId: r.ownerId != null ? Number(r.ownerId) : r.ownerId,
      totalPrice: r.totalPrice != null ? Number(r.totalPrice) : r.totalPrice
    })) : []
  } catch (e) { state.error = e.message } finally { state.loading = false }
}

export async function updateRentalStatus(rentalId, newStatus) {
  state.loading = true
  state.error = null
  try {
    const rental = state.rentals.find(r => r.id === rentalId)
    
    await RentalApi.updateRentalStatus(rentalId, newStatus)
    
    // Crear notificaciones según el nuevo estado
    if (rental) {
      if (newStatus === 'completed') {
        // Notificar al owner que el alquiler se completó
        await createRentalCompletedNotification(rental)
      } else if (newStatus === 'accepted' || newStatus === 'confirmed') {
        // Notificar al renter que su solicitud fue aceptada/confirmada
        await createRentalAcceptedNotification(rental)
      } else if (newStatus === 'rejected' || newStatus === 'cancelled') {
        // Notificar al renter que su solicitud fue rechazada/cancelada
        await createRentalRejectedNotification(rental)
      }
    }
    
    // Recargar rentals después de actualizar
    await loadRentals()
  } catch (e) {
    state.error = e.message
    throw e
  } finally {
    state.loading = false
  }
}

export async function rateRental(rentalId, rating, comment) {
  state.loading = true
  state.error = null
  try {
    const rental = state.rentals.find(r => r.id === rentalId)
    if (!rental) throw new Error('Rental not found')

    // 1. Create Review
    const reviewData = {
      rentalId: rentalId,
      vehicleId: rental.vehicleId,
      renterId: rental.renterId,
      ownerId: rental.ownerId,
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString()
    }
    await RentalApi.createReview(reviewData)

    // 2. Update Rental to mark as rated
    await RentalApi.updateRentalRating(rentalId, { 
      isRated: true,
      rating: rating 
    })

    // 3. Create notification for owner
    await createReviewNotification(rental, rating, comment)

    // 4. Reload rentals
    await loadRentals()
    
    return true
  } catch (e) {
    state.error = e.message
    throw e
  } finally {
    state.loading = false
  }
}

// Crear notificación cuando se recibe una calificación
async function createReviewNotification(rental, rating, comment) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    const starsText = '⭐'.repeat(rating)
    
    const notification = {
      userId: rental.ownerId,
      type: 'review_received',
      title: '🌟 Nueva Calificación Recibida',
      message: `Tu vehículo ${vehicle?.brand} ${vehicle?.model} ha recibido una calificación de ${starsText} (${rating}/5). ${comment ? `Comentario: "${comment}"` : ''}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/my-vehicles`,
      actionLabel: 'Ver Mis Vehículos',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        renterId: rental.renterId,
        rating: rating,
        comment: comment
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de calificación creada para owner:', rental.ownerId)
  } catch (error) {
    console.error('Error creating review notification:', error)
  }
}

// Crear notificación cuando un rental se completa
async function createRentalCompletedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.ownerId,
      type: 'rental_completed',
      title: '✅ Alquiler Completado',
      message: `El cliente ${rental.renterName || ''} ha completado el alquiler del vehículo ${vehicle?.brand} ${vehicle?.model}. Alquiler #${rental.id}. Total: S/. ${rental.totalPrice}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/vehicles/${rental.vehicleId}`,
      actionLabel: 'Ver Vehículo',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        renterId: rental.renterId,
        renterName: rental.renterName,
        totalPrice: rental.totalPrice
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de alquiler completado creada para owner:', rental.ownerId)
  } catch (error) {
    console.error('Error creating rental completed notification:', error)
  }
}

// Crear notificación cuando una solicitud es aceptada
async function createRentalAcceptedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.renterId,
      type: 'rental_confirmed',
      title: '🎉 ¡Solicitud Aceptada!',
      message: `Tu solicitud de alquiler del vehículo ${vehicle?.brand} ${vehicle?.model} ha sido aceptada. Alquiler #${rental.id}. Puedes recoger el vehículo el ${new Date(rental.startDate).toLocaleDateString('es-ES')}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/details/${rental.id}`,
      actionLabel: 'Ver Detalles',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        ownerId: rental.ownerId,
        totalPrice: rental.totalPrice,
        startDate: rental.startDate,
        endDate: rental.endDate
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de solicitud aceptada creada para renter:', rental.renterId)
  } catch (error) {
    console.error('Error creating rental accepted notification:', error)
  }
}

// Crear notificación cuando una solicitud es rechazada
async function createRentalRejectedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.renterId,
      type: 'rental_cancelled',
      title: '❌ Solicitud Rechazada',
      message: `Lo sentimos, tu solicitud de alquiler del vehículo ${vehicle?.brand} ${vehicle?.model} ha sido rechazada por el propietario. Alquiler #${rental.id}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/browse`,
      actionLabel: 'Ver Otros Vehículos',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        ownerId: rental.ownerId
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de solicitud rechazada creada para renter:', rental.renterId)
  } catch (error) {
    console.error('Error creating rental rejected notification:', error)
  }
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
    maxPrice: 1000,
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
    updateRentalStatus,
    rateRental,
    selectVehicle,
    selectedVehicle,
    filteredVehicles,
    setFilters,
    setSortBy,
    clearFilters,
  }
}
