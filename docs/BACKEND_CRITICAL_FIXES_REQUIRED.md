# 🚨 BACKEND - Fixes CRÍTICOS Requeridos

## Fecha: 2 de Diciembre 2025

---

## 🔴 PRIORIDAD CRÍTICA #1: Vehicle ID como GUID

### ❌ Error Actual
El backend devuelve `id` como GUID/string en lugar de número entero, causando `NaN` en el frontend.

### 📋 Evidencia
```javascript
// Console logs del frontend:
🚗 [rental-page] vehicle.id: NaN tipo: number
🚗 [rental.store] selectVehicle llamado con id: NaN
🚗 [rental.store] selectedVehicle computed - buscando id: NaN encontrado: null
```

### 🔧 Código Backend Actual
```csharp
// VehicleController.cs
[HttpGet("{id:guid}")]  // ❌ Usa GUID en vez de int
public async Task<IActionResult> GetById(Guid id)

// VehicleResource.cs
public record VehicleResource(
    string Id,  // ❌ Id es string (GUID convertido)
    int OwnerId,
    // ...
);

// VehicleResourceFromEntityAssembler.cs
return new VehicleResource(
    vehicle.Id.ToString(),  // ❌ Convierte GUID a string
    // ...
);
```

### ✅ Solución Requerida

**Opción A: Cambiar a IDs numéricos (RECOMENDADO)**
```csharp
// 1. Cambiar la entidad Vehicle para usar int en vez de Guid
public class Vehicle : AggregateRoot
{
    public int Id { get; set; }  // Cambiar de Guid a int
    // ...
}

// 2. Actualizar el controlador
[HttpGet("{id:int}")]  // Cambiar :guid a :int
public async Task<IActionResult> GetById(int id)

// 3. Actualizar el resource
public record VehicleResource(
    int Id,  // Cambiar string a int
    // ...
);

// 4. Actualizar el assembler
return new VehicleResource(
    vehicle.Id,  // No hacer .ToString()
    // ...
);

// 5. Actualizar la base de datos
ALTER TABLE vehicles MODIFY COLUMN id INT AUTO_INCREMENT;
```

**Opción B: Mantener GUIDs (frontend ya está ajustado)**
Si prefieren mantener GUIDs, el frontend ya está actualizado para soportarlos. Solo asegúrense de:
1. Que el campo `Id` esté presente en todos los responses
2. Que sea un GUID válido (no null/undefined)

### 🎯 Impacto
- ❌ **Los usuarios NO pueden seleccionar vehículos para alquilar**
- ❌ El modal de alquiler nunca se abre
- ❌ Todo el flujo de rental está roto

---

## 🔴 PRIORIDAD CRÍTICA #2: Tabla `reviews` No Existe

### ❌ Error Actual
```
MySqlConnector.MySqlException: Table 'moveo_db.reviews' doesn't exist
```

### 📋 Stack Trace
```
at Moveo_backend.Reviews.Infrastructure.Persistence.ReviewRepository.GetAllAsync()
at Moveo_backend.Reviews.Application.ReviewService.GetAllAsync()
at Moveo_backend.Reviews.Interfaces.REST.ReviewsController.GetAll()
```

### ✅ Solución Requerida

**1. Crear la tabla `reviews` en la base de datos**

```sql
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id VARCHAR(36),
    vehicle_id VARCHAR(36),
    adventure_route_id VARCHAR(36) NULL,
    reviewer_id INT NOT NULL,
    owner_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    type VARCHAR(20) NOT NULL, -- 'vehicle' o 'adventure'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_adventure_route_id (adventure_route_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_rental_id (rental_id)
);
```

**2. Crear la entidad Review en el backend**

```csharp
namespace Moveo_backend.Reviews.Domain.Model.Aggregates
{
    public class Review : AggregateRoot
    {
        public int Id { get; set; }
        public string RentalId { get; set; }
        public string VehicleId { get; set; }
        public string? AdventureRouteId { get; set; }
        public int ReviewerId { get; set; }
        public int OwnerId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string Type { get; set; } // "vehicle" o "adventure"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
```

**3. Configurar en el DbContext**

```csharp
public DbSet<Review> Reviews { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Review>(entity =>
    {
        entity.ToTable("reviews");
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Rating).IsRequired();
        entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
        entity.Property(e => e.Comment).HasColumnType("TEXT");
    });
}
```

### 🎯 Impacto
- ❌ **El frontend no puede cargar el modal de alquiler**
- ❌ Error 500 al intentar ver vehículos
- ❌ No se pueden crear ni ver reseñas

---

## 🔴 PRIORIDAD ALTA #3: POST /payments - PaymentMethod Requerido

### ❌ Error Actual
```
POST http://localhost:8080/api/v1/payments 400 (Bad Request)
{
  "errors": {
    "PaymentMethod": ["The PaymentMethod field is required."]
  }
}
```

### 📤 JSON que envía el Frontend
```json
{
  "rentalId": "abc-123",
  "amount": 450.00,
  "currency": "PEN",
  "status": "pending"
}
```

### ✅ Solución Requerida

**Opción A: Hacer PaymentMethod opcional en el backend**
```csharp
public record CreatePaymentCommand(
    string RentalId,
    decimal Amount,
    string Currency,
    string Status,
    string? PaymentMethod = "card"  // Valor por defecto
);
```

**Opción B: Frontend envíe PaymentMethod (YA CORREGIDO ABAJO)**

### 🎯 Estructura Esperada del Endpoint

```csharp
// POST /api/v1/payments
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreatePaymentCommand command)
{
    var payment = await _paymentService.CreateAsync(command);
    return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
}

// Estructura del Command
public record CreatePaymentCommand(
    string RentalId,
    int PayerId,
    int RecipientId,
    decimal Amount,
    string Currency,
    string Status,
    string? PaymentMethod,
    string? TransactionId,
    string? Description
);

// Response esperado
public record PaymentResource(
    int Id,
    string RentalId,
    int PayerId,
    int RecipientId,
    decimal Amount,
    string Currency,
    string Status,
    string PaymentMethod,
    string? TransactionId,
    string? Description,
    DateTime CreatedAt,
    DateTime? CompletedAt
);
```

---

## 🔴 PRIORIDAD ALTA #4: POST /adventure-routes - Campos Requeridos

### ❌ Error Actual
```
POST http://localhost:8080/api/v1/adventure-routes 400 (Bad Request)
{
  "errors": {
    "Images": ["The Images field is required."],
    "Waypoints": ["The Waypoints field is required."],
    "EstimatedTime": ["The EstimatedTime field is required."]
  }
}
```

### ✅ Solución Requerida

**Hacer estos campos opcionales en el backend o asignar valores por defecto**

```csharp
public record CreateAdventureRouteCommand(
    int OwnerId,
    string Title,
    string Description,
    string Difficulty,
    double Distance,
    string? EstimatedTime = "1 hour",  // Opcional con default
    List<WaypointDto>? Waypoints = null,  // Opcional
    List<string>? Images = null  // Opcional
);

// En el handler/service
var route = new AdventureRoute
{
    // ...
    EstimatedTime = command.EstimatedTime ?? "1 hour",
    Waypoints = command.Waypoints ?? new List<Waypoint>(),
    Images = command.Images ?? new List<string>()
};
```

**O validar en el frontend que estos campos se envíen siempre (YA CORREGIDO ABAJO)**

---

## 📊 Resumen de Prioridades

| # | Issue | Endpoint | Prioridad | Estado |
|---|-------|----------|-----------|--------|
| 1 | Vehicle ID es GUID → NaN | `GET /vehicles` | 🔴 CRÍTICA | Frontend ajustado, backend debe elegir GUID o int |
| 2 | Tabla `reviews` no existe | `GET /reviews` | 🔴 CRÍTICA | Backend debe crear tabla y entidad |
| 3 | PaymentMethod requerido | `POST /payments` | 🟠 ALTA | Frontend corregido, backend debe validar |
| 4 | Campos requeridos en adventures | `POST /adventure-routes` | 🟠 ALTA | Frontend corregido, backend debe hacer opcionales |

---

## ⚡ ACCIÓN INMEDIATA REQUERIDA

### Para el Equipo de Backend:

**NO PAREN HASTA COMPLETAR TODO:**

1. **CRÍTICO - Crear tabla `reviews`** ⏱️ 15 min
   - Ejecutar el SQL de creación de tabla
   - Crear entidad Review y configurar DbContext
   - Verificar que `GET /reviews` funcione

2. **CRÍTICO - Decidir sobre Vehicle IDs** ⏱️ 30 min
   - Opción A: Cambiar a `int` (recomendado, más fácil)
   - Opción B: Mantener `Guid` pero asegurar que se devuelva correctamente
   - **Confirmar cuál opción eligen y ejecutarla**

3. **ALTA - Ajustar validaciones de POST** ⏱️ 20 min
   - `POST /payments`: Hacer `PaymentMethod` opcional con default "card"
   - `POST /adventure-routes`: Hacer `Images`, `Waypoints`, `EstimatedTime` opcionales
   - Asignar valores por defecto si no se envían

