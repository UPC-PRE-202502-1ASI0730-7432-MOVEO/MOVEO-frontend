import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { AdventureAssembler } from './adventure.assembler.js'

/**
 * API para gestionar Adventure Routes
 */
export const AdventureRouteApi = {
  /**
   * Obtener todas las rutas de aventura
   */
  async listRoutes() {
    try {
      const data = await apiClient.get('/adventure-routes')
      return AdventureAssembler.toRouteCollection(data)
    } catch (error) {
      console.error('Error fetching adventure routes:', error)
      throw error
    }
  },

  /**
   * Obtener una ruta por ID
   */
  async getRoute(id) {
    try {
      const data = await apiClient.get(`/adventure-routes/${id}`)
      return AdventureAssembler.toRouteEntity(data)
    } catch (error) {
      console.error(`Error fetching adventure route ${id}:`, error)
      throw error
    }
  },

  /**
   * Obtener rutas por tipo
   */
  async getRoutesByType(type) {
    try {
      const data = await apiClient.get(`/adventure-routes?type=${type}`)
      return AdventureAssembler.toRouteCollection(data)
    } catch (error) {
      console.error(`Error fetching routes by type ${type}:`, error)
      throw error
    }
  },

  /**
   * Obtener rutas destacadas
   */
  async getFeaturedRoutes() {
    try {
      const data = await apiClient.get('/adventure-routes?featured=true')
      return AdventureAssembler.toRouteCollection(data)
    } catch (error) {
      console.error('Error fetching featured routes:', error)
      throw error
    }
  }
}
