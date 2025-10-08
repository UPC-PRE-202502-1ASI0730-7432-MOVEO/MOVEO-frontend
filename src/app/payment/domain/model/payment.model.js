import { PaymentEntity } from "./payment.entity.js";

export class Payment extends PaymentEntity {
    get formattedDueDate() {
        const date = new Date(this.dueDate);
        return date.toLocaleDateString("es-PE");
    }

    get status() {
        return this.paid ? "Pagado" : "Pendiente";
    }
}
