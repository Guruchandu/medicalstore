const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: Number,
    description: String,
    category: String,
    dose: String,
    type: { type: String, enum: ['OTC', 'Rx'], default: 'OTC' },
    inStock: { type: Boolean, default: true },
    img: String,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
