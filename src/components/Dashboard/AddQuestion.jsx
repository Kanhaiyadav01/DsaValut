// src/components/Dashboard/AddQuestion.jsx
import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/config"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const INTERVALS = [3, 7, 15, 25, 37, 120]

const TAGS = [
  "Array", "String", "Linked List", "Stack", "Queue",
  "Binary Tree", "BST", "Graph", "DP", "Greedy",
  "Backtracking", "Sliding Window", "Two Pointers",
  "Binary Search", "Hashing", "Heap / PQ", "Trie",
  "Bit Manipulation", "Math", "Sorting", "Custom"
]

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function dateToStr(date) {
  return date.toISOString().split("T")[0]
}

export default function AddQuestion({ currentUser, onSuccess }) {
  const today = new Date()

  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [tag, setTag] = useState("")
  const [customTag, setCustomTag] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [solvedDate, setSolvedDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title.trim()) { setError("Enter a problem title."); return }
    if (!tag) { setError("Select a topic tag."); return }
    if (tag === "Custom" && !customTag.trim()) { setError("Enter your custom tag."); return }
    if (!difficulty) { setError("Select difficulty."); return }

    setLoading(true)

    try {
      const finalTag = tag === "Custom" ? customTag.trim() : tag

      await addDoc(
        collection(db, "users", currentUser.uid, "questions"),
        {
          title: title.trim(),
          link: link.trim(),
          tag: finalTag,
          difficulty,
          solvedDate: dateToStr(solvedDate),
          currentStage: 0,
          nextRevisionDate: addDays(dateToStr(solvedDate), INTERVALS[0]),
          completed: false,
          revisionLog: [],
          createdAt: serverTimestamp()
        }
      )

      setTitle("")
      setLink("")
      setTag("")
      setCustomTag("")
      setDifficulty("")
      setSolvedDate(new Date())
      setSuccess(`✅ Added! First revision in ${INTERVALS[0]} days.`)
      setTimeout(() => onSuccess(), 1500)

    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Add Question</h1>
        <p className="font-mono text-sm" style={{ color: "rgba(139,92,246,0.6)" }}>
          // log a newly solved problem
        </p>
      </div>

      {/* ── Card ── */}
      <div className="rounded-2xl p-6 md:p-8"
        style={{
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.15)"
        }}>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl font-mono text-sm"
            style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 px-4 py-3 rounded-xl font-mono text-sm"
            style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: "rgba(139,92,246,0.6)" }}>
              Problem Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Two Sum, Merge Intervals..."
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(139,92,246,0.2)"}
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: "rgba(139,92,246,0.6)" }}>
              Problem Link (optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(139,92,246,0.2)"}
            />
          </div>

          {/* Solved Date — Custom DatePicker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: "rgba(139,92,246,0.6)" }}>
              Solved On
            </label>
            <DatePicker
              selected={solvedDate}
              onChange={(date) => setSolvedDate(date)}
              maxDate={today}
              dateFormat="dd MMM yyyy"
              placeholderText="Select date..."
              customInput={
                <input
                  readOnly
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    caretColor: "transparent"
                  }}
                />
              }
            />
          </div>

          {/* Tag + Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Tag */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "rgba(139,92,246,0.6)" }}>
                Topic Tag *
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" style={{ background: "#080810" }}>— select topic —</option>
                {TAGS.map((t) => (
                  <option key={t} value={t} style={{ background: "#080810" }}>{t}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "rgba(139,92,246,0.6)" }}>
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" style={{ background: "#080810" }}>— select —</option>
                <option value="Easy" style={{ background: "#080810" }}>Easy</option>
                <option value="Medium" style={{ background: "#080810" }}>Medium</option>
                <option value="Hard" style={{ background: "#080810" }}>Hard</option>
              </select>
            </div>
          </div>

          {/* Custom Tag */}
          {tag === "Custom" && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "rgba(139,92,246,0.6)" }}>
                Custom Tag Name *
              </label>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="e.g. Segment Tree..."
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(139,92,246,0.2)"}
              />
            </div>
          )}

          {/* Interval Preview */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
            <p className="text-xs font-mono mb-3" style={{ color: "rgba(139,92,246,0.5)" }}>
              // auto-scheduled revision intervals
            </p>
            <div className="flex flex-wrap gap-2">
              {["Today", "+3d", "+7d", "+15d", "+25d", "+37d", "+120d"].map((label, i) => (
                <span key={i} className="text-xs font-mono px-3 py-1 rounded-full"
                  style={{
                    background: i === 0 ? "rgba(124,58,237,0.3)" : "rgba(139,92,246,0.08)",
                    color: i === 0 ? "#a78bfa" : "rgba(139,92,246,0.4)",
                    border: `1px solid ${i === 0 ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.15)"}`
                  }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-3.5 rounded-full transition-all duration-200"
            style={{
              background: loading ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.35)"
            }}>
            {loading ? "// saving..." : "Add Question →"}
          </button>

        </form>
      </div>
    </div>
  )
}