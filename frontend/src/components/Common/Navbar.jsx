import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineUser } from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const cartItemsCount = cart?.products?.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";
  const isNormalUser = isLoggedIn && !isAdmin;

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-medium">
          Oscar
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-6">
          <Link
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            to="/collections/all?gender=men"
          >
            Men
          </Link>

          <Link
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            to="/collections/all?gender=women"
          >
            Women
          </Link>

          <Link
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            to="/collections/all?category=Top%20Wear"
          >
            Top Wear
          </Link>

          <Link
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            to="/collections/all?category=Bottom%20Wear"
          >
            Bottom Wear
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Admin: only for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-black px-3 py-2 rounded text-sm text-white"
            >
              Admin Dashboard
            </Link>
          )}

          {/* Profile: only for normal users */}
          {isNormalUser && (
            <Link
              to="/profile"
              className="hover:text-black"
              title="My Profile"
              aria-label="My Profile"
            >
              <HiOutlineUser className="text-gray-700" size={22} />
            </Link>
          )}

          {/* Login: only when logged out */}
          {!isLoggedIn && (
            <Link to="/login" className="text-sm font-medium hover:text-black">
              Login
            </Link>
          )}

          {/* Cart: only for normal users */}
          {isNormalUser && (
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-black"
              aria-label={`Open cart, ${cartItemsCount} items`}
            >
              <FiShoppingBag className="text-gray-700" size={22} />

              {cartItemsCount > 0 && (
                <span className="absolute min-w-5 h-5 px-1 flex items-center justify-center -top-2 -right-2.5 text-white text-xs bg-[#ea2e0e] rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* Search */}
          <SearchBar />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden hover:text-black"
            aria-label="Toggle menu"
          >
            <HiBars3BottomRight size={22} />
          </button>
        </div>
      </nav>

      {/* Cart drawer: only for normal users */}
      {isNormalUser && (
        <CartDrawer
          drawerOpen={drawerOpen}
          toggleCartDrawer={toggleCartDrawer}
        />
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/10 z-40"
          />

          <div className="fixed top-0 left-0 w-2/4 sm:w-1/2 md:hidden bg-white h-full shadow-lg z-50">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button onClick={closeMobileMenu} aria-label="Close menu">
                <IoMdClose className="h-6 w-6 text-gray-400 hover:text-gray-900" />
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Menu</h2>

              <nav className="space-y-4">
                <Link
                  className="block text-gray-600 hover:text-black"
                  onClick={closeMobileMenu}
                  to="/collections/all?gender=men"
                >
                  Men
                </Link>

                <Link
                  className="block text-gray-600 hover:text-black"
                  onClick={closeMobileMenu}
                  to="/collections/all?gender=women"
                >
                  Women
                </Link>

                <Link
                  className="block text-gray-600 hover:text-black"
                  onClick={closeMobileMenu}
                  to="/collections/all?category=Top%20Wear"
                >
                  Top Wear
                </Link>

                <Link
                  className="block text-gray-600 hover:text-black"
                  onClick={closeMobileMenu}
                  to="/collections/all?category=Bottom%20Wear"
                >
                  Bottom Wear
                </Link>

                {/* Mobile admin dashboard */}
                {isAdmin && (
                  <Link
                    className="block text-gray-600 hover:text-black font-medium"
                    onClick={closeMobileMenu}
                    to="/admin"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Mobile profile: normal users only */}
                {isNormalUser && (
                  <Link
                    className="block text-gray-600 hover:text-black"
                    onClick={closeMobileMenu}
                    to="/profile"
                  >
                    My Profile
                  </Link>
                )}

                {/* Mobile login */}
                {!isLoggedIn && (
                  <Link
                    className="block text-gray-600 hover:text-black"
                    onClick={closeMobileMenu}
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
