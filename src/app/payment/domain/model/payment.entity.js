export class PaymentEntity {
    constructor({ id, userId, amount, description, dueDate, paymentMethod, paid }) {
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.description = description;
        this.dueDate = dueDate;
        this.paymentMethod = paymentMethod;
        this.paid = paid;
    }
}
