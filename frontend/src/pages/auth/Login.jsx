import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setCargando(true);
    setError("");
    try {
      const data = await login(email, contrasena);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("nombre", data.nombre);
      if (data.rol === "admin") navigate("/admin");
      else if (data.rol === "docente") navigate("/docente");
      else navigate("/estudiante");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1025 50%, #0d1117 100%)" }}
    >
      {/* Glow ambiental */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)", top: "15%", left: "30%" }}
      />
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1d4ed8, transparent)", bottom: "20%", right: "25%" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "1px solid #6d28d9" }}
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">SGAL</h1>
          <p className="text-sm mt-1" style={{ color: "#8b7aa8" }}>
            Pontificia Universidad Católica del Ecuador
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 className="text-white text-lg font-medium mb-6">Iniciar sesión</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>
                Correo institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="usuario@pucesd.edu.ec"
                className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  caretColor: "#7c3aed",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase" style={{ color: "#8b7aa8" }}>
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full text-white text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  caretColor: "#7c3aed",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #7c3aed")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={cargando}
              className="w-full mt-2 text-white font-semibold py-3 rounded-xl text-sm transition duration-200 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #6d28d9, #4338ca)")}
              onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #7c3aed, #4f46e5)")}
            >
              {cargando ? "Verificando..." : "Continuar"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#4a3f5c" }}>
          SGAL © {new Date().getFullYear()} · PUCE Santo Domingo
        </p>
      </div>
    </div>
  );
}