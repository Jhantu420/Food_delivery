import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: {  type: Object, required: true},
    status: {type: String, default: "Don't Deliverd" },
    date: { type: Date, default: Date.now }, // Corrected default value
    payment: { type: Boolean, default: false }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
