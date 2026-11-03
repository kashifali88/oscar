import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: String,
    price: Number,
    image: String,
    color: String,
    size: String,
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, {_id: false});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true});

export default mongoose.model("Cart", cartSchema);