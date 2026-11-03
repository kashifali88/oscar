
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    FiEdit2,
    FiX,
    FiSave,
    FiUser,
    FiCamera,
    FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";

import MyOrdersPage from "./MyOrdersPage";
import { logout } from "../store/slices/authSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        profile: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/user/fetch`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch profile");
            }

            setProfile({
                username: data.user.username || "",
                email: data.user.email || "",
                profile: data.user.profile || "",
            });
        } catch (error) {
            toast.error(error.message || "Failed to load profile");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Clean up image preview URL
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Handle username and email changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle password changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Select profile image
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB");
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setEditMode(true);
    };

    // Upload image using your existing Cloudinary upload route
    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Image upload failed");
        }

        if (!data.data) {
            throw new Error("Cloudinary did not return an image URL");
        }

        return data.data;
    };

    // Save profile
    const handleSave = async () => {
        if (!profile.username.trim() || !profile.email.trim()) {
            return toast.error("Please fill all required fields");
        }

        if (
            profile.username.trim().length < 4 ||
            profile.username.trim().length > 32
        ) {
            return toast.error("Username must be 4–32 characters");
        }

        const hasPassword =
            passwords.currentPassword ||
            passwords.newPassword ||
            passwords.confirmPassword;

        if (
            hasPassword &&
            (!passwords.currentPassword ||
                !passwords.newPassword ||
                !passwords.confirmPassword)
        ) {
            return toast.error("Please complete all password fields");
        }

        if (
            hasPassword &&
            passwords.newPassword.length < 6
        ) {
            return toast.error("Password must be at least 6 characters");
        }

        if (
            hasPassword &&
            passwords.newPassword !== passwords.confirmPassword
        ) {
            return toast.error("New passwords do not match");
        }

        try {
            setLoading(true);

            // Upload selected image first
            let profileImageUrl = profile.profile;

            if (selectedFile) {
                profileImageUrl = await uploadProfileImage(selectedFile);
            }

            // Prepare JSON data
            const body = {
                username: profile.username.trim(),
                email: profile.email.trim(),
                profile: profileImageUrl,
            };

            // Add password fields if user wants to change password
            if (hasPassword) {
                body.currentPassword = passwords.currentPassword;
                body.newPassword = passwords.newPassword;
                body.confirmPassword = passwords.confirmPassword;
            }

            // Update user profile
            const response = await fetch(`${BACKEND_URL}/user/update`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Update frontend state
            setProfile({
                username: data.user.username || "",
                email: data.user.email || "",
                profile: data.user.profile || "",
            });

            setSelectedFile(null);
            setPreview("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setEditMode(false);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditMode(false);
        setSelectedFile(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        fetchProfile();
    };

    // Logout
    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    // Delete account
    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            return toast.error("Please enter your password");
        }

        try {
            setDeleting(true);

            const response = await fetch(`${BACKEND_URL}/user/delete`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: deletePassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete account");
            }

            dispatch(logout());

            toast.success("Your account has been deleted");
            navigate("/register");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setDeleting(false);
        }
    };

    const profileImage =
        preview ||
        (profile.profile && profile.profile !== "img"
            ? profile.profile
            : "");

    // Loading screen
    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 md:px-6">

                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    My Account
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* PROFILE SECTION */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white shadow-sm border rounded-xl p-6">

                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    My Profile
                                </h2>

                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="p-2 rounded-full hover:bg-orange-50 text-[#ea2e0e]"
                                        title="Edit profile"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                                        title="Cancel editing"
                                    >
                                        <FiX size={22} />
                                    </button>
                                )}
                            </div>

                            {/* PROFILE IMAGE */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">

                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-orange-100"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center text-[#ea2e0e]">
                                            <FiUser size={50} />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="absolute bottom-0 right-0 bg-[#ea2e0e] text-white p-2 rounded-full shadow-md hover:bg-[#c9250b]"
                                        title="Change profile picture"
                                    >
                                        <FiCamera size={18} />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-400 mb-6">
                                Click the camera icon to change your picture
                            </p>

                            {/* USERNAME */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-2">
                                    Username
                                </label>

                                {editMode ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        minLength={4}
                                        maxLength={32}
                                        className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#ea2e0e]"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800">
                                        {profile.username || "No username"}
                                    </p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-500 mb-2">
                                    Email Address
                                </label>

                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#ea2e0e]"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800 break-all">
                                        {profile.email || "No email"}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD UPDATE */}
                            {editMode && (
                                <div className="border-t pt-5 mt-5">
                                    <h3 className="font-semibold mb-4">
                                        Change Password
                                    </h3>

                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwords.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Current password"
                                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#ea2e0e]"
                                        />

                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="New password"
                                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#ea2e0e]"
                                        />

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#ea2e0e]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SAVE BUTTON */}
                            {editMode && (
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 mt-6 rounded-lg px-4 py-3 text-white bg-[#ea2e0e] hover:bg-[#c9250b] disabled:opacity-60"
                                >
                                    <FiSave />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            )}

                            {/* LOGOUT */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-4 rounded-lg px-4 py-3 text-white bg-gray-800 hover:bg-gray-900"
                            >
                                Logout
                            </button>

                            {/* DELETE ACCOUNT */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-red-600 border border-red-200 hover:bg-red-50"
                            >
                                <FiTrash2 />
                                Delete Account
                            </button>

                        </div>
                    </div>

                    {/* ORDERS SECTION */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white shadow-sm border rounded-xl p-4 md:p-6">
                            <MyOrdersPage />
                        </div>
                    </div>

                </div>
            </div>

            {/* DELETE ACCOUNT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-red-600">
                                Delete Account
                            </h2>

                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletePassword("");
                                }}
                                className="text-gray-500 hover:text-black"
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-5">
                            Are you sure you want to permanently delete your
                            account? Enter your password to confirm. This
                            action cannot be undone.
                        </p>

                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) =>
                                setDeletePassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-red-500"
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletePassword("");
                                }}
                                className="flex-1 border rounded-lg py-3 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 bg-red-500 text-white rounded-lg py-3 hover:bg-red-600 disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
