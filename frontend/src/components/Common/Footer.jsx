import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
const Footer = () => {
  return (
    <footer className="border-t-4 rounded-md border-[#ea2f0ed3]  py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-900 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>
          {/* newsletter form */}
          <form className="flex">
            <input
              required
              className="p-3 w-full text-sm border-t border-l border-b
          border-gray-300 rounded-l-md outline-none"
              type="email"
              placeholder="Enter your email"
            />
            <button className="py-3 px-6 rounded-r-md hover:opacity-95 bg-black text-sm text-white">
              Subscribe
            </button>
          </form>
        </div>
        {/* shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link className="hover:text-gray-600 " to="#">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 " to="#">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 " to="#">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>
        {/* support links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link className="hover:text-gray-600" to="#">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 " to="#">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 " to="#">
                FAQs
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 " to="#">
                Feature
              </Link>
            </li>
          </ul>
        </div>
        {/* follow us */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              className="hover:text-gray-500"
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TbBrandMeta size={22} />
            </a>
            <a
              className="hover:text-gray-500"
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoInstagram size={22} />
            </a>
            <a
              className="hover:text-gray-500"
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiTwitterXLine size={22} />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <FiPhoneCall size={20} className="inline-block mr-2" />
          +923195378220
        </div>
      </div>
      {/* footer bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-center text-gray-500 text-sm tracking-tighter">
          © 2026 Oscar. All Rights Reserved.
        </p>
        <p className="text-center text-gray-500 text-sm mt-2">
          Designed & Developed by{" "}
          <span className="font-semibold text-gray-800">Kashif Ali</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
