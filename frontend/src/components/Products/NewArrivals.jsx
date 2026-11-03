import { useEffect } from "react";
import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const NewArrivals = () => {
  const scrollRef = useRef(null);

  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/products/new-arrivals`,
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "failed to fetch new arrivals");
          return;
        }
        setNewArrivals(data.products);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchNewArrivals();
  }, []);

  const updateButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    setIsStart(container.scrollLeft <= 0);
    setIsEnd(
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 5,
    );
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });

    setTimeout(updateButtons, 350);
  };

  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Explore New Arrivals
          </h2>

          <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
            Discover our latest styles straight off the runway. Keep your
            wardrobe on the cutting edge of fashion.
          </p>

          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={isStart}
              className={`w-11 h-11 rounded-full border shadow ${
                isStart
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <FiChevronLeft className="mx-auto text-xl" />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={isEnd}
              className={`w-11 h-11 rounded-full border shadow ${
                isEnd
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <FiChevronRight className="mx-auto text-xl" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={updateButtons}
          className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {Array.isArray(newArrivals) &&
            newArrivals.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[190px] sm:w-[220px] md:w-[250px] snap-start"
              >
                <div className="bg-white p-4 rounded-lg group">
                  <div className="overflow-hidden rounded-xl bg-gray-100">
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.images[0].alt}
                        className="w-full h-64 md:h-80 object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  <div className="px-2">
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block group"
                    >
                    <h3 className="mt-3 font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    </Link>

                    <p className="text-gray-400 line-through">
                      Rs. {product.price}
                    </p>

                    <p className="text-xl font-bold text-[#ea2e0e]">
                      Rs. {product.discountedPrice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
