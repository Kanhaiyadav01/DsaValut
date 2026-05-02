// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Lock,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ── Name Edit ──
  const [name, setName] = useState(currentUser?.displayName || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState({ text: "", type: "" });

  // ── Password Change ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });

  // ── Delete Account ──
  const [deleteInput, setDeleteInput] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ text: "", type: "" });

  // Is Google user?
  const isGoogleUser =
    currentUser?.providerData?.[0]?.providerId === "google.com";

  // Join date
  const joinDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  // Avatar letter
  const avatarLetter =
    currentUser?.displayName?.[0]?.toUpperCase() ||
    currentUser?.email?.[0]?.toUpperCase() ||
    "?";

  // ── Input Style ──
  const inputStyle = {
    background: "rgba(139,92,246,0.05)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "12px",
    color: "#f1f5f9",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  // ── Update Name ──
  async function handleUpdateName(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameMsg({ text: "Name cannot be empty.", type: "error" });
      return;
    }
    setNameLoading(true);
    setNameMsg({ text: "", type: "" });
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      setNameMsg({ text: "Name updated successfully!", type: "success" });
    } catch {
      setNameMsg({ text: "Failed to update name. Try again.", type: "error" });
    } finally {
      setNameLoading(false);
    }
  }

  // ── Update Password ──
  async function handleUpdatePassword(e) {
    e.preventDefault();
    setPassMsg({ text: "", type: "" });
    if (newPassword.length < 6) {
      setPassMsg({
        text: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }
    setPassLoading(true);
    try {
      // Reauthenticate first — Firebase requires this for sensitive actions
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPassMsg({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setPassMsg({ text: "Current password is wrong.", type: "error" });
      } else {
        setPassMsg({
          text: "Failed to update password. Try again.",
          type: "error",
        });
      }
    } finally {
      setPassLoading(false);
    }
  }

  // ── Delete Account ──
  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") {
      setDeleteMsg({
        text: 'Type "DELETE" exactly to confirm.',
        type: "error",
      });
      return;
    }
    setDeleteLoading(true);
    setDeleteMsg({ text: "", type: "" });
    try {
      // Step 1 — reauthenticate if email user
      if (!isGoogleUser) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          deletePassword,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      // Step 2 — delete all Firestore questions
      const questionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "questions",
      );
      const snapshot = await getDocs(questionsRef);
      const deletions = snapshot.docs.map((d) =>
        deleteDoc(doc(db, "users", currentUser.uid, "questions", d.id)),
      );
      await Promise.all(deletions);

      // Step 3 — delete Firebase Auth account
      await deleteUser(auth.currentUser);

      navigate("/");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setDeleteMsg({ text: "Wrong password.", type: "error" });
      } else {
        setDeleteMsg({
          text: "Failed to delete account. Try again.",
          type: "error",
        });
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white" style={{ background: "#080810" }}>
      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,8,16,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(139,92,246,0.1)",
        }}
      >
        <Link to="/" className="flex items-center gap-2 group">
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
          <span className="font-bold text-sm tracking-tight">
            <span className="text-white">Neuro</span>
            <span style={{ color: "#a78bfa" }}>DSA</span>
          </span>
        </Link>
        <Link
          to="/dashboard"
          className="btn-shimmer flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-full"
          style={{ border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <ArrowLeft size={12} />
          back to dashboard
        </Link>
      </header>

      {/* ── Content ── */}
      <main className="pt-24 pb-12 px-4 max-w-xl mx-auto">
        {/* ── Avatar Card ── */}
        <div
          className="rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{
            background: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          {/* Big Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
          >
            {avatarLetter}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-white">
              {currentUser?.displayName || "No name set"}
            </h1>
            <div className="flex items-center gap-2">
              <Mail size={11} style={{ color: "rgba(167,139,250,0.6)" }} />
              <span className="font-mono text-xs text-gray-400">
                {currentUser?.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={11} style={{ color: "rgba(167,139,250,0.6)" }} />
              <span className="font-mono text-xs text-gray-500">
                joined {joinDate}
              </span>
            </div>
            {isGoogleUser && (
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full w-fit mt-1"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  color: "#a78bfa",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                Google account
              </span>
            )}
          </div>
        </div>

        {/* ── Edit Name ── */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <User size={16} style={{ color: "#a78bfa" }} />
            <h2 className="text-base font-semibold text-white">Edit Name</h2>
          </div>
          <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.2)")
              }
            />
            {nameMsg.text && (
              <div
                className="flex items-center gap-2 text-sm font-mono"
                style={{
                  color: nameMsg.type === "success" ? "#34d399" : "#f87171",
                }}
              >
                {nameMsg.type === "success" ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}
                {nameMsg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={nameLoading}
              className="btn-shimmer w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: nameLoading
                  ? "rgba(124,58,237,0.3)"
                  : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: "white",
                boxShadow: nameLoading
                  ? "none"
                  : "0 4px 20px rgba(124,58,237,0.3)",
              }}
            >
              {nameLoading ? "// saving..." : "Save Name →"}
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} style={{ color: "#a78bfa" }} />
            <h2 className="text-base font-semibold text-white">
              Change Password
            </h2>
          </div>

          {isGoogleUser ? (
            <p
              className="font-mono text-sm mt-4"
              style={{ color: "rgba(200,180,255,0.75)" }}
            >
              // you signed in with Google — password change is not available
              for Google accounts.
            </p>
          ) : (
            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4 mt-5"
            >
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                }
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                }
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                }
              />
              {passMsg.text && (
                <div
                  className="flex items-center gap-2 text-sm font-mono"
                  style={{
                    color: passMsg.type === "success" ? "#34d399" : "#f87171",
                  }}
                >
                  {passMsg.type === "success" ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertTriangle size={14} />
                  )}
                  {passMsg.text}
                </div>
              )}
              <button
                type="submit"
                disabled={passLoading}
                className="btn-shimmer w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: passLoading
                    ? "rgba(124,58,237,0.3)"
                    : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white",
                  boxShadow: passLoading
                    ? "none"
                    : "0 4px 20px rgba(124,58,237,0.3)",
                }}
              >
                {passLoading ? "// updating..." : "Update Password →"}
              </button>
            </form>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(248,113,113,0.04)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trash2 size={16} style={{ color: "#f87171" }} />
            <h2
              className="text-base font-semibold"
              style={{ color: "#f87171" }}
            >
              Danger Zone
            </h2>
          </div>
          <p
            className="font-mono text-xs mb-5"
            style={{ color: "rgba(248,113,113,0.6)" }}
          >
            // this will permanently delete your account and all questions.
            cannot be undone.
          </p>

          <div className="flex flex-col gap-3">
            {/* Confirm input */}
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              style={{
                ...inputStyle,
                border: "1px solid rgba(248,113,113,0.25)",
                background: "rgba(248,113,113,0.05)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(248,113,113,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(248,113,113,0.25)")
              }
            />

            {/* Password for email users */}
            {!isGoogleUser && (
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password to confirm"
                style={{
                  ...inputStyle,
                  border: "1px solid rgba(248,113,113,0.25)",
                  background: "rgba(248,113,113,0.05)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(248,113,113,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(248,113,113,0.25)")
                }
              />
            )}

            {deleteMsg.text && (
              <div
                className="flex items-center gap-2 text-sm font-mono"
                style={{
                  color: deleteMsg.type === "success" ? "#34d399" : "#f87171",
                }}
              >
                <AlertTriangle size={14} />
                {deleteMsg.text}
              </div>
            )}

            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading || deleteInput !== "DELETE"}
              className="btn-shimmer w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background:
                  deleteInput === "DELETE"
                    ? "rgba(248,113,113,0.15)"
                    : "rgba(248,113,113,0.05)",
                color:
                  deleteInput === "DELETE"
                    ? "#f87171"
                    : "rgba(248,113,113,0.3)",
                border: "1px solid rgba(248,113,113,0.25)",
                cursor: deleteInput !== "DELETE" ? "not-allowed" : "pointer",
              }}
            >
              {deleteLoading ? "// deleting..." : "Delete My Account"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
