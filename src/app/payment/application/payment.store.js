import { ref } from "vue";
import { Payment } from "../domain/model/payment.model.js";

export default function usePaymentsStore() {
    const payments = ref([]);
    const errors = ref([]);

    // 🔹 Cargar pagos desde localStorage si existen
    function loadFromLocalStorage() {
        const data = localStorage.getItem("payments");
        if (data) {
            payments.value = JSON.parse(data).map(p => new Payment(p));
        }
    }

    // 🔹 Guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem("payments", JSON.stringify(payments.value));
    }

    // 🔹 Obtener todos los pagos (ya cargados localmente)
    async function fetchPayments() {
        try {
            loadFromLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al obtener pagos:", err);
        }
    }

    // 🔹 Agregar nuevo pago
    async function addPayment(paymentData) {
        try {
            const newPayment = new Payment({
                id: Date.now(),
                ...paymentData,
            });
            payments.value.push(newPayment);
            saveToLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al agregar pago:", err);
        }
    }

    // 🔹 Eliminar un pago
    async function deletePayment(payment) {
        try {
            payments.value = payments.value.filter(p => p.id !== payment.id);
            saveToLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al eliminar pago:", err);
        }
    }

    // 🔹 Obtener un pago por ID
    function getPaymentById(id) {
        return payments.value.find(p => p.id === id);
    }

    // 🔹 Marcar como pagado
    async function markAsPaid(paymentId, method) {
        try {
            const payment = getPaymentById(paymentId);
            if (!payment) throw new Error("Pago no encontrado");

            payment.status = "pagado";
            payment.method = method;
            saveToLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al actualizar pago:", err);
        }
    }

    return {
        payments,
        errors,
        fetchPayments,
        addPayment,
        deletePayment,
        getPaymentById,
        markAsPaid,
    };
}
