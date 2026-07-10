import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSkeleton />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;