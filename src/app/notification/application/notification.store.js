import { ref, computed } from 'vue'
import { NotificationApi } from '@/app/notification/infrastructure/notification-api.js'

// Module-level singleton state
const notifications = ref([])
const unreadCount = ref(0)
const loading = ref(false)
const error = ref(null)

const unreadNotifications = computed(() => {
  return (notifications.value || []).filter(n => !n.read)
})

const recentNotifications = computed(() => {
  return (notifications.value || []).slice(0, 5)
})

/**
 * Store para gestionar notificaciones del usuario
 */
export function useNotificationStore() {
  
  async function fetchNotifications(userId) {
    if (!userId) return
    loading.value = true
    error.value = null
    try {
      const result = await NotificationApi.listNotifications(userId)
      notifications.value = Array.isArray(result) ? result : []
      updateUnreadCount()
    } catch (err) {
      console.error('Error fetching notifications:', err)
      error.value = err?.message || String(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadNotifications(userId) {
    if (!userId) return
    try {
      const result = await NotificationApi.getUnreadNotifications(userId)
      const unread = Array.isArray(result) ? result : []
      unreadCount.value = unread.length
      return unread
    } catch (err) {
      console.error('Error fetching unread notifications:', err)
      throw err
    }
  }

  async function markAsRead(notificationId) {
    try {
      const updated = await NotificationApi.markAsRead(notificationId)
      // Update local state
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value[index] = updated
      }
      updateUnreadCount()
      return updated
    } catch (err) {
      console.error('Error marking notification as read:', err)
      throw err
    }
  }

  async function markAllAsRead(userId) {
    if (!userId) return
    try {
      await NotificationApi.markAllAsRead(userId)
      // Update all local notifications to read
      notifications.value = notifications.value.map(n => ({
        ...n,
        read: true,
        readAt: new Date().toISOString()
      }))
      unreadCount.value = 0
    } catch (err) {
      console.error('Error marking all as read:', err)
      throw err
    }
  }

  async function deleteNotification(notificationId) {
    try {
      await NotificationApi.deleteNotification(notificationId)
      // Remove from local state
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
      updateUnreadCount()
    } catch (err) {
      console.error('Error deleting notification:', err)
      throw err
    }
  }

  async function createNotification(notificationData) {
    try {
      const created = await NotificationApi.createNotification(notificationData)
      // Add to local state
      notifications.value = [created, ...notifications.value]
      updateUnreadCount()
      return created
    } catch (err) {
      console.error('Error creating notification:', err)
      throw err
    }
  }

  function updateUnreadCount() {
    unreadCount.value = (notifications.value || []).filter(n => !n.read).length
  }

  function getNotificationById(id) {
    return notifications.value.find(n => n.id === id) || null
  }

  /**
   * Helper para crear notificación de daño reportado
   */
  async function createDamageNotification(userId, ticketData) {
    return await createNotification({
      userId,
      type: 'damage_report',
      title: 'Reporte de Daño Recibido',
      message: `Se ha reportado un daño en tu vehículo: ${ticketData.subject}`,
      relatedId: ticketData.id,
      relatedType: 'ticket',
      actionUrl: `/support/tickets/${ticketData.id}`,
      actionLabel: 'Ver Ticket',
      metadata: {
        ticketId: ticketData.id,
        vehicleId: ticketData.vehicleId,
        estimatedCost: ticketData.estimatedCost
      }
    })
  }

  /**
   * Helper para crear notificación de pago requerido
   */
  async function createPaymentRequiredNotification(userId, ticketData) {
    return await createNotification({
      userId,
      type: 'payment_required',
      title: 'Pago de Daño Requerido',
      message: `Debes pagar ${ticketData.formattedCost} por el daño reportado en el vehículo.`,
      relatedId: ticketData.id,
      relatedType: 'ticket',
      actionUrl: `/payments/damage/${ticketData.id}`,
      actionLabel: 'Realizar Pago',
      metadata: {
        ticketId: ticketData.id,
        vehicleId: ticketData.vehicleId,
        amount: ticketData.estimatedCost
      }
    })
  }

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    // Computed
    unreadNotifications,
    recentNotifications,
    // Actions
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    getNotificationById,
    // Helpers
    createDamageNotification,
    createPaymentRequiredNotification
  }
}
