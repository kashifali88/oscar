import React from "react";
import { Link } from "react-router-dom";
import menCollection from "../../assets/homeCollection/men-collection.png";
import womenCollection from "../../assets/homeCollection/women-collection.png";

const CollectionSection = () => {
  return (
    <section className="py-10 md:py-16 px-2 lg:px-0">
        <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Collections
      </h2>
      <p className="mt-2 text-gray-600">
        Discover our latest styles for every occasion.
      </p>
    </div>
    
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8">
        {/* Women's Collection */}
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src={womenCollection}
            alt="Women's Collection"
            className="
              w-full
              h-44
              sm:h-56
              md:h-96
              lg:h-[420px]
              object-cover
              object-top
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              bottom-2
              left-2
              md:bottom-6
              md:left-6
              w-[85%]
              md:w-2/5
              bg-white/95
              rounded-lg
              px-2
              py-2
              md:px-4
              md:py-4
              shadow-xl
            "
          >
            <h2 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 whitespace-nowrap">
              Women's Collection
            </h2>

            <Link
              to="/collections/all?gender=women"
              className="
                inline-block
                mt-1
                md:mt-2
                text-[11px]
                sm:text-xs
                md:text-sm
                font-medium
                text-[#ea2e0e]
                hover:underline
              "
            >
              Shop Now →
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src={menCollection}
            alt="Men's Collection"
            className="
              w-full
              h-44
              sm:h-56
              md:h-96
              lg:h-[420px]
              object-cover
              object-top
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              bottom-2
              left-2
              md:bottom-6
              md:left-6
              w-[85%]
              md:w-2/5
              bg-white/95
              rounded-lg
              px-2
              py-2
              md:px-4
              md:py-4
              shadow-xl
            "
          >
            <h2 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 whitespace-nowrap">
              Men's Collection
            </h2>

            <Link
              to="/collections/all?gender=men"
              className="
                inline-block
                mt-1
                md:mt-2
                text-[11px]
                sm:text-xs
                md:text-sm
                font-medium
                text-[#ea2e0e]
                hover:underline
              "
            >
              Shop Now →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CollectionSection;