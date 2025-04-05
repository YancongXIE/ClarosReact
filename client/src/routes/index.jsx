import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/main';
import ProjectManagement from '../sections/project-management/ProjectManagement';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/project-management',
        element: <ProjectManagement />,
      },
      // ... 其他路由
    ],
  },
];

export default routes; 