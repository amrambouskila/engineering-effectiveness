import { useState, useMemo } from "react";

const SAMPLE_PROJECTS = [
  {
    name: "PMS Migration v2",
    targetDate: "2025-03-01",
    actualDate: "2025-05-20",
    expectedRevenue: 500000,
    actualRevenue: 490000,
    expectedBreachCost: 220000,
    vulnerabilities: 3,
    expectedPhases: 5,
    actualPhases: 5,
    intersectingProjects: 1,
    reusableComponents: 1,
  },
  {
    name: "Guest Portal Redesign",
    targetDate: "2025-01-15",
    actualDate: "2025-03-28",
    expectedRevenue: 300000,
    actualRevenue: 310000,
    expectedBreachCost: 150000,
    vulnerabilities: 2,
    expectedPhases: 4,
    actualPhases: 4,
    intersectingProjects: 2,
    reusableComponents: 2,
  },
  {
    name: "Loyalty Engine Overhaul",
    targetDate: "2025-06-01",
    actualDate: "2025-09-15",
    expectedRevenue: 800000,
    actualRevenue: 780000,
    expectedBreachCost: 350000,
    vulnerabilities: 4,
    expectedPhases: 8,
    actualPhases: 9,
    intersectingProjects: 1,
    reusableComponents: 1,
  },
  {
    name: "Revenue Dashboard",
    targetDate: "2025-02-01",
    actualDate: "2025-04-10",
    expectedRevenue: 120000,
    actualRevenue: 125000,
    expectedBreachCost: 60000,
    vulnerabilities: 1,
    expectedPhases: 3,
    actualPhases: 3,
    intersectingProjects: 2,
    reusableComponents: 3,
  },
  {
    name: "Booking API Refactor",
    targetDate: "2025-04-01",
    actualDate: "2025-06-25",
    expectedRevenue: 600000,
    actualRevenue: 610000,
    expectedBreachCost: 400000,
    vulnerabilities: 3,
    expectedPhases: 6,
    actualPhases: 6,
    intersectingProjects: 1,
    reusableComponents: 2,
  },
  {
    name: "Check-in Kiosk Software",
    targetDate: "2025-05-01",
    actualDate: "2025-07-20",
    expectedRevenue: 250000,
    actualRevenue: 260000,
    expectedBreachCost: 90000,
    vulnerabilities: 2,
    expectedPhases: 4,
    actualPhases: 4,
    intersectingProjects: 1,
    reusableComponents: 1,
  },
  {
    name: "Staff Scheduling Platform",
    targetDate: "2025-07-01",
    actualDate: "2025-10-05",
    expectedRevenue: 400000,
    actualRevenue: 385000,
    expectedBreachCost: 180000,
    vulnerabilities: 5,
    expectedPhases: 5,
    actualPhases: 6,
    intersectingProjects: 0,
    reusableComponents: 0,
  },
  {
    name: "Payment Gateway v3",
    targetDate: "2025-03-15",
    actualDate: "2025-05-30",
    expectedRevenue: 700000,
    actualRevenue: 720000,
    expectedBreachCost: 500000,
    vulnerabilities: 2,
    expectedPhases: 6,
    actualPhases: 6,
    intersectingProjects: 2,
    reusableComponents: 2,
  },
];

const FIELDS = [
  { key: "targetDate", label: "Target Date", type: "date" },
  { key: "actualDate", label: "Actual Date", type: "date" },
  { key: "expectedRevenue", label: "Exp Rev", type: "currency" },
  { key: "actualRevenue", label: "Act Rev", type: "currency" },
  { key: "expectedBreachCost", label: "Breach Cost", type: "currency" },
  { key: "vulnerabilities", label: "Vulns", type: "number" },
  { key: "expectedPhases", label: "Exp Phases", type: "number" },
  { key: "actualPhases", label: "Act Phases", type: "number" },
  { key: "intersectingProjects", label: "Intersects", type: "number" },
  { key: "reusableComponents", label: "Reusable", type: "number" },
];

function daysBetween(a, b) {
  return (new Date(b) - new Date(a)) / 86400000;
}

