// src/components/Dashboard/QuestionCard.jsx
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { CheckCircle, RotateCcw, Trash2, ExternalLink } from "lucide-react"

// ── Spaced repetition intervals in days ──
const INTERVALS = [3, 7, 15, 25, 37, 120]

// ── Helper: add days to a date string ──
function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

// ── Helper: format date nicely ──
function formatDate(dateStr) {
  if (!dateStr) return "—"
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

// ── Helper: today string ──
function todayStr() {
  return new Date().toISOString().split("T")[0]
}

// ── Difficulty color ──
function diffColor(diff) {
  switch (diff) {
    case "Easy":   return { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" }
    case "Medium": return { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" }
    case "Hard":   return { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" }
    default:       return { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.25)" }
  }
}

export default function QuestionCard({ question, currentUser, showActions = false }) {
  const today = todayStr()
  const isOverdue = !question.completed && question.nextRevisionDate < today
  const isDueToday = !question.completed && question.nextRevisionDate === today
  const diff = diffColor(question.difficulty)

  // ── Mark Done ──
  async function handleDone() {
    const nextStage = question.currentStage + 1
    const isCompleted = nextStage >= INTERVALS.length

    const ref = doc(db, "users", currentUser.uid, "questions", question.id)
    await updateDoc(ref, {
      currentStage: nextStage,
      completed: isCompleted,
      nextRevisionDate: isCompleted ? null : addDays(today, INTERVALS[nextStage]),
      revisionLog: [
        ...(question.revisionLog || []),
        { date: today, status: "done", stage: question.currentStage }
      ]
    })
  }

  // ── Mark Missed — shift from today ──
  async function handleMissed() {
    const ref = doc(db, "users", currentUser.uid, "questions", question.id)
    await updateDoc(ref, {
      nextRevisionDate: addDays(today, INTERVALS[question.currentStage]),
      revisionLog: [
        ...(question.revisionLog || []),
        { date: today, status: "missed", stage: question.currentStage }
      ]
    })
  }

  // ── Delete ──
  async function handleDelete() {
    if (!window.confirm(`Delete "${question.title}"?`)) return
    const ref = doc(db, "users", currentUser.uid, "questions", question.id)
    await deleteDoc(ref)
  }

  return (
    <div className="rounded-2xl p-5 transition-all duration-200"
      style={{
        background: "rgba(139,92,246,0.04)",
        border: `1px solid ${isOverdue
          ? "rgba(248,113,113,0.3)"
          : isDueToday
          ? "rgba(251,191,36,0.3)"
          : "rgba(139,92,246,0.15)"}`,
        boxShadow: isOverdue ? "0 0 20px rgba(248,113,113,0.05)" : "none"
      }}>

      {/* ── Top Row ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">

        {/* Title + Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-white font-semibold text-base">{question.title}</h3>
          {question.link && (
            <a href={question.link} target="_blank" rel="noreferrer"
              className="text-xs font-mono px-2 py-0.5 rounded-md transition"
              style={{ color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)" }}>
              ↗ open
            </a>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status pill */}
          {question.completed ? (
            <span className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
              ✓ mastered
            </span>
          ) : isOverdue ? (
            <span className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
              overdue
            </span>
          ) : isDueToday ? (
            <span className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}>
              due today
            </span>
          ) : null}

          {/* Difficulty */}
          <span className="text-xs font-mono px-2 py-1 rounded-full"
            style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
            {question.difficulty}
          </span>

          {/* Tag */}
          <span className="text-xs font-mono px-2 py-1 rounded-full"
            style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
            {question.tag}
          </span>
        </div>
      </div>

      {/* ── Progress Dots ── */}
      <div className="flex items-center gap-1.5 mb-4">
        {INTERVALS.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: i < question.currentStage ? "8px" : "8px",
              height: "8px",
              background: i < question.currentStage
                ? "#34d399"
                : i === question.currentStage && !question.completed
                ? "#7c3aed"
                : "rgba(255,255,255,0.1)",
              boxShadow: i === question.currentStage && !question.completed
                ? "0 0 8px rgba(124,58,237,0.8)"
                : "none"
            }}>
          </div>
        ))}
        <span className="text-xs font-mono ml-2"
          style={{ color: "rgba(139,92,246,0.5)" }}>
          {question.currentStage}/{INTERVALS.length}
        </span>
      </div>

      {/* ── Info Row ── */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="text-xs font-mono text-gray-500">
          solved {formatDate(question.solvedDate)}
        </span>
        {!question.completed && (
          <span className="text-xs font-mono text-gray-500">
            next revision{" "}
            <span className="text-gray-300">{formatDate(question.nextRevisionDate)}</span>
          </span>
        )}
      </div>

      {/* ── Action Buttons — only on TodayView ── */}
      {showActions && !question.completed && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleDone}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "rgba(52,211,153,0.1)",
              color: "#34d399",
              border: "1px solid rgba(52,211,153,0.25)"
            }}>
            ✓ Done
          </button>
          <button onClick={handleMissed}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "rgba(251,191,36,0.1)",
              color: "#fbbf24",
              border: "1px solid rgba(251,191,36,0.25)"
            }}>
            ⟳ Missed
          </button>
          <button onClick={handleDelete}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "rgba(248,113,113,0.08)",
              color: "#f87171",
              border: "1px solid rgba(248,113,113,0.2)"
            }}>
            🗑 Delete
          </button>
        </div>
      )}

      {/* Delete only — on AllQuestions view */}
      {!showActions && (
        <button onClick={handleDelete}
          className="text-xs font-mono text-gray-600 hover:text-red-400 transition">
          🗑 delete
        </button>
      )}

    </div>
  )
}