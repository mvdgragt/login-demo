import { useNavigate } from "react-router-dom";
import { logout } from "./api";
import { loadSession, clearSession } from "./session";

const WelcomePage = () => {
  const navigate = useNavigate();
  const session = loadSession();

  const handleLogout = async () => {
    clearSession();
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between">
        <div className="leading-tight">
          <div className="text-[17px] font-bold text-[#2c2c2c]">Sundsgården</div>
          <div className="text-[8px] tracking-[2px] text-gray-400 uppercase">Hotell &amp; Konferens</div>
        </div>
        <button
          className="px-3.5 py-1 text-[13px] border border-gray-400 bg-gray-200 cursor-pointer hover:bg-gray-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)]">
        <h1 className="text-3xl font-normal text-[#222] m-0">Welcome, {session?.firstName ?? session?.name}!</h1>
        <p className="text-[15px] text-[#555] mt-3">You are logged in as <strong>{session?.role?.replace("_", " ")}</strong>.</p>
      </div>
    </div>
  );
};

export default WelcomePage;
