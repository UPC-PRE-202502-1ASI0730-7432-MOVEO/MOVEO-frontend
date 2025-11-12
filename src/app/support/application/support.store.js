import { ref, computed } from 'vue'
import { SupportApi } from '@/app/support/infrastructure/support-api.js'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'

// Module-level singleton state
const tickets = ref([])
const currentTicket = ref(null)
const loading = ref(false)
const error = ref(null)

const openTickets = computed(() => {
  return (tickets.value || []).filter(t => t.isOpen)
})

const closedTickets = computed(() => {
  return (tickets.value || []).filter(t => t.isClosed)
})

const damageTickets = computed(() => {
  return (tickets.value || []).filter(t => t.type === 'damage')
})

const stats = computed(() => {
  const list = tickets.value || []
  return {
    total: list.length,
    open: openTickets.value.length,
    closed: closedTickets.value.length,
    damage: damageTickets.value.length
  }
})

/**
 * Store para gestionar tickets de soporte
 */
export function useSupportStore() {
  const notificationStore = useNotificationStore()

  async function fetchTickets(userId) {
    if (!userId) return
    loading.value = true
    error.value = null
    try {
      const result = await SupportApi.listTickets(userId)
      tickets.value = Array.isArray(result) ? result : []
    } catch (err) {
      console.error('Error fetching tickets:', err)
      error.value = err?.message || String(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTicket(ticketId) {
    loading.value = true
    error.value = null
    try {
      const result = await SupportApi.getTicket(ticketId)
      currentTicket.value = result || null
      return currentTicket.value
    } catch (err) {
      console.error('Error fetching ticket:', err)
      error.value = err?.message || String(err)
      currentTicket.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTicket(ticketData) {
    try {
      const created = await SupportApi.createTicket(ticketData)
      // Add to local state
      tickets.value = [created, ...tickets.value]
      
      // Si es un ticket de daño, crear notificación para el owner
      if (created.type === 'damage' && created.vehicleId) {
        // Buscar el owner del vehículo (necesitarías una API para esto)
        // Por ahora asumimos que el ticketData incluye ownerId
        if (ticketData.ownerId) {
          await notificationStore.createDamageNotification(ticketData.ownerId, created)
        }
      }
      
      return created
    } catch (err) {
      console.error('Error creating ticket:', err)
      throw err
    }
  }

  async function updateTicket(ticketId, updates) {
    try {
      const updated = await SupportApi.updateTicket(ticketId, updates)
      // Update local state
      const index = tickets.value.findIndex(t => t.id === ticketId)
      if (index !== -1) {
        tickets.value[index] = updated
      }
      if (currentTicket.value?.id === ticketId) {
        currentTicket.value = updated
      }
      return updated
    } catch (err) {
      console.error('Error updating ticket:', err)
      throw err
    }
  }

  async function closeTicket(ticketId, resolutionNotes = '') {
    try {
      const closed = await SupportApi.closeTicket(ticketId, resolutionNotes)
      // Update local state
      const index = tickets.value.findIndex(t => t.id === ticketId)
      if (index !== -1) {
        tickets.value[index] = closed
      }
      if (currentTicket.value?.id === ticketId) {
        currentTicket.value = closed
      }
      return closed
    } catch (err) {
      console.error('Error closing ticket:', err)
      throw err
    }
  }

  async function fetchOpenTickets(userId) {
    if (!userId) return
    try {
      const result = await SupportApi.getOpenTickets(userId)
      return Array.isArray(result) ? result : []
    } catch (err) {
      console.error('Error fetching open tickets:', err)
      throw err
    }
  }

  async function fetchDamageTickets(userId) {
    if (!userId) return
    try {
      const result = await SupportApi.getDamageTickets(userId)
      return Array.isArray(result) ? result : []
    } catch (err) {
      console.error('Error fetching damage tickets:', err)
      throw err
    }
  }

  /**
   * Helper para reportar daño y crear notificaciones
   */
  async function reportDamage(damageData) {
    try {
      // Crear ticket de daño
      const ticket = await createTicket({
        ...damageData,
        type: 'damage',
        priority: 'high'
      })

      // Si hay un costo estimado, crear notificación de pago para el renter
      if (ticket.estimatedCost > 0 && damageData.renterId) {
        await notificationStore.createPaymentRequiredNotification(
          damageData.renterId,
          ticket
        )
      }

      return ticket
    } catch (err) {
      console.error('Error reporting damage:', err)
      throw err
    }
  }

  function getTicketById(id) {
    return tickets.value.find(t => t.id === id) || null
  }

  return {
    // State
    tickets,
    currentTicket,
    loading,
    error,
    // Computed
    openTickets,
    closedTickets,
    damageTickets,
    stats,
    // Actions
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicket,
    closeTicket,
    fetchOpenTickets,
    fetchDamageTickets,
    reportDamage,
    getTicketById
  }
}
