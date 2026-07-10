import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiSave, FiLogOut, FiKey } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put('/profile', data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    if (!oldPassword || !newPassword) {
      toast.error('Fill all fields');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put('/profile/password', { oldPassword, newPassword });
      toast.success('Password changed successfully');
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold gold-text">My Profile</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your account settings</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300"
        >
          <FiLogOut size={16} /> <span className="hidden xs:inline">Logout</span>
        </button>
      </div>

      {/* User Avatar / Greeting */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-gold-50/50 to-white rounded-xl border border-gold-100/50">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800">{user?.name || 'User'}</h2>
          <p className="text-xs sm:text-sm text-gray-500">{user?.email || ''}</p>
          <span className="inline-block text-[10px] sm:text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full mt-0.5 font-medium">
            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-5 sm:gap-8">
        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white rounded-xl shadow-luxury p-4 sm:p-6 border border-gray-50"
        >
          <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center gap-2 gold-text">
            <FiUser size={18} /> Edit Profile
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" /> {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-gold-500/30 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave size={16} /> Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 bg-white rounded-xl shadow-luxury p-4 sm:p-6 border border-gray-50"
        >
          <h2 className="text-sm sm:text-lg font-semibold mb-4 flex items-center gap-2 gold-text">
            <FiKey size={18} /> Change Password
          </h2>
          <form onSubmit={changePassword} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Old Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-gold-500/30 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiLock size={16} /> Update Password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-[10px] sm:text-xs text-gray-400">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
        </p>
      </div>
    </div>
  );
};

export default Profile;