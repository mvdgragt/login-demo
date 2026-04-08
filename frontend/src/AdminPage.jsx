import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getEmployees, createEmployee, updateEmployee, deleteEmployee } from "./api";
import { loadSession, clearSession } from "./session";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "WAITER", label: "Waiter" },
  { value: "RUNNER", label: "Runner" },
  { value: "HEAD_WAITER", label: "Head Waiter" },
];

const ROLE_STYLE = {
  ADMIN: { background: "#f3e8ff", color: "#6b21a8" },
  WAITER: { background: "#e3f0ff", color: "#1a5fa8" },
  RUNNER: { background: "#fff3cd", color: "#856404" },
  HEAD_WAITER: { background: "#e8f5e9", color: "#2e6b3e" },
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  code: "",
  role: "WAITER",
};

const AdminPage = () => {
  const navigate = useNavigate();
  const session = loadSession();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [showCodes, setShowCodes] = useState({});


  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployees(await getEmployees());
    } catch (err) {
      console.error(err.message);
    }
  };

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!/^\d{4}$/.test(form.code)) {
      setError("Login code must be exactly 4 digits.");
      return;
    }
    setLoading(true);
    try {
      await createEmployee(form);
      setSuccess(`${form.firstName} ${form.lastName} has been registered.`);
      setForm(emptyForm);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({ firstName: emp.firstName, lastName: emp.lastName, email: emp.email, code: emp.code, role: emp.role });
    setEditError("");
  };

  const setEdit = (field) => (e) =>
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleUpdate = async (id) => {
    setEditError("");
    if (!/^\d{4}$/.test(editForm.code)) {
      setEditError("Login code must be exactly 4 digits.");
      return;
    }
    try {
      await updateEmployee(id, editForm);
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setEditError(err.message);
    }
  };

  const toggleCode = (id) =>
    setShowCodes((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDelete = async (id) => {
    if (!confirm("Remove this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    clearSession();
    await logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0" }}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#2c2c2c" }}>Sundsgården</div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: "#777", textTransform: "uppercase" }}>Hotell &amp; Konferens</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#555" }}>
            Welcome, {session?.name}
          </span>
          <button style={s.btnSm} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={s.body}>
        <h1 style={s.h1}>Register new employee</h1>

        {/* Register form */}
        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            {/* Left */}
            <div>
              <Field label="First name">
                <input
                  style={s.input}
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                />
              </Field>
              <Field label="Last name">
                <input
                  style={s.input}
                  value={form.lastName}
                  onChange={set("lastName")}
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  style={s.input}
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </Field>
              <Field label="Login code">
                <input
                  style={s.input}
                  value={form.code}
                  onChange={set("code")}
                  maxLength={4}
                  placeholder="4 digits"
                  required
                />
              </Field>
            </div>

            {/* Middle */}
            <div>
              <Field label="Role">
                <select
                  style={s.input}
                  value={form.role}
                  onChange={set("role")}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="submit"
                style={s.btnSm}
                disabled={loading}
              >
                {loading ? "Saving…" : "Submit"}
              </button>
            </div>
          </div>

          {error && <p style={s.errMsg}>{error}</p>}
          {success && <p style={s.okMsg}>{success}</p>}
        </form>

        {/* Employee table */}
        <h2 style={s.h2}>Registered employees</h2>
        {employees.length === 0 ? (
          <p style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
            No employees registered yet.
          </p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["Name", "Email", "Role", "Code", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) =>
                editingId === emp.id ? (
                  <tr key={emp.id} style={{ background: "#fffbe6" }}>
                    <td style={s.td}>
                      <input style={{ ...s.input, width: 90, marginRight: 4 }} value={editForm.firstName} onChange={setEdit("firstName")} />
                      <input style={{ ...s.input, width: 90 }} value={editForm.lastName} onChange={setEdit("lastName")} />
                    </td>
                    <td style={s.td}>
                      <input style={s.input} type="email" value={editForm.email} onChange={setEdit("email")} />
                    </td>
                    <td style={s.td}>
                      <select style={s.input} value={editForm.role} onChange={setEdit("role")}>
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <input style={{ ...s.input, width: 60, textAlign: "center" }} value={editForm.code} onChange={setEdit("code")} maxLength={4} />
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                        <button style={s.btnSm} onClick={() => handleUpdate(emp.id)}>Save</button>
                        <button style={s.btnSm} onClick={() => setEditingId(null)}>Cancel</button>
                        {editError && <span style={{ color: "#c0392b", fontSize: 11 }}>{editError}</span>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={emp.id}>
                    <td style={s.td}>
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td style={s.td}>{emp.email}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, ...ROLE_STYLE[emp.role] }}>
                        {ROLES.find((r) => r.value === emp.role)?.label}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={{ fontFamily: "monospace", letterSpacing: 2 }}>
                        {showCodes[emp.id] ? emp.code : "••••"}
                      </span>
                      <button style={{ ...s.btnSm, marginLeft: 6, padding: "1px 7px", fontSize: 11 }} onClick={() => toggleCode(emp.id)}>
                        {showCodes[emp.id] ? "Hide" : "Show"}
                      </button>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={s.btnSm} onClick={() => startEdit(emp)}>Edit</button>
                        <button style={s.btnDel} onClick={() => handleDelete(emp.id)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Small local components ────────────────────────────────────────────────────


const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "#333",
        marginBottom: 4,
      }}
    >
      <span>{label}</span>
      <em style={{ color: "#888", fontSize: 12 }}>Required</em>
    </div>
    {children}
  </div>
);


// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  nav: {
    background: "#fff",
    borderBottom: "1px solid #ddd",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: { padding: "32px 40px", maxWidth: 900 },
  h1: { fontSize: 26, fontWeight: 500, marginBottom: 28, color: "#222" },
  h2: {
    fontSize: 17,
    fontWeight: 500,
    margin: "40px 0 14px",
    color: "#333",
    borderTop: "1px solid #ddd",
    paddingTop: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 32px",
  },
  input: {
    height: 32,
    border: "1px solid #aaa",
    padding: "0 8px",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    width: "100%",
  },
  badge: {
    padding: "2px 8px",
    borderRadius: 2,
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: ".4px",
  },
  btnSm: {
    padding: "4px 14px",
    fontSize: 13,
    border: "1px solid #999",
    background: "#e8e8e8",
    cursor: "pointer",
  },
  btnDel: {
    padding: "2px 10px",
    fontSize: 12,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    color: "#c0392b",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    background: "#f5f5f5",
    border: "1px solid #ddd",
    fontWeight: 500,
    color: "#444",
  },
  td: { padding: "7px 10px", border: "1px solid #ddd", color: "#333" },
  errMsg: {
    background: "#f8d7da",
    border: "1px solid #f1aeb5",
    color: "#842029",
    padding: "10px 16px",
    marginTop: 8,
    fontSize: 14,
  },
  okMsg: {
    background: "#d4edda",
    border: "1px solid #b8dac1",
    color: "#276144",
    padding: "10px 16px",
    marginTop: 16,
    fontSize: 14,
  },
};

export default AdminPage;
