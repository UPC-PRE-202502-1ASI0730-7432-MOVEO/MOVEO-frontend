<template>
  <div class="notification-panel-wrapper">
    <Button
      icon="pi pi-bell"
      class="notification-bell-button"
      :class="{ 'bell-active': panel?.visible }"
      text
      rounded
      @click="togglePanel"
      :badge="unreadCount > 0 ? String(unreadCount) : null"
      badgeSeverity="danger"
      v-tooltip.bottom="$t('notification.notifications')"
    />
    
    <OverlayPanel ref="panel" :style="{ width: '400px', maxWidth: '90vw' }">
      <div class="notification-panel">
        <div class="notification-header">
          <h3>{{ $t('notification.notifications') }}</h3>
          <div class="notification-header-actions">
            <Button
              v-if="unreadCount > 0"
              :label="$t('notification.markAllAsRead')"
              size="small"
              text
              @click="markAllAsRead"
            />
          </div>
        </div>
        
        <div v-if="loading" class="notification-loading">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
        
        <div v-else-if="error" class="notification-error">
          <Message severity="error" :closable="false">
            {{ $t('notification.loadError') }}
          </Message>
        </div>
        
        <div v-else-if="notifications.length === 0" class="notification-empty">
          <i class="pi pi-bell-slash" style="font-size: 3rem; color: var(--text-color-secondary); margin-bottom: 1rem;"></i>
          <p style="font-size: 1rem; color: var(--text-color-secondary); margin: 0;">{{ $t('notification.noNotifications') }}</p>
          <p style="font-size: 0.875rem; color: var(--text-color-secondary); margin-top: 0.5rem;">{{ $t('notification.noNotificationsDesc') }}</p>
        </div>
        
        <div v-else class="notification-list">
          <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @action="handleAction"
            @read="handleRead"
            @delete="handleDelete"
          />
        </div>
        
        <div v-if="notifications.length > 0" class="notification-footer">
          <Button
            :label="$t('notification.viewAll')"
            text
            @click="viewAllNotifications"
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import NotificationItem from './notification-item.vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const userStore = useUserStore()
const panel = ref()

// The store already exposes computed refs. Use them directly so we don't wrap
// a computed inside another computed (which caused `notifications.value` to
// be a ComputedRef object instead of an array).
const notifications = notificationStore.recentNotifications
const unreadCount = notificationStore.unreadCount
const loading = notificationStore.loading
const error = notificationStore.error

const togglePanel = async (event) => {
  panel.value.toggle(event)
  
  // Cargar notificaciones al abrir el panel
  if (panel.value.visible) {
    await loadNotifications()
  }
}

const loadNotifications = async () => {
  // Obtener userId del user store - necesitamos el .value porque es un computed
  const currentUser = userStore.currentUser.value
  console.log('🔔 Usuario actual:', currentUser)
  if (currentUser && currentUser.id) {
    console.log('🔔 Cargando notificaciones para usuario ID:', currentUser.id)
    await notificationStore.fetchNotifications(currentUser.id)
    console.log('🔔 Notificaciones cargadas:', notifications.value.length)
  } else {
    console.error('❌ No hay usuario autenticado o falta el ID')
    console.error('currentUser:', currentUser)
  }
}

const markAllAsRead = async () => {
  const currentUser = userStore.currentUser.value
  if (currentUser && currentUser.id) {
    await notificationStore.markAllAsRead(currentUser.id)
  }
}

const handleAction = (notification) => {
  panel.value.hide()
}

const handleRead = () => {
  // La notificación ya fue marcada como leída
}

const handleDelete = () => {
  // La notificación ya fue eliminada
}

const viewAllNotifications = () => {
  router.push('/notifications')
  panel.value.hide()
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-panel-wrapper {
  position: relative;
}

.notification-panel {
  display: flex;
  flex-direction: column;
  max-height: 600px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.notification-header-actions {
  display: flex;
  gap: 0.5rem;
}

.notification-loading,
.notification-error,
.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.notification-empty p {
  margin-top: 1rem;
  color: var(--text-color-secondary);
}

.notification-list {
  overflow-y: auto;
  max-height: 450px;
}

.notification-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--surface-border);
  text-align: center;
}

/* Notification Bell Button Styles */
.notification-bell-button {
  color: white !important;
  background: transparent !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.notification-bell-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
}

.notification-bell-button.bell-active {
  background: white !important;
  color: #000 !important;
  border-color: white !important;
}

.notification-bell-button.bell-active :deep(.pi-bell) {
  color: #FF6F00 !important;
}

</style>
