// Repositorio / gateway API para IAM (users)
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { toUserEntity, toUserCollection } from './iam.assembler.js'

export const IamApi = {
  /**
   * Get all users
   */
  async listUsers() {
    const data = await apiClient.get('/users')
    return toUserCollection(data)
  },

  /**
   * Get user by ID
   */
  async getUser(id) {
    const data = await apiClient.get(`/users/${id}`)
    return toUserEntity(data)
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    const users = await apiClient.get(`/users?email=${email}`)
    return users.length > 0 ? toUserEntity(users[0]) : null
  },

  /**
   * Create new user
   */
  async createUser(payload) {
    const data = await apiClient.post('/users', payload)
    return toUserEntity(data)
  },

  /**
   * Update user
   */
  async updateUser(id, payload) {
    const data = await apiClient.patch(`/users/${id}`, payload)
    return toUserEntity(data)
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    await apiClient.delete(`/users/${id}`)
  }
}
