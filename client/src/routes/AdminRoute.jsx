import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSkeleton />;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;