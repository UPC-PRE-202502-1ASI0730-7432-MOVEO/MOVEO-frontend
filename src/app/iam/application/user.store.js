import { reactive, computed } from 'vue'

const DEMO_USERS = {
  renter: {
    id: 2,
    email: "ana@moveo.com",
    role: "renter",
    firstName: "Ana",
    lastName: "López",
    phone: "+51963852741",
    dni: "85236974",
    licenseNumber: "LIC-2021-456",
    isVerified: true,
    reputationScore: 4.9,
    totalReviews: 8,
    joinedAt: "2024-02-20T14:30:00Z",
    profilePicture: "ana.jpg",
    preferences: {
      language: 'es',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      favoriteDistricts: ['Miraflores', 'San Isidro', 'Barranco'],
      priceRange: { min: 30, max: 70 },
      preferredTransmission: 'automático',
      favoriteVehicleTypes: ['sedan', 'suv']
    }
  },
  owner: {
    id: 1,
    email: "carlos@moveo.com",
    role: "owner",
    firstName: "Carlos",
    lastName: "Mendoza",
    phone: "+51987654321",
    dni: "74125896",
    licenseNumber: "LIC-2020-789",
    isVerified: true,
    reputationScore: 4.8,
    totalReviews: 12,
    joinedAt: "2024-01-15T10:00:00Z",
    profilePicture: "carlos.jpg",
    preferences: {
      language: 'es',
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      autoAcceptRentals: false,
      minimumRentalDays: 1,
      instantBooking: false
    }
  }
}

// Estado reactivo del usuario
export const userState = reactive({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

// Inicializar con usuario renter por defecto (para testing)
function initializeUser() {
  const savedUser = localStorage.getItem('moveo_current_user')
  if (savedUser) {
    try {
      userState.currentUser = JSON.parse(savedUser)
      userState.isAuthenticated = true
    } catch (e) {
      console.error('Error loading saved user:', e)
      setUser(DEMO_USERS.renter)
    }
  } else {
    // Por defecto, usuario renter
    setUser(DEMO_USERS.renter)
  }
}

// Computed properties
export const currentUser = computed(() => userState.currentUser)
export const isAuthenticated = computed(() => userState.isAuthenticated)
export const userRole = computed(() => userState.currentUser?.role || null)
export const userName = computed(() => {
  const user = userState.currentUser
  return user ? `${user.firstName} ${user.lastName}` : ''
})
export const userInitials = computed(() => {
  const user = userState.currentUser
  return user ? `${user.firstName[0]}${user.lastName[0]}` : '?'
})

// Setear usuario (para testing con usuarios demo)
export function setUser(user) {
  userState.currentUser = user
  userState.isAuthenticated = true
  userState.error = null
  localStorage.setItem('moveo_current_user', JSON.stringify(user))
}

// Cambiar a usuario demo (solo para desarrollo)
export function switchToDemoUser(role) {
  const demoUser = DEMO_USERS[role]
  if (demoUser) {
    setUser(demoUser)
  }
}

// Logout
export function logout() {
  userState.currentUser = null
  userState.isAuthenticated = false
  localStorage.removeItem('moveo_current_user')
}

// Actualizar preferencias del usuario
export function updateUserPreferences(preferences) {
  if (userState.currentUser) {
    userState.currentUser.preferences = {
      ...userState.currentUser.preferences,
      ...preferences
    }
    localStorage.setItem('moveo_current_user', JSON.stringify(userState.currentUser))
  }
}

// Actualizar información del perfil
export function updateUserProfile(updates) {
  if (userState.currentUser) {
    userState.currentUser = {
      ...userState.currentUser,
      ...updates
    }
    localStorage.setItem('moveo_current_user', JSON.stringify(userState.currentUser))
  }
}

// Hook para usar el store
export function useUserStore() {
  return {
    state: userState,
    currentUser,
    isAuthenticated,
    userRole,
    userName,
    userInitials,
    setUser,
    switchToDemoUser,
    logout,
    updateUserPreferences,
    updateUserProfile,
    DEMO_USERS
  }
}

// Inicializar al cargar
initializeUser()
