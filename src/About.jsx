import { Link } from "react-router-dom";

const C = {
  pageBg:       "#f3f2f2",
  surface:      "#ffffff",
  surfaceAlt:   "#fafaf9",
  border:       "#e5e5e5",
  borderStrong: "#c9c7c5",
  text:         "#181818",
  textMuted:    "#706e6b",
  textSubtle:   "#a8a5a0",
  brand:        "#0176d3",
  brandDark:    "#014486",
  brandBg:      "#eaf5fe",
  ai:           "#5a1ba9",
  aiBg:         "#e9d9ff",
  success:      "#2e844a",
  successBg:    "#cdefc4",
  warning:      "#7e4800",
  warningBg:    "#fef0e1",
  shadow1:      "0 2px 4px 0 rgba(0,0,0,0.08)",
  shadow2:      "0 4px 8px 0 rgba(0,0,0,0.12)",
};

const FONT = "'Salesforce Sans','Helvetica Neue',Arial,sans-serif";

function Card({ children, style }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "28px 32px",
      boxShadow: C.shadow1,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ icon, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <span style={{ fontSize:22 }}>{icon}</span>
      <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:C.text, letterSpacing:-0.2 }}>
        {children}
      </h2>
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{
      display:"inline-block",
      background: bg || C.brandBg,
      color: color || C.brand,
      borderRadius:9999,
      padding:"3px 12px",
      fontSize:11,
      fontWeight:700,
      letterSpacing:0.5,
      textTransform:"uppercase",
    }}>
      {children}
    </span>
  );
}

const TEAM = [
  {
    name: "Arpit Garg",
    role: "Engagement Lead",
    contribution: "Championed HandoffIQ as a Slalom delivery accelerator — drove the vision, client positioning, and strategic direction that turned an internal idea into a demo-ready product.",
    initials: "AG",
    color: C.success,
    bg: C.successBg,
  },
  {
    name: "Kanika Singla",
    role: "Business Architect",
    contribution: "Defined the Definition of Ready framework, prompt content strategy, demo scenarios, and the delivery readiness methodology that powers the analysis.",
    initials: "KS",
    color: C.brand,
    bg: C.brandBg,
  },
  {
    name: "Fayzeen Ali",
    role: "Technical Architect",
    contribution: "Built the React application, LLM integration, file parsing pipeline, UI/UX, and GitHub setup. Turned the concept into a working tool.",
    initials: "FA",
    color: C.ai,
    bg: C.aiBg,
  },
];

const HOW_TO_STEPS = [
  {
    n: "1",
    title: "Choose your mode",
    body: "Select Agile / Sprint Ready to review individual user stories against a Definition of Ready checklist, or Gate / Handoff to evaluate a full document package across six quality dimensions.",
  },
  {
    n: "2",
    title: "Select the handoff type",
    body: "Pick the team pairing that matches your handoff — BA → Developer, Developer → QA, Architect → Delivery, and more. This focuses the analysis on what matters for that specific transition.",
  },
  {
    n: "3",
    title: "Upload your artifact",
    body: "Drop in a DOCX, PDF, or plain text file. The tool extracts the content locally in your browser — nothing is stored on any server.",
  },
  {
    n: "4",
    title: "Analyse",
    body: "The AI evaluates the content and returns verdicts, specific fixes, quality scores, and improved rewrites — usually within 15–30 seconds.",
  },
  {
    n: "5",
    title: "Act on the output",
    body: "Use the per-story READY / REFINE / DEFER verdicts to triage your backlog, or the Gate improvement plan to drive a pre-handoff workshop. Copy improved story rewrites directly back into your tool.",
  },
];

const OBJECTIVES = [
  "Cut the time teams spend in 'is this ready?' conversations from hours to minutes",
  "Surface missing information before it becomes a sprint-blocking defect",
  "Give receiving teams an objective, consistent quality bar — not a gut check",
  "Produce actionable fixes, not just scores: every gap has a suggested remedy",
  "Accelerate Salesforce and IT delivery programs at Slalom and client engagements",
];

const ARTIFACTS = [
  { icon:"📋", label:"User Stories", desc:"Individual stories or a sprint backlog in DOCX/PDF" },
  { icon:"📐", label:"Solution Design Docs", desc:"Architecture and technical design documents" },
  { icon:"📄", label:"Requirements Documents", desc:"BRDs, FRDs, or functional specifications" },
  { icon:"🗂️", label:"Handoff Packages", desc:"Any document package passed between teams" },
];

