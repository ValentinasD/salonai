import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPanel from "./pages/AdminPanel";
import UsersPage from "./pages/admin/UsersPage";
import HomePageComponent from "./pages/Home";


const App = () => {
  const { user } = useAuth();

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/profile" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePageComponent />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Apsaugotos maršruto vietos */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<UsersPage />} />
      </Route>
      {/* <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      /> */}
      {/* Neatpažintas kelias → redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
