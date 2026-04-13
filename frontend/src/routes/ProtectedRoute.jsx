import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleSlugMap = {
  'ADMINISTRATEUR': 'administrateur',
  'RESPONSABLE': 'responsable',
  'UTILISATEUR': 'utilisateur'
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const { role: urlRole } = useParams();

  if (!user) return <Navigate to="/login" replace />;

  // 1. Check if user role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 2. If :role exists in URL, verify it matches user's role
  const correctSlug = roleSlugMap[user.role];
  if (urlRole && urlRole !== correctSlug) {
    // Replace the first segment of the path with the correct slug
    const newPath = location.pathname.replace(`/${urlRole}`, `/${correctSlug}`);
    return <Navigate to={newPath} replace />;
  }

  return children;
};

export default ProtectedRoute;