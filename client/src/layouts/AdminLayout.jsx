import { Outlet, Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar with Back Button */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 hover:text-gold-500 transition p-1 rounded-lg hover:bg-gold-50"
              title="Back to Dashboard"
            >
              <FiArrowLeft size={22} />
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-gold-500 transition flex items-center gap-1"
            >
              <FiHome size={16} /> Home
            </Link>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden sm:block">
            Admin Panel
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;