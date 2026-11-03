const products = [
  {
    name: "Stylish Leather Jacket",
    discountedPrice: 1200,
    description: "A stylish leather jacket with a comfortable fit and premium finish.",
    price: 1500,
    totalStock: 25,
    sku: "JKT-001",
    category: "Jackets",
    brand: "FashionBrand",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red"],
    collections: ["Best Sellers", "Winter Collection"],
    gender: "Men",
    images: {
      url: "/images/products/jacket.jpg"
    },
    isFeatured: true,
    isPublished: true,
    rating: 4.5,
    numReviews: 12,
    tags: ["jacket", "leather", "fashion"],
  },

  {
    name: "Classic Cotton Shirt",
    discountedPrice: 850,
    description: "A comfortable cotton shirt designed for casual everyday wear.",
    price: 1000,
    totalStock: 40,
    sku: "SHT-002",
    category: "Shirts",
    brand: "UrbanStyle",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Black"],
    collections: ["New Arrivals", "Casual Wear"],
    gender: "Men",
    images: {
      url: "/images/products/shirt.jpg"
    },
    isFeatured: false,
    isPublished: true,
    rating: 4.2,
    numReviews: 8,
    tags: ["shirt", "cotton", "casual"],
  },

  {
    name: "Elegant Women Handbag",
    discountedPrice: 1800,
    description: "An elegant handbag with a spacious interior for everyday use.",
    price: 2200,
    totalStock: 18,
    sku: "BAG-003",
    category: "Bags",
    brand: "Elegance",
    sizes: ["Standard"],
    colors: ["Black", "Brown", "Red"],
    collections: ["Best Sellers", "Women Collection"],
    gender: "Women",
    images: {
      url: "/images/products/handbag.jpg"
    },
    isFeatured: true,
    isPublished: true,
    rating: 4.7,
    numReviews: 15,
    tags: ["handbag", "women", "fashion"]
  }
];

export default products;