<template>
  <section class="register-page">
    <div class="container">
      <div class="register-content">
        <h1 class="page-title">Crear Cuenta</h1>
        <p class="page-subtitle">Únete a MOVEO y comienza a alquilar o publicar vehículos</p>
        <user-register-form />
      </div>
    </div>
  </section>
</template>

<script setup>
import UserRegisterForm from '@/app/iam/components/user-register-form.vue'
</script>

<style scoped>
.register-page {
  padding: 2rem 1rem;
  background: #f7fafc;
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.register-content {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: center;
  color: #1a202c;
}

.page-subtitle {
  text-align: center;
  color: #718096;
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .register-content {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>


