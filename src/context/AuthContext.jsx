import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"


// Step 1 — create the context (empty box for now)
// const AuthContext = createContext()

export const AuthContext = createContext()

// Step 2 — create a custom hook for easy access
export function useAuth() {
  return useContext(AuthContext)
}

// Step 3 — create the Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase listener — fires on every auth change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    // Cleanup listener when component unmounts
    return unsubscribe
  }, [])

  const value = { currentUser }

  // Don't render app until Firebase tells us auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-gray-500 font-mono text-sm animate-pulse">
          // loading...
        </span>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
  
}