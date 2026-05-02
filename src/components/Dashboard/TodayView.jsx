import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import QuestionCard from "./QuestionCard"
import {
  AlertTriangle, CalendarClock, Trophy,
  Layers, Clock, Bell, BellOff, BellRing, Zap
} from "lucide-react"
import {
  isNotificationSupported,
  getPermissionStatus,
  requestNotificationPermission,
  checkAndNotify,
  hasNotifiedToday,
  markNotifiedToday
} from "../../utils/notifications"

export default function TodayView({ questions, allQuestions, loading }) {
  const { currentUser } = useAuth()
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Split into overdue and due today
  const overdue = questions.filter((q) => q.nextRevisionDate < todayStr)
  const dueToday = questions.filter((q) => q.nextRevisionDate === todayStr)

  // Stats
  const totalSolved = allQuestions.length
  const mastered = allQuestions.filter((q) => q.completed).length

  // Notification state
  const [notifPermission, setNotifPermission] = useState(getPermissionStatus())

  // Auto notify once per day
  useEffect(() => {
    if (!questions || questions.length === 0) return
    if (hasNotifiedToday()) return
    if (notifPermission !== "granted") return
    checkAndNotify(questions)
    markNotifiedToday()
  }, [questions, notifPermission])

  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? "granted" : "denied")
    if (granted) {
      checkAndNotify(questions)
      markNotifiedToday()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="font-mono text-sm animate-pulse"
          style={{ color: "rgba(139,92,246,0.5)" }}>
          // loading your questions...
        </span>
      </div>
    )
  }

  return (
    <div>

      {/* ── Greeting ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          Hey, {currentUser?.displayName?.split(" ")[0] || "Grinder"}
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              boxShadow: "0 4px 12px rgba(124,58,237,0.4)"
            }}>
            <Zap size={18} fill="white" color="white" />
          </span>
        </h1>
        <p className="font-mono text-sm" style={{ color: "rgba(200,180,255,0.75)" }}>
          // {dateLabel}
        </p>
      </div>

      {/* ── Notification Banner — default ── */}
      {isNotificationSupported() && notifPermission === "default" && (
        <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(139,92,246,0.25)"
          }}>
          <div className="flex items-center gap-3">
            <Bell size={16} style={{ color: "#a78bfa" }} />
            <div>
              <p className="text-sm font-medium text-white">Enable morning reminders</p>
              <p className="text-xs font-mono" style={{ color: "rgba(200,180,255,0.75)" }}>
                // get notified when you have questions to revise
              </p>
            </div>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="btn-shimmer shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "white",
              boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
            }}>
            Enable
          </button>
        </div>
      )}

      {/* ── Notification Blocked ── */}
      {isNotificationSupported() && notifPermission === "denied" && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.2)"
          }}>
          <BellOff size={16} style={{ color: "#f87171" }} />
          <p className="text-xs font-mono" style={{ color: "rgba(248,113,113,0.8)" }}>
            // notifications blocked. enable in browser settings to get reminders.
          </p>
        </div>
      )}

      {/* ── Notifications Active ── */}
      {isNotificationSupported() && notifPermission === "granted" && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.15)"
          }}>
          <BellRing size={16} style={{ color: "#34d399" }} />
          <p className="text-xs font-mono" style={{ color: "rgba(52,211,153,0.8)" }}>
            // morning reminders active. you will be notified when questions are due.
          </p>
        </div>
      )}

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "total added", value: totalSolved, icon: <Layers size={14} /> },
          { label: "due today",   value: questions.length, icon: <Clock size={14} /> },
          { label: "mastered",    value: mastered, icon: <Trophy size={14} /> },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)"
            }}>
            <div className="flex justify-center mb-2"
              style={{ color: "rgba(139,92,246,0.5)" }}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold font-mono text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs font-mono"
              style={{ color: "rgba(200,180,255,0.75)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── All Clear State ── */}
      {questions.length === 0 && (
        <div className="text-center py-24">
          <div className="flex justify-center mb-4">
            <Trophy size={48} style={{ color: "rgba(139,92,246,0.3)" }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            All clear for today!
          </h2>
          <p className="font-mono text-sm" style={{ color: "rgba(200,180,255,0.75)" }}>
            // no revisions due. keep grinding.
          </p>
        </div>
      )}

      {/* ── Overdue Section ── */}
      {overdue.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: "#f87171" }} />
            <span className="text-sm font-mono font-semibold"
              style={{ color: "#f87171" }}>
              {overdue.length} overdue
            </span>
            <div className="flex-1 h-px"
              style={{ background: "rgba(248,113,113,0.2)" }}>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {overdue.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                currentUser={currentUser}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Due Today Section ── */}
      {dueToday.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock size={14} style={{ color: "#fbbf24" }} />
            <span className="text-sm font-mono font-semibold"
              style={{ color: "#fbbf24" }}>
              {dueToday.length} due today
            </span>
            <div className="flex-1 h-px"
              style={{ background: "rgba(251,191,36,0.2)" }}>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {dueToday.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                currentUser={currentUser}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}