import { useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut, FiGrid } from "react-icons/fi";

export default function DashboardEstudiante() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const modulos = [
    {
      titulo: "Consultar Información",
      descripcion: "Revisa disponibilidad de espacios, horarios de clases y detalle de equipos.",
      uc: "UC005",
      icono: <FiSearch className="w-6 h-6" />,
      color: "#10b981",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1025 50%, #0d1117 100%)" }}
    >
      <div
        className="fixed w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)", top: "10%", left: "20%" }}
      />

      <nav
        className="px-8 py-4 flex justify-between items-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <FiGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">SGAL</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            Estudiante
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#8b7aa8" }}>{nombre}</span>
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8b7aa8",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            <FiLogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </nav>

      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-semibold">Panel Estudiante</h2>
          <p className="text-sm mt-1" style={{ color: "#8b7aa8" }}>
            Consulta la información de espacios y horarios disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modulos.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.border = `1px solid ${m.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}30` }}
                >
                  {m.icono}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{m.titulo}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${m.color}20`, color: m.color }}>
                      {m.uc}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#6b6080" }}>{m.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}