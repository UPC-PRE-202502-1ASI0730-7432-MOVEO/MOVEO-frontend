<script setup>
import { ref, onMounted, computed } from "vue";
import usePaymentsStore from "../../application/payment.store.js";

const { payments, fetchPayments, markAsPaid } = usePaymentsStore();

const userId = 3; // ahora usamos userId en lugar de residentId

const selectedPayment = ref(null);
const showPaymentForm = ref(false);
const selectedMethod = ref(null);
const ticketGenerated = ref(false);
const cardInfo = ref({ number: "", name: "", expiry: "", ccv: "" });
const yapeReceipt = ref(null);

const filteredPayments = computed(() =>
    payments.value.filter(p => p.userId === userId && !p.paid)
);

onMounted(fetchPayments);

function pay(payment) {
  selectedPayment.value = payment;
  showPaymentForm.value = true;
  selectedMethod.value = null;
  ticketGenerated.value = false;
}

function submitCardPayment() {
  if (cardInfo.value.number && cardInfo.value.name && cardInfo.value.ccv && cardInfo.value.expiry) {
    markAsPaid(selectedPayment.value.id, "card");
    showPaymentForm.value = false;
  }
}

function submitYapePayment() {
  if (yapeReceipt.value) {
    markAsPaid(selectedPayment.value.id, "yape");
    showPaymentForm.value = false;
  }
}

function generateCashTicket() {
  ticketGenerated.value = true;
  markAsPaid(selectedPayment.value.id, "cash");
}

function handleYapeFileUpload(event) {
  yapeReceipt.value = event.target.files[0];
}

function cancelPayment() {
  showPaymentForm.value = false;
  selectedMethod.value = null;
  selectedPayment.value = null;
  cardInfo.value = { number: "", name: "", expiry: "", ccv: "" };
  yapeReceipt.value = null;
  ticketGenerated.value = false;
}
</script>

<template>
  <div class="payment-container">
    <h2>Pagos pendientes</h2>

    <div v-if="filteredPayments.length === 0">
      <p>No tienes pagos pendientes.</p>
    </div>

    <div v-for="payment in filteredPayments" :key="payment.id" class="payment-card">
      <h3>Pago #{{ payment.id }}</h3>
      <p><strong>Monto:</strong> S/. {{ payment.amount }}</p>
      <p><strong>Descripción:</strong> {{ payment.description }}</p>
      <p><strong>Fecha límite:</strong> {{ payment.formattedDueDate }}</p>

      <button @click="pay(payment)">Pagar</button>
    </div>

    <!-- Formulario de pago -->
    <div v-if="showPaymentForm && selectedPayment" class="payment-form">
      <h3>Método de pago</h3>

      <div class="method-buttons">
        <button @click="selectedMethod = 'card'" :class="{ active: selectedMethod === 'card' }">Tarjeta</button>
        <button @click="selectedMethod = 'yape'" :class="{ active: selectedMethod === 'yape' }">Yape</button>
        <button @click="selectedMethod = 'cash'" :class="{ active: selectedMethod === 'cash' }">Efectivo</button>
        <button @click="cancelPayment()">Cancelar</button>
      </div>

      <div v-if="selectedMethod === 'card'" class="card-form">
        <div class="credit-card-display">
          <div class="card-number">{{ cardInfo.number || 'XXXX XXXX XXXX XXXX' }}</div>
          <div class="card-holder">{{ cardInfo.name || 'NOMBRE TITULAR' }}</div>
          <div class="card-expiry">{{ cardInfo.expiry || 'MM/AA' }}</div>
        </div>

        <form class="card-inputs">
          <label>Número de Tarjeta:</label>
          <input v-model="cardInfo.number" placeholder="XXXX XXXX XXXX XXXX" />

          <label>Nombre del Titular:</label>
          <input v-model="cardInfo.name" placeholder="Nombre Apellido" />

          <label>Fecha de Expiración (MM/AA):</label>
          <input v-model="cardInfo.expiry" placeholder="MM/AA" />

          <label>CCV:</label>
          <input v-model="cardInfo.ccv" placeholder="123" />

          <button type="button" @click="submitCardPayment">Confirmar Pago</button>
        </form>
      </div>

      <div v-if="selectedMethod === 'yape'" class="yape-form">
        <p><strong>Escanea este QR:</strong></p>
        <img src="" alt="QR Yape" width="200" />
        <p>Sube la captura:</p>
        <input type="file" @change="handleYapeFileUpload" />
        <button @click="submitYapePayment">Enviar Comprobante</button>
      </div>

      <div v-if="selectedMethod === 'cash'" class="cash-form">
        <p>Se generará un ticket que podrás mostrar en caja.</p>
        <button v-if="!ticketGenerated" @click="generateCashTicket">Generar Ticket</button>
        <div v-else>
          <p><strong>Ticket:</strong> #{{ selectedPayment.id }} - S/. {{ selectedPayment.amount }}</p>
          <p>Preséntalo en recepción.</p>
        </div>
      </div>
    </div>
  </div>
</template>
