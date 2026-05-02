// src/components/Dashboard/Navbar.jsx
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Navbar({ currentUser }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  // First letter of name for avatar
  const avatarLetter =
    currentUser?.displayName?.[0]?.toUpperCase() ||
    currentUser?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(8,8,16,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        {/* Icon box with lightning bolt */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
          </svg>
        </div>

        {/* Two-tone text */}
        <span className="font-bold text-sm tracking-tight">
          <span className="text-white">Neuro</span>
          <span style={{ color: "#a78bfa" }}>DSA</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Username + Avatar — clicks to profile */}
        <Link
          to="/profile"
          className="btn-shimmer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
          style={{
            border: "1px solid rgba(139,92,246,0.15)",
            background: "rgba(139,92,246,0.05)",
          }}
        >
          {/* Green dot */}
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#34d399" }}
          ></div>

          {/* Username */}
          <span className="font-mono text-xs text-gray-400">
            {currentUser?.displayName || currentUser?.email}
          </span>

          {/* Avatar letter */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff",
            }}
          >
            {avatarLetter}
          </div>
        </Link>

        {/* Mobile — just icon */}
        <Link
          to="/profile"
          className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            color: "#fff",
          }}
        >
          {avatarLetter}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-shimmer font-mono text-xs text-gray-500 hover:text-white transition px-3 py-1.5 rounded-full"
          style={{ border: "1px solid rgba(139,92,246,0.2)" }}
        >
          logout →
        </button>
      </div>
    </header>
  );
}
