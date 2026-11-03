
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Hero from "../components/Common/Hero";
import CollectionSection from "../components/Products/CollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollections from "../components/Products/FeaturedCollections";
import FeaturedSection from "../components/Products/FeaturedSection";

import { fetchProductsByFilters } from "../store/slices/productSlice";
import WhatsApp from "../components/Common/WhatsApp";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [bestSellerError, setBestSellerError] = useState("");

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSellers = async () => {
      try {
        setBestSellerLoading(true);
        setBestSellerError("");

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/products/best-seller`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch best sellers");
        }

        setBestSellerProducts(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (err) {
        setBestSellerError(err.message || "Failed to fetch best sellers");
      } finally {
        setBestSellerLoading(false);
      }
    };

    fetchBestSellers();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <CollectionSection />
      <NewArrivals />

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl text-center font-bold mb-4">
          Best Sellers
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Shop our most-loved styles chosen by customers.
        </p>

        <ProductGrid
          products={bestSellerProducts}
          loading={bestSellerLoading}
          error={bestSellerError}
        />
      </section>

      {/* Women's Bottom Wear */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl text-center font-bold mb-4 text-gray-900">
          Bottom Wear for Women
        </h2>

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
        />
      </section>

      <FeaturedCollections />
      <FeaturedSection />
      <WhatsApp />

    </div>
  );
};

export default Home;
