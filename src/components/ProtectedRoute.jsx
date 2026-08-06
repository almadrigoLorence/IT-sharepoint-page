import { Navigate } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAcademy();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
