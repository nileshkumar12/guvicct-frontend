import React from "react";
import { useForm } from "react-hook-form";
import { API_URLS } from "../../utils/config";
import { useToast } from '../../components/ToastProvider.jsx'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from 'react-router-dom'



const getAuthToken = () => {
  const candidates = [
    localStorage.getItem('token'),
    localStorage.getItem('accessToken'),
    localStorage.getItem('authToken'),
    localStorage.getItem('jwt'),
  ]

  return candidates.find((value) => `${value || ''}`.trim()) || ''
}
const AdminChangePassword = ({ onButtonClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(!!getAuthToken());
  const { register, handleSubmit, watch, reset, formState: { errors }, } = useForm();
  const { addToast } = useToast();
  const newPassword = watch("newPassword");
  
  const [userEmail, setUserEmail] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u).email : ''
    } catch (e) {
      return ''
    }
  });

  const handleSignOut = () => {
    ;['token', 'accessToken', 'authToken', 'jwt', 'user'].forEach((key) => {
      localStorage.removeItem(key)
    })

    setAccountOpen(false)
    setIsLogged(false)
    setUserRole(null)
    setUserEmail('')

  }
  const [userRole, setUserRole] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u).role : null
    } catch (e) {
      return null
    }
  });

  const onSubmit = async (data) => {

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URLS}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to change password");
      }

      addToast("Password changed successfully. Please login again.", "success");

      handleSignOut();

      reset();

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {

      addToast(error.message || "Something went wrong", "error");

    }
  };

  return (
    <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <div className="max-w-lg bg-white rounded-xl shadow-md ">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Change Password
      </h2>

      <p className="text-gray-500 mb-6">
        Update your account password securely.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>

          <input
            type="password"
            placeholder="Enter current password"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />

          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Change Password
        </button>
         <button
          type="button" onClick={onButtonClick}
          className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        </div>
      </form>
          </div>
    </div>
    </div>
  );
};

export default AdminChangePassword;