import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from '../components/Products/ProductGrid'
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../store/slices/productSlice";
const CollectionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { collection } = useParams();
  const [searchParams] = useSearchParams(); 
  const dispatch = useDispatch();
  const { products, loading, error, } = useSelector((state)=> state.products);
  const queryParams = Object.fromEntries([...searchParams])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


const queryString = searchParams.toString();

useEffect(() => {
  const queryParams = Object.fromEntries(
    new URLSearchParams(queryString)
  );

  // "all" means show all products, not a collection named "all"
  const filters = {
    ...queryParams,
    ...(collection && collection.toLowerCase() !== "all"
      ? { collection }
      : {}),
  };

  dispatch(fetchProductsByFilters(filters));
}, [dispatch, collection, queryString]);




  // Close sidebar when clicking outside of it (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

 


  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden w-full border-b border-gray-200 shadow-sm px-4 py-3 flex justify-end  items-center bg-white"
      >
        <span className="font-medium text-gray-900 mr-2">Filters</span>
        <FaFilter className="text-gray-500" />
      </button>

      {/* Mobile overlay — only shows when sidebar is open, only on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}
          
         {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white overflow-y-auto
                  transform transition-transform duration-300
                  lg:static lg:translate-x-0 lg:w-64 lg:transform-none
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <FilterSidebar />
      </div>
      <div className="grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort options */}
        <SortOptions />
        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
