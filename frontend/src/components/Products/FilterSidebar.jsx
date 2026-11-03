
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const MAX_PRICE = 20000;

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    brand: [],
    minPrice: 0,
    maxPrice: MAX_PRICE,
  });

  const [priceRange, setPriceRange] = useState(MAX_PRICE);

  const categories = ["Top Wear", "Bottom Wear"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const brands = [
    { label: "Urban Threads", value: "UrbanThreads" },
    { label: "Modern Fit", value: "ModernFit" },
    { label: "Street Style", value: "StreetStyle" },
    { label: "Beach Cycle", value: "BeachCycle" },
  ];

  const colors = ["Black", "Red", "White", "Blue"];
  const genders = ["Men", "Women"];

  // Read filters from the URL
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    const maxPrice = params.maxPrice
      ? Number(params.maxPrice)
      : MAX_PRICE;

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice,
    });

    setPriceRange(maxPrice);
  }, [searchParams]);

  // Update URL whenever a filter changes
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        }
      } else if (key === "minPrice" || key === "maxPrice") {
        params.set(key, String(value));
      } else if (value) {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
    navigate({ search: params.toString() });
  };

  // Handle category, gender, color, size, and brand
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      const currentValues = newFilters[name] || [];

      newFilters[name] = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Handle maximum price slider
  const handlePriceChange = (e) => {
    const newMax = Number(e.target.value);

    setPriceRange(newMax);

    const newFilters = {
      ...filters,
      minPrice: 0,
      maxPrice: newMax,
    };

    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">
        Filter
      </h3>

      {/* Category filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Category
        </label>

        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="mr-2 h-4 w-4 text-blue-500"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Gender
        </label>

        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 text-blue-500"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* Color filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Colors
        </label>

        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              type="button"
              name="color"
              value={color}
              key={color}
              onClick={handleFilterChange}
              aria-label={color}
              title={color}
              className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-105 ${
                filters.color === color
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">
          Sizes
        </label>

        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="w-4 h-4 text-blue-500 rounded border border-gray-300"
            />
            <span className="text-gray-600 ml-2">{size}</span>
          </div>
        ))}
      </div>

      {/* Brand filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Brands
        </label>

        {brands.map((brand) => (
          <div
            className="flex items-center mb-1"
            key={brand.value}
          >
            <input
              type="checkbox"
              name="brand"
              value={brand.value}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand.value)}
              className="w-4 h-4 text-blue-500 rounded border border-gray-300"
            />

            <span className="text-gray-600 ml-2">
              {brand.label}
            </span>
          </div>
        ))}
      </div>

      {/* Price range filter */}
      <div className="mb-6">
        <label className="text-gray-600 block font-medium mb-2">
          Maximum Price
        </label>

        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={100}
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />

        <div className="flex justify-between text-gray-600 mt-2">
          <span>Rs. 0</span>
          <span className="font-medium">
            Rs. {priceRange.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
