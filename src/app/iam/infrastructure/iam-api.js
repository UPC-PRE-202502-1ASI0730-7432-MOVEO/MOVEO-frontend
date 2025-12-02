// Repositorio / gateway API para IAM (users) con JWT Authentication
import { apiClient, tokenManager } from '@/app/shared/infrastructure/apiClient.js'
import { toUserEntity, toUserCollection } from './iam.assembler.js'

export const IamApi = {
  // ==================== AUTH ENDPOINTS ====================
  
  /**
   * Login with email and password
   * POST /api/v1/auth/login
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password })
    
    // Store tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Register new user
   * POST /api/v1/auth/register
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    
    // Store tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async refreshToken() {
    const accessToken = tokenManager.getAccessToken()
    const refreshToken = tokenManager.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      throw new Error('No tokens available')
    }
    
    const response = await apiClient.post('/auth/refresh-token', { 
      accessToken, 
      refreshToken 
    })
    
    // Store new tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Logout - invalidate refresh token
   * POST /api/v1/auth/logout
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout', {})
    } finally {
      // Always clear tokens locally, even if API call fails
      tokenManager.clearTokens()
    }
  },

  /**
   * Get current authenticated user
   * GET /api/v1/auth/me
   * @returns {User}
   */
  async getCurrentUser() {
    const data = await apiClient.get('/auth/me')
    return data
  },

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(currentPassword, newPassword) {
    return await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  },

  // ==================== USER CRUD ENDPOINTS ====================

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
   * Get user by email (returns raw data for authentication)
   * @deprecated Use login() instead for authentication
   */
  async getUserByEmail(email) {
    const users = await apiClient.get(`/users?email=${email}`)
    // Return raw user data (including password) for authentication
    return users.length > 0 ? users[0] : null
  },

  /**
   * Get user by email as entity (without sensitive data)
   */
  async getUserByEmailAsEntity(email) {
    const users = await apiClient.get(`/users?email=${email}`)
    return users.length > 0 ? toUserEntity(users[0]) : null
  },

  /**
   * Create new user
   * @deprecated Use register() instead for new user creation
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
  },

  // ==================== TOKEN UTILITIES ====================

  /**
   * Check if user is authenticated with valid token
   */
  isAuthenticated() {
    return tokenManager.hasValidToken()
  },

  /**
   * Clear all auth data
   */
  clearAuth() {
    tokenManager.clearTokens()
  }
}
