import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMe } from "./api";
import { loadSession, saveSession } from "./session";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Skip login if already logged in
  useEffect(() => {
    const session = loadSession();
    if (session?.role === "ADMIN") navigate("/admin");
    else if (session) navigate("/welcome");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, code);
      const user = await getMe();
      saveSession(user);
      navigate(user.role === "ADMIN" ? "/admin" : "/welcome");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
      <div className="bg-white py-10 px-[50px] w-[480px] max-w-[95vw] border border-[#ccc]">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-[28px] font-normal text-[#222] m-0">Login</h1>
          <div className="leading-[1.2] text-right">
            <div className="text-[17px] font-bold text-[#2c2c2c]">
              Sundsgården
            </div>
            <div className="text-[8px] tracking-[2px] text-[#777] uppercase">
              Hotell &amp; Konferens
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Row label="Email:">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-7 border border-[#999] px-1.5 text-sm outline-none"
              required
              autoFocus
            />
          </Row>

          <Row label="Password:">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={4}
              placeholder="4-digit code"
              className="flex-1 h-7 border border-[#999] px-1.5 text-sm outline-none"
              required
            />
          </Row>

          {error && (
            <p className="ml-[90px] mb-2.5 text-[13px] text-[#c0392b]">{error}</p>
          )}

          <div className="ml-[90px]">
            <button
              type="submit"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Small reusable components local to this file ──────────────────────────────

const Row = ({ label, children }) => (
  <div className="flex items-center mb-4">
    <label className="w-[90px] text-right pr-3 text-sm text-[#333] shrink-0">{label}</label>
    {children}
  </div>
);

export default LoginPage;
