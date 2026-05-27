import { useState } from "react";
import { Link } from "react-router-dom";
import "./about.css";

const FONT = "'Manrope','Salesforce Sans','Helvetica Neue',Arial,sans-serif";
const FONT_MONO = "'JetBrains Mono','SF Mono',Consolas,monospace";

const C = {
  pageBg:      "#faf8ff",
  surface:     "#ffffff",
  surfaceAlt:  "#f5efff",
  border:      "#ece4fb",
  borderStrong:"#d6c7ee",
  text:        "#1a1130",
  textMuted:   "#5e5773",
  textSubtle:  "#a59cb8",
  primary:     "#7e14ff",
  primaryHover:"#6b00f0",
  primaryBg:   "#ede6ff",
  accent:      "#47bfff",
  accentBg:    "#e0f3ff",
  brand:       "#7e14ff",
  brandDark:   "#6b00f0",
  brandBg:     "#ede6ff",
  einstein:    "#5a1ba9",
  einsteinBg:  "#e9d9ff",
  success:     "#2e844a",
  successBg:   "#cdefc4",
  warning:     "#7e4800",
  warningBg:   "#fef0e1",
  error:       "#ba0517",
  errorBg:     "#fddde3",
  shadow1:     "0 2px 4px 0 rgba(126,20,255,0.06)",
  shadow2:     "0 8px 24px rgba(126,20,255,0.08)",
  shadowLift:  "0 12px 32px rgba(126,20,255,0.14)",
};

const TOTAL_SECTIONS = 8;

function AppBarMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 80 80" style={{ flexShrink:0 }} aria-hidden="true">
      <path d="M 41 4 A 36 36 0 1 1 35 4.5" fill="none" stroke={C.primary} strokeWidth="8" strokeLinecap="round"/>
      <path d="M 22 41 L 33 52 L 58 28" fill="none" stroke="#863bff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BrandMark() {
  return (
    <svg width="68" height="68" viewBox="0 0 110 110" aria-label="Handoff IQ" role="img"
      style={{ flexShrink:0, filter:`drop-shadow(0 4px 12px rgba(126,20,255,0.2))` }}>
      <path d="M 56 6 A 49 49 0 1 1 47 6.7" fill="none" stroke={C.primary} strokeWidth="11" strokeLinecap="round"/>
      <path d="M 33 56 L 47 70 L 75 41" fill="none" stroke="#863bff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SectionIntro({ num, label, title, lede }) {
  const padded = String(num).padStart(2, "0");
  const total = String(TOTAL_SECTIONS).padStart(2, "0");
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="eyebrow" style={{ fontFamily: FONT_MONO, letterSpacing:"0.18em" }}>
        <span>{padded} / {total}</span>
        <span style={{ color: C.textSubtle, fontWeight:600 }}>·</span>
        <span style={{ fontFamily: FONT }}>{label}</span>
      </div>
      <h2 className="display-hero">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

const DOR_ITEMS = [
  { n:1, name:"Clear user story format",        desc:"Role, capability, and business value — preferably As a / I want / So that." },
  { n:2, name:"Testable acceptance criteria",   desc:"Given / When / Then or equivalent — independently validatable." },
  { n:3, name:"Scope clearly defined",          desc:"What's in, what's out — no open-ended or blended scope." },
  { n:4, name:"SF objects, fields, UI",         desc:"Affected objects, fields, layouts, flows, components, permissions." },
  { n:5, name:"Business rules & validations",   desc:"Decision logic, validations, statuses, error handling, automation." },
  { n:6, name:"Dependencies identified",        desc:"Upstream / downstream stories, integrations, data, approvals, blockers." },
  { n:7, name:"Security, data, NFRs",           desc:"Permissions, sharing, data quality, performance, compliance." },
  { n:8, name:"Testing — full coverage",        desc:"Happy path AND exception / edge / error scenarios." },
];

const SDF_GATE_ITEMS = [
  "Project scope is clear & validated",
  "Customer Readiness Checklist & Sales-to-Delivery handoff complete",
  "Customer introduction & SOW review",
  "Alignment with 3rd-party vendors",
  "Roles & responsibilities validated / Relationship Map",
  "Kickoff & Discover staff assigned (Slalom + Customer)",
  "Discover Kickoff materials complete",
  "Discover Workshop prep & sessions scheduled",
  "Program governance initiated (ways of working)",
  "Salesforce licensing secured for project start date",
  "High-level threats identified for research",
  "Regulatory compliance scope identified",
  "Salesforce security risk workshops scheduled",
  "InfoSec stakeholders identified",
];

const ROADMAP = [
  { time:"Now · May 2026", name:"Hackathon prototype",       items:["2 modes covering 3 handoff scenarios","Grounded in SDF and Slalom standards","Light-purple brand experience","End-to-end working prototype"] },
  { time:"Pilot · H2 2026", name:"Slalom-internal rollout",   items:["Expand to all priority handoff scenarios","Pilot on 3–5 Salesforce engagements","Capture rework-reduction telemetry","Publish as a Slalom delivery asset"] },
  { time:"Scale · 2027",    name:"Every deliverable, every cloud", items:["Design docs, test plans, runbooks, discovery","Multi-cloud: AWS, Azure, GCP frameworks","Jira / Confluence / GitHub / ADO integrations","Auto-ingest from delivery tooling"] },
  { time:"Vision",          name:"The Slalom quality gate",   items:["Embedded in every Slalom engagement","Client-facing readiness dashboards","Published Slalom delivery standard","Continuous learning from outcomes"] },
];

export default function About() {
  const [activeTab, setActiveTab] = useState("dor");

  return (
    <div style={{ fontFamily:FONT, background:C.pageBg, minHeight:"100vh", color:C.text, WebkitFontSmoothing:"antialiased" }}>
      {/* Animated gradient band */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, height:4, zIndex:100,
        background:"linear-gradient(90deg,#7e14ff 0%,#863bff 50%,#47bfff 100%)",
        backgroundSize:"200% 100%",
        animation:"gradientShift 8s linear infinite",
        pointerEvents:"none",
      }}/>

      {/* Glassmorphic app bar */}
      <header style={{
        background:"rgba(255,255,255,0.82)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`,
        height:56, padding:"0 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:20,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <AppBarMark />
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"0.2px", color:C.text }}>
            Handoff<span style={{
              background:"linear-gradient(135deg,#7e14ff 0%,#47bfff 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text", fontWeight:800,
            }}>IQ</span>
          </span>
          <span style={{
            background:C.primaryBg, color:C.primary,
            border:`1px solid ${C.primary}44`,
            borderRadius:9999, padding:"2px 10px",
            fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
          }}>About</span>
        </div>
        <Link to="/" style={{
          fontSize:12, color:C.textMuted, letterSpacing:"0.3px",
          textDecoration:"none", padding:"5px 13px",
          borderRadius:9999, border:`1px solid ${C.border}`,
          transition:"all 0.15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.color=C.primary;e.currentTarget.style.borderColor=C.primary+"55";}}
          onMouseLeave={e=>{e.currentTarget.style.color=C.textMuted;e.currentTarget.style.borderColor=C.border;}}
        >← Back to tool</Link>
      </header>

      {/* Sub-bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 28px" }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", display:"block" }}>
          Slalom delivery accelerator
        </span>
        <div style={{ fontSize:18, fontWeight:700, color:C.text, marginTop:4, letterSpacing:"-0.01em" }}>
          Delivery Readiness Analyzer
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"48px 28px 96px" }}>

        {/* ── HERO ── */}
        <section className="about-hero fade d1" style={{
          background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:14, boxShadow:C.shadow2,
          borderTop:`4px solid ${C.primary}`,
          padding:"48px 48px 44px", marginBottom:32,
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap:18,
            marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${C.border}`,
          }}>
            <BrandMark />
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
              <div style={{ fontSize:38, fontWeight:700, color:C.text, letterSpacing:"-0.02em", lineHeight:1 }}>
                Handoff<span style={{
                  background:"linear-gradient(135deg,#7e14ff 0%,#47bfff 100%)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  backgroundClip:"text", fontWeight:800, marginLeft:3,
                }}>IQ</span>
              </div>
              <div style={{ fontSize:12, color:C.textMuted, letterSpacing:"0.18em", textTransform:"uppercase", marginTop:8, fontWeight:600 }}>
                Delivery readiness, scored.
              </div>
            </div>
          </div>

          <div className="eyebrow">AI-powered readiness validator</div>

          <h1 className="display-hero" style={{ position:"relative" }}>
            Stop shipping <span style={{
              background:"linear-gradient(135deg,#7e14ff 0%,#47bfff 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>incomplete handoffs.</span>
          </h1>
          <p className="lede" style={{ fontSize:18 }}>
            An artifact-agnostic AI engine that scores any project deliverable for readiness, flags what's
            missing, and tells the receiving team exactly what to ask before they commit.
          </p>
        </section>

        {/* ── MISSION BAND ── */}
        <section className="mission-band fade d1">
          <div className="mission-inner">
            <div className="mission-eyebrow">
              <span className="mission-dot"/>
              Aligned with Slalom AI Week 2026 · Mission Statement
            </div>
            <blockquote className="mission-quote">
              We are radically <strong>reimagining delivery</strong> to amplify our people, empower innovation, and deliver predictable, high-value outcomes for our clients <em>with AI as our accelerator.</em>
            </blockquote>
            <p className="mission-bridge">
              <strong>HandoffIQ is how we make that real.</strong> As AI accelerates how we create deliverables, HandoffIQ is the quality gate that keeps every output consistent with Slalom standards — predictable, repeatable, and ready to scale across every engagement.
            </p>
          </div>
        </section>

        <div className="section-divider"/>

        {/* ── 01 · PROBLEM ── */}
        <SectionIntro
          num={1}
          label="The problem"
          title="The hidden cost of bad handoffs."
          lede="Every Slalom engagement runs on handoffs. When an artifact moves between roles or phases with gaps in it, the receiving team finds out too late."
        />

        <div className="problem-grid fade d2" style={{
          display:"grid", gridTemplateColumns:"280px 1fr",
          gap:28, alignItems:"stretch",
        }}>
          <div style={{
            background:C.surface, border:`1px solid ${C.border}`,
            borderLeft:`4px solid ${C.error}`, borderRadius:12,
            padding:"28px 24px", boxShadow:C.shadow1,
            display:"flex", flexDirection:"column", justifyContent:"center",
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.error, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12 }}>
              ⚡ The hidden cost
            </div>
            <div className="stat-number" style={{ fontSize:76, fontWeight:800, lineHeight:1, color:C.error, letterSpacing:"-0.04em", marginBottom:8, fontFamily:FONT_MONO }}>
              67%
            </div>
            <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.55 }}>
              of delivery rework traces back to bad handoffs — incomplete requirements, missing acceptance criteria, untested assumptions.
            </div>
          </div>

          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:28, boxShadow:C.shadow1 }}>
            <h3 style={{ fontSize:13, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.15em", margin:"0 0 14px" }}>
              Why this hurts every project
            </h3>
            <p style={{ fontSize:15, lineHeight:1.7, color:C.text, margin:"0 0 14px" }}>
              BA to developer. Architect to delivery. Discovery to implementation. Sprint to sprint.
              <strong> When an artifact moves between roles or phases with gaps in it, the receiving team finds out too late</strong> — usually mid-sprint, during UAT, or worst case, in production.
            </p>
            <p style={{ fontSize:15, lineHeight:1.7, color:C.text, margin:"0 0 18px" }}>
              The cost shows up as rework, slipped timelines, scope creep, and the kind of "we didn't know that" conversations no one wants to have. The fix is upstream: catch the gap <em>before</em> the handoff lands.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["Vague acceptance criteria","Missing NFRs","Hidden dependencies","Untested edge cases","Unclear data model"].map(p => (
                <span key={p} style={{ background:C.errorBg, color:C.error, borderRadius:9999, padding:"5px 12px", fontSize:12, fontWeight:600 }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider"/>

        {/* ── 02 · WHAT IT DOES ── */}
        <SectionIntro
          num={2}
          label="What the tool does"
          title="One engine. Two modes. Any artifact."
          lede="HandoffIQ is a reusable Slalom asset that validates any artifact moving between roles or phases. The prototype demonstrates the framework on high-impact archetypes across two modes; the underlying engine is artifact-agnostic and extensible."
        />

        <div className="modes-grid fade d3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <div className="mode-card agile">
            <div style={{ fontSize:24, marginBottom:10 }}>🔄</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:4, letterSpacing:"-0.01em" }}>Sprint Ready</div>
            <div style={{ fontSize:11, color:C.primary, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:700, marginBottom:14 }}>
              Agile mode · Story-by-story DoR check
            </div>
            <p style={{ fontSize:13.5, color:C.text, lineHeight:1.65, marginBottom:14 }}>
              Analyses each user story individually against a Definition of Ready. Returns a per-story verdict and a rewritten, sprint-ready version.
            </p>
            <ul className="mode-list" style={{ listStyle:"none", padding:0, margin:0 }}>
              {["READY / REFINE / DEFER verdict per story","8-point DoR checklist with pass/fail notes","AI-suggested fix for every gap","Sprint planning recommendation"].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mode-card gate">
            <div style={{ fontSize:24, marginBottom:10 }}>🏗️</div>
            <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:4, letterSpacing:"-0.01em" }}>Gate / Handoff</div>
            <div style={{ fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:700, marginBottom:14 }}>
              Stage-gate mode · Document review
            </div>
            <p style={{ fontSize:13.5, color:C.text, lineHeight:1.65, marginBottom:14 }}>
              Evaluates the full handoff package across six quality dimensions. Produces an improvement plan with NFR recommendations and Salesforce capability mapping.
            </p>
            <ul className="mode-list" style={{ listStyle:"none", padding:0, margin:0 }}>
              {["Package check: present / incomplete / missing","6 quality dimensions scored 1–10","Story rewrites and NFR suggestions","Standard vs custom SF capability mapping"].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section-divider"/>

        {/* ── 03 · STANDARDS ── */}
        <SectionIntro
          num={3}
          label="Grounded in Slalom standards"
          title="Encoded standards, not invented criteria."
          lede="Each handoff type has its own readiness standard drawn from Slalom's delivery playbook: the user-story Definition of Ready, the Salesforce Delivery Framework (SDF) Risk Gates, and more. The tool applies the right standard for the right handoff — automatically and consistently."
        />

        <div className="fade d4" style={{ marginBottom: 20 }}>
          <div className="tabs-list" role="tablist">
            <button
              className={`tab-item${activeTab === "dor" ? " active" : ""}`}
              role="tab"
              aria-selected={activeTab === "dor"}
              onClick={() => setActiveTab("dor")}
            >
              <span style={{ fontSize:16, lineHeight:1 }}>📋</span>
              User Story · Definition of Ready
              <span className="tab-item-tag">Agile</span>
            </button>
            <button
              className={`tab-item${activeTab === "sdf" ? " active" : ""}`}
              role="tab"
              aria-selected={activeTab === "sdf"}
              onClick={() => setActiveTab("sdf")}
            >
              <span style={{ fontSize:16, lineHeight:1 }}>🛡️</span>
              Client Discovery · SDF Risk Gate
              <span className="tab-item-tag">Gate</span>
            </button>
          </div>

          {activeTab === "dor" && (
            <div role="tabpanel" className="fade">
              <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.6 }}>
                Slalom's <strong style={{ color:C.text }}>8-point Definition of Ready</strong> for user-story handoff — the same standard a BA, lead, or architect would apply in a manual review, now applied automatically to every story.
              </p>
              <div className="standards-grid">
                {DOR_ITEMS.map(item => (
                  <div key={item.n} className="standard-tile">
                    <div className="standard-num">{item.n}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.3 }}>{item.name}</div>
                    <div style={{ fontSize:11.5, color:C.textMuted, lineHeight:1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sdf" && (
            <div role="tabpanel" className="fade">
              <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.6 }}>
                Before Slalom begins a project phase, the <strong style={{ color:C.text }}>Salesforce Delivery Framework (SDF)</strong> applies a Risk Gate to confirm the engagement has its foundations in place. HandoffIQ scores client-provided documents against the relevant gate to determine readiness to proceed.
              </p>
              <div className="gate-card">
                <div className="gate-header">
                  <div className="gate-badge">🛡️</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:3, letterSpacing:"-0.01em" }}>Risk Gate 1: Discover Preparation</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>Client → Discovery handoff · Verifies the engagement is set up for a successful start</div>
                  </div>
                </div>
                <div className="gate-checklist">
                  {SDF_GATE_ITEMS.map((item, i) => (
                    <div key={i} className="gate-check">
                      <span className="check-icon">☐</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="gate-footer">
                  One of multiple gates throughout the SDF lifecycle. Each project phase has its own gate checklist.
                </div>
              </div>
            </div>
          )}

          <div className="sdf-callout" style={{ marginTop:18 }}>
            <strong>Auditable, version-controlled, reusable.</strong> Every standard is human-readable and pluggable — not a black-box AI judgment. Each checked criterion is traceable to a Slalom standard or SDF artifact.
          </div>
        </div>

        <div className="section-divider"/>

        {/* ── 04 · HOW TO USE ── */}
        <SectionIntro
          num={4}
          label="How to use the tool"
          title="Four steps from artifact to action."
          lede="Configure the handoff, drop in artifacts, let the engine analyse, and act on the results — straight into the next refinement."
        />

        <div className="workflow fade d4" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, position:"relative" }}>
          {[
            { n:"1", icon:"⚙️", title:"Configure", desc:"Pick a mode — Sprint Ready or Gate — and select the handoff type (BA → Dev, Architect → Delivery, etc.). Each handoff type loads its own DoR focus.", final:false },
            { n:"2", icon:"📂", title:"Upload",    desc:"Drop in your artifacts — PDF, DOCX, TXT, or paste text directly. Multiple artifacts can be analysed together as a single package.", final:false },
            { n:"3", icon:"✨", title:"Analyse",   desc:"AI runs against the artifact, scoring readiness, identifying gaps, and generating targeted, role-specific recommendations.", final:false },
            { n:"4", icon:"📊", title:"Act on it", desc:"Review the score, story verdicts, and improvement plan. Take the rewritten stories and suggested NFRs straight into the next refinement.", final:true },
          ].map(s => (
            <div key={s.n} className={`step-card${s.final ? " final" : ""}`}>
              <div className="step-num" style={{
                position:"absolute", top:-12, left:16,
                background: s.final ? C.einstein : C.primary,
                color:"#fff", width:28, height:28, borderRadius:9999,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:700, boxShadow:C.shadow1,
              }}>{s.n}</div>
              <div style={{ fontSize:22, margin:"8px 0 10px" }}>{s.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6, letterSpacing:"-0.01em" }}>{s.title}</div>
              <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="section-divider"/>

        {/* ── 05 · TEAM ── */}
        <SectionIntro
          num={5}
          label="The team behind it"
          title='"We used it to build a tool."'
        />

        <blockquote className="team-quote fade d5">
          <div className="team-quote-mark">&ldquo;</div>
          <div className="team-quote-text">
            We didn't just build a tool. <span className="team-quote-em">We used it to build a tool.</span>
          </div>
          <div className="team-quote-attr">— the build team</div>
        </blockquote>

        <div className="team-grid fade d5" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
          {[
            { initials:"AG", name:"Arpit Garg",    role:"Product Owner",       tag:"📋 Vision & backlog",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.primary} 0%, ${C.primaryHover} 100%)` },
              desc:"Shaped the problem space, prioritized what the prototype demonstrates, and owned the bridge between the framework's vision and what ships this week." },
            { initials:"KS", name:"Kanika Singla", role:"Business Architect",  tag:"🧩 Process & framework",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.einstein} 0%, #3d0f7a 100%)` },
              desc:"Designed the readiness framework, the DoR criteria, and the handoff archetypes — translating delivery pain into a structured, repeatable evaluation model." },
            { initials:"FA", name:"Fayzeen Ali",   role:"Technical Architect", tag:"⚡ Engineering & AI",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.success} 0%, #1f5e34 100%)` },
              desc:"Built the analyser end-to-end — prompt engineering, parsing, scoring logic, and the front-end. Owns the path from prototype to reusable asset." },
          ].map(m => (
            <div key={m.name} className="team-card">
              <div style={{
                width:72, height:72, borderRadius:"50%", margin:"0 auto 16px",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:26, fontWeight:700, letterSpacing:"0.5px",
                boxShadow:C.shadow1, ...m.avatarStyle,
              }}>{m.initials}</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>{m.name}</div>
              <div className="team-role" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>
                {m.role}
              </div>
              <span style={{
                display:"inline-block", background:C.surfaceAlt, border:`1px solid ${C.border}`,
                borderRadius:9999, padding:"3px 12px", fontSize:11, color:C.textMuted, fontWeight:600,
              }}>{m.tag}</span>
              <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6, marginTop:12 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="section-divider"/>

        {/* ── 06 · ROADMAP ── */}
        <SectionIntro
          num={6}
          label="Roadmap & vision"
          title="From prototype to default."
          lede="A path to make readiness validation a default part of every engagement, on every deliverable."
        />

        <div className="roadmap fade d5">
          {ROADMAP.map(phase => (
            <div key={phase.name} className="phase-card">
              <div className="phase-marker"/>
              <div className="phase-time">{phase.time}</div>
              <div className="phase-name">{phase.name}</div>
              <ul className="phase-list">
                {phase.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider"/>

        {/* ── 07 · REPOSITORY ── */}
        <SectionIntro
          num={7}
          label="Project repository"
          title="Every artifact, in the open."
          lede="The full set of supporting artifacts produced during the hackathon — wireframes, prompts, framework, test data."
        />

        <div className="fade d5" style={{
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
          boxShadow:C.shadow1, padding:28,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:16, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{
                width:44, height:44, borderRadius:10, background:C.primaryBg,
                color:C.primary, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, flexShrink:0,
              }}>📁</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:2 }}>HandoffIQ — Artifacts</div>
                <div style={{ fontSize:12, color:C.textMuted }}>Full set of supporting artifacts produced during the hackathon</div>
              </div>
            </div>
            <a href="#" className="repo-btn">Open repository →</a>
          </div>

          <div className="artifact-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10 }}>
            {[
              { icon:"📋", name:"User stories",           desc:"Prioritized backlog covering both modes and the underlying framework" },
              { icon:"🏗️", name:"Solution architecture",  desc:"System context, data flow, and prompt design" },
              { icon:"🧩", name:"Readiness framework",    desc:"DoR criteria, quality dimensions, scoring model" },
              { icon:"✨", name:"Prompt library",          desc:"Mode-specific prompts and the structured JSON contract" },
              { icon:"🎨", name:"Wireframes & design",    desc:"Light-purple UI and component patterns" },
              { icon:"🧪", name:"Test artifacts & demo data", desc:"Synthetic stories, sample handoffs, evaluation runs" },
            ].map(a => (
              <div key={a.name} className="artifact-row">
                <div style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:2 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.5 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider"/>

        {/* ── 08 · CLOSING ── */}
        <SectionIntro
          num={8}
          label="Built during AI Week 2026"
          title="A reusable asset, not a one-off demo."
        />

        <div className="fade d5" style={{
          padding:32,
          background:`linear-gradient(135deg, ${C.einsteinBg} 0%, ${C.primaryBg} 50%, ${C.accentBg} 100%)`,
          border:`1px solid ${C.einsteinBg}`,
          borderLeft:`4px solid ${C.einstein}`,
          borderRadius:14,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:24, flexWrap:"wrap",
        }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.einstein, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>
              ✦ Built during Slalom AI Week 2026
            </div>
            <p style={{ fontSize:15, color:C.text, lineHeight:1.6, margin:0 }}>
              The engine is artifact-agnostic. Any deliverable, any role, any phase — the framework extends. Built to catch the rework on every project, every handoff.
            </p>
          </div>
          <div style={{ display:"flex", gap:28 }}>
            {[{ num:"2", label:"Modes" }, { num:"10", label:"Handoff types" }, { num:"14", label:"Quality checks" }].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:36, fontWeight:800, color:C.einstein, lineHeight:1, fontFamily:FONT_MONO, letterSpacing:"-0.02em" }}>{s.num}</div>
                <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.15em", marginTop:8 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
