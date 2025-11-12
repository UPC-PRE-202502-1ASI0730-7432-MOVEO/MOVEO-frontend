<template>
  <div 
    :class="['notification-item', { 'unread': notification.isUnread }]"
    @click="handleClick"
  >
    <div class="notification-icon">
      <i :class="['pi', notification.typeIcon, notification.typeClass]"></i>
    </div>
    
    <div class="notification-content">
      <h4 class="notification-title">{{ notification.title }}</h4>
      <p class="notification-message">{{ notification.message }}</p>
      <span class="notification-date">{{ notification.formattedDate }}</span>
    </div>
    
    <div class="notification-actions">
      <Button
        v-if="notification.hasAction"
        :label="notification.actionLabel || $t('notification.view')"
        icon="pi pi-arrow-right"
        size="small"
        text
        @click.stop="handleAction"
      />
      <Button
        v-if="notification.isUnread"
        icon="pi pi-check"
        size="small"
        text
        rounded
        severity="secondary"
        @click.stop="markAsRead"
        v-tooltip.top="$t('notification.markAsRead')"
      />
      <Button
        icon="pi pi-times"
        size="small"
        text
        rounded
        severity="danger"
        @click.stop="deleteNotification"
        v-tooltip.top="$t('notification.delete')"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['action', 'read', 'delete'])

const router = useRouter()
const notificationStore = useNotificationStore()

const handleClick = () => {
  if (props.notification.isUnread) {
    markAsRead()
  }
}

const handleAction = () => {
  if (props.notification.actionUrl) {
    router.push(props.notification.actionUrl)
  }
  emit('action', props.notification)
}

const markAsRead = async () => {
  try {
    await notificationStore.markAsRead(props.notification.id)
    emit('read', props.notification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const deleteNotification = async () => {
  try {
    await notificationStore.deleteNotification(props.notification.id)
    emit('delete', props.notification)
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}
</script>

<style scoped>
.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  transition: background-color 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: var(--surface-hover);
}

.notification-item.unread {
  background-color: var(--primary-50);
}

.notification-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--surface-100);
}

.notification-icon i {
  font-size: 1.25rem;
}

.notification-icon .notification-info {
  color: var(--blue-500);
}

.notification-icon .notification-warning {
  color: var(--orange-500);
}

.notification-icon .notification-success {
  color: var(--green-500);
}

.notification-icon .notification-error {
  color: var(--red-500);
}

.notification-icon .notification-damage_report {
  color: var(--orange-600);
}

.notification-icon .notification-payment_required {
  color: var(--red-600);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
}

.notification-message {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-date {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.notification-actions {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
</style>
