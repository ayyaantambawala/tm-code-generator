import { useState } from "react";

const GRADE_MAP = {
  "A193 Grade B7M": "B7M", "A193 Grade B7": "B7", "A193 B7M": "B7M", "A193 B7": "B7",
  "A320 Grade L7M": "L7M", "A320 Grade L7": "L7", "A320 L7M": "L7M", "A320 L7": "L7",
  "A453 GR660 CLASS D": "660 CL D", "A453 GR660 Class D": "660 CL D", "A453 GR660": "660",
  "A194 Grade 2HM": "2HM", "A194 Grade 2H": "2H", "A194 2HM": "2HM", "A194 2H": "2H",
  "A194-7M": "7M", "A194 7M": "7M", "A194 GR. 7M": "7M", "A194 GR. 7L": "7L",
  "SS 316": "SS316", "SS 304": "SS304", "SS 316L": "SS316L", "BS 3692 GR.8.8": "BS8.8",
  "A193 B8M": "B8M", "A193 B8": "B8",
};

const NHN_BOLT_GRADES = ["SS316", "SS304", "SS316L", "BS8.8", "B8M", "B8"];

const COAT_MAP = {
  "Xylan 1070": "TC", "Takecoat 1000": "TC", "Xylan 1070 or Takecoat 1000": "TC",
};

const SIZE_MAP = {
  "1/2": "1/2", ".625": "5/8", "5/8": "5/8", ".75": "3/4", "3/4": "3/4",
  ".875": "7/8", "7/8": "7/8", "1.125": "1 1/8", "1 1/8": "1 1/8",
  "1.25": "1 1/4", "1 1/4": "1 1/4", "1.5": "1 1/2", "1 1/2": "1 1/2",
  "1": "1",
};

function parseDescription(desc) {
  let size = null;
  const sizePatterns = Object.keys(SIZE_MAP).sort((a, b) => b.length - a.length);
  for (const pat of sizePatterns) {
    const re = new RegExp(`(?<![\\d.])(${pat.replace("/", "\\/")}(?:\\s*inch)?)(?![\\d])`, "i");
    if (re.test(desc)) { size = SIZE_MAP[pat]; break; }
  }
  if (!size) {
    const m = desc.match(/(\d+(?:\.\d+)?)\s*inch/i);
    if (m) size = SIZE_MAP[m[1]] || m[1];
  }

  let length = null;
  const lenMatch = desc.match(/[xX×]\s*(\d+)\s*mm/i) || desc.match(/(\d+)\s*mm\s*$/i);
  if (lenMatch) length = lenMatch[1];

  let boltGrade = null;
  const beforeSlash = desc.split("/")[0];
  for (const [pat, code] of Object.entries(GRADE_MAP)) {
    if (beforeSlash.toLowerCase().includes(pat.toLowerCase())) { boltGrade = code; break; }
  }

  let nutGrade = null;
  const afterSlash = desc.includes("/") ? desc.split("/").slice(1).join("/") : desc;
  const nutPatterns = [
    ["A194 Grade 2HM","2HM"],["A194 Grade 2H","2H"],["A194-7M","7M"],
    ["A194 GR. 7M","7M"],["A194 GR. 7L","7L"],
    ["A194 2HM","2HM"],["A194 2H","2H"],["A563M 10S","10S"],
    ["SS 316A4","SS316A4"],["SS 304A2","SS304A2"],["SS 316L 80/A4","SS316L80A4"],
    ["BS 3692 GR.8","BS8"],
  ];
  for (const [pat, code] of nutPatterns) {
    if (afterSlash.toLowerCase().includes(pat.toLowerCase())) { nutGrade = code; break; }
  }
  if (!nutGrade && /660.*class\s*d/i.test(afterSlash)) nutGrade = "660 CL D";

  let coat = null;
  for (const [pat, code] of Object.entries(COAT_MAP)) {
    if (desc.toLowerCase().includes(pat.toLowerCase())) { coat = code; break; }
  }

  return { size, length, boltGrade, nutGrade, coat };
}

