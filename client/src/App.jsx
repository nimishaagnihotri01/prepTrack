import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH PAGES (NO SIDEBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ⭐ ALL DASHBOARD PAGES USE MAINLAYOUT */}
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
        <Route path="/verify/:token" element={<Verify />} />

      </Routes>
    </Router>
  );
}
