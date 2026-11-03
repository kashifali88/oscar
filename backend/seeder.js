import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import Cart from './models/cartModel.js';
import products from "./data/products.js";
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    const hashedPassword = await bcrypt.hash("root123", 10);
    const createdUser = await User.create({
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
      role: "admin",
    });

    const userId = createdUser._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: userId,
    }));

    await Product.insertMany(sampleProducts);

    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });