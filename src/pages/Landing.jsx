import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = "" }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#080810" }}
    >
      {/* ── Global Styles ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        .glow-violet {
          background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(139,92,246,0.25), transparent);
        }
        .glow-bottom {
          background: radial-gradient(ellipse 60% 50% at 50% 110%, rgba(109,40,217,0.2), transparent);
        }
        .card-hover {
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .card-hover:hover {
          border-color: rgba(139,92,246,0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.12);
        }
        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 6px 28px rgba(124,58,237,0.5);
          transform: translateY(-1px);
        }
        .text-gradient {
          background: linear-gradient(135deg, #a78bfa, #7c3aed, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .interval-active {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border-color: #7c3aed;
          box-shadow: 0 0 16px rgba(124,58,237,0.4);
        }
        .nav-blur {
          background: rgba(8,8,16,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(139,92,246,0.1);
        }
        .section-label {
          color: #a78bfa;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ═══════════════════════════════
           NAVBAR
      ═══════════════════════════════ */}
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              boxShadow: "0 0 12px rgba(124,58,237,0.4)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-white group-hover:text-violet-300 transition-colors duration-200">
            Neuro<span style={{ color: "#a78bfa" }}>DSA</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-white font-mono transition px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className=" btn-shimmer btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════
     HERO
═══════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* ── Layer 1: Dot Grid ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.18) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        ></div>

        {/* ── Layer 2: Grid Lines ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
        linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
      `,
            backgroundSize: "80px 80px",
          }}
        ></div>

        {/* ── Layer 3: Floating Orbs ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "15%",
            left: "10%",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
            animation: "pulse-slow 5s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        ></div>
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "20%",
            right: "8%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(109,40,217,0.12), transparent 70%)",
            animation: "pulse-slow 7s ease-in-out infinite reverse",
            filter: "blur(48px)",
          }}
        ></div>
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            right: "15%",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.1), transparent 70%)",
            animation: "pulse-slow 6s ease-in-out infinite",
            filter: "blur(32px)",
          }}
        ></div>

        {/* ── Layer 4: Corner Geometric Accents ── */}
        <div className="absolute top-24 left-8 pointer-events-none opacity-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
              fill="none"
            />
            <rect
              x="12"
              y="12"
              width="30"
              height="30"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
              fill="none"
            />
            <rect
              x="23"
              y="23"
              width="30"
              height="30"
              stroke="rgba(139,92,246,0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute bottom-24 right-8 pointer-events-none opacity-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="25"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="15"
              stroke="rgba(139,92,246,0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute top-32 right-12 pointer-events-none opacity-15">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="60"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="0"
              x2="0"
              y2="60"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
            />
            <line
              x1="30"
              y1="0"
              x2="30"
              y2="60"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="30"
              x2="60"
              y2="30"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="absolute bottom-32 left-12 pointer-events-none opacity-15">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <polygon
              points="25,2 48,48 2,48"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
              fill="none"
            />
            <polygon
              points="25,12 40,42 10,42"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        {/* ── Layer 5: Top Edge Glow ── */}
        <div className="glow-violet absolute inset-0 pointer-events-none"></div>

        {/* ════════════════════════════
       ACTUAL HERO CONTENT
  ════════════════════════════ */}

        {/* Badge */}
        <div
          className="opacity-0 mb-6 relative z-10"
          style={{ animation: "fadeInUp 0.6s ease forwards 0.1s" }}
        >
          <span
            className="text-xs font-mono px-4 py-1.5 rounded-full tracking-widest uppercase"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#a78bfa",
            }}
          >
            ⚡ Built for competitive programmers
          </span>
        </div>

        {/* Heading */}
        <h1
          className="opacity-0 text-5xl md:text-7xl font-bold leading-tight mb-6 relative z-10"
          style={{ animation: "fadeInUp 0.7s ease forwards 0.2s" }}
        >
          Solve once.
          <br />
          <span className="text-gradient">Never forget.</span>
        </h1>

        {/* Subtext */}
        <p
          className="opacity-0 text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed relative z-10"
          style={{ animation: "fadeInUp 0.7s ease forwards 0.35s" }}
        >
          DSA Reviser automatically schedules your revision using spaced
          repetition — so every problem you solve actually sticks.
        </p>

        {/* CTA Buttons */}
        <div
          className="opacity-0 flex flex-col sm:flex-row gap-3 mb-16 relative z-10"
          style={{ animation: "fadeInUp 0.7s ease forwards 0.5s" }}
        >
          <Link
            to="/signup"
            className="  btn-shimmer btn-primary text-white font-bold px-8 py-3.5 rounded-full text-sm"
          >
            Start Grinding Free →
          </Link>
          <Link
            to="/login"
            className=" btn-shimmer text-sm font-semibold px-8 py-3.5 rounded-full transition duration-200 text-gray-300 hover:text-white"
            style={{
              border: "1px solid rgba(139,92,246,0.25)",
              background: "rgba(139,92,246,0.05)",
            }}
          >
            Already have an account
          </Link>
        </div>

        {/* Interval Badges */}
        <div
          className="opacity-0 flex flex-wrap justify-center gap-2 relative z-10"
          style={{ animation: "fadeInUp 0.7s ease forwards 0.65s" }}
        >
          {[
            "Day 0",
            "+3 days",
            "+7 days",
            "+15 days",
            "+25 days",
            "+37 days",
            "+120 days",
          ].map((label, i) => (
            <span
              key={i}
              className={`text-xs font-mono px-3 py-1.5 rounded-full ${i === 0 ? "interval-active text-white" : "text-gray-500"}`}
              style={
                i !== 0
                  ? {
                      background: "rgba(139,92,246,0.06)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }
                  : {}
              }
            >
              {label}
            </span>
          ))}
        </div>
        <p
          className="mt-3 font-mono text-xs relative z-10"
          style={{ color: "rgba(167,139,250,0.4)" }}
        >
          // auto-scheduled revision intervals
        </p>

        {/* Bottom fade out */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #080810)",
          }}
        ></div>
      </section>
      {/* ═══════════════════════════════
           PROBLEM
      ═══════════════════════════════ */}
      <section
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <FadeSection>
            <p className="section-label mb-4">// the problem</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              You grind 300+ problems.
              <br />
              <span style={{ color: "rgba(255,255,255,0.25)" }}>
                Then forget half of them.
              </span>
            </h2>
          </FadeSection>
          <FadeSection className="mt-4">
            <p className="text-gray-500 text-lg leading-relaxed">
              You solve Two Sum, move on, and three weeks later — blank. You
              have seen this problem before but cannot recall the approach. So
              you solve it again. Wasting hours re-learning instead of learning
              new problems.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mt-4">
              This is not a discipline problem. It is a{" "}
              <span className="text-white font-semibold">system problem.</span>{" "}
              Your brain forgets without timely revision. That is just science.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══════════════════════════════
     REALITY CHECK
═══════════════════════════════ */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{
          borderTop: "1px solid rgba(139,92,246,0.1)",
          background: "rgba(124,58,237,0.04)",
        }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.07), transparent)",
          }}
        ></div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Label */}
          <FadeSection className="text-center mb-16">
            <p className="section-label mb-4">// reality check</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              DSA is hard.
              <br />
              <span style={{ color: "rgba(255,255,255,0.25)" }}>
                Be prepared for that.
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
              Most people quit because they expected it to be easy. Read these
              before you start — and remember them when it gets tough.
            </p>
          </FadeSection>

          {/* Big Featured Quote */}
          <FadeSection>
            <div
              className="rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              {/* Giant quotation mark */}
              <div
                className="absolute top-4 left-6 text-8xl font-serif leading-none pointer-events-none select-none"
                style={{ color: "rgba(139,92,246,0.15)" }}
              >
                "
              </div>

              <blockquote className="relative z-10 text-2xl md:text-3xl font-semibold text-white leading-relaxed text-center px-4 md:px-8">
                Struggle is not the enemy.{" "}
                <span className="text-gradient">It is the lesson.</span> If you
                solved it in 5 minutes, you did not learn — you just remembered.
              </blockquote>

              <p
                className="text-center font-mono text-sm mt-6"
                style={{ color: "rgba(167,139,250,0.5)" }}
              >
                — every serious DSA grinder, ever.
              </p>
            </div>
          </FadeSection>

          {/* Smaller Quotes Grid */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            {[
              {
                quote:
                  "Sit with the problem for 20 minutes before you look at hints. That discomfort you feel? That is your brain building a new connection.",
                icon: "⏱",
              },
              {
                quote:
                  "A hint after 20 minutes of struggle is wisdom. A hint after 2 minutes is just copy-paste. One builds you. One fools you.",
                icon: "💡",
              },
              {
                quote:
                  "DSA is not hard because you are not smart. It is hard because it is supposed to be hard. Everyone struggles. The ones who make it just refuse to quit.",
                icon: "🔥",
              },
              {
                quote:
                  "You will forget. You will get stuck. You will feel like you are not improving. That is exactly what progress feels like in the beginning.",
                icon: "📈",
              },
            ].map((item, i) => (
              <FadeSection key={i}>
                <div
                  className="card-hover rounded-2xl p-6 h-full flex gap-4"
                  style={{
                    background: "rgba(139,92,246,0.04)",
                    border: "1px solid rgba(139,92,246,0.12)",
                  }}
                >
                  <div className="text-2xl mt-0.5 shrink-0">{item.icon}</div>
                  <p className="text-gray-400 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>

          {/* Bottom line */}
          <FadeSection className="text-center mt-14">
            <p className="text-gray-600 font-mono text-sm">
              // this tool will not make DSA easy. it will make sure your effort
              is not wasted.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══════════════════════════════
           HOW IT WORKS
      ═══════════════════════════════ */}
      <section
        className="py-28 px-6"
        style={{
          borderTop: "1px solid rgba(139,92,246,0.1)",
          background: "rgba(124,58,237,0.03)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeSection className="text-center mb-16">
            <p className="section-label mb-4">// how it works</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Three steps. That's it.
            </h2>
          </FadeSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Solve a Problem",
                desc: "Solve any DSA problem on LeetCode, GFG, or anywhere. Log it in DSA Reviser with topic and difficulty.",
              },
              {
                step: "02",
                title: "We Schedule Revision",
                desc: "We automatically calculate your revision dates — +3, +7, +15, +25, +37, +120 days. No manual tracking.",
              },
              {
                step: "03",
                title: "Revise on Time",
                desc: "Open the app each morning. See exactly what to revise today. Mark done or missed. We adjust automatically.",
              },
            ].map((item, i) => (
              <FadeSection key={i}>
                <div
                  className="card-hover rounded-2xl p-6 h-full"
                  style={{
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  <div
                    className="font-mono font-bold text-4xl mb-4"
                    style={{ color: "rgba(139,92,246,0.3)" }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-white font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
           FEATURES
      ═══════════════════════════════ */}
      <section
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
      >
        <div className="max-w-4xl mx-auto">
          <FadeSection className="text-center mb-16">
            <p className="section-label mb-4">// features</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need.
              <br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>
                Nothing you don't.
              </span>
            </h2>
          </FadeSection>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "🧠",
                title: "Spaced Repetition",
                desc: "Science-backed revision intervals keep problems in your long-term memory — not just short-term.",
              },
              {
                icon: "📅",
                title: "Today's Dashboard",
                desc: "Open the app and see exactly which problems to revise today. No thinking, just grinding.",
              },
              {
                icon: "🏷️",
                title: "Topic Tracking",
                desc: "Tag problems by Array, DP, Graph, and more. See exactly which topics need more work.",
              },
              {
                icon: "🔔",
                title: "Morning Reminders",
                desc: "Browser notifications remind you every morning — so you never miss a revision session.",
              },
              {
                icon: "📊",
                title: "Progress Stats",
                desc: "Track total solved, mastered, and topic-wise breakdown. See your growth clearly.",
              },
              {
                icon: "☁️",
                title: "Cloud Sync",
                desc: "Data saved to Firebase. Switch devices anytime — your progress follows you everywhere.",
              },
            ].map((f, i) => (
              <FadeSection key={i}>
                <div
                  className="card-hover flex gap-4 rounded-2xl p-6"
                  style={{
                    background: "rgba(139,92,246,0.04)",
                    border: "1px solid rgba(139,92,246,0.12)",
                  }}
                >
                  <div className="text-3xl mt-0.5">{f.icon}</div>
                  <div>
                    <h3 className="text-white font-bold mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
           BOTTOM CTA
      ═══════════════════════════════ */}
      <section
        className="relative py-36 px-6 text-center overflow-hidden"
        style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
      >
        <div className="glow-bottom absolute inset-0 pointer-events-none"></div>
        <FadeSection className="relative z-10">
          <p className="section-label mb-6">// ready to stop forgetting?</p>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Start grinding.
            <br />
            <span className="text-gradient">Start remembering.</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
            Free forever. No credit card. Just you and your problems.
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-block text-white font-bold px-10 py-4 rounded-full text-base"
          >
            Create Free Account →
          </Link>
        </FadeSection>
      </section>

      {/* ═══════════════════════════════
           FOOTER
      ═══════════════════════════════ */}
      <footer
        className="py-8 px-6 text-center"
        style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}
      >
        <p
          className="font-mono text-xs"
          style={{ color: "rgba(167,139,250,0.6)" }}
        >
          built with <span style={{ color: "#f87171" }}>♥</span> by a developer,
          for developers // NeuroDSA © 2026
        </p>
      </footer>
    </div>
  );
}
