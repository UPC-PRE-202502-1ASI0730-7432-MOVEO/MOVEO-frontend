<template>
  <div class="profile-page">
    <div class="container">
      <!-- Header del perfil -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
          <button class="avatar-edit-btn" title="Cambiar foto">
            📷
          </button>
        </div>
        
        <div class="profile-info">
          <h1 class="profile-name">{{ userName }}</h1>
          <p class="profile-email">{{ currentUser?.email }}</p>
          <div class="profile-badges">
            <span class="badge" :class="currentUser?.role">
              {{ currentUser?.role === 'renter' ? '👤 Cliente' : '🚗 Propietario' }}
            </span>
            <span v-if="currentUser?.isVerified" class="badge verified">
              ✓ Verificado
            </span>
          </div>
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">{{ currentUser?.reputationScore }}</span>
              <span class="stat-label">Calificación</span>
            </div>
            <div class="stat">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ currentUser?.totalReviews }}</span>
              <span class="stat-label">Reseñas</span>
            </div>
            <div class="stat">
              <span class="stat-icon">📅</span>
              <span class="stat-value">{{ joinedDate }}</span>
              <span class="stat-label">Miembro desde</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="profile-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Contenido de tabs -->
      <div class="tab-content">
        <!-- Tab: Información Personal -->
        <div v-if="activeTab === 'personal'" class="tab-panel">
          <div class="info-grid">
            <div class="info-card">
              <h3 class="card-title">📋 Información Personal</h3>
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Nombre completo:</span>
                  <span class="info-value">{{ userName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Correo electrónico:</span>
                  <span class="info-value">{{ currentUser?.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ currentUser?.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">DNI:</span>
                  <span class="info-value">{{ currentUser?.dni }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Licencia de conducir:</span>
                  <span class="info-value">{{ currentUser?.licenseNumber }}</span>
                </div>
              </div>
              <button class="btn btn-secondary">
                <span class="icon">✏️</span>
                Editar información
              </button>
            </div>

            <div class="info-card">
              <h3 class="card-title">🔐 Verificación</h3>
              <div class="verification-status">
                <div class="verification-item" :class="{ verified: currentUser?.isVerified }">
                  <span class="verification-icon">{{ currentUser?.isVerified ? '✅' : '⏳' }}</span>
                  <div class="verification-info">
                    <p class="verification-title">Identidad verificada</p>
                    <p class="verification-desc">
                      {{ currentUser?.isVerified ? 'Tu identidad ha sido verificada' : 'Verifica tu identidad para mayor confianza' }}
                    </p>
                  </div>
                </div>
                <div class="verification-item verified">
                  <span class="verification-icon">✅</span>
                  <div class="verification-info">
                    <p class="verification-title">Email verificado</p>
                    <p class="verification-desc">{{ currentUser?.email }}</p>
                  </div>
                </div>
                <div class="verification-item verified">
                  <span class="verification-icon">✅</span>
                  <div class="verification-info">
                    <p class="verification-title">Teléfono verificado</p>
                    <p class="verification-desc">{{ currentUser?.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Estadísticas -->
        <div v-if="activeTab === 'stats'" class="tab-panel">
          <div class="info-grid">
            <div class="info-card">
              <h3 class="card-title">📊 Estadísticas Generales</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-card-icon">🚗</div>
                  <div class="stat-card-value">{{ profileStats.totalRentals || 0 }}</div>
                  <div class="stat-card-label">Total de Alquileres</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon">✅</div>
                  <div class="stat-card-value">{{ profileStats.completedRentals || 0 }}</div>
                  <div class="stat-card-label">Completados</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon">⏳</div>
                  <div class="stat-card-value">{{ profileStats.activeRentals || 0 }}</div>
                  <div class="stat-card-label">Activos</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon">⭐</div>
                  <div class="stat-card-value">{{ profileStats.averageRating?.toFixed(1) || '0.0' }}</div>
                  <div class="stat-card-label">Calificación</div>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="card-title">💰 Estadísticas Financieras</h3>
              <div class="financial-stats">
                <div class="financial-item">
                  <span class="financial-label">
                    {{ currentUser?.role === 'owner' ? 'Total Ganado' : 'Total Gastado' }}
                  </span>
                  <span class="financial-value">
                    S/. {{ (currentUser?.role === 'owner' ? profileStats.totalEarned : profileStats.totalSpent || 0).toFixed(2) }}
                  </span>
                </div>
                <div class="financial-item">
                  <span class="financial-label">Total de Transacciones</span>
                  <span class="financial-value">{{ profileStats.totalRentals || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="card-title">✅ Progreso de Verificación</h3>
              <div class="verification-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: verificationProgress + '%' }"></div>
                </div>
                <p class="progress-text">{{ verificationProgress }}% completado</p>
              </div>
              <div class="verification-checklist">
                <div class="checklist-item" :class="{ completed: profileData?.verified?.email }">
                  <i class="pi" :class="profileData?.verified?.email ? 'pi-check-circle' : 'pi-circle'"></i>
                  <span>Email verificado</span>
                </div>
                <div class="checklist-item" :class="{ completed: profileData?.verified?.phone }">
                  <i class="pi" :class="profileData?.verified?.phone ? 'pi-check-circle' : 'pi-circle'"></i>
                  <span>Teléfono verificado</span>
                </div>
                <div class="checklist-item" :class="{ completed: profileData?.verified?.dni }">
                  <i class="pi" :class="profileData?.verified?.dni ? 'pi-check-circle' : 'pi-circle'"></i>
                  <span>DNI verificado</span>
                </div>
                <div class="checklist-item" :class="{ completed: profileData?.verified?.license }">
                  <i class="pi" :class="profileData?.verified?.license ? 'pi-check-circle' : 'pi-circle'"></i>
                  <span>Licencia verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Preferencias -->
        <div v-if="activeTab === 'preferences'" class="tab-panel">
          <user-preferences />
        </div>

        <!-- Tab: Seguridad -->
        <div v-if="activeTab === 'security'" class="tab-panel">
          <div class="info-card">
            <h3 class="card-title">🔒 Seguridad de la cuenta</h3>
            <div class="security-options">
              <div class="security-option">
                <div class="security-option-info">
                  <p class="security-option-title">Cambiar contraseña</p>
                  <p class="security-option-desc">Actualiza tu contraseña periódicamente para mayor seguridad</p>
                </div>
                <button class="btn btn-secondary">Cambiar</button>
              </div>
              <div class="security-option">
                <div class="security-option-info">
                  <p class="security-option-title">Autenticación de dos factores</p>
                  <p class="security-option-desc">Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <button class="btn btn-secondary">Activar</button>
              </div>
              <div class="security-option">
                <div class="security-option-info">
                  <p class="security-option-title">Sesiones activas</p>
                  <p class="security-option-desc">Revisa y cierra sesiones en otros dispositivos</p>
                </div>
                <button class="btn btn-secondary">Ver sesiones</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Demo (solo desarrollo) -->
        <div v-if="activeTab === 'demo'" class="tab-panel">
          <div class="info-card demo-card">
            <h3 class="card-title">🧪 Modo Desarrollo - Cambiar Usuario</h3>
            <p class="demo-warning">
              ⚠️ Esta sección es solo para desarrollo y será removida cuando tengamos login real.
            </p>
            <div class="demo-users">
              <div 
                v-for="(user, key) in DEMO_USERS" 
                :key="key"
                class="demo-user-card"
                :class="{ active: currentUser?.id === user.id }"
                @click="switchUser(key)"
              >
                <div class="demo-user-avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                <div class="demo-user-info">
                  <p class="demo-user-name">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="demo-user-role">{{ user.role === 'renter' ? '👤 Cliente' : '🚗 Propietario' }}</p>
                  <p class="demo-user-email">{{ user.email }}</p>
                </div>
                <span v-if="currentUser?.id === user.id" class="demo-user-active">✓ Actual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useProfileStore } from '@/app/profile/application/profile.store.js'
import UserPreferences from '@/app/iam/components/user-preferences.vue'

const { currentUser, userName, userInitials, switchToDemoUser, DEMO_USERS } = useUserStore()
const profileStore = useProfileStore()

const activeTab = ref('personal')

const tabs = [
  { value: 'personal', label: 'Información Personal', icon: '👤' },
  { value: 'stats', label: 'Estadísticas', icon: '📊' },
  { value: 'preferences', label: 'Preferencias', icon: '⚙️' },
  { value: 'security', label: 'Seguridad', icon: '🔒' },
  { value: 'demo', label: 'Demo (DEV)', icon: '🧪' }
]

const joinedDate = computed(() => {
  if (!currentUser.value?.joinedAt) return ''
  const date = new Date(currentUser.value.joinedAt)
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
})

const profileData = computed(() => profileStore.profile)
const verificationProgress = computed(() => profileStore.verificationLevel)
const profileStats = computed(() => profileData.value?.stats || {})

function switchUser(role) {
  switchToDemoUser(role)
  window.location.reload() // Recargar para actualizar el toolbar
}

onMounted(async () => {
  if (currentUser.value?.id) {
    await profileStore.fetchProfile(currentUser.value.id)
  }
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 200px);
  background: var(--bg-base);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Profile Header */
.profile-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-secondary-2);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-moveo-orange);
  border: 3px solid white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.profile-email {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.profile-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.badge {
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.renter {
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
}

.badge.owner {
  background: var(--bg-moveo-orange);
  color: var(--text-secondary-2);
}

.badge.verified {
  background: #10b981;
  color: white;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-family: var(--font-family-primary);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--bg-muted);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-family: var(--font-family-primary);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--bg-base);
}

.tab-btn.active {
  color: var(--brand-green);
  border-bottom-color: var(--brand-green);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-grid {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-family: var(--font-family-primary);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--bg-muted);
}

.info-label {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-secondary);
}

.info-value {
  font-family: var(--font-family-primary);
  color: var(--text-primary);
  font-weight: 500;
}

/* Verification */
.verification-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.verification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-base);
}

.verification-item.verified {
  background: #ecfdf5;
}

.verification-icon {
  font-size: 2rem;
}

.verification-title {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.verification-desc {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Security */
.security-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
}

.security-option-title {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.security-option-desc {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
}

.btn-secondary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Demo Section */
.demo-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px dashed #f59e0b;
}

.demo-warning {
  font-family: var(--font-family-primary);
  color: #92400e;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.demo-users {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.demo-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--bg-muted);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.demo-user-card:hover {
  border-color: var(--brand-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-user-card.active {
  border-color: var(--brand-green);
  background: #ecfdf5;
}

.demo-user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-secondary-2);
  flex-shrink: 0;
}

.demo-user-info {
  flex: 1;
}

.demo-user-name {
  font-family: var(--font-family-primary);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.demo-user-role {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.demo-user-email {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.demo-user-active {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-family: var(--font-family-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  border-radius: 12px;
  text-align: center;
}

.stat-card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-card-value {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-secondary-2);
  margin-bottom: 0.25rem;
}

.stat-card-label {
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  color: var(--text-secondary-2);
  opacity: 0.9;
}

.financial-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.financial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-base);
  border-radius: 8px;
}

.financial-label {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-secondary);
}

.financial-value {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-green);
}

.verification-progress {
  margin: 1.5rem 0;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background: var(--bg-muted);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-green) 0%, #10b981 100%);
  transition: width 0.5s ease;
}

.progress-text {
  font-family: var(--font-family-primary);
  text-align: center;
  color: var(--text-secondary);
  margin: 0;
}

.verification-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-base);
  border-radius: 8px;
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
}

.checklist-item.completed {
  background: #ecfdf5;
  color: #10b981;
}

.checklist-item i {
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .container {
    padding: 0 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .security-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
