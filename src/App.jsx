import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JournalPage from "./pages/JournalPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user , isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/journal" replace /> : <LoginPage />}
        /> */}



        <Route
  path="/login"
  element={
    isAuthenticated ? (
      <Navigate
        to={user?.role?.[0] === "ADMIN" ? "/admin" : "/journal"}
        replace
      />
    ) : (
      <LoginPage />
    )
  }
/>


        
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/journal" replace /> : <SignupPage />}
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute> 
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/journal" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
