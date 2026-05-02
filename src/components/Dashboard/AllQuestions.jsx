// src/components/Dashboard/AllQuestions.jsx
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import QuestionCard from "./QuestionCard"

const DIFF_FILTERS = ["All", "Easy", "Medium", "Hard"]
const STATUS_FILTERS = ["All", "Pending", "Completed"]

export default function AllQuestions({ questions, loading }) {
  const { currentUser } = useAuth()
  const [activeTag, setActiveTag] = useState("All")
  const [activeDiff, setActiveDiff] = useState("All")
  const [activeStatus, setActiveStatus] = useState("All")
  const [search, setSearch] = useState("")

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

  // ── Get unique tags from all questions ──
  const allTags = ["All", ...new Set(questions.map((q) => q.tag))]

  // ── Apply filters ──
  let filtered = questions

  if (search.trim()) {
    filtered = filtered.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (activeTag !== "All") {
    filtered = filtered.filter((q) => q.tag === activeTag)
  }

  if (activeDiff !== "All") {
    filtered = filtered.filter((q) => q.difficulty === activeDiff)
  }

  if (activeStatus === "Pending") {
    filtered = filtered.filter((q) => !q.completed)
  } else if (activeStatus === "Completed") {
    filtered = filtered.filter((q) => q.completed)
  }

  // ── Sort: overdue first, then by next revision date ──
  filtered = [...filtered].sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    return (a.nextRevisionDate || "9999") < (b.nextRevisionDate || "9999") ? -1 : 1
  })

  return (
    <div>

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">All Questions</h1>
        <p className="font-mono text-sm" style={{ color: "rgba(139,92,246,0.6)" }}>
          // {questions.length} total · {questions.filter(q => q.completed).length} mastered
        </p>
      </div>

      {/* ── Search ── */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition"
          style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.2)",
            fontFamily: "inherit"
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(139,92,246,0.2)"}
        />
      </div>

      {/* ── Tag Filters ── */}
      <div className="mb-3 flex flex-wrap gap-2">
        {allTags.map((t) => (
          <button key={t} onClick={() => setActiveTag(t)}
            className="text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-150"
            style={{
              background: activeTag === t ? "rgba(124,58,237,0.25)" : "rgba(139,92,246,0.05)",
              color: activeTag === t ? "#a78bfa" : "#6b7280",
              border: `1px solid ${activeTag === t ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Difficulty + Status Filters ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {DIFF_FILTERS.map((d) => (
          <button key={d} onClick={() => setActiveDiff(d)}
            className="text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-150"
            style={{
              background: activeDiff === d ? "rgba(124,58,237,0.25)" : "rgba(139,92,246,0.05)",
              color: activeDiff === d
                ? "#a78bfa"
                : d === "Easy" ? "#34d399"
                : d === "Medium" ? "#fbbf24"
                : d === "Hard" ? "#f87171"
                : "#6b7280",
              border: `1px solid ${activeDiff === d ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`
            }}>
            {d}
          </button>
        ))}
        <div className="w-px mx-1" style={{ background: "rgba(139,92,246,0.2)" }}></div>
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setActiveStatus(s)}
            className="text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-150"
            style={{
              background: activeStatus === s ? "rgba(124,58,237,0.25)" : "rgba(139,92,246,0.05)",
              color: activeStatus === s ? "#a78bfa" : "#6b7280",
              border: `1px solid ${activeStatus === s ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="text-xs font-mono mb-4" style={{ color: "rgba(139,92,246,0.4)" }}>
        // showing {filtered.length} of {questions.length} questions
      </p>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">No questions found</h2>
          <p className="font-mono text-sm" style={{ color: "rgba(139,92,246,0.4)" }}>
            // try a different filter or search term
          </p>
        </div>
      )}

      {/* ── Question List ── */}
      <div className="flex flex-col gap-3">
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            currentUser={currentUser}
            showActions={false}
          />
        ))}
      </div>

    </div>
  )
}