import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalStock: {
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
  },
  sizes: {
   type: [String],
  required:true,
  },
  colors: {
    type: [String],
    required: true
  },
  collections: {
    type: [String],
    required: true
  },
  gender: {
    type: String,
    enum: ["Men", "Women", "Unisex"],
    required: true
  },
images: {
  type: [String],
  default: [],
},
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
},
tags: [String],
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

});

const Product = mongoose.model("Product", productSchema);
export default Product;
