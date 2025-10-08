<template>
  <nav class="role-toolbar" v-if="currentRole">
    <div class="container">
      <div class="toolbar-content">
        <div class="role-indicator">
          <span class="role-badge" :class="currentRole">
            {{ roleLabel }}
          </span>
        </div>
        
        <div class="toolbar-nav">
          <router-link 
            v-for="link in currentLinks" 
            :key="link.path"
            :to="link.path"
            class="toolbar-link"
            active-class="active"
          >
            <span class="link-icon">{{ link.icon }}</span>
            <span class="link-text">{{ link.label }}</span>
          </router-link>
        </div>

        <div class="role-switcher">
          <button 
            @click="toggleRole" 
            class="switch-btn"
            :title="`Cambiar a ${currentRole === 'renter' ? 'propietario' : 'cliente'}`"
          >
            <span class="switch-icon">🔄</span>
            <span class="switch-text">Cambiar rol</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// En producción, esto vendría del store de autenticación
const currentRole = ref('renter') // 'renter' | 'owner'

const router = useRouter()

const roleLabel = computed(() => {
  return currentRole.value === 'renter' ? '👤 Cliente' : '🚗 Propietario'
})

// Links para clientes (renters)
const renterLinks = [
  { path: '/rentals', label: 'Buscar Vehículos', icon: '🔍' },
  { path: '/my-rentals', label: 'Mis Alquileres', icon: '📋' },
  { path: '/favorites', label: 'Favoritos', icon: '❤️' },
  { path: '/profile', label: 'Mi Perfil', icon: '👤' }
]

// Links para propietarios (owners)
const ownerLinks = [
  { path: '/my-vehicles', label: 'Mis Vehículos', icon: '🚗' },
  { path: '/add-vehicle', label: 'Publicar Vehículo', icon: '➕' },
  { path: '/rental-requests', label: 'Solicitudes', icon: '📩' },
  { path: '/earnings', label: 'Ganancias', icon: '💰' },
  { path: '/profile', label: 'Mi Perfil', icon: '👤' }
]

const currentLinks = computed(() => {
  return currentRole.value === 'renter' ? renterLinks : ownerLinks
})

function toggleRole() {
  currentRole.value = currentRole.value === 'renter' ? 'owner' : 'renter'
  
  // Redirigir a la página principal del rol
  const defaultPath = currentRole.value === 'renter' ? '/rentals' : '/my-vehicles'
  router.push(defaultPath)
}

// Función para cambiar rol desde fuera del componente
defineExpose({ setRole: (role) => { currentRole.value = role } })
</script>

<style scoped>
.role-toolbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  gap: 1rem;
}

/* Role Indicator */
.role-indicator {
  display: flex;
  align-items: center;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.role-badge.owner {
  background: rgba(255, 215, 0, 0.3);
}

/* Toolbar Navigation */
.toolbar-nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.toolbar-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.toolbar-link:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transform: translateY(-2px);
}

.toolbar-link.active {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
}

.link-icon {
  font-size: 1.1rem;
}

.link-text {
  display: inline;
}

/* Role Switcher */
.role-switcher {
  display: flex;
  align-items: center;
}

.switch-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.switch-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.switch-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 968px) {
  .toolbar-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toolbar-nav {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .toolbar-nav::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 640px) {
  .link-text {
    display: none;
  }

  .toolbar-link {
    padding: 0.5rem 0.75rem;
  }

  .switch-text {
    display: none;
  }

  .switch-btn {
    padding: 0.5rem 0.75rem;
  }
}
</style>
