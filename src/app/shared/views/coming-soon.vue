<template>
  <div class="coming-soon-page">
    <div class="content">
      <div class="icon">🚧</div>
      <h1 class="title">Próximamente</h1>
      <p class="message">Esta funcionalidad estará disponible muy pronto.</p>
      <p class="hint">Estamos trabajando para ofrecerte la mejor experiencia.</p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary">
          <span class="icon">🏠</span>
          Volver al Inicio
        </router-link>
        <button @click="$router.back()" class="btn btn-secondary">
          <span class="icon">⬅️</span>
          Regresar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed
</script>

<style scoped>
.coming-soon-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease;
}

.icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a202c;
}

.message {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
}

.hint {
  font-size: 0.9rem;
  color: #718096;
  margin: 0 0 2rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.btn .icon {
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 480px) {
  .content {
    padding: 2rem 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .icon {
    font-size: 4rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