function generateCodes(desc) {
  const { size, length, boltGrade, nutGrade, coat } = parseDescription(desc);
  const codes = [];
  const missing = [];

  if (!size) missing.push("size");
  if (!coat) missing.push("coating");

  const sz = size ? `I${size}` : "I?";
  const coatCode = coat || "?";

  if (!boltGrade) missing.push("bolt grade");
  if (!length) missing.push("length");
  codes.push({ label: "Stud Bolt", code: `${sz}-${length || "?"}-SB-${boltGrade || "?"}-${coatCode}` });

  const nutPrefix = boltGrade && NHN_BOLT_GRADES.includes(boltGrade) ? "NHN" : "HHN";
  const nutLabel = nutPrefix === "NHN" ? "Normal Hex Nut" : "Heavy Hex Nut";
  if (!nutGrade) missing.push("nut grade");
  codes.push({ label: nutLabel, code: `${sz}-${nutPrefix}-${nutGrade || "?"}-${coatCode}` });

  return { codes, missing: [...new Set(missing)] };
}

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(null);

  const handleGenerate = () => {
    if (!input.trim()) return;
    const { codes, missing } = generateCodes(input);
    setResults([{ desc: input, codes, missing }]);
  };

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #0f1e2e 50%, #0d1117 100%)",
      color: "#e2e8f0", fontFamily: "'Segoe UI', sans-serif",
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px"
    }}>
      <div style={{ width: "100%", maxWidth: 680 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <svg viewBox="0 0 240 235" width="130" style={{ display: "block", margin: "0 auto 10px" }} xmlns="http://www.w3.org/2000/svg">
            <polygon points="120,4 210,52 210,148 120,196 30,148 30,52" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="2"/>
            <polygon points="120,18 198,62 198,148 120,182 42,148 42,62" fill="white"/>
            <polygon points="120,30 188,70 188,142 120,172 52,142 52,70" fill="#1e3a8a"/>
            <text x="120" y="122" textAnchor="middle" fontFamily="'Segoe UI', sans-serif" fontWeight="800" fontSize="52" fill="white" letterSpacing="2">TM</text>
            <text x="120" y="220" textAnchor="middle" fontFamily="'Segoe UI', sans-serif" fontWeight="600" fontSize="20" fill="#94a3b8" letterSpacing="3">TECHNICAL METAL</text>
          </svg>
          <h1 style={{
            fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5,
            background: "linear-gradient(to right, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Part Code Generator</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>Paste a bolt description — get the part codes instantly</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, backdropFilter: "blur(10px)"
        }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 1, textTransform: "uppercase" }}>
            Item Description
          </label>
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleGenerate(); }}
            placeholder="e.g. Stud Bolt, Coated with Xylan 1070 or Takecoat 1000, ASME B18.2.1, With 3 Nuts, ASTM A193 Grade B7M/ASTM A194 Grade 2HM, 1.5 inch x 330 mm"
            style={{
              width: "100%", minHeight: 110, marginTop: 10,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#e2e8f0", fontSize: 13,
              padding: 14, resize: "vertical", boxSizing: "border-box", outline: "none", lineHeight: 1.6
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 11, color: "#334155" }}>Ctrl + Enter to generate</span>
            <button onClick={handleGenerate} style={{
              padding: "10px 28px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
            }}>Generate →</button>
          </div>
        </div>

        {results.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {results.map((r, ri) => (
              <div key={ri} style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${r.missing.length ? "rgba(167,139,250,0.4)" : "rgba(52,211,153,0.2)"}`,
                borderRadius: 16, padding: 20
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {r.codes.map((c, ci) => {
                    const key = `${ri}-${ci}`;
                    const isBolt = c.label === "Stud Bolt";
                    return (
                      <div key={ci} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "14px 16px"
                      }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                          background: isBolt ? "rgba(59,130,246,0.2)" : "rgba(99,102,241,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                        }}>{isBolt ? "🔩" : "🔧"}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 }}>{c.label}</div>
                          <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: c.code.includes("?") ? "#f59e0b" : "#34d399", letterSpacing: 0.5 }}>{c.code}</div>
                        </div>
                        <button onClick={() => copyCode(c.code, key)} style={{
                          padding: "7px 14px", flexShrink: 0,
                          background: copied === key ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)",
                          color: copied === key ? "#34d399" : "#94a3b8",
                          border: `1px solid ${copied === key ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                          borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600
                        }}>{copied === key ? "✓ Copied" : "Copy"}</button>
                      </div>
                    );
                  })}
                </div>
                {r.missing.length > 0 && (
                  <div style={{
                    marginTop: 14, padding: "10px 14px",
                    background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
                    borderRadius: 9, fontSize: 12, color: "#a78bfa"
                  }}>⚠️ Could not detect: <strong>{r.missing.join(", ")}</strong> — please verify the description</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
