// src/components/Dashboard/StatsView.jsx
import { Layers, Clock, Trophy } from "lucide-react";
import {
  Hash,
  CheckSquare,
  AlertTriangle,
  RefreshCw,
  XCircle,
} from "lucide-react";
export default function StatsView({ questions }) {
  const today = new Date().toISOString().split("T")[0];

  // ── Core Numbers ──
  const total = questions.length;
  const mastered = questions.filter((q) => q.completed).length;
  const due = questions.filter(
    (q) => !q.completed && q.nextRevisionDate <= today,
  ).length;
  const overdue = questions.filter(
    (q) => !q.completed && q.nextRevisionDate < today,
  ).length;
  const pending = questions.filter((q) => !q.completed).length;
  const totalRevisions = questions.reduce(
    (sum, q) => sum + (q.revisionLog?.length || 0),
    0,
  );
  const totalMissed = questions.reduce(
    (sum, q) =>
      sum + (q.revisionLog?.filter((r) => r.status === "missed").length || 0),
    0,
  );

  // ── By Difficulty ──
  const easy = questions.filter((q) => q.difficulty === "Easy").length;
  const medium = questions.filter((q) => q.difficulty === "Medium").length;
  const hard = questions.filter((q) => q.difficulty === "Hard").length;

  // ── By Tag ──
  const tagMap = {};
  questions.forEach((q) => {
    tagMap[q.tag] = (tagMap[q.tag] || 0) + 1;
  });
  const tagEntries = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);
  const maxTagCount = tagEntries[0]?.[1] || 1;

  // ── Mastery % ──
  const masteryPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Stats</h1>
        <p className="font-mono text-sm" className="text-comment">
          // your progress at a glance
        </p>
      </div>

      {/* ── Top Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          {
            label: "total added",
            value: total,
            color: "#a78bfa",
            icon: <Hash size={16} />,
          },
          {
            label: "mastered",
            value: mastered,
            color: "#34d399",
            icon: <CheckSquare size={16} />,
          },
          {
            label: "pending",
            value: pending,
            color: "#fbbf24",
            icon: <Clock size={16} />,
          },
          {
            label: "due now",
            value: due,
            color: "#f87171",
            icon: <AlertTriangle size={16} />,
          },
          {
            label: "total revisions",
            value: totalRevisions,
            color: "#a78bfa",
            icon: <RefreshCw size={16} />,
          },
          {
            label: "missed",
            value: totalMissed,
            color: "#f87171",
            icon: <XCircle size={16} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-lift rounded-2xl p-5 text-center"
            style={{
              background: "rgba(139,92,246,0.05)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div
              className="flex justify-center mb-2"
              style={{ color: stat.color, opacity: 0.6 }}
            >
              {stat.icon}
            </div>
            <div
              className="text-3xl font-bold font-mono mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "rgba(200,180,255,0.75)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Mastery Progress Bar ── */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">
            Overall Mastery
          </span>
          <span className="font-mono text-sm" style={{ color: "#a78bfa" }}>
            {masteryPercent}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ background: "rgba(139,92,246,0.1)", height: "8px" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${masteryPercent}%`,
              background: "linear-gradient(90deg, #7c3aed, #34d399)",
            }}
          ></div>
        </div>
        <p
          className="text-xs font-mono mt-3"
          style={{ color: "rgba(139,92,246,0.4)" }}
        >
          // {mastered} of {total} problems fully mastered
        </p>
      </div>

      {/* ── By Difficulty ── */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <h2 className="text-sm font-semibold text-white mb-5">By Difficulty</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              label: "Easy",
              count: easy,
              color: "#34d399",
              bg: "rgba(52,211,153,0.2)",
            },
            {
              label: "Medium",
              count: medium,
              color: "#fbbf24",
              bg: "rgba(251,191,36,0.2)",
            },
            {
              label: "Hard",
              count: hard,
              color: "#f87171",
              bg: "rgba(248,113,113,0.2)",
            },
          ].map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono" style={{ color: d.color }}>
                  {d.label}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {d.count} problems
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", height: "6px" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: total === 0 ? "0%" : `${(d.count / total) * 100}%`,
                    background: d.bg,
                    borderRight: `2px solid ${d.color}`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── By Topic ── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <h2 className="text-sm font-semibold text-white mb-5">By Topic</h2>

        {tagEntries.length === 0 && (
          <p className="text-xs font-mono" className="text-comment">
            // no questions added yet
          </p>
        )}

        <div className="flex flex-col gap-4">
          {tagEntries.map(([tag, count]) => (
            <div key={tag}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-gray-300">{tag}</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(139,92,246,0.5)" }}
                >
                  {count} problems
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ background: "rgba(139,92,246,0.08)", height: "6px" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(count / maxTagCount) * 100}%`,
                    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
