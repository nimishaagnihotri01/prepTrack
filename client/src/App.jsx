import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Learning = lazy(() => import("./pages/Learning"));
const Profile = lazy(() => import("./pages/Profile"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const MainLayout = lazy(() => import("./components/MainLayout"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef3f9] text-[#0f2a44]">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Learning />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
