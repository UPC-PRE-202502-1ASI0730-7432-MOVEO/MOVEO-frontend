<template>
  <article 
    class="vehicle-item" 
    :class="{ selected }"
    @click="$emit('select', vehicle.id)"
  >
    <div class="vehicle-image">
      <img 
        v-if="vehicle.primaryPhoto" 
        :src="`/images/vehicles/${vehicle.primaryPhoto}`" 
        :alt="vehicle.fullName"
        @error="onImageError"
      />
      <div v-else class="no-image">
        <span>📷</span>
      </div>
      <span class="badge" :class="vehicle.isAvailable ? 'available' : 'unavailable'">
        {{ vehicle.isAvailable ? 'Disponible' : 'No disponible' }}
      </span>
    </div>
    
    <div class="vehicle-info">
      <h3 class="vehicle-title">{{ vehicle.fullName }}</h3>
      <p class="vehicle-year">{{ vehicle.year }}</p>
      <div class="vehicle-specs">
        <span class="spec">🚗 {{ vehicle.transmission }}</span>
        <span class="spec">⛽ {{ vehicle.fuelType }}</span>
        <span class="spec">👥 {{ vehicle.seats }} asientos</span>
      </div>
      <div class="vehicle-price">
        <span class="price-amount">S/ {{ vehicle.dailyPrice }}</span>
        <span class="price-label">/día</span>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])

const onImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('error')
}
</script>

<style scoped>
.vehicle-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.vehicle-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.vehicle-item.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.vehicle-image {
  position: relative;
  width: 100%;
  height: 180px;
  background: #f3f4f6;
  overflow: hidden;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.vehicle-image.error .no-image {
  display: flex;
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.badge.available {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.badge.unavailable {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.vehicle-info {
  padding: 1rem;
}

.vehicle-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.vehicle-year {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.vehicle-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.spec {
  font-size: 0.75rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.vehicle-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.price-label {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
