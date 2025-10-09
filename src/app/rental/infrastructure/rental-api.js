// Repositorio / gateway API para rental
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { toVehicleCollection, toVehicleEntity, toRentalCollection, toRentalEntity } from './rental.assembler.js'
import http from '@/app/shared/infrastructure/http-common.js'


export const RentalApi = {

  async getRentalReviews(rentalId) {
    const response = await http.get(`/reviews?rentalId=${rentalId}`)
    return response.data
  },
  async getVehicleRentalHistory(vehicleId) {
    const response = await http.get(`/rentals?vehicleId=${vehicleId}&_sort=startDate&_order=desc`)
    return response.data
  },
  async listVehicles() {
    const data = await apiClient.get('/vehicles')
    return toVehicleCollection(data)
  },
  async getVehicle(id) {
    const data = await apiClient.get(`/vehicles/${id}`)
    return toVehicleEntity(data)
  },
  async listRentals() {
    const data = await apiClient.get('/rentals')
    return toRentalCollection(data)
  },
  async createRental(payload) {
    const data = await apiClient.post('/rentals', payload)
    return toRentalEntity(data)
  }
}