export default function About() {
  return (
    <div style={{ fontFamily:FONT, background:C.pageBg, minHeight:"100vh", color:C.text }}>

      {/* App Bar */}
      <div style={{
        background: C.brand,
        height: 48,
        padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#fff",
        position: "sticky", top: 0, zIndex: 11,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="22" height="22" viewBox="0 0 80 80" style={{ flexShrink:0 }}>
            <path d="M 41 4 A 36 36 0 1 1 35 4.5" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
            <path d="M 22 41 L 33 52 L 58 28" fill="none" stroke="#c4a8f0" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:0.2 }}>
            Slalom Handoff<span style={{ color:"#c4a8f0", fontWeight:800 }}>IQ</span>
          </span>
          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:16, lineHeight:1, marginTop:1 }}>›</span>
          <span style={{ fontWeight:600, fontSize:15, color:"#fff", letterSpacing:0.1 }}>About</span>
        </div>
        <Link to="/" style={{
          color:"rgba(255,255,255,0.85)", fontSize:12, fontWeight:500,
          textDecoration:"none", padding:"3px 12px",
          border:"1px solid rgba(255,255,255,0.3)", borderRadius:9999,
          transition:"background 0.15s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >← Back to tool</Link>
      </div>

      {/* Hero */}
      <div style={{
        background:`linear-gradient(135deg, ${C.brandDark} 0%, ${C.brand} 60%, #0ea5e9 100%)`,
        color:"#fff",
        padding:"56px 28px 48px",
        textAlign:"center",
      }}>
        <div style={{ marginBottom:16 }}>
          <svg width="64" height="64" viewBox="0 0 80 80">
            <path d="M 41 4 A 36 36 0 1 1 35 4.5" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
            <path d="M 22 41 L 33 52 L 58 28" fill="none" stroke="#c4a8f0" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ margin:"0 0 12px", fontSize:32, fontWeight:800, letterSpacing:-0.5 }}>
          Slalom Handoff<span style={{ color:"#c4a8f0" }}>IQ</span>
        </h1>
        <p style={{ margin:"0 auto 24px", maxWidth:560, fontSize:16, lineHeight:1.6, opacity:0.9 }}>
          An AI-powered delivery readiness analyser for Salesforce and IT implementation teams.
          Know whether your handoff artifacts are ready — before the sprint starts.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
          <Pill color="#fff" bg="rgba(255,255,255,0.2)">Slalom Delivery Accelerator</Pill>
          <Pill color="#fff" bg="rgba(255,255,255,0.2)">Early Prototype</Pill>
          <Pill color="#fff" bg="rgba(255,255,255,0.2)">Agile + Gate Modes</Pill>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"40px 24px 64px" }}>

        {/* Meta moment callout */}
        <div style={{
          background:`linear-gradient(135deg, ${C.aiBg}, #f0e8ff)`,
          border:`1.5px solid ${C.ai}33`,
          borderRadius:12,
          padding:"24px 28px",
          marginBottom:32,
          display:"flex", gap:16, alignItems:"flex-start",
        }}>
          <span style={{ fontSize:28, flexShrink:0 }}>🤖</span>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:C.ai, marginBottom:6, letterSpacing:0.2, textTransform:"uppercase" }}>
              The meta moment
            </div>
            <p style={{ margin:0, fontSize:15, lineHeight:1.65, color:C.text }}>
              <strong>We didn't just build a tool. We used it to build a tool.</strong>{" "}
              The user stories and requirements for HandoffIQ were run through the tool itself during development.
              It flagged gaps, suggested rewrites, and helped the team sharpen the brief before each build sprint.
              A delivery readiness tool that passed its own readiness check.
            </p>
          </div>
        </div>

        <div style={{ display:"grid", gap:24 }}>

          {/* Vision */}
          <Card>
            <SectionHeading icon="🔭">Vision</SectionHeading>
            <p style={{ margin:0, fontSize:15, lineHeight:1.7, color:C.textMuted }}>
              Every Salesforce and IT delivery program has the same problem: work arrives at the next team
              with gaps — missing acceptance criteria, ambiguous requirements, untested edge cases.
              The receiving team either raises a defect in sprint, escalates to the BA, or absorbs the
              ambiguity into bad code.
            </p>
            <p style={{ margin:"14px 0 0", fontSize:15, lineHeight:1.7, color:C.textMuted }}>
              HandoffIQ exists to catch those gaps at the gate, not after the sprint. It applies a consistent,
              AI-powered Definition of Ready check so that every team in the delivery chain has an objective
              signal — not a subjective gut check — before committing to the work.
            </p>
          </Card>

          {/* Objectives */}
          <Card>
            <SectionHeading icon="🎯">Objectives</SectionHeading>
            <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {OBJECTIVES.map((obj, i) => (
                <li key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", fontSize:14, lineHeight:1.55, color:C.textMuted }}>
                  <span style={{
                    background:C.successBg, color:C.success,
                    borderRadius:9999, width:22, height:22, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:800, marginTop:1,
                  }}>{i+1}</span>
                  {obj}
                </li>
              ))}
            </ul>
          </Card>

          {/* How to use */}
          <Card>
            <SectionHeading icon="🚀">How to Use</SectionHeading>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {HOW_TO_STEPS.map(step => (
                <div key={step.n} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{
                    background:C.brandBg, color:C.brand,
                    borderRadius:9999, width:32, height:32, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:800,
                  }}>{step.n}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:4 }}>{step.title}</div>
                    <div style={{ fontSize:13, lineHeight:1.6, color:C.textMuted }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Supported Artifacts */}
          <Card>
            <SectionHeading icon="📁">Supported Artifacts</SectionHeading>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:12 }}>
              {ARTIFACTS.map(a => (
                <div key={a.label} style={{
                  background:C.surfaceAlt,
                  border:`1px solid ${C.border}`,
                  borderRadius:8,
                  padding:"14px 16px",
                }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{a.icon}</div>
                  <div style={{ fontWeight:600, fontSize:13, color:C.text, marginBottom:4 }}>{a.label}</div>
                  <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.5 }}>{a.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ margin:"16px 0 0", fontSize:12, color:C.textSubtle }}>
              Accepts <strong>.docx</strong>, <strong>.pdf</strong>, and <strong>.txt</strong> files.
              Content is extracted locally in your browser — no files are uploaded to any server.
            </p>
          </Card>

          {/* Team */}
          <Card>
            <SectionHeading icon="👥">Team</SectionHeading>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:16 }}>
              {TEAM.map(member => (
                <div key={member.name} style={{
                  background:C.surfaceAlt,
                  border:`1px solid ${C.border}`,
                  borderRadius:10,
                  padding:"20px 20px",
                  display:"flex", gap:16, alignItems:"flex-start",
                }}>
                  <div style={{
                    width:48, height:48, borderRadius:9999, flexShrink:0,
                    background:member.bg, color:member.color,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, fontSize:16, letterSpacing:0.5,
                    border:`2px solid ${member.color}33`,
                  }}>
                    {member.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{member.name}</div>
                    <div style={{ marginBottom:8 }}>
                      <Pill color={member.color} bg={member.bg}>{member.role}</Pill>
                    </div>
                    <p style={{ margin:0, fontSize:13, lineHeight:1.6, color:C.textMuted }}>{member.contribution}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin:"20px 0 0", fontSize:13, color:C.textMuted, lineHeight:1.6 }}>
              Built as a <strong>Slalom delivery accelerator</strong> — designed to be reused and extended
              across Salesforce and IT engagements. The methodology is adapted from Slalom's own
              delivery standards and shaped by real project experience.
            </p>
          </Card>

          {/* CTA */}
          <div style={{ textAlign:"center", paddingTop:8 }}>
            <Link to="/" style={{
              display:"inline-block",
              background:C.brand, color:"#fff",
              borderRadius:9999, padding:"12px 32px",
              fontWeight:700, fontSize:14, textDecoration:"none",
              boxShadow:C.shadow2,
              transition:"background 0.15s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=C.brandDark}
              onMouseLeave={e=>e.currentTarget.style.background=C.brand}
            >
              → Open the tool
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        background:C.surface, borderTop:`1px solid ${C.border}`,
        padding:"16px 28px",
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:8,
      }}>
        <p style={{ margin:0, fontSize:11, color:C.textSubtle }}>
          Slalom HandoffIQ · Early prototype · Powered by Claude (Anthropic)
        </p>
      </div>

    </div>
  );
}
