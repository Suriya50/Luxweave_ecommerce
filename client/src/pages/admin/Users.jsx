import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await api.put(`/users/${id}/block`);
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="text-center py-10 text-sm">Loading...</div>;

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-6 gold-text">Users</h1>

      <div className="space-y-2.5 sm:space-y-3">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-3 sm:p-4 flex flex-wrap items-center gap-3"
          >
            {/* Avatar */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-sm sm:text-base flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">{user.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            {/* Role & Status */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <span className="text-[9px] sm:text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                {user.role || 'user'}
              </span>
              <span className={`text-[9px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {user.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => handleBlock(user._id, user.isBlocked)}
                className={`p-1.5 rounded-lg transition ${
                  user.isBlocked ? 'text-green-500 hover:bg-green-50' : 'text-yellow-500 hover:bg-yellow-50'
                }`}
              >
                {user.isBlocked ? <FiUserCheck size={16} /> : <FiUserX size={16} />}
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">No users found</div>
      )}
    </div>
  );
};

export default Users;