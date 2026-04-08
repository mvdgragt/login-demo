import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";
import WelcomePage from "./WelcomePage";
import { loadSession } from "./session";

// If there is no session, send the user back to login
const ProtectedRoute = ({ children }) =>
  loadSession() ? children : <Navigate to="/" replace />;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