function clamp(v, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

function computeScores(projects) {
  if (!projects.length)
    return { speed: 0, accuracy: 0, defense: 0, strength: 0, endurance: 0 };

  const perProject = projects.map((p) => {
    const planned = Math.max(daysBetween("2024-06-01", p.targetDate), 30);
    const slip = Math.max(daysBetween(p.targetDate, p.actualDate), 0);
    const speed = clamp(100 * (1 - (slip / planned) * 2.5));

    const revAcc = clamp(100 - Math.abs(1 - p.actualRevenue / p.expectedRevenue) * 200);
    const phaseAcc = clamp(100 - (Math.abs(p.actualPhases - p.expectedPhases) / Math.max(p.expectedPhases, 1)) * 150);
    const accuracy = revAcc * 0.5 + phaseAcc * 0.5;

    const breachWeight = p.expectedBreachCost / 500000;
    const rawDefense = 100 - p.vulnerabilities * 18;
    const defense = clamp(rawDefense - (p.vulnerabilities > 0 ? breachWeight * 10 : 0));

    const strength = clamp((p.actualRevenue / Math.max(p.expectedRevenue, 1)) * 100);

    const reuse = clamp((p.reusableComponents / 8) * 50, 0, 50);
    const cross = clamp((p.intersectingProjects / 5) * 50, 0, 50);
    const endurance = reuse + cross;

    return { speed, accuracy, defense, strength, endurance };
  });

  const avg = (key) =>
    Math.round(perProject.reduce((s, p) => s + p[key], 0) / perProject.length);

  return {
    speed: avg("speed"),
    accuracy: avg("accuracy"),
    defense: avg("defense"),
    strength: avg("strength"),
    endurance: avg("endurance"),
  };
}

const AXES = [
  { key: "speed", label: "SPD", full: "Speed" },
  { key: "accuracy", label: "ACC", full: "Accuracy" },
  { key: "defense", label: "DEF", full: "Defense" },
  { key: "strength", label: "STR", full: "Strength" },
  { key: "endurance", label: "END", full: "Endurance" },
];

function tierColor(v) {
  if (v >= 75) return "#22c55e";
  if (v >= 45) return "#eab308";
  return "#ef4444";
}

function tierLabel(v) {
  if (v >= 75) return "HIGH";
  if (v >= 45) return "MID";
  return "LOW";
}

function RadarChart({ scores, size = 330 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const n = AXES.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  const pt = (i, val) => {
    const a = start + i * step;
    const d = (val / 100) * r;
    return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) };
  };

  const grid = [20, 40, 60, 80, 100];
  const data = AXES.map((a, i) => pt(i, scores[a.key]));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }}>
      <defs>
        <radialGradient id="rbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#141428" />
          <stop offset="100%" stopColor="#0a0a14" />
        </radialGradient>
        <linearGradient id="rfill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glo">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx={cx} cy={cy} r={r + 22} fill="url(#rbg)" />

      {grid.map((lv) => (
        <polygon key={lv} points={AXES.map((_, i) => { const p = pt(i, lv); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="#1e293b" strokeWidth={lv === 100 ? 1 : 0.4} strokeDasharray={lv === 100 ? "none" : "2,4"} />
      ))}

      {AXES.map((_, i) => {
        const e = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#1e293b" strokeWidth={0.4} />;
      })}

      <polygon points={data.map(p => `${p.x},${p.y}`).join(" ")} fill="url(#rfill)" stroke="#06b6d4" strokeWidth={1.8} filter="url(#glo)" strokeLinejoin="round" />

      {data.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={tierColor(scores[AXES[i].key])} stroke="#0a0a14" strokeWidth={1.5} />
      ))}

      {AXES.map((a, i) => {
        const lp = pt(i, 122);
        const anc = i === 0 ? "middle" : lp.x > cx + 5 ? "start" : lp.x < cx - 5 ? "end" : "middle";
        return (
          <g key={a.key}>
            <text x={lp.x} y={lp.y - 6} textAnchor={anc} fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.1em">{a.label}</text>
            <text x={lp.x} y={lp.y + 8} textAnchor={anc} fill={tierColor(scores[a.key])} fontSize="13" fontFamily="monospace" fontWeight="700">{scores[a.key]}</text>
          </g>
        );
      })}

      <text x={cx} y={cy - 5} textAnchor="middle" fill="#e2e8f0" fontSize="20" fontFamily="monospace" fontWeight="800">
        {Math.round(AXES.reduce((s, a) => s + scores[a.key], 0) / AXES.length)}
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace" letterSpacing="0.15em">OVERALL</text>
    </svg>
  );
}

function fmt(val, type) {
  if (type === "currency") return `$${(val / 1000).toFixed(0)}k`;
  return String(val);
}

function cellColor(field, p) {
  if (field.key === "actualDate") {
    const slip = daysBetween(p.targetDate, p.actualDate);
    return slip <= 7 ? "#22c55e" : slip <= 45 ? "#eab308" : "#ef4444";
  }
  if (field.key === "actualRevenue") return p.actualRevenue >= p.expectedRevenue ? "#22c55e" : "#eab308";
  if (field.key === "vulnerabilities") return p.vulnerabilities === 0 ? "#22c55e" : p.vulnerabilities <= 2 ? "#eab308" : "#ef4444";
  if (field.key === "actualPhases") return p.actualPhases <= p.expectedPhases ? "#22c55e" : "#eab308";
  if (field.key === "expectedBreachCost") return p.expectedBreachCost >= 300000 ? "#ef4444" : p.expectedBreachCost >= 150000 ? "#eab308" : "#94a3b8";
  return "#94a3b8";
}

export default function App() {
  const [sel, setSel] = useState(null);

  const active = sel !== null ? [SAMPLE_PROJECTS[sel]] : SAMPLE_PROJECTS;
  const scores = useMemo(() => computeScores(active), [sel]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#e2e8f0", padding: "20px 12px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.3em", color: "#06b6d4", margin: 0 }}>EFFECTIVENESS</h1>
          <p style={{ fontSize: 9, color: "#475569", margin: "4px 0 0", letterSpacing: "0.12em" }}>
            {sel !== null ? SAMPLE_PROJECTS[sel].name.toUpperCase() : `AGGREGATE · ${SAMPLE_PROJECTS.length} PROJECTS`}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <RadarChart scores={scores} />
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 20 }}>
          {[["HIGH", "75–100", "#22c55e"], ["MID", "45–74", "#eab308"], ["LOW", "0–44", "#ef4444"]].map(([l, r, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              <span style={{ color: "#64748b", fontSize: 9, letterSpacing: "0.08em" }}>{l} {r}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: "#475569", marginBottom: 8 }}>SCORE DERIVATION — ALL 10 FIELDS MAPPED</h2>
          {[
            { key: "speed", name: "Speed", inputs: "target date, actual date", formula: "100 × (1 − (slipDays ÷ plannedDuration) × 2.5)", note: "Measures delivery punctuality relative to project timeline length" },
            { key: "accuracy", name: "Accuracy", inputs: "exp revenue, act revenue, exp phases, act phases", formula: "50% × revAccuracy + 50% × phaseAccuracy", note: "How close output matched the plan — both financial and scope" },
            { key: "defense", name: "Defense", inputs: "exp breach cost, vulnerabilities", formula: "100 − (vulns × 18) − (breachWeight × 10 if vulns > 0)", note: "Breach cost amplifies vuln penalty — high-stakes systems punished harder" },
            { key: "strength", name: "Strength", inputs: "exp revenue, actual revenue", formula: "actualRevenue ÷ expectedRevenue × 100", note: "Raw value delivery — did the project earn what it promised?" },
            { key: "endurance", name: "Endurance", inputs: "intersecting projects, reusable components", formula: "(intersects ÷ 5 × 50) + (reusable ÷ 8 × 50)", note: "Cross-pollination + reuse — does this project compound future delivery?" },
          ].map((f) => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 10px", background: "#0f0f1a", borderRadius: 6, borderLeft: `3px solid ${tierColor(scores[f.key])}`, marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#e2e8f0", fontSize: 11, fontWeight: 700 }}>{f.name}</span>
                <span style={{ color: tierColor(scores[f.key]), fontSize: 14, fontWeight: 800 }}>{scores[f.key]} <span style={{ fontSize: 8, opacity: 0.7 }}>{tierLabel(scores[f.key])}</span></span>
              </div>
              <div style={{ color: "#64748b", fontSize: 9 }}>Inputs: {f.inputs}</div>
              <div style={{ color: "#94a3b8", fontSize: 9 }}>{f.formula}</div>
              <div style={{ color: "#475569", fontSize: 8, fontStyle: "italic" }}>{f.note}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: "#475569", margin: 0 }}>PROJECT DATA — ALL 10 FIELDS</h2>
            {sel !== null && (
              <button onClick={() => setSel(null)} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", fontSize: 8, padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                SHOW ALL
              </button>
            )}
          </div>
          <div style={{ overflowX: "auto", background: "#0f0f1a", borderRadius: 8, border: "1px solid #1e293b", padding: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  <th style={{ padding: "7px 5px", textAlign: "left", color: "#475569", fontSize: 8, fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap", position: "sticky", left: 0, background: "#0f0f1a", zIndex: 1 }}>Project</th>
                  {FIELDS.map((f) => (
                    <th key={f.key} style={{ padding: "7px 5px", textAlign: "left", color: "#475569", fontSize: 8, fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_PROJECTS.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => setSel(i === sel ? null : i)}
                    style={{
                      borderBottom: "1px solid #0a0a14",
                      cursor: "pointer",
                      opacity: sel !== null && sel !== i ? 0.25 : 1,
                      background: sel === i ? "#0a0a14" : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <td style={{ padding: "6px 5px", color: "#e2e8f0", fontWeight: 600, whiteSpace: "nowrap", position: "sticky", left: 0, background: sel === i ? "#0a0a14" : "#0f0f1a", zIndex: 1 }}>{p.name}</td>
                    {FIELDS.map((f) => (
                      <td key={f.key} style={{ padding: "6px 5px", color: cellColor(f, p), whiteSpace: "nowrap" }}>
                        {fmt(p[f.key], f.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 8, color: "#1e293b", marginTop: 4, textAlign: "center", letterSpacing: "0.08em" }}>
            TAP ROW TO ISOLATE · TAP AGAIN TO AGGREGATE
          </p>
        </div>
      </div>
    </div>
  );
}
