const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
    }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: { type: String, required: true, default: 'pending' },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
