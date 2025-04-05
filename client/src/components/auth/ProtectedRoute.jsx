import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const ProtectedRoute = ({ children, allowedRoles = ['manager', 'admin', 'respondent'] }) => {
  const { user } = useContext(AuthContext);
  const currentPath = window.location.pathname;

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 检查用户角色
  const userRole = user.role;

  // 如果是respondent用户，限制访问
  if (userRole === 'respondent') {
    // respondent用户只能访问这些路径
    const allowedPaths = ['/ranking-exercise', '/guide'];
    
    // 如果访问的不是允许的路径，重定向到ranking exercise
    if (!allowedPaths.includes(currentPath)) {
      return <Navigate to="/ranking-exercise" replace />;
    }
  }

  // 如果是admin用户，限制访问用户管理页面
  if (userRole === 'admin' && currentPath === '/usermanagement') {
    return <Navigate to="/dashboard" replace />;
  }

  // 如果用户角色在允许列表中，显示内容
  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // 如果用户角色不在允许列表中，重定向到ranking application
  return <Navigate to="/dataanalyst" replace />;
};

export default ProtectedRoute; 