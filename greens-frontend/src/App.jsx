import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterCompany from "./pages/RegisterCompany";
import ForgotPassword from "./pages/ForgotPassword";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AdminList from "./admin/AdminList";
import ContractorDashboard from "./contractor/ContractorDashboard";
import ResetPassword from "./pages/ResetPassword";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Ładowanie...</div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Ładowanie...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.is_admin) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Brak uprawnień</h2>
          <p>Nie masz uprawnień administratora do tej sekcji.</p>
          <button onClick={() => window.history.back()}>Wróć</button>
        </div>
      </Layout>
    );
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Ładowanie...</div>
    );
  }

  return user ? <Navigate to="/" /> : children;
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/lista"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/ogloszenie/:id"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register-company"
          element={
            <PublicRoute>
              <RegisterCompany />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
        path="/reset-password"
        element={
            <PublicRoute>
            <ResetPassword />
            </PublicRoute>
        }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="container">
                  <h1>Profil użytkownika</h1>
                  <p>Ta strona wymaga logowania!</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Layout>
                <AdminList />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/contractor/*"
          element={
            <ProtectedRoute>
              <Layout>
                <ContractorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
