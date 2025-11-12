<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('support.createTicket')"
    :style="{ width: '600px' }"
    @update:visible="updateVisible"
  >
    <div class="ticket-form">
      <div class="form-group">
        <label for="type">{{ $t('support.ticketType') }} *</label>
        <Dropdown
          id="type"
          v-model="formData.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('support.selectType')"
          :class="{ 'p-invalid': submitted && !formData.type }"
        />
        <small v-if="submitted && !formData.type" class="p-error">
          {{ $t('support.typeRequired') }}
        </small>
      </div>

      <div v-if="formData.type === 'damage'" class="form-group">
        <label for="vehicle">{{ $t('support.vehicle') }} *</label>
        <Dropdown
          id="vehicle"
          v-model="formData.vehicleId"
          :options="vehicleOptions"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('support.selectVehicle')"
          :class="{ 'p-invalid': submitted && formData.type === 'damage' && !formData.vehicleId }"
        />
        <small v-if="submitted && formData.type === 'damage' && !formData.vehicleId" class="p-error">
          {{ $t('support.vehicleRequired') }}
        </small>
      </div>

      <div class="form-group">
        <label for="priority">{{ $t('support.priorityLabel') }} *</label>
        <Dropdown
          id="priority"
          v-model="formData.priority"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('support.selectPriority')"
          :class="{ 'p-invalid': submitted && !formData.priority }"
        />
        <small v-if="submitted && !formData.priority" class="p-error">
          {{ $t('support.priorityRequired') }}
        </small>
      </div>

      <div class="form-group">
        <label for="subject">{{ $t('support.subject') }} *</label>
        <InputText
          id="subject"
          v-model="formData.subject"
          :placeholder="$t('support.subjectPlaceholder')"
          :class="{ 'p-invalid': submitted && !formData.subject }"
        />
        <small v-if="submitted && !formData.subject" class="p-error">
          {{ $t('support.subjectRequired') }}
        </small>
      </div>

      <div class="form-group">
        <label for="description">{{ $t('support.description') }} *</label>
        <Textarea
          id="description"
          v-model="formData.description"
          :placeholder="$t('support.descriptionPlaceholder')"
          rows="5"
          :class="{ 'p-invalid': submitted && !formData.description }"
        />
        <small v-if="submitted && !formData.description" class="p-error">
          {{ $t('support.descriptionRequired') }}
        </small>
      </div>

      <div v-if="formData.type === 'damage'" class="form-group">
        <label for="estimatedCost">{{ $t('support.estimatedCost') }}</label>
        <InputNumber
          id="estimatedCost"
          v-model="formData.estimatedCost"
          mode="currency"
          currency="PEN"
          locale="es-PE"
          :placeholder="$t('support.estimatedCostPlaceholder')"
        />
      </div>

      <div class="form-group">
        <label for="attachments">{{ $t('support.attachments') }}</label>
        <FileUpload
          mode="basic"
          name="attachments[]"
          accept="image/*"
          :maxFileSize="5000000"
          :multiple="true"
          :auto="false"
          chooseLabel="Seleccionar archivos"
          @select="onFileSelect"
        />
        <small class="p-help">{{ $t('support.attachmentsHelp') }}</small>
        
        <div v-if="formData.attachments.length > 0" class="attachments-list">
          <div v-for="(file, index) in formData.attachments" :key="index" class="attachment-item">
            <span>{{ file }}</span>
            <Button
              icon="pi pi-times"
              text
              rounded
              severity="danger"
              size="small"
              @click="removeAttachment(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('common.cancel')"
        severity="secondary"
        @click="closeDialog"
      />
      <Button
        :label="$t('support.submitTicket')"
        :loading="loading"
        @click="submitTicket"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import FileUpload from 'primevue/fileupload'
import { useSupportStore } from '@/app/support/application/support.store.js'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'created'])

const { t } = useI18n()
const toast = useToast()
const supportStore = useSupportStore()

const submitted = ref(false)
const loading = ref(false)

const formData = ref({
  type: null,
  vehicleId: null,
  priority: 'medium',
  subject: '',
  description: '',
  estimatedCost: 0,
  attachments: []
})

const typeOptions = [
  { label: t('support.type.damage'), value: 'damage' },
  { label: t('support.type.complaint'), value: 'complaint' },
  { label: t('support.type.question'), value: 'question' },
  { label: t('support.type.technical'), value: 'technical' },
  { label: t('support.type.other'), value: 'other' }
]

const priorityOptions = [
  { label: t('support.priority.low'), value: 'low' },
  { label: t('support.priority.medium'), value: 'medium' },
  { label: t('support.priority.high'), value: 'high' },
  { label: t('support.priority.urgent'), value: 'urgent' }
]

// Mock vehicle options - en producción estos vendrían de un store de vehículos
const vehicleOptions = ref([
  { id: 1, name: 'Toyota Corolla 2023' },
  { id: 2, name: 'Mazda 3 2023' },
  { id: 3, name: 'Honda Civic 2024' }
])

const updateVisible = (value) => {
  emit('update:visible', value)
}

const closeDialog = () => {
  resetForm()
  updateVisible(false)
}

const resetForm = () => {
  formData.value = {
    type: null,
    vehicleId: null,
    priority: 'medium',
    subject: '',
    description: '',
    estimatedCost: 0,
    attachments: []
  }
  submitted.value = false
}

const onFileSelect = (event) => {
  // Simulamos URLs de archivos subidos
  const files = event.files
  files.forEach(file => {
    formData.value.attachments.push(`https://example.com/uploads/${file.name}`)
  })
}

const removeAttachment = (index) => {
  formData.value.attachments.splice(index, 1)
}

const validateForm = () => {
  if (!formData.value.type) return false
  if (!formData.value.priority) return false
  if (!formData.value.subject) return false
  if (!formData.value.description) return false
  if (formData.value.type === 'damage' && !formData.value.vehicleId) return false
  
  return true
}

const submitTicket = async () => {
  submitted.value = true

  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.fillRequiredFields'),
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const userStr = localStorage.getItem('user')
    const user = JSON.parse(userStr)
    
    const ticketData = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      type: formData.value.type,
      subject: formData.value.subject,
      description: formData.value.description,
      priority: formData.value.priority,
      attachments: formData.value.attachments
    }

    if (formData.value.vehicleId) {
      ticketData.vehicleId = formData.value.vehicleId
      const vehicle = vehicleOptions.value.find(v => v.id === formData.value.vehicleId)
      ticketData.vehicleName = vehicle?.name
    }

    if (formData.value.estimatedCost) {
      ticketData.estimatedCost = formData.value.estimatedCost
    }

    // Si es un reporte de daño, usar reportDamage en lugar de createTicket
    if (formData.value.type === 'damage') {
      await supportStore.reportDamage({
        ...ticketData,
        renterId: user.role === 'renter' ? user.id : null,
        ownerId: user.role === 'owner' ? user.id : null,
        rentalId: null // En producción, esto vendría del contexto del alquiler
      })
    } else {
      await supportStore.createTicket(ticketData)
    }

    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('support.ticketCreatedSuccess'),
      life: 3000
    })

    emit('created')
    closeDialog()
  } catch (error) {
    console.error('Error creating ticket:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.ticketCreatedError'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Resetear campos específicos cuando cambia el tipo
watch(() => formData.value.type, (newType) => {
  if (newType !== 'damage') {
    formData.value.vehicleId = null
    formData.value.estimatedCost = 0
  }
})
</script>

<style scoped>
.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--surface-50);
  border-radius: 4px;
  font-size: 0.875rem;
}

.p-help {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}
</style>
