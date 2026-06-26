import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLogOut, FiGrid, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import api from "../../services/api";

export default function Usuarios() {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", contrasena: "", rol: "docente" });
  const [error, setError] = useState("");

  const cerrarSesion = () => { localStorage.clear(); navigate("/"); };

  const cargarUsuarios = async () => {
    const res = await api.get("/usuarios/");
    setUsuarios(res.data);
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", email: "", contrasena: "", rol: "docente" });
    setError("");
    setModal(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, contrasena: "", rol: u.rol });
    setError("");
    setModal(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await api.put(`/usuarios/${editando.id}`, {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
        });
      } else {
        await api.post("/usuarios/", form);
      }
      setModal(false);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al guardar.");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await api.delete(`/usuarios/${id}`);
    cargarUsuarios();
  };

  const rolColor = {
    admin: { bg: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "rgba(124,58,237,0.3)" },
    docente: { bg: "rgba(14,165,233,0.15)", color: "#38bdf8", border: "rgba(14,165,233,0.3)" },
    estudiante: { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1025 50%, #0d1117 100%)" }}>
      <div className="fixed w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)", top: "10%", left: "20%" }} />

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

      {/* Contenido */}
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-white text-2xl font-semibold">Gestionar Usuarios</h2>
            <p className="text-sm mt-1" style={{ color: "#8b7aa8" }}>Administra las cuentas del sistema.</p>
          </div>
          <button onClick={abrirCrear}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <FiPlus className="w-4 h-4" /> Nuevo usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Correo</th>
                <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Rol</th>
                <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Estado</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} style={{
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <td className="px-6 py-4 text-white text-sm">{u.nombre}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#8b7aa8" }}>{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: rolColor[u.rol]?.bg || "rgba(255,255,255,0.1)",
                        color: rolColor[u.rol]?.color || "#fff",
                        border: `1px solid ${rolColor[u.rol]?.border || "rgba(255,255,255,0.2)"}`,
                      }}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: u.activo ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                        color: u.activo ? "#34d399" : "#f87171",
                        border: u.activo ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                      }}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => abrirEditar(u)}
                        className="p-2 rounded-lg transition"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#8b7aa8" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminar(u.id)}
                        className="p-2 rounded-lg transition"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}>
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl p-8"
            style={{ background: "#1a1025", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-lg">
                {editando ? "Editar usuario" : "Nuevo usuario"}
              </h3>
              <button onClick={() => setModal(false)} style={{ color: "#8b7aa8" }}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {["nombre", "email", ...(editando ? [] : ["contrasena"])].map((campo) => (
                <div key={campo}>
                  <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>
                    {campo === "contrasena" ? "Contraseña" : campo.charAt(0).toUpperCase() + campo.slice(1)}
                  </label>
                  <input
                    type={campo === "contrasena" ? "password" : campo === "email" ? "email" : "text"}
                    value={form[campo]}
                    onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                    className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                    onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Rol</label>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <option value="docente" style={{ background: "#1a1025" }}>Docente</option>
                  <option value="estudiante" style={{ background: "#1a1025" }}>Estudiante</option>
                  <option value="admin" style={{ background: "#1a1025" }}>Administrador</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button onClick={guardar}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm transition mt-2"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <FiCheck className="w-4 h-4" />
                {editando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}