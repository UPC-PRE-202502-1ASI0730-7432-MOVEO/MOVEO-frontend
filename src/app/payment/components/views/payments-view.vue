<script setup>
import { ref, onMounted } from "vue";
import usePaymentsStore from "../../application/payment.store.js";
import { Button, InputText } from "primevue";

const store = usePaymentsStore();
const { payments, fetchPayments, addPayment, deletePayment } = store;

const newPayment = ref({
  userId: "",
  amount: "",
  method: null,
  status: "pendiente",
});

const selectedMethod = ref(null);

// 💳 Información de la tarjeta
const cardInfo = ref({
  number: "",
  name: "",
  expiry: "",
  ccv: "",
});

onMounted(() => {
  fetchPayments();
});

function handleAddPayment() {
  if (!newPayment.value.userId || !newPayment.value.amount || !selectedMethod.value) {
    alert("Completa todos los campos y selecciona un método de pago.");
    return;
  }

  newPayment.value.method = selectedMethod.value;

  addPayment({ ...newPayment.value });
  newPayment.value = { userId: "", amount: "", method: null, status: "pendiente" };
  selectedMethod.value = null;
  cardInfo.value = { number: "", name: "", expiry: "", ccv: "" }; // limpia los campos
}

function handleDelete(payment) {
  if (confirm("¿Eliminar este pago?")) {
    deletePayment(payment);
  }
}

function selectMethod(method) {
  selectedMethod.value = method;
}
</script>

<template>
  <div class="payments-container">
    <h1>Gestión de Pagos</h1>

    <div class="form-section">
      <h2>Registrar Pago</h2>

      <div class="form-group">
        <label for="userId">Usuario</label>
        <InputText id="userId" v-model="newPayment.userId" placeholder="Ej. 123" />
      </div>

      <div class="form-group">
        <label for="amount">Monto</label>
        <InputText id="amount" v-model="newPayment.amount" placeholder="Ej. 50.00" />
      </div>

      <div class="form-group">
        <label>Método de Pago</label>
        <div class="method-buttons">
          <button
              type="button"
              :class="{ active: selectedMethod === 'tarjeta' }"
              @click="selectMethod('tarjeta')"
          >
            💳 Tarjeta
          </button>

          <button
              type="button"
              :class="{ active: selectedMethod === 'yape' }"
              @click="selectMethod('yape')"
          >
            📱 Yape
          </button>
        </div>
      </div>

      <!-- TARJETA INTERACTIVA -->
      <div v-if="selectedMethod === 'tarjeta'" class="card-form">
        <div class="credit-card-display">
          <div class="card-number">
            {{ cardInfo.number || "XXXX XXXX XXXX XXXX" }}
          </div>
          <div class="card-holder">
            {{ cardInfo.name || "NOMBRE DEL TITULAR" }}
          </div>
          <div class="card-expiry">
            {{ cardInfo.expiry || "MM/AA" }}
          </div>
        </div>

        <div class="card-inputs">
          <label>Número de Tarjeta:</label>
          <input
              type="text"
              v-model="cardInfo.number"
              placeholder="XXXX XXXX XXXX XXXX"
          />

          <label>Nombre del Titular:</label>
          <input
              type="text"
              v-model="cardInfo.name"
              placeholder="Nombre Apellido"
          />

          <label>Fecha de Expiración (MM/AA):</label>
          <input type="text" v-model="cardInfo.expiry" placeholder="MM/AA" />

          <label>CCV:</label>
          <input type="text" v-model="cardInfo.ccv" placeholder="123" />
        </div>
      </div>

      <!-- YAPE -->
      <div v-if="selectedMethod === 'yape'" class="yape-form">
        <p><strong>Escanea este QR con tu app de Yape:</strong></p>
        <img
            src=""
            alt="Código QR de Yape"
            class="yape-qr"
        />
        <p>Sube la captura de tu Yapeo:</p>
        <input type="file" />
      </div>

      <Button label="Agregar Pago" icon="pi pi-check" class="btn-save" @click="handleAddPayment" />
    </div>

    <div class="table-section">
      <h2>Pagos Registrados</h2>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Monto</th>
          <th>Método</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in payments" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.userId }}</td>
          <td>S/. {{ p.amount }}</td>
          <td>{{ p.method }}</td>
          <td>{{ p.status }}</td>
          <td>
            <Button
                icon="pi pi-trash"
                class="btn-delete"
                severity="danger"
                @click="handleDelete(p)"
            />
          </td>
        </tr>
        <tr v-if="payments.length === 0">
          <td colspan="6" class="empty">No hay pagos registrados.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.payments-container {
  max-width: 900px;
  margin: 2rem auto;
  background: var(--bg-moveo-orange-light);
  padding: 2rem;
  border-radius: 12px;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.form-section {
  margin-bottom: 2rem;
  background: var(--bg-muted);
  padding: 1rem;
  border-radius: 8px;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--text-primary);
}

.method-buttons {
  display: flex;
  gap: 12px;
}

.method-buttons button {
  flex: 1;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f1f1f1;
  font-weight: bold;
  transition: 0.3s;
  color: var(--text-primary);
}

.method-buttons button:hover {
  background-color: #e0e0e0;
}

.method-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}

/* Tarjeta Interactiva */
.card-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.credit-card-display {
  width: 350px;
  height: 200px;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  border-radius: 16px;
  color: white;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', Courier, monospace;
  position: relative;
  overflow: hidden;
}

.credit-card-display::after {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.card-number {
  font-size: 20px;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.card-holder,
.card-expiry {
  font-size: 14px;
  text-transform: uppercase;
}

.card-holder {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.card-expiry {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.card-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
}

.card-inputs label {
  font-weight: bold;
  color: #333;
}

.card-inputs input {
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #aaa;
}

.card-inputs input:focus {
  border-color: #335A8E;
  outline: none;
  box-shadow: 0 0 5px rgba(51, 90, 142, 0.6);
}

/* Yape */
.yape-form {
  text-align: center;
  margin-top: 1rem;
}

.yape-qr {
  width: 220px;
  margin: 1rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  color: var(--text-primary);
}

h2 {
  color: var(--text-primary);
}

th, td {
  padding: 0.75rem;
  border-bottom: 1px solid #ccc;
}

th {
  background: var(--brand-green);
  color: white;
}

.empty {
  text-align: center;
  color: #999;
}

.btn-save {
  background-color: var(--brand-green);
  border: none;
  color: white;
}

.btn-delete {
  background-color: var(--brand-pink);
  border: none;
  color: white;
}
</style>