4. **VERIFICACIÓN** ⏱️ 10 min
   - Probar cada endpoint con Postman/Swagger
   - Verificar que todos los responses incluyan el campo `id`
   - Confirmar que no hay más errores 500

---

## 📞 Respuesta Esperada del Backend

Por favor confirmen:

1. ✅ **Tabla `reviews` creada y endpoint funcionando**
2. ✅ **Decisión sobre Vehicle IDs (int o GUID) y ejecutada**
3. ✅ **Validaciones ajustadas en POST /payments y POST /adventure-routes**
4. ✅ **Todos los endpoints probados y funcionando**

**Tiempo estimado total: ~75 minutos**

---

## 🎯 Criterios de Éxito

- [ ] Frontend puede cargar vehículos sin error 500
- [ ] Frontend puede hacer click en un vehículo y abrir el modal
- [ ] Frontend puede crear un pago sin error 400
- [ ] Frontend puede crear una aventura sin error 400
- [ ] Todos los IDs se manejan consistentemente (int o GUID)

---

## 📝 Notas Finales

- El **frontend YA ESTÁ AJUSTADO** para soportar GUIDs en vehicle IDs
- El **frontend YA ENVIARÁ** los campos requeridos correctamente
- Solo falta que el **backend complete las 4 tareas** listadas arriba
- **NO detenerse hasta que todo funcione al 100%**

🚀 **¡Adelante equipo backend! El frontend está listo y esperando.**

---

## ✅ CAMBIOS REALIZADOS EN EL FRONTEND

El frontend ya ha sido actualizado para trabajar correctamente con el backend:

### 1. **Soporte para Vehicle IDs como GUID/String** ✅
- `rental.store.js`: IDs se mantienen como strings en lugar de Number
- `rental-page.vue`: Key usa fallback con index
- `rental-flow-modal.vue`: Comparaciones usan String()
- `my-rentals-page.vue`: Búsqueda de vehículos usa String()
- `rental-requests-page.vue`: Comparaciones de vehicleId usan String()

### 2. **Payment: Campo `paymentMethod` agregado** ✅
- `rental-flow-modal.vue`: Envía `paymentMethod: 'card'` por defecto
- El campo `type` fue removido para coincidir con el schema del backend

### 3. **Adventure Routes: Campos requeridos agregados** ✅
- `create-adventure.vue`: Ahora envía:
  - `images: []` (array vacío si no hay imagen)
  - `waypoints: []` (array vacío por defecto)
  - `estimatedTime: formData.duration || '1 hour'`
  - `distance: 0` (valor por defecto)

### 4. **Manejo graceful de error de Reviews** ✅
- `rental-flow-modal.vue`: Try-catch separado para reviews
- Si la tabla `reviews` no existe, el modal sigue funcionando
- Solo muestra warning en consola pero no bloquea el flujo

---

## 🎯 ESTADO ACTUAL

| Componente | Estado Frontend | Esperando Backend |
|------------|----------------|-------------------|
| Vehicle IDs | ✅ Soporta GUIDs | Decidir: int o GUID |
| Reviews Table | ✅ Manejo de error | Crear tabla y entidad |
| Payment Method | ✅ Envía campo correcto | Validar/hacer opcional |
| Adventure Fields | ✅ Envía todos los campos | Hacer opcionales o validar |

---

## 📦 ARCHIVOS MODIFICADOS EN FRONTEND

1. `src/app/rental/application/rental.store.js`
2. `src/app/rental/presentation/views/rental-page.vue`
3. `src/app/rental/presentation/components/rental-flow-modal.vue`
4. `src/app/rental/presentation/views/my-rentals-page.vue`
5. `src/app/rental/presentation/views/rental-requests-page.vue`
6. `src/app/adventure/presentation/views/create-adventure.vue`

**Total de cambios: 6 archivos actualizados**

---

## 🚀 PRÓXIMOS PASOS

### Para probar en desarrollo:

1. **Recargar la app:** `Ctrl+R` en el navegador
2. **Ver logs en consola:** Los logs con emoji 🚗 mostrarán el estado
3. **Probar flujo completo:**
   - ✅ Browse vehicles (debe cargar sin error 500)
   - ✅ Click en vehículo (modal debe abrir)
   - ✅ Seleccionar fechas y confirmar (payment debe crear)
   - ✅ Crear aventura (debe funcionar con campos opcionales)

### Para el backend:

**NO PARAR hasta completar las 4 tareas críticas listadas arriba.**

Una vez completadas, el sistema funcionará al 100% frontend ↔ backend.

🎉 **¡Frontend listo! Ahora todo depende del backend!**
