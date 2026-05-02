// src/components/Dashboard/Sidebar.jsx
import { Calendar, BookOpen, PlusCircle, BarChart2 } from "lucide-react"

const tabs = [
  { id: "today", icon: Calendar,    label: "Today" },
  { id: "all",   icon: BookOpen,    label: "All Questions" },
  { id: "add",   icon: PlusCircle,  label: "Add Question" },
  { id: "stats", icon: BarChart2,   label: "Stats" },
]

export default function Sidebar({ activeTab, setActiveTab, dueCount }) {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-56 py-6 px-3"
      style={{
        background: "rgba(8,8,16,0.95)",
        borderRight: "1px solid rgba(139,92,246,0.1)"
      }}>

      <nav className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item btn-shimmer ${isActive ? "active" : ""} flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full`}
              style={{
                background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                color: isActive ? "#a78bfa" : "#6b7280",
                border: isActive
                  ? "1px solid rgba(139,92,246,0.25)"
                  : "1px solid transparent"
              }}>
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{tab.label}</span>
              {tab.id === "today" && dueCount > 0 && (
                <span className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#7c3aed", color: "#fff" }}>
                  {dueCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom hint */}
      <div className="mt-auto px-4">
        <div className="rounded-xl p-3"
          style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
          <p className="font-mono text-xs leading-relaxed"
            style={{ color: "rgba(200,180,255,0.75)" }}>
            // struggle min 20 min<br />before checking hints
          </p>
        </div>
      </div>

    </aside>
  )
}