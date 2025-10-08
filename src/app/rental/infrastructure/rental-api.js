// Repositor io / gateway API para rental
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { toVehicleCollection, toVehicleEntity, toRentalCollection, toRentalEntity } from './rental.assembler.js'

export const RentalApi = {
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
// Assembler / Mapper para DTOs de rental
import { Vehicle } from '../domain/model/Vehicle.entity.js'
import { Rental } from '../domain/model/Rental.entity.js'

export function toVehicleEntity(dto) { return new Vehicle(dto) }
export function toRentalEntity(dto) { return new Rental(dto) }
export function toVehicleCollection(list) { return Array.isArray(list) ? list.map(toVehicleEntity) : [] }
export function toRentalCollection(list) { return Array.isArray(list) ? list.map(toRentalEntity) : [] }

