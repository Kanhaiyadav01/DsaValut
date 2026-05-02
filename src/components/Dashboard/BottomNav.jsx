// src/components/Dashboard/BottomNav.jsx
import { Calendar, BookOpen, PlusCircle, BarChart2 } from "lucide-react"

const tabs = [
  { id: "today", icon: Calendar,   label: "Today" },
  { id: "all",   icon: BookOpen,   label: "All" },
  { id: "add",   icon: PlusCircle, label: "Add" },
  { id: "stats", icon: BarChart2,  label: "Stats" },
]

export default function BottomNav({ activeTab, setActiveTab, dueCount }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 z-50"
      style={{
        background: "rgba(8,8,16,0.97)",
        borderTop: "1px solid rgba(139,92,246,0.1)",
        backdropFilter: "blur(16px)"
      }}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative"
            style={{ color: isActive ? "#a78bfa" : "#4b5563" }}>
            {tab.id === "today" && dueCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#7c3aed", color: "#fff", fontSize: "9px" }}>
                {dueCount}
              </span>
            )}
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-xs font-mono">{tab.label}</span>
            {isActive && (
              <div className="w-1 h-1 rounded-full"
                style={{ background: "#7c3aed" }}>
              </div>
            )}
          </button>
        )
      })}
    </nav>
  )
}