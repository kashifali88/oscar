import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../store/slices/adminUserSlice";

const UserManagement = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.adminUsers
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  // Fetch real users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createUser(formData)).unwrap();

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "customer",
      });

      alert("User created successfully");
    } catch (error) {
      alert(error);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, newRole) => {
    try {
      await dispatch(
        updateUser({
          id: userId,
          role: newRole,
        })
      ).unwrap();

      alert("User role updated successfully");
    } catch (error) {
      alert(error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await dispatch(deleteUser(userId)).unwrap();
      alert("User deleted successfully");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Add New User */}
      <div className="p-6 rounded-lg mb-6 shadow">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full p-2 outline-none border border-gray-300 rounded"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="w-full p-2 outline-none border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full p-2 outline-none border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Add User"}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        {loading && users.length === 0 && (
          <p className="p-4">Loading users...</p>
        )}

        {error && <p className="p-4 text-red-500">{error}</p>}

        <table className="min-w-full text-left text-gray-500">
          <thead className="text-xs bg-gray-100 uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>

                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    className="outline-none border border-gray-300 p-2 rounded"
                    onChange={(e) =>
                      handleChangeRole(user._id, e.target.value)
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
