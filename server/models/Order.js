const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, default: 'COD' },
    cancellationReason: { type: String, default: '' },
    cancelledAt: { type: Date, default: null },
    // ✅ FIX: Remove enum, just store string or null
    cancelledBy: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);