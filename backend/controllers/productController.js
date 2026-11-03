import Product from "../models/productModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";



// read product
export const getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) return next(errorHandler(404, 'Product not found'));
  res.status(200).json({success:true, product});
});

// read all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({success:true, products});
});

// query products

export const filterProducts = catchAsyncError(async (req, res, next) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    priceMin,
    priceMax,
    size,
    color,
    collection,
    gender,
    isFeatured,
    search,
    sortBy,
    limit,
  } = req.query;

  const filter = {};

  // Filter by category
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  // Filter by brand
  if (brand?.trim()) {
  const brands = brand.split(",").map((b) => b.trim()).filter(Boolean);

  filter.$and = [
    ...(filter.$and || []),
    {
      $or: brands.map((b) => ({
        brand: {
          $regex: b.replace(/\s+/g, ""),
          $options: "i",
        },
      })),
    },
  ];
}

  // Filter by price (supports both parameter naming styles)
  const minimumPrice = minPrice ?? priceMin;
  const maximumPrice = maxPrice ?? priceMax;

  if (minimumPrice !== undefined && minimumPrice !== "") {
    filter.price = { ...filter.price, $gte: Number(minimumPrice) };
  }

  if (maximumPrice !== undefined && maximumPrice !== "") {
    filter.price = { ...filter.price, $lte: Number(maximumPrice) };
  }

  // Filter by size, color, collection and gender
if (size?.trim()) {
  const sizes = size.split(",").map((s) => s.trim()).filter(Boolean);

  filter.sizes = {
    $in: sizes.map((s) => new RegExp(`^${s}$`, "i")),
  };
}
  if (color) {
    filter.colors = { $regex: color, $options: "i" };
  }

  if (collection) {
    filter.collections = { $regex: collection, $options: "i" };
  }

  if (gender?.trim()) {
  filter.gender = {
    $regex: `^${gender.trim()}$`,
    $options: "i",
  };
}

  // Filter by featured status
  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === "true";
  }

  // Search by product name or description
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sorting — define outside the if block
  const sortOptions = {};

  if (sortBy) {
    const sortFields = sortBy.split(",");

    sortFields.forEach((field) => {
      const [key, order] = field.split(":");

      // Only allow supported sorting fields
      const allowedFields = [
        "price",
        "discountedPrice",
        "rating",
        "createdAt",
        "name",
      ];

      if (allowedFields.includes(key)) {
        sortOptions[key] = order === "desc" ? -1 : 1;
      }
    });
  }

  // Default sorting when no valid sort option is supplied
  if (Object.keys(sortOptions).length === 0) {
    sortOptions.createdAt = -1;
  }

  // Fetch products
  let query = Product.find(filter).sort(sortOptions);

  if (limit !== undefined && Number(limit) > 0) {
    query = query.limit(Number(limit));
  }

  const products = await query;

  res.status(200).json({
    success: true,
    products,
  });
});


// similar products
export const similarProducts  = catchAsyncError(async (req, res, next) => {
  const {id} = req.params;
  const product = await Product.findById(id);
  if(!product) return next(errorHandler(404, 'Product not found'));
  const similarProduct = await Product.find({ _id: {$ne: id},gender: product.gender, category: product.category }).limit(5);
  res.status(200).json({success:true, products: similarProduct});
})

// best sellers
export const bestSellers = catchAsyncError(async (req, res, next) => {
  const bestSellers = await Product.find().sort({rating: -1}).limit(5);
  if(!bestSellers) return next(errorHandler(404, 'No best sellers found'));
  res.status(200).json({success:true, products: bestSellers});
})

// new arrivals
export const newArrivals = catchAsyncError(async (req, res, next) => {
  const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
  if(!newArrivals) return next(errorHandler(404, 'No new arrivals found'));
  res.status(200).json({success:true, products: newArrivals});
})

