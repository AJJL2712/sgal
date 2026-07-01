import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import api from "../../services/api";

const HORAS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 7;
  return `${h.toString().padStart(2, "0")}:00`;
});

const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export default function Horarios() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");
  const [recursos, setRecursos] = useState([]);
  const [horariosPorRecurso, setHorariosPorRecurso] = useState({});
  const [expandido, setExpandido] = useState({});
  const [modal, setModal] = useState(false);
  const [celda, setCelda] = useState(null);
  const [form, setForm] = useState({ carrera: "", nivel: "" });
  const [error, setError] = useState("");

  const cerrarSesion = () => { localStorage.clear(); navigate("/"); };

  const cargarDatos = async () => {
    const res = await api.get("/recursos/");
    setRecursos(res.data);
    const mapa = {};
    const expandMap = {};
    for (const r of res.data) {
      const h = await api.get(`/recursos/${r.id}/horarios`);
      mapa[r.id] = h.data;
      expandMap[r.id] = false;
    }
    setHorariosPorRecurso(mapa);
    setExpandido(expandMap);
  };

  useEffect(() => { cargarDatos(); }, []);

  const getBloque = (recursoId, dia, hora) => {
    return (horariosPorRecurso[recursoId] || []).find((h) => {
      return h.dia === dia && h.hora_inicio.slice(0, 5) === hora;
    });
  };

  const abrirModal = (recursoId, dia, hora) => {
    setCelda({ recursoId, dia, hora });
    setForm({ carrera: "", nivel: "" });
    setError("");
    setModal(true);
  };

  const guardar = async () => {
    try {
      const horaFin = `${(parseInt(celda.hora) + 1).toString().padStart(2, "0")}:00`;
      await api.post(`/recursos/${celda.recursoId}/horarios`, {
        recurso_id: celda.recursoId,
        dia: celda.dia,
        hora_inicio: celda.hora,
        hora_fin: horaFin,
        carrera: form.carrera,
        nivel: form.nivel,
      });
      setModal(false);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar.");
    }
  };

  const eliminar = async (recursoId, horarioId) => {
    await api.delete(`/recursos/${recursoId}/horarios/${horarioId}`);
    cargarDatos();
  };

  const toggleExpandido = (id) => {
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1025 50%, #0d1117 100%)" }}>
      <div className="fixed w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0ea5e9, transparent)", top: "10%", left: "20%" }} />

      {/* Navbar */}
      <nav className="px-8 py-4 flex justify-between items-center"
        style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            onClick={() => navigate("/admin")}>
            <FiGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">SGAL</span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#8b7aa8" }}>{nombre}</span>
          <button onClick={cerrarSesion} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8b7aa8" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
            <FiLogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </nav>

      <div className="px-8 py-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-semibold">Gestionar Horarios</h2>
          <p className="text-sm mt-1" style={{ color: "#8b7aa8" }}>
            Configura los horarios de cada recurso. Haz click en una celda libre para asignar.
          </p>
        </div>

        <div className="space-y-6">
          {recursos.map((r) => (
            <div key={r.id} className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>

              {/* Header recurso */}
              <div className="flex justify-between items-center px-6 py-4 cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", borderBottom: expandido[r.id] ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                onClick={() => toggleExpandido(r.id)}>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{r.nombre}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: r.tipo === "laboratorio" ? "rgba(14,165,233,0.15)" : "rgba(79,70,229,0.15)",
                      color: r.tipo === "laboratorio" ? "#38bdf8" : "#818cf8",
                      border: r.tipo === "laboratorio" ? "1px solid rgba(14,165,233,0.3)" : "1px solid rgba(79,70,229,0.3)",
                    }}>
                    {r.tipo}
                  </span>
                  <span className="text-xs" style={{ color: "#6b6080" }}>
                    {(horariosPorRecurso[r.id] || []).length} bloques configurados
                  </span>
                </div>
                {expandido[r.id] ? <FiChevronUp style={{ color: "#8b7aa8" }} /> : <FiChevronDown style={{ color: "#8b7aa8" }} />}
              </div>

              {/* Grilla */}
              {expandido[r.id] && (
                <div className="overflow-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <th className="px-4 py-2 text-left text-xs w-16" style={{ color: "#6b6080" }}>Hora</th>
                        {DIAS.map((d) => (
                          <th key={d} className="px-3 py-2 text-left text-xs capitalize font-medium" style={{ color: "#8b7aa8" }}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HORAS.map((hora, i) => (
                        <tr key={hora} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className="px-4 py-1.5 text-xs font-mono" style={{ color: "#6b6080" }}>{hora}</td>
                          {DIAS.map((dia) => {
                            const bloque = getBloque(r.id, dia, hora);
                            return (
                              <td key={dia} className="px-2 py-1 min-w-36">
                                {bloque ? (
                                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer"
                                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}
                                    onClick={() => eliminar(r.id, bloque.id)}>
                                    <div>
                                      <p className="text-white font-medium">{bloque.carrera || "Sin carrera"}</p>
                                      <p style={{ color: "#a78bfa" }}>{bloque.nivel || ""}</p>
                                    </div>
                                    <span style={{ color: "#a78bfa" }}>✕</span>
                                  </div>
                                ) : (
                                  <div className="h-8 rounded-lg cursor-pointer transition"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}
                                    onClick={() => abrirModal(r.id, dia, hora)}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.08)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#1a1025", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-white font-semibold text-lg mb-1">Asignar horario</h3>
            <p className="text-sm mb-6 capitalize" style={{ color: "#8b7aa8" }}>
              {celda?.dia} — {celda?.hora} a {`${(parseInt(celda?.hora) + 1).toString().padStart(2, "0")}:00`}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Carrera</label>
                <input type="text" value={form.carrera}
                  onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                  placeholder="Ej: Ingeniería en Sistemas"
                  className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Nivel</label>
                <input type="text" value={form.nivel}
                  onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                  placeholder="Ej: 3er nivel"
                  className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")} />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{typeof error === "string" ? error : JSON.stringify(error)}</p>}
              <div className="flex gap-3">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm transition"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8b7aa8", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Cancelar
                </button>
                <button onClick={guardar}
                  className="flex-1 py-3 rounded-xl text-sm text-white font-semibold"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}