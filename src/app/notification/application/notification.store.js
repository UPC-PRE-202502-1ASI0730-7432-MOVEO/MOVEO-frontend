import { reactive, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:5332'

const state = reactive({
  notifications: [],
  loading: false,
  error: null
})

export const useNotificationStore = () => {
  // Cargar notificaciones del usuario
  const fetchNotifications = async (userId) => {
    state.loading = true
    state.error = null
    
    try {
      // Obtener TODAS las notificaciones del db.json
      const response = await axios.get(`${API_BASE}/notifications`)
      
      // Filtrar solo las notificaciones del usuario actual
      const userNotifications = response.data.filter(n => n.userId === userId)
      
      // Ordenar por fecha (más recientes primero)
      state.notifications = userNotifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      
      console.log('📬 Notificaciones cargadas:', state.notifications.length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      state.error = 'Error al cargar notificaciones'
      state.notifications = []
    } finally {
      state.loading = false
    }
  }

  // Marcar notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_BASE}/notifications/${notificationId}`, {
        read: true,
        readAt: new Date().toISOString()
      })
      
      // Actualizar estado local
      const notif = state.notifications.find(n => n.id === notificationId)
      if (notif) {
        notif.read = true
        notif.readAt = new Date().toISOString()
      }
      
      console.log('✅ Notificación marcada como leída')
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como leídas
  const markAllAsRead = async (userId) => {
    try {
      const unread = state.notifications.filter(n => !n.read)
      
      // Marcar cada una como leída
      for (const notif of unread) {
        await axios.patch(`${API_BASE}/notifications/${notif.id}`, {
          read: true,
          readAt: new Date().toISOString()
        })
        notif.read = true
        notif.readAt = new Date().toISOString()
      }
      
      console.log('✅ Todas las notificaciones marcadas como leídas')
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE}/notifications/${notificationId}`)
      
      // Remover del estado local
      state.notifications = state.notifications.filter(n => n.id !== notificationId)
      
      console.log('✅ Notificación eliminada')
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Computed: Notificaciones no leídas
  const unreadNotifications = computed(() => {
    return state.notifications.filter(n => !n.read)
  })

  // Computed: Conteo de no leídas
  const unreadCount = computed(() => {
    return unreadNotifications.value.length
  })

  // Computed: Notificaciones recientes (últimas 5)
  const recentNotifications = computed(() => {
    return state.notifications.slice(0, 5)
  })

  return {
    state,
    notifications: computed(() => state.notifications),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    unreadNotifications,
    unreadCount,
    recentNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
