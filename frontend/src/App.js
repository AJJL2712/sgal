import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardAdmin from "./pages/admin/Dashboard";
import DashboardDocente from "./pages/docente/Dashboard";
import DashboardEstudiante from "./pages/estudiante/Dashboard";
import Usuarios from "./pages/admin/Usuarios";

const PrivateRoute = ({ children, rol }) => {
  const token = localStorage.getItem("token");
  const rolGuardado = localStorage.getItem("rol");

  if (!token) return <Navigate to="/" />;
  if (rol && rolGuardado !== rol) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute rol="admin">
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/docente"
          element={
            <PrivateRoute rol="docente">
              <DashboardDocente />
            </PrivateRoute>
          }
        />
        <Route
          path="/estudiante"
          element={
            <PrivateRoute rol="estudiante">
              <DashboardEstudiante />
            </PrivateRoute>
          }
        />

      <Route path="/admin/usuarios" element={<PrivateRoute rol="admin"><Usuarios /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}