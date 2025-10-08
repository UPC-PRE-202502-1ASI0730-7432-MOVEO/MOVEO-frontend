<template>
  <AuthLayout>
    <div class="role-selection">
      <div class="role-selection__header">
        <h1 class="role-selection__title">Únete a MOVEO</h1>
        <p class="role-selection__subtitle">Selecciona cómo quieres usar nuestra plataforma</p>
      </div>

      <div class="role-selection__cards">
        <!-- Renter Card -->
        <router-link to="/register/renter" class="role-card role-card--renter">
          <div class="role-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <h2 class="role-card__title">Soy Cliente</h2>
          <p class="role-card__description">
            Busca y alquila vehículos de manera fácil y segura. Encuentra el auto perfecto para tu próxima aventura.
          </p>
          <ul class="role-card__features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Búsqueda avanzada de vehículos
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Reservas instantáneas
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Historial de alquileres
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Soporte 24/7
            </li>
          </ul>
          <div class="role-card__button">
            Registrarme como Cliente
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <!-- Owner Card -->
        <router-link to="/register/owner" class="role-card role-card--owner">
          <div class="role-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M3 9h18"></path>
              <path d="M9 21V9"></path>
            </svg>
          </div>
          <h2 class="role-card__title">Soy Propietario</h2>
          <p class="role-card__description">
            Publica tus vehículos y genera ingresos extra. Gestiona tus autos de forma simple y eficiente.
          </p>
          <ul class="role-card__features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Publicación ilimitada de vehículos
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Panel de control completo
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Gestión de reservas
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Ingresos garantizados
            </li>
          </ul>
          <div class="role-card__button">
            Registrarme como Propietario
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </router-link>
      </div>

      <div class="role-selection__footer">
        <p>¿Ya tienes una cuenta? <router-link to="/login" class="link">Inicia sesión</router-link></p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../components/AuthLayout.vue'
</script>

<style scoped>
.role-selection {
  width: 100%;
}

.role-selection__header {
  text-align: center;
  margin-bottom: 3rem;
}

.role-selection__title {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.role-selection__subtitle {
  font-family: var(--font-secondary);
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.role-selection__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(380px, 480px));
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.role-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 3rem 2.5rem;
  background: white;
  border: 3px solid transparent;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.role-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, #059669 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.role-card--renter::before {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, #059669 100%);
}

.role-card--owner::before {
  background: linear-gradient(135deg, var(--bg-moveo-orange) 0%, #ea580c 100%);
}

.role-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--bg-moveo-green);
}

.role-card--owner:hover {
  border-color: var(--bg-moveo-orange);
}

.role-card:hover::before {
  opacity: 0.03;
}

/* Add z-index to content */
.role-card > * {
  position: relative;
  z-index: 1;
}

.role-card__icon {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, #059669 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(74, 222, 128, 0.3);
  transition: all 0.4s ease;
}

.role-card--owner .role-card__icon {
  background: linear-gradient(135deg, var(--bg-moveo-orange) 0%, #ea580c 100%);
  box-shadow: 0 8px 24px rgba(251, 146, 60, 0.3);
}

.role-card:hover .role-card__icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 32px rgba(74, 222, 128, 0.4);
}

.role-card--owner:hover .role-card__icon {
  box-shadow: 0 12px 32px rgba(251, 146, 60, 0.4);
}

.role-card__title {
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.role-card:hover .role-card__title {
  color: var(--bg-moveo-green);
}

.role-card--owner:hover .role-card__title {
  color: var(--bg-moveo-orange);
}

.role-card__description {
  font-family: var(--font-secondary);
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.75rem;
  min-height: 60px;
}

.role-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex-grow: 1;
}

.role-card__features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-secondary);
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin-bottom: 0.875rem;
  line-height: 1.5;
}

.role-card__features li svg {
  flex-shrink: 0;
  color: var(--bg-moveo-green);
}

.role-card--owner .role-card__features li svg {
  color: var(--bg-moveo-orange);
}

.role-card__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.125rem 1.5rem;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, #059669 100%);
  color: white;
  border-radius: 14px;
  font-family: var(--font-primary);
  font-size: 1.0625rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
}

.role-card--owner .role-card__button {
  background: linear-gradient(135deg, var(--bg-moveo-orange) 0%, #ea580c 100%);
  box-shadow: 0 4px 16px rgba(251, 146, 60, 0.3);
}

.role-card:hover .role-card__button {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(74, 222, 128, 0.4);
}

.role-card--owner:hover .role-card__button {
  box-shadow: 0 8px 24px rgba(251, 146, 60, 0.4);
}

.role-card__button svg {
  transition: transform 0.3s ease;
}

.role-card:hover .role-card__button svg {
  transform: translateX(4px);
}

.role-selection__footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.role-selection__footer p {
  font-family: var(--font-secondary);
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.link {
  color: var(--bg-moveo-green);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--bg-moveo-orange);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .role-selection__cards {
    grid-template-columns: repeat(2, minmax(300px, 400px));
    gap: 2rem;
  }
  
  .role-card {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .role-selection__title {
    font-size: 2rem;
  }

  .role-selection__cards {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }

  .role-card {
    padding: 2.5rem 2rem;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }

  .role-card__icon {
    width: 75px;
    height: 75px;
  }

  .role-card__icon svg {
    width: 48px;
    height: 48px;
  }

  .role-card__title {
    font-size: 1.75rem;
  }
}
</style>
