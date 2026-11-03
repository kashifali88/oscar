import React from "react";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

const navLinkClass = ({ isActive }) => {
  return `flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 ${
    isActive ? "bg-gray-700" : ""
  }`;
};
const AdminSidebar = ({toggleSidebar}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = () => {
    try {
      dispatch(logout())
    toast.success("Admin Logged Out Successfully")
    navigate("/", {replace: true});
    } catch (error) {
      toast.error(error.message || "failed to logout")
    }
    
  }
  
  
 
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          Oscar
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink onClick={toggleSidebar}  to="/admin/users" className={navLinkClass}>
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink onClick={toggleSidebar} to="/admin/products" className={navLinkClass}>
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>
        <NavLink onClick={toggleSidebar} to="/admin/create-product" className={navLinkClass}>
          <FaBoxOpen />
          <span>Create-Product</span>
        </NavLink>

        <NavLink onClick={toggleSidebar} to="/admin/orders" className={navLinkClass}>
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink onClick={toggleSidebar} to="/" className={navLinkClass}>
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div>
        <button
          className="w-full bg-red-500 mt-2 text-white px-4 py-2 rounded justify-center flex items-center hover:bg-red-600 space-x-2"
          onClick={handleLogout}
        >
            <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
