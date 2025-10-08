import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { mapVehicle, mapRental } from '../domain/index.js'

export const RentalRepository = {
  async listVehicles() {
    const data = await apiClient.get('/vehicles')
    return data.map(mapVehicle)
  },
  async getVehicle(id) {
    const data = await apiClient.get(`/vehicles/${id}`)
    return mapVehicle(data)
  },
  async listRentals() {
    const data = await apiClient.get('/rentals')
    return data.map(mapRental)
  },
  async createRental(payload) {
    // json-server no calcula lógica; asumimos payload correcto
    const data = await apiClient.post('/rentals', payload)
    return mapRental(data)
  }
}


