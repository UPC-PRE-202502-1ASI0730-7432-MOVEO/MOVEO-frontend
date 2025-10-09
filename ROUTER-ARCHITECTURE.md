# 📚 MOVEO Router Architecture - Nested Routes

## 🎯 Estructura Modular con Rutas Anidadas

Este proyecto sigue el patrón de **Nested Routes** (rutas anidadas) de Vue Router, similar al ejemplo de tu profesor. Esto permite una arquitectura más limpia, escalable y mantenible.

---

## 📁 Estructura de Archivos

```
src/
├── router.js (Router principal)
└── app/
    ├── iam/
    │   └── presentation/
    │       └── iam-router.js (Rutas de autenticación)
    ├── rental/
    │   └── presentation/
    │       └── rental-router.js (Rutas de alquileres)
    ├── adventure/
    │   └── presentation/
    │       └── adventure-router.js (Rutas de aventuras)
    └── payment/
        └── presentation/
            └── payment-router.js (Rutas de pagos)
```

---

## 🔗 Mapa de Rutas

### 🏠 Raíz
- `/` → Redirige a `/dashboard`

### 📊 Dashboard
- `/dashboard` → Dashboard principal (requiere autenticación)

### 🔐 IAM Module (`/auth/*`)
| Ruta Completa | Nombre | Componente | Descripción |
|---------------|--------|------------|-------------|
| `/auth/login` | `login` | `login-page.vue` | Inicio de sesión |
| `/auth/register` | - | Redirect | Redirige a select-role |
| `/auth/register/select-role` | `register-select-role` | `role-selection-page.vue` | Selección de rol |
| `/auth/register/renter` | `register-renter` | `register-renter-page.vue` | Registro inquilino |
| `/auth/register/owner` | `register-owner` | `register-owner-page.vue` | Registro propietario |
| `/auth/profile` | `profile` | `profile-page.vue` | Perfil de usuario |

### 🚗 Rental Module (`/rental/*`)
| Ruta Completa | Nombre | Rol | Descripción |
|---------------|--------|-----|-------------|
| `/rental/browse` | `rentals` | renter | Explorar vehículos |
| `/rental/my-rentals` | `my-rentals` | renter | Mis alquileres |
| `/rental/favorites` | `favorites` | renter | Favoritos |
| `/rental/my-vehicles` | `my-vehicles` | owner | Mis vehículos |
| `/rental/vehicles/:id` | `vehicle-detail` | - | Detalle de vehículo |
| `/rental/add-vehicle` | `add-vehicle` | owner | Agregar vehículo |
| `/rental/rental-requests` | `rental-requests` | owner | Solicitudes de alquiler |
| `/rental/earnings` | `earnings` | owner | Ganancias |

### 🎒 Adventure Module (`/adventures/*`)
| Ruta Completa | Nombre | Descripción |
|---------------|--------|-------------|
| `/adventures` | `adventures` | Lista de aventuras |
| `/adventures/new` | `adventure-new` | Nueva aventura |
| `/adventures/edit/:id` | `adventure-edit` | Editar aventura |

### 💰 Payment Module (`/payments/*`)
| Ruta Completa | Nombre | Descripción |
|---------------|--------|-------------|
| `/payments` | `payments` | Módulo de pagos |
| `/payments/my-payments` | `my-payments` | Mis pagos |

### 🔄 Rutas Legacy (Retrocompatibilidad)
Para mantener compatibilidad con código antiguo:
- `/login` → `/auth/login`
- `/register` → `/auth/register`
- `/profile` → `/auth/profile`
- `/rentals` → `/rental/browse`
- `/my-rentals` → `/rental/my-rentals`
- etc.

---

## 🛡️ Navigation Guard

El router incluye un `beforeEach` guard que:

1. **Logs de navegación**: Muestra en consola cada cambio de ruta
2. **Títulos dinámicos**: Actualiza `document.title` con formato `MOVEO - {Page Title}`
3. **Protección de rutas**: Verifica autenticación y redirige a login si es necesario

```javascript
router.beforeEach((to, from, next) => {
  // Logging
  console.log(`🚀 Navigation from ${from.name} to ${to.name}`)
  
  // Page title
  document.title = `MOVEO - ${to.meta.title}`
  
  // Auth check
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})
```

---

## 🎨 Beneficios de Nested Routes

### ✅ Ventajas:
1. **Modularidad**: Cada módulo tiene su propio archivo de rutas
2. **Mantenibilidad**: Fácil de encontrar y modificar rutas específicas
3. **Escalabilidad**: Agregar nuevos módulos es simple
4. **Organización**: URLs semánticas y agrupadas por funcionalidad
5. **Reutilización**: Componentes pueden compartirse entre rutas
6. **Testing**: Cada módulo de rutas puede probarse independientemente

### 📦 Ejemplo de uso en código:

```javascript
// En lugar de:
router.push('/my-vehicles')

// Ahora usamos:
router.push('/rental/my-vehicles')

// O por nombre:
router.push({ name: 'my-vehicles' })
```

---

## 🔧 Cómo agregar un nuevo módulo

1. Crear archivo de rutas:
```javascript
// src/app/nuevo-modulo/presentation/nuevo-router.js
export default [
  {
    path: 'ruta-1',
    name: 'nombre-ruta-1',
    component: () => import('./views/vista-1.vue'),
    meta: { title: 'Título Ruta 1' }
  }
]
```

2. Importar en `router.js`:
```javascript
import nuevoModuloRoutes from '@/app/nuevo-modulo/presentation/nuevo-router.js'
```

3. Agregar a las rutas:
```javascript
{
  path: '/nuevo-modulo',
  children: nuevoModuloRoutes
}
```

---

## 📝 Meta Fields Disponibles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | string | Título de la página |
| `requiresAuth` | boolean | Requiere autenticación |
| `hideLayout` | boolean | Oculta layout principal |
| `role` | string | Rol requerido ('renter' o 'owner') |

---

## 🚀 Comandos útiles

```bash
# Ver todas las rutas registradas (en DevTools)
router.getRoutes()

# Navegar programáticamente
router.push({ name: 'rentals' })
router.push('/rental/browse')

# Ir atrás
router.back()

# Reemplazar sin historial
router.replace('/dashboard')
```

---

## 📚 Referencias

- [Vue Router - Nested Routes](https://router.vuejs.org/guide/essentials/nested-routes.html)
- [Vue Router - Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- Ejemplo del profesor: ACME Learning Center

---

**Creado para:** MOVEO Frontend  
**Fecha:** Octubre 2025  
**Patrón:** Nested Routes Architecture
