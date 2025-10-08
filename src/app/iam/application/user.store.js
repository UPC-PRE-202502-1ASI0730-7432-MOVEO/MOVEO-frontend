import { reactive, computed } from 'vue'
import { IamApi } from '../infrastructure/iam-api.js'

// Estado reactivo del usuario
export const userState = reactive({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  demoUsers: [] // Para el switcher de demo users
})

// Inicializar con usuario guardado en localStorage
function initializeUser() {
  const savedUser = localStorage.getItem('moveo_current_user')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      userState.currentUser = userData
      userState.isAuthenticated = true
    } catch (e) {
      console.error('Error loading saved user:', e)
      userState.currentUser = null
      userState.isAuthenticated = false
    }
  }
}

// Computed properties
export const currentUser = computed(() => userState.currentUser)
export const isAuthenticated = computed(() => userState.isAuthenticated)
export const userRole = computed(() => userState.currentUser?.role || null)
export const userName = computed(() => {
  const user = userState.currentUser
  return user ? user.fullName : ''
})
export const userInitials = computed(() => {
  const user = userState.currentUser
  return user ? user.initials : '?'
})

/**
 * Login con email y password
 */
export async function login(email, password) {
  userState.loading = true
  userState.error = null
  
  try {
    // Buscar usuario por email
    const user = await IamApi.getUserByEmail(email)
    
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    // 🚀 DESARROLLO: Bypass de contraseña - cualquier password funciona
    // En producción, aquí validarías la contraseña hasheada
    console.log('✅ Login exitoso (modo desarrollo - sin validación de contraseña)')
    
    setUser(user)
    userState.loading = false
    return user
  } catch (error) {
    userState.loading = false
    userState.error = error.message || 'Error al iniciar sesión'
    throw error
  }
}

/**
 * Registrar nuevo usuario
 */
export async function register(userData) {
  userState.loading = true
  userState.error = null
  
  try {
    // Crear payload para la API
    const payload = {
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dni: userData.dni,
      licenseNumber: userData.licenseNumber || null,
      avatar: null,
      verified: {
        email: false,
        phone: false,
        dni: false,
        license: false
      },
      stats: {
        totalRentals: 0,
        totalSpent: 0,
        totalEarned: 0,
        activeRentals: 0,
        completedRentals: 0,
        canceledRentals: 0
      },
      preferences: userData.preferences || {
        language: 'es',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      bankAccount: userData.bankAccount || null
    }
    
    const newUser = await IamApi.createUser(payload)
    setUser(newUser)
    userState.loading = false
    return newUser
  } catch (error) {
    userState.loading = false
    userState.error = error.message || 'Error al registrar usuario'
    throw error
  }
}

/**
 * Cargar usuarios demo (para el switcher de desarrollo)
 */
export async function loadDemoUsers() {
  try {
    const users = await IamApi.listUsers()
    // Obtener 1 renter y 1 owner
    const renter = users.find(u => u.role === 'renter')
    const owner = users.find(u => u.role === 'owner')
    
    userState.demoUsers = [renter, owner].filter(Boolean)
    return userState.demoUsers
  } catch (error) {
    console.error('Error loading demo users:', error)
    userState.demoUsers = []
    return []
  }
}

/**
 * Cambiar a usuario demo por ID (para desarrollo)
 */
export async function switchToDemoUser(userId) {
  try {
    const user = await IamApi.getUser(userId)
    if (user) {
      setUser(user)
    }
  } catch (error) {
    console.error('Error switching to demo user:', error)
  }
}

/**
 * Setear usuario actual y guardar en localStorage
 */
export function setUser(user) {
  userState.currentUser = user
  userState.isAuthenticated = true
  userState.error = null
  localStorage.setItem('moveo_current_user', JSON.stringify(user))
}

/**
 * Logout
 */
export function logout() {
  userState.currentUser = null
  userState.isAuthenticated = false
  localStorage.removeItem('moveo_current_user')
}

/**
 * Actualizar preferencias del usuario
 */
export async function updateUserPreferences(preferences) {
  if (!userState.currentUser) return
  
  try {
    const updatedUser = await IamApi.updateUser(userState.currentUser.id, {
      preferences: {
        ...userState.currentUser.preferences,
        ...preferences
      }
    })
    setUser(updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating preferences:', error)
    throw error
  }
}

/**
 * Actualizar información del perfil
 */
export async function updateUserProfile(updates) {
  if (!userState.currentUser) return
  
  try {
    const updatedUser = await IamApi.updateUser(userState.currentUser.id, updates)
    setUser(updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Hook para usar el store
 */
export function useUserStore() {
  return {
    state: userState,
    currentUser,
    isAuthenticated,
    userRole,
    userName,
    userInitials,
    login,
    register,
    loadDemoUsers,
    switchToDemoUser,
    setUser,
    logout,
    updateUserPreferences,
    updateUserProfile
  }
}

// Inicializar al cargar
initializeUser()
