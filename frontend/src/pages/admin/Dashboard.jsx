import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SGAL - Panel Administrador</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Bienvenido, {nombre}</span>
          <button
            onClick={cerrarSesion}
            className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Panel de Administración
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
            <h3 className="font-semibold text-gray-700">Gestionar Usuarios</h3>
            <p className="text-gray-400 text-sm mt-1">UC002</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
            <h3 className="font-semibold text-gray-700">Gestionar Recursos</h3>
            <p className="text-gray-400 text-sm mt-1">UC003</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-600">
            <h3 className="font-semibold text-gray-700">Generar Reportes</h3>
            <p className="text-gray-400 text-sm mt-1">UC006</p>
          </div>
        </div>
      </div>
    </div>
  );
}