<template>
  <div class="notification-panel-wrapper">
    <Button
      icon="pi pi-bell"
      severity="secondary"
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
          <i class="pi pi-bell" style="font-size: 3rem; color: var(--text-color-secondary)"></i>
          <p>{{ $t('notification.noNotifications') }}</p>
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
import NotificationItem from './notification-item.vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const panel = ref()

const notifications = computed(() => notificationStore.recentNotifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const loading = computed(() => notificationStore.loading)
const error = computed(() => notificationStore.error)

const togglePanel = async (event) => {
  panel.value.toggle(event)
  
  // Cargar notificaciones al abrir el panel
  if (panel.value.visible) {
    await loadNotifications()
  }
}

const loadNotifications = async () => {
  // Obtener userId del localStorage o store de autenticación
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    await notificationStore.fetchNotifications(user.id)
  }
}

const markAllAsRead = async () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    await notificationStore.markAllAsRead(user.id)
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
</style>
