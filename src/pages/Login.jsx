import { useState } from "react"
import { auth } from "../firebase/config"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link , Navigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  

  const navigate = useNavigate()
  const provider = new GoogleAuthProvider()

  const { currentUser } = useAuth()
if (currentUser) return <Navigate to="/dashboard" />

  async function handleLogin(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError("")
    setLoading(true)
    try {
      await signInWithPopup(auth, provider)
      navigate("/dashboard")
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  function getFriendlyError(code) {
    switch (code) {
      case "auth/user-not-found": return "No account found with this email."
      case "auth/wrong-password": return "Wrong password. Try again."
      case "auth/invalid-email": return "Please enter a valid email."
      case "auth/invalid-credential": return "Wrong email or password."
      case "auth/too-many-requests": return "Too many attempts. Try again later."
      default: return "Something went wrong. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-white font-mono text-sm tracking-widest uppercase opacity-50">
            dsa_reviser
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white text-center mb-2 leading-tight">
          Let's get back<br />to grinding.
        </h1>
        <p className="text-gray-500 text-sm text-center mb-10 font-mono">
          // your revision schedule awaits
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4 font-mono">{error}</p>
        )}

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-semibold py-3.5 rounded-full transition duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.2 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.6 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
              <path fill="#FBBC05" d="M10.7 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23.8 23.8 0 0 0 .5 24c0 3.8.9 7.4 2.8 10.5l7.4-5.9z"/>
              <path fill="#34A853" d="M24 47c5.4 0 10-1.8 13.4-4.8l-7.5-5.8c-1.9 1.3-4.3 2.1-5.9 2.1-6.3 0-11.6-4.2-13.5-9.9l-7.4 5.9C7 41.3 14.8 47 24 47z"/>
            </svg>
            Login with Google
          </button>

          {/* Email Button — toggles form */}
          {!showEmailForm && (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold py-3.5 rounded-full transition duration-200"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Continue with Email
            </button>
          )}

          {/* Email Form — appears after clicking */}
          {showEmailForm && (
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white text-sm outline-none focus:border-white transition placeholder-gray-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white text-sm outline-none focus:border-white transition placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-bold py-3.5 rounded-full transition duration-200"
              >
                {loading ? "Logging in..." : "Login →"}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-gray-500 hover:text-gray-300 text-sm text-center transition font-mono"
              >
                ← back
              </button>
            </form>
          )}

        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 w-full">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-zinc-600 text-xs font-mono">or</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        {/* Signup Link */}
        <p className="text-gray-500 text-sm font-mono text-center">
          No account?{" "}
          <Link to="/signup" className="text-white hover:text-gray-300 transition underline underline-offset-2">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login