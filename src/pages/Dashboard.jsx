// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Dashboard/Navbar"
import Sidebar from "../components/Dashboard/Sidebar"
import BottomNav from "../components/Dashboard/BottomNav"
import TodayView from "../components/Dashboard/TodayView"
import AllQuestions from "../components/Dashboard/AllQuestions"
import AddQuestion from "../components/Dashboard/AddQuestion"
import StatsView from "../components/Dashboard/StatsView"

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("today")
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    // Real-time listener — fires every time data changes in Firestore
    const q = query(
      collection(db, "users", currentUser.uid, "questions"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setQuestions(data)
      setLoading(false)
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [currentUser])

  // Helper — today's date string
  const todayStr = new Date().toISOString().split("T")[0]

  // Questions due today or overdue
  const dueQuestions = questions.filter(
    (q) => !q.completed && q.nextRevisionDate <= todayStr
  )

  function renderView() {
    switch (activeTab) {
      case "today":
        return <TodayView questions={dueQuestions} allQuestions={questions} loading={loading} />
      case "all":
        return <AllQuestions questions={questions} loading={loading} />
      case "add":
        return <AddQuestion currentUser={currentUser} onSuccess={() => setActiveTab("today")} />
      case "stats":
        return <StatsView questions={questions} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: "#080810" }}>

      {/* Top Navbar */}
      <Navbar currentUser={currentUser} />

      <div className="flex flex-1 pt-16">

        {/* Sidebar — desktop only */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dueCount={dueQuestions.length}
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-56 pb-20 md:pb-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {renderView()}
          </div>
        </main>

      </div>

      {/* Bottom Nav — mobile only */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={dueQuestions.length}
      />

    </div>
  )
}