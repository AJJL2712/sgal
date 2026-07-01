import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiClock } from "react-icons/fi";
import api from "../../services/api";

export default function Recursos() {
    const navigate = useNavigate();
    const nombre = localStorage.getItem("nombre");
    const [recursos, setRecursos] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalHorario, setModalHorario] = useState(false);
    const [editando, setEditando] = useState(null);
    const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [form, setForm] = useState({ nombre: "", tipo: "aula", ubicacion: "", capacidad: "", estado: "disponible" });
    const [formHorario, setFormHorario] = useState({ dia: "lunes", hora_inicio: "", hora_fin: "" });
    const [error, setError] = useState("");

    const cerrarSesion = () => { localStorage.clear(); navigate("/"); };

    const cargarRecursos = async () => {
        const res = await api.get("/recursos/");
        setRecursos(res.data);
    };

    useEffect(() => { cargarRecursos(); }, []);

    const abrirCrear = () => {
        setEditando(null);
        setForm({ nombre: "", tipo: "aula", ubicacion: "", capacidad: "", estado: "disponible" });
        setError("");
        setModal(true);
    };

    const abrirEditar = (r) => {
        setEditando(r);
        setForm({ nombre: r.nombre, tipo: r.tipo, ubicacion: r.ubicacion, capacidad: r.capacidad, estado: r.estado });
        setError("");
        setModal(true);
    };

    const guardar = async () => {
        try {
            if (editando) {
                await api.put(`/recursos/${editando.id}`, { ...form, capacidad: parseInt(form.capacidad) });
            } else {
                await api.post("/recursos/", { ...form, capacidad: parseInt(form.capacidad) });
            }
            setModal(false);
            cargarRecursos();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al guardar.");
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar este recurso?")) return;
        await api.delete(`/recursos/${id}`);
        cargarRecursos();
    };

    const abrirHorarios = async (r) => {
        setRecursoSeleccionado(r);
        const res = await api.get(`/recursos/${r.id}/horarios`);
        setHorarios(res.data);
        setFormHorario({ dia: "lunes", hora_inicio: "", hora_fin: "" });
        setError("");
        setModalHorario(true);
    };

    const guardarHorario = async () => {
        try {
            await api.post(`/recursos/${recursoSeleccionado.id}/horarios`, {
                ...formHorario,
                recurso_id: recursoSeleccionado.id,
            });
            const res = await api.get(`/recursos/${recursoSeleccionado.id}/horarios`);
            setHorarios(res.data);
            setFormHorario({ dia: "lunes", hora_inicio: "", hora_fin: "" });
            setError("");
        } catch (err) {
            setError(err.response?.data?.detail || "Error al guardar horario.");
        }
    };

    const eliminarHorario = async (horarioId) => {
        await api.delete(`/recursos/${recursoSeleccionado.id}/horarios/${horarioId}`);
        const res = await api.get(`/recursos/${recursoSeleccionado.id}/horarios`);
        setHorarios(res.data);
    };

    const tipoColor = {
        aula: { bg: "rgba(79,70,229,0.15)", color: "#818cf8", border: "rgba(79,70,229,0.3)" },
        laboratorio: { bg: "rgba(14,165,233,0.15)", color: "#38bdf8", border: "rgba(14,165,233,0.3)" },
    };

    const estadoColor = {
        disponible: { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
        mantenimiento: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
    };

    const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    const inputStyle = {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
    };

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1025 50%, #0d1117 100%)" }}>
            <div className="fixed w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #4f46e5, transparent)", top: "10%", left: "20%" }} />

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
                        <h2 className="text-white text-2xl font-semibold">Gestionar Recursos</h2>
                        <p className="text-sm mt-1" style={{ color: "#8b7aa8" }}>Administra aulas y laboratorios.</p>
                    </div>
                    <button onClick={abrirCrear}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                        <FiPlus className="w-4 h-4" /> Nuevo recurso
                    </button>
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                {["Nombre", "Tipo", "Ubicación", "Capacidad", "Estado", ""].map((h) => (
                                    <th key={h} className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recursos.map((r, i) => (
                                <tr key={r.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                    <td className="px-6 py-4 text-white text-sm">{r.nombre}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full"
                                            style={{ background: tipoColor[r.tipo]?.bg, color: tipoColor[r.tipo]?.color, border: `1px solid ${tipoColor[r.tipo]?.border}` }}>
                                            {r.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm" style={{ color: "#8b7aa8" }}>{r.ubicacion}</td>
                                    <td className="px-6 py-4 text-sm" style={{ color: "#8b7aa8" }}>{r.capacidad}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full"
                                            style={{ background: estadoColor[r.estado]?.bg, color: estadoColor[r.estado]?.color, border: `1px solid ${estadoColor[r.estado]?.border}` }}>
                                            {r.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button onClick={() => abrirHorarios(r)} className="p-2 rounded-lg transition"
                                                style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,165,233,0.2)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(14,165,233,0.1)")}>
                                                <FiClock className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => abrirEditar(r)} className="p-2 rounded-lg transition"
                                                style={{ background: "rgba(255,255,255,0.05)", color: "#8b7aa8" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => eliminar(r.id)} className="p-2 rounded-lg transition"
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

            {/* Modal Recurso */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                    <div className="w-full max-w-md rounded-2xl p-8" style={{ background: "#1a1025", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-semibold text-lg">{editando ? "Editar recurso" : "Nuevo recurso"}</h3>
                            <button onClick={() => setModal(false)} style={{ color: "#8b7aa8" }}><FiX className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            {[["nombre", "Nombre", "text"], ["ubicacion", "Ubicación", "text"], ["capacidad", "Capacidad", "number"]].map(([campo, label, tipo]) => (
                                <div key={campo}>
                                    <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>{label}</label>
                                    <input type={tipo} value={form[campo]} onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                                        className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                        style={inputStyle}
                                        onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                                        onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Tipo</label>
                                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                    className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                    style={inputStyle}>
                                    <option value="aula" style={{ background: "#1a1025" }}>Aula</option>
                                    <option value="laboratorio" style={{ background: "#1a1025" }}>Laboratorio</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Estado</label>
                                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
                                    className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                    style={inputStyle}>
                                    <option value="disponible" style={{ background: "#1a1025" }}>Disponible</option>
                                    <option value="mantenimiento" style={{ background: "#1a1025" }}>Mantenimiento</option>
                                </select>
                            </div>
                            {error && <p className="text-red-400 text-xs text-center">{typeof error === "string" ? error : JSON.stringify(error)}</p>}
                            <button onClick={guardar}
                                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm mt-2"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                                <FiCheck className="w-4 h-4" />
                                {editando ? "Guardar cambios" : "Crear recurso"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Horarios */}
            {modalHorario && (
                <div className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                    <div className="w-full max-w-lg rounded-2xl p-8" style={{ background: "#1a1025", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-semibold text-lg">Horarios — {recursoSeleccionado?.nombre}</h3>
                            <button onClick={() => setModalHorario(false)} style={{ color: "#8b7aa8" }}><FiX className="w-5 h-5" /></button>
                        </div>

                        {/* Lista horarios */}
                        <div className="mb-6 space-y-2 max-h-48 overflow-y-auto">
                            {horarios.length === 0 && (
                                <p className="text-sm text-center py-4" style={{ color: "#6b6080" }}>Sin horarios configurados.</p>
                            )}
                            {horarios.map((h) => (
                                <div key={h.id} className="flex justify-between items-center px-4 py-3 rounded-xl"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    <span className="text-white text-sm capitalize">{h.dia}</span>
                                    <span className="text-sm" style={{ color: "#8b7aa8" }}>{h.hora_inicio} — {h.hora_fin}</span>
                                    <button onClick={() => eliminarHorario(h.id)} style={{ color: "#f87171" }}>
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Agregar horario */}
                        <div className="space-y-3">
                            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#8b7aa8" }}>Agregar horario</p>
                            <select value={formHorario.dia} onChange={(e) => setFormHorario({ ...formHorario, dia: e.target.value })}
                                className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                style={inputStyle}>
                                {dias.map((d) => <option key={d} value={d} style={{ background: "#1a1025" }} className="capitalize">{d}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: "#8b7aa8" }}>Hora inicio</label>
                                    <input type="time" value={formHorario.hora_inicio}
                                        onChange={(e) => setFormHorario({ ...formHorario, hora_inicio: e.target.value })}
                                        className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                        style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: "#8b7aa8" }}>Hora fin</label>
                                    <input type="time" value={formHorario.hora_fin}
                                        onChange={(e) => setFormHorario({ ...formHorario, hora_fin: e.target.value })}
                                        className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none"
                                        style={inputStyle} />
                                </div>
                            </div>
                            {error && <p className="text-red-400 text-xs text-center">{typeof error === "string" ? error : JSON.stringify(error)}</p>}
                            <button onClick={guardarHorario}
                                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm"
                                style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                                <FiPlus className="w-4 h-4" /> Agregar horario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}