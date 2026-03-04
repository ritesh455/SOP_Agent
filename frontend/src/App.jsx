import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          token
            ? role === "admin"
              ? <Navigate to="/admin" />
              : <Navigate to="/employee" />
            : <Navigate to="/login" />
        }
      />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Employee */}
      <Route
        path="/employee"
        element={
          token && role === "employee"
            ? <EmployeeDashboard />
            : <Navigate to="/login" />
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          token && role === "admin"
            ? <AdminDashboard />
            : <Navigate to="/login" />
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
