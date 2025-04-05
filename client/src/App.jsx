import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { AiAnalysisProvider } from "./context/AiAnalysisProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// layout imports:
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
// public pages imports:
import LandingPage from "./pages/public-pages/LandingPage";
// private (dashboard) page imports:
import DashboardHome from "./pages/data-vis-pages/DashboardHome";
import DataAnalyst from "./pages/data-vis-pages/DataAnalyst";
import RankingExercise from "./pages/data-vis-pages/RankingExercise";
import Guide from "./pages/data-vis-pages/Guide";
import Settings from "./pages/data-vis-pages/Settings";
import UserManagement from "./pages/data-vis-pages/UserManagement";
import ProjectManagement from "./sections/project-management/ProjectManagement";
// auth imports:
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />

          <Route
            path="/dataanalyst"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DataAnalyst />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ranking-exercise"
            element={
              <ProtectedRoute allowedRoles={['respondent']}>
                <DashboardLayout>
                  <RankingExercise />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AiAnalysisProvider>
                    <DashboardHome />
                  </AiAnalysisProvider>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Guide />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-management"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <DashboardLayout>
                  <ProjectManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Handle all non-existent paths, redirect to /dataanalyst */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dataanalyst" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
