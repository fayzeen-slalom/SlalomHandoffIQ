import { Link } from "react-router-dom";
import "./about.css";

const FONT = "'Salesforce Sans','Helvetica Neue',Arial,sans-serif";

const C = {
  pageBg:      "#f3f2f2",
  surface:     "#ffffff",
  surfaceAlt:  "#fafaf9",
  border:      "#e5e5e5",
  text:        "#181818",
  textMuted:   "#706e6b",
  textSubtle:  "#a8a5a0",
  brand:       "#0176d3",
  brandDark:   "#014486",
  brandBg:     "#eaf5fe",
  einstein:    "#5a1ba9",
  einsteinBg:  "#e9d9ff",
  success:     "#2e844a",
  successBg:   "#cdefc4",
  warning:     "#7e4800",
  warningBg:   "#fef0e1",
  error:       "#ba0517",
  errorBg:     "#fddde3",
  shadow1:     "0 2px 4px 0 rgba(0,0,0,0.08)",
  shadow2:     "0 4px 12px 0 rgba(0,0,0,0.10)",
  shadow3:     "0 8px 24px 0 rgba(0,0,0,0.10)",
};

/* ── App bar mark (white on brand blue) ── */
function AppBarMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 80 80" style={{ flexShrink:0 }} aria-hidden="true">
      <path d="M 41 4 A 36 36 0 1 1 35 4.5" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"/>
      <path d="M 22 41 L 33 52 L 58 28" fill="none" stroke="#c4a8f0" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Brand mark (brand blue on white, hero size) ── */
function BrandMark() {
  return (
    <svg width="68" height="68" viewBox="0 0 110 110" aria-label="Handoff IQ" role="img"
      style={{ flexShrink:0, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.06))" }}>
      <path d="M 56 6 A 49 49 0 1 1 47 6.7" fill="none" stroke={C.brand} strokeWidth="11" strokeLinecap="round"/>
      <path d="M 33 56 L 47 70 L 75 41" fill="none" stroke={C.einstein} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SectionHeader({ step, title, einstein }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, margin:"36px 0 18px" }}>
      <div style={{
        width:30, height:30, borderRadius:9999,
        background: einstein ? C.einstein : C.brand,
        color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:700, flexShrink:0,
      }}>{step}</div>
      <div style={{ fontSize:12, color:C.text, letterSpacing:"1.2px", fontWeight:700, textTransform:"uppercase" }}>
        {title}
      </div>
      <div style={{ flex:1, height:1, background:C.border }}/>
    </div>
  );
}

export default function About() {
  return (
    <div style={{ fontFamily:FONT, background:C.pageBg, minHeight:"100vh", color:C.text, WebkitFontSmoothing:"antialiased" }}>

      {/* App bar */}
      <header style={{
        background:C.brand, color:"#fff", height:48, padding:"0 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:20, boxShadow:C.shadow1,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <AppBarMark />
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:"0.2px" }}>
            Handoff<span style={{ fontWeight:600, marginLeft:3 }}>IQ</span>
          </span>
          <span style={{
            background:"rgba(255,255,255,0.18)", borderRadius:9999,
            padding:"3px 12px", fontSize:10, fontWeight:700,
            letterSpacing:"1px", textTransform:"uppercase",
          }}>About</span>
        </div>
        <Link to="/" style={{
          fontSize:12, color:"rgba(255,255,255,0.85)", letterSpacing:"0.3px",
          textDecoration:"none",
        }}
          onMouseEnter={e=>e.currentTarget.style.color="#fff"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.85)"}
        >← Back to tool</Link>
      </header>

      {/* Sub-bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"16px 28px" }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", display:"block" }}>
          Slalom delivery accelerator
        </span>
        <div style={{ fontSize:20, fontWeight:700, color:C.text, marginTop:4 }}>
          Delivery Readiness Analyzer
        </div>
      </div>

      <div style={{ maxWidth:1080, margin:"0 auto", padding:"36px 28px 80px" }}>

        {/* ── HERO ── */}
        <section className="about-hero fade d1" style={{
          background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:8, boxShadow:C.shadow2,
          borderTop:`4px solid ${C.brand}`,
          padding:"40px 44px", marginBottom:28,
        }}>
          {/* Brand lockup */}
          <div style={{
            display:"flex", alignItems:"center", gap:18,
            marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${C.border}`,
          }}>
            <BrandMark />
            <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
              <div style={{ fontSize:38, fontWeight:500, color:C.text, letterSpacing:"-1px", lineHeight:1 }}>
                Handoff<span style={{ color:C.einstein, fontWeight:600, marginLeft:5 }}>IQ</span>
              </div>
              <div style={{ fontSize:12, color:C.textMuted, letterSpacing:"2px", textTransform:"uppercase", marginTop:8, fontWeight:600 }}>
                Delivery readiness, scored.
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:C.einsteinBg, color:C.einstein,
            padding:"5px 14px", borderRadius:9999,
            fontSize:11, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase",
            marginBottom:18,
          }}>
            ✨ AI-powered readiness validator
          </div>

          <h1 className="hero-title" style={{ fontSize:42, fontWeight:700, color:C.text, lineHeight:1.1, margin:"0 0 14px", letterSpacing:"-0.5px" }}>
            Stop shipping <span style={{ color:C.brand }}>incomplete handoffs.</span>
          </h1>
          <p style={{ fontSize:18, color:C.textMuted, maxWidth:720, lineHeight:1.55, margin:0 }}>
            An artifact-agnostic AI engine that scores any project deliverable for readiness, flags what's
            missing, and tells the receiving team exactly what to ask before they commit.
          </p>
        </section>

        {/* ── PROBLEM ── */}
        <SectionHeader step="1" title="The problem we are solving" />

        <div className="problem-grid fade d2" style={{
          display:"grid", gridTemplateColumns:"280px 1fr",
          gap:28, marginBottom:28, alignItems:"stretch",
        }}>
          {/* Stat card */}
          <div style={{
            background:C.surface, border:`1px solid ${C.border}`,
            borderLeft:`4px solid ${C.error}`, borderRadius:8,
            padding:"28px 24px", boxShadow:C.shadow1,
            display:"flex", flexDirection:"column", justifyContent:"center",
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.error, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:12 }}>
              ⚡ The hidden cost
            </div>
            <div className="stat-number" style={{ fontSize:76, fontWeight:700, lineHeight:1, color:C.error, letterSpacing:"-2px", marginBottom:8 }}>
              67%
            </div>
            <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.55 }}>
              of delivery rework traces back to bad handoffs — incomplete requirements, missing acceptance criteria, untested assumptions.
            </div>
          </div>

          {/* Problem description */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:28, boxShadow:C.shadow1 }}>
            <h2 style={{ fontSize:14, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 14px" }}>
              Why this hurts every project
            </h2>
            <p style={{ fontSize:15, lineHeight:1.7, color:C.text, margin:"0 0 14px" }}>
              Every Slalom engagement runs on handoffs. BA to developer. Architect to delivery. Discovery
              to implementation. Sprint to sprint. <strong>When an artifact moves between roles or phases
              with gaps in it, the receiving team finds out too late</strong> — usually mid-sprint, during
              UAT, or worst case, in production.
            </p>
            <p style={{ fontSize:15, lineHeight:1.7, color:C.text, margin:"0 0 18px" }}>
              The cost shows up as rework, slipped timelines, scope creep, and the kind of "we didn't know
              that" conversations no one wants to have. The fix is upstream: catch the gap <em>before</em> the handoff lands.
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

        {/* ── WHAT IT DOES ── */}
        <SectionHeader step="2" title="What the tool does" />

        <div className="fade d3" style={{
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
          boxShadow:C.shadow1, padding:24, marginBottom:16,
        }}>
          <p style={{ fontSize:14, lineHeight:1.7, color:C.text, margin:0 }}>
            <strong>Handoff IQ</strong> is a reusable Slalom asset that validates any artifact moving between
            roles or phases. Drop in user stories, design docs, requirements packages, test plans, or discovery
            outputs — get back a readiness score, a complete / incomplete / missing gap analysis, and the targeted
            questions the receiving party should ask before they commit. The hackathon prototype demonstrates the
            framework on high-impact archetypes across two modes, but the underlying engine is artifact-agnostic
            and extensible.
          </p>
        </div>

        <div className="modes-grid fade d3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div className="mode-card agile">
            <div style={{ fontSize:24, marginBottom:10 }}>🔄</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>Sprint Ready</div>
            <div style={{ fontSize:12, color:C.brand, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600, marginBottom:14 }}>
              Agile mode · Story-by-story DoR check
            </div>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.65, marginBottom:14 }}>
              Analyses each user story individually against a Definition of Ready. Returns a per-story
              verdict and a rewritten, sprint-ready version.
            </p>
            <ul className="mode-list" style={{ listStyle:"none", padding:0, margin:0 }}>
              {["READY / REFINE / DEFER verdict per story","8-point DoR checklist with pass/fail notes","Einstein-suggested fix for every gap","Sprint planning recommendation"].map(item => (
                <li key={item} style={{ fontSize:12, color:C.textMuted, padding:"6px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:8, lineHeight:1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mode-card gate">
            <div style={{ fontSize:24, marginBottom:10 }}>🏗️</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>Gate / Handoff</div>
            <div style={{ fontSize:12, color:C.warning, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600, marginBottom:14 }}>
              Stage-gate mode · Document review
            </div>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.65, marginBottom:14 }}>
              Evaluates the full handoff package across six quality dimensions. Produces an improvement
              plan with NFR recommendations and Salesforce capability mapping.
            </p>
            <ul className="mode-list" style={{ listStyle:"none", padding:0, margin:0 }}>
              {["Package check: present / incomplete / missing","6 quality dimensions scored 1–10","Story rewrites and NFR suggestions","Standard vs custom SF capability mapping"].map(item => (
                <li key={item} style={{ fontSize:12, color:C.textMuted, padding:"6px 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", gap:8, lineHeight:1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── HOW TO USE ── */}
        <SectionHeader step="3" title="How to use the tool" />

        <div className="workflow fade d4" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, position:"relative" }}>
          {[
            { n:"1", icon:"⚙️", title:"Configure", desc:"Pick a mode — Sprint Ready or Gate — and select the handoff type (BA → Dev, Architect → Delivery, etc.). Each handoff type loads its own DoR focus.", final:false },
            { n:"2", icon:"📂", title:"Upload",    desc:"Drop in your artifacts — PDF, DOCX, TXT, or paste text directly. Multiple artifacts can be analysed together as a single package.", final:false },
            { n:"3", icon:"✨", title:"Analyse",   desc:"Einstein runs against the artifact, scoring readiness, identifying gaps, and generating targeted, role-specific recommendations.", final:false },
            { n:"4", icon:"📊", title:"Act on it", desc:"Review the score, story verdicts, and improvement plan. Take the rewritten stories and suggested NFRs straight into the next refinement.", final:true },
          ].map(s => (
            <div key={s.n} className={`step-card${s.final ? " final" : ""}`}>
              <div className="step-num" style={{
                position:"absolute", top:-12, left:16,
                background: s.final ? C.einstein : C.brand,
                color:"#fff", width:28, height:28, borderRadius:9999,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:700, boxShadow:C.shadow1,
              }}>{s.n}</div>
              <div style={{ fontSize:22, margin:"8px 0 10px" }}>{s.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>{s.title}</div>
              <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ── TEAM ── */}
        <SectionHeader step="4" title="The team behind it" einstein />

        <div className="team-grid fade d5" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
          {[
            { initials:"AG", name:"Arpit Garg",    role:"Product Owner",       tag:"📋 Vision & backlog",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.brand} 0%, ${C.brandDark} 100%)` },
              desc:"Shaped the problem space, prioritized what the prototype demonstrates, and owned the bridge between the framework's vision and what ships this week." },
            { initials:"KS", name:"Kanika Singla", role:"Business Architect",  tag:"🧩 Process & framework",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.einstein} 0%, #3d0f7a 100%)` },
              desc:"Designed the readiness framework, the DoR criteria, and the handoff archetypes — translating delivery pain into a structured, repeatable evaluation model." },
            { initials:"FA", name:"Fayzeen Ali",   role:"Technical Architect", tag:"⚡ Engineering & AI",
              avatarStyle:{ background:`linear-gradient(135deg, ${C.success} 0%, #1f5e34 100%)` },
              desc:"Built the analyser end-to-end — prompt engineering, parsing, scoring logic, and the SLDS front-end. Owns the path from prototype to reusable asset." },
          ].map(m => (
            <div key={m.name} className="team-card">
              <div style={{
                width:72, height:72, borderRadius:"50%", margin:"0 auto 16px",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:26, fontWeight:700, letterSpacing:"0.5px",
                boxShadow:C.shadow1, ...m.avatarStyle,
              }}>{m.initials}</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>{m.name}</div>
              <div className="team-role" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", marginBottom:14 }}>
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

        {/* ── REPOSITORY ── */}
        <SectionHeader step="5" title="Project repository" />

        <div className="fade d5" style={{
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
          boxShadow:C.shadow1, padding:28,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:16, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{
                width:44, height:44, borderRadius:8, background:C.brandBg,
                color:C.brand, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, flexShrink:0,
              }}>📁</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:2 }}>Handoff IQ — Artifacts</div>
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
              { icon:"🎨", name:"Wireframes & design",    desc:"SLDS 2 / Cosmos-styled UI and component patterns" },
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

        {/* ── CLOSING ── */}
        <div className="fade d5" style={{
          marginTop:40, padding:28,
          background:`linear-gradient(135deg, ${C.einsteinBg} 0%, ${C.brandBg} 100%)`,
          border:`1px solid ${C.einsteinBg}`,
          borderLeft:`4px solid ${C.einstein}`,
          borderRadius:8,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:24, flexWrap:"wrap",
        }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.einstein, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:6 }}>
              ✨ Built during Slalom AI Week 2026
            </div>
            <h3 style={{ fontSize:22, fontWeight:700, color:C.text, margin:"0 0 6px", lineHeight:1.2 }}>
              A reusable asset, not a one-off demo.
            </h3>
            <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.6, margin:0 }}>
              The engine is artifact-agnostic. Any deliverable, any role, any phase — the framework
              extends. Built to catch the rework on every project, every handoff.
            </p>
          </div>
          <div style={{ display:"flex", gap:28 }}>
            {[{ num:"2", label:"Modes" }, { num:"10", label:"Handoff types" }, { num:"14", label:"Quality checks" }].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:30, fontWeight:700, color:C.einstein, lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", marginTop:6 }}>
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
