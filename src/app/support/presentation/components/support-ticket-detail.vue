<template>
  <div class="ticket-detail-page">
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <Message v-else-if="error" severity="error">
      {{ error }}
    </Message>

    <div v-else-if="ticket" class="ticket-detail">
      <!-- Header -->
      <div class="ticket-header">
        <Button
          icon="pi pi-arrow-left"
          text
          @click="goBack"
          :label="$t('common.back')"
        />
        
        <div class="header-actions">
          <Tag :class="ticket.statusClass">
            {{ ticket.statusLabel }}
          </Tag>
          <Tag :severity="getPrioritySeverity(ticket.priority)">
            {{ ticket.priorityLabel }}
          </Tag>
        </div>
      </div>

      <!-- Main Info -->
      <Card class="ticket-main-card">
        <template #content>
          <div class="ticket-type-badge">
            <i :class="['pi', ticket.typeIcon]"></i>
            <span>{{ ticket.typeLabel }}</span>
          </div>
          
          <h1 class="ticket-title">{{ ticket.subject }}</h1>
          
          <div class="ticket-meta-info">
            <div class="meta-item">
              <i class="pi pi-user"></i>
              <span>{{ ticket.userName }} ({{ ticket.userRole === 'owner' ? $t('user.owner') : $t('user.renter') }})</span>
            </div>
            <div v-if="ticket.vehicleName" class="meta-item">
              <i class="pi pi-car"></i>
              <span>{{ ticket.vehicleName }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-calendar"></i>
              <span>{{ ticket.formattedDate }}</span>
            </div>
          </div>

          <Divider />

          <div class="ticket-description">
            <h3>{{ $t('support.description') }}</h3>
            <p>{{ ticket.description }}</p>
          </div>

          <Divider v-if="ticket.estimatedCost" />

          <div v-if="ticket.estimatedCost" class="ticket-cost-section">
            <div class="cost-label">
              <i class="pi pi-dollar"></i>
              <span>{{ $t('support.estimatedCost') }}</span>
            </div>
            <div class="cost-value">{{ ticket.formattedCost }}</div>
          </div>

          <Divider v-if="ticket.attachments && ticket.attachments.length > 0" />

          <div v-if="ticket.attachments && ticket.attachments.length > 0" class="ticket-attachments">
            <h3>{{ $t('support.attachments') }}</h3>
            <div class="attachments-grid">
              <Image
                v-for="(attachment, index) in ticket.attachments"
                :key="index"
                :src="attachment"
                :alt="`Attachment ${index + 1}`"
                width="150"
                preview
              />
            </div>
          </div>

          <Divider v-if="ticket.resolutionNotes" />

          <div v-if="ticket.resolutionNotes" class="ticket-resolution">
            <h3>{{ $t('support.resolutionNotes') }}</h3>
            <p>{{ ticket.resolutionNotes }}</p>
            <div v-if="ticket.resolvedAt" class="resolved-date">
              <i class="pi pi-check-circle"></i>
              <span>{{ $t('support.resolvedAt') }}: {{ new Date(ticket.resolvedAt).toLocaleString() }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Actions Card -->
      <Card v-if="ticket.isOpen" class="actions-card">
        <template #content>
          <h3>{{ $t('support.actions') }}</h3>
          
          <div class="actions-buttons">
            <Button
              v-if="ticket.requiresPayment"
              :label="$t('support.proceedToPayment')"
              icon="pi pi-credit-card"
              severity="danger"
              @click="proceedToPayment"
            />
            
            <Button
              v-if="canCloseTicket"
              :label="$t('support.closeTicket')"
              icon="pi pi-check"
              severity="success"
              outlined
              @click="showCloseDialog = true"
            />
            
            <Button
              :label="$t('support.updateTicket')"
              icon="pi pi-pencil"
              outlined
              @click="showUpdateDialog = true"
            />
          </div>
        </template>
      </Card>

      <!-- Close Ticket Dialog -->
      <Dialog
        v-model:visible="showCloseDialog"
        :header="$t('support.closeTicket')"
        modal
        :style="{ width: '500px' }"
      >
        <div class="close-dialog-content">
          <p>{{ $t('support.closeTicketConfirm') }}</p>
          <Textarea
            v-model="resolutionNotes"
            :placeholder="$t('support.resolutionNotesPlaceholder')"
            rows="5"
          />
        </div>
        
        <template #footer>
          <Button
            :label="$t('common.cancel')"
            severity="secondary"
            @click="showCloseDialog = false"
          />
          <Button
            :label="$t('support.closeTicket')"
            severity="success"
            :loading="updating"
            @click="closeTicket"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Image from 'primevue/image'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useSupportStore } from '@/app/support/application/support.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const supportStore = useSupportStore()

const showCloseDialog = ref(false)
const showUpdateDialog = ref(false)
const resolutionNotes = ref('')
const updating = ref(false)

const ticket = computed(() => supportStore.currentTicket)
const loading = computed(() => supportStore.loading)
const error = computed(() => supportStore.error)

const userStore = useUserStore()
const canCloseTicket = computed(() => {
  // Solo el dueño del ticket o un administrador puede cerrarlo
  const currentUser = userStore.currentUser.value
  if (!currentUser || !ticket.value) return false
  return Number(ticket.value.userId) === Number(currentUser.id) || currentUser.role === 'admin'
})

const getPrioritySeverity = (priority) => {
  const severityMap = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger'
  }
  return severityMap[priority] || 'info'
}

const goBack = () => {
  router.push('/support/tickets')
}

const proceedToPayment = () => {
  router.push(`/payments/damage/${ticket.value.id}`)
}

const closeTicket = async () => {
  updating.value = true
  
  try {
    await supportStore.closeTicket(ticket.value.id, resolutionNotes.value)
    
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('support.ticketClosedSuccess'),
      life: 3000
    })
    
    showCloseDialog.value = false
    resolutionNotes.value = ''
  } catch (error) {
    console.error('Error closing ticket:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.ticketClosedError'),
      life: 3000
    })
  } finally {
    updating.value = false
  }
}

const loadTicket = async () => {
  const ticketId = route.params.id
  await supportStore.fetchTicket(ticketId)
}

onMounted(() => {
  loadTicket()
})
</script>

<style scoped>
.ticket-detail-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.ticket-main-card {
  margin-bottom: 2rem;
}

.ticket-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--surface-100);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.ticket-title {
  margin: 0 0 1.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
}

.ticket-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: var(--text-color-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  color: var(--primary-color);
}

.ticket-description h3,
.ticket-attachments h3,
.ticket-resolution h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.ticket-description p,
.ticket-resolution p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color-secondary);
}

.ticket-cost-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--red-50) 0%, var(--orange-50) 100%);
  border-radius: 8px;
}

.cost-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.cost-label i {
  font-size: 1.5rem;
  color: var(--red-500);
}

.cost-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--red-600);
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.resolved-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--green-50);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--green-700);
}

.resolved-date i {
  color: var(--green-600);
}

.actions-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.actions-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.close-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.close-dialog-content p {
  margin: 0;
  color: var(--text-color-secondary);
}
</style>
