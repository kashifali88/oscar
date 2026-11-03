
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const search = searchTerm.trim();

    if (!search) return;

    navigate(`/collections/all?search=${encodeURIComponent(search)}`);

    setIsOpen(false);
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={closeSearch}
          className="fixed inset-0 bg-black/10 z-40"
        />
      )}

      <div
        className={`flex items-center justify-center ${
          isOpen
            ? "fixed top-0 left-0 w-full h-24 bg-white z-50 shadow-md"
            : "relative"
        }`}
      >
        {isOpen ? (
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center w-full px-4"
          >
            <div className="relative w-full max-w-xl">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full bg-gray-100 px-4 py-3 pr-24"
              />

              <button
                type="submit"
                aria-label="Search products"
                className="absolute top-1/2 right-12 -translate-y-1/2 text-gray-600 hover:text-orange-600"
              >
                <HiMagnifyingGlass size={22} />
              </button>

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-red-500"
              >
                <HiMiniXMark size={22} />
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open search"
            className="flex items-center text-gray-700 hover:text-orange-600"
          >
            <HiMagnifyingGlass size={22} />
          </button>
        )}
      </div>
    </>
  );
};

export default SearchBar;
