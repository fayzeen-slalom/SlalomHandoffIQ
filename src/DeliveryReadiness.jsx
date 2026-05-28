import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { getSkillForContext } from "./skills";

const WATERFALL_TYPES = [
  { id:"ba-dev",        label:"BA → Developer",          desc:"Requirements to build-ready specs",   icon:"📋" },
  { id:"arch-delivery", label:"Architect → Delivery",     desc:"Solution design to implementation",  icon:"🏗️" },
  { id:"workstream",    label:"Workstream → Workstream",  desc:"Cross-team handoff within program",  icon:"🔄" },
  { id:"client-impl",   label:"Client → Impl. Team",      desc:"Pre-discovery outputs to delivery team", icon:"🤝" },
];

const AGILE_TYPES = [
  { id:"ba-dev",         label:"BA → Developer",              desc:"Story ready for sprint commitment",    icon:"📋",
    dorFocus:"Acceptance criteria completeness, data model clarity, edge cases defined, UI/UX described",
    extra:"Check each story has unambiguous ACs, no hidden dependencies, and is independently deliverable within a sprint." },
  { id:"sf-integration", label:"Implementation Team → Integration Team", desc:"Implementation build ready for integration", icon:"🔗",
    dorFocus:"API endpoint or platform event defined, payload structure documented, error handling specified, environment accessible, field mappings complete",
    extra:"Check API contracts, authentication setup, and field-level mappings are documented. Integration error scenarios and retry logic should be specified." },
  { id:"integration-sf", label:"Integration Team → Implementation Team", desc:"Integration spec ready for implementation build", icon:"⚡",
    dorFocus:"Inbound payload schema defined, target object/field mappings identified, duplicate/upsert logic specified, volume and frequency documented",
    extra:"Check the integration team has provided the full inbound schema, identified which target objects are affected, and documented how conflicts or duplicates should be handled." },
  { id:"sf-data",        label:"Implementation Team → Data / Analytics",desc:"Data model ready for reporting", icon:"📊",
    dorFocus:"New objects and fields documented, field types and picklist values confirmed, reporting requirements specified, data access/sharing model clear",
    extra:"Check new schema changes are documented, calculated fields are explained, and the analytics team has record access and sharing model context." },
];

/* ── Logo-derived light palette ── */
const C = {
  // Surfaces
  pageBg:        "#faf8ff",     // subtle lavender-tinted off-white
  surface:       "#ffffff",     // card/panel
  surfaceAlt:    "#f5efff",     // inputs, code blocks (faint purple)
  border:        "#ece4fb",     // subtle divider
  borderStrong:  "#d6c7ee",     // input border

  // Text
  text:          "#1a1130",     // purple-charcoal
  textMuted:     "#5e5773",     // secondary
  textSubtle:    "#a59cb8",     // tertiary

  // Primary (logo deep purple)
  primary:       "#7e14ff",
  primaryHover:  "#6b00f0",
  primaryBg:     "#ede6ff",

  // Secondary accent (logo blue highlight)
  accent:        "#47bfff",
  accentBg:      "#e0f3ff",

  // Aliases for existing code references
  brand:         "#7e14ff",
  brandDark:     "#6b00f0",
  brandBg:       "#ede6ff",

  // AI accent (keep existing)
  ai:      "#5a1ba9",
  aiBg:    "#e9d9ff",

  // Semantic
  success:       "#2e844a",
  successBg:     "#cdefc4",
  warning:       "#7e4800",
  warningBg:     "#fef0e1",
  error:         "#ba0517",
  errorBg:       "#fddde3",

  // Mode accents — Agile=primary purple, Gate=accent blue
  agile:         "#7e14ff",
  agileBg:       "#ede6ff",
  gate:          "#47bfff",
  gateBg:        "#e0f3ff",

  // Shadows (purple-tinted)
  shadow1:       "0 2px 4px 0 rgba(126,20,255,0.06)",
  shadow2:       "0 8px 24px rgba(126,20,255,0.08)",
  shadowLift:    "0 12px 32px rgba(126,20,255,0.14)",
};

const FONT = "'Manrope','Salesforce Sans','Helvetica Neue',Arial,sans-serif";
const FONT_MONO = "'JetBrains Mono','SF Mono',Consolas,monospace";

const MODELS = [
  { id:"claude-sonnet-4-6",         label:"Sonnet 4.6",  sub:"Recommended"  },
  { id:"claude-opus-4-7",           label:"Opus 4.7",    sub:"Most capable" },
  { id:"claude-haiku-4-5-20251001", label:"Haiku 4.5",   sub:"Fastest"      },
];

const QUALITY_DIMS = [
  { key:"clarity",        label:"Clarity",               icon:"🔍" },
  { key:"testability",    label:"Testability",           icon:"✅" },
  { key:"businessValue",  label:"Business Value",        icon:"💼" },
  { key:"dependencyRisk", label:"Dependency Risk",       icon:"⚡" },
  { key:"dataImpact",     label:"Data / Integration",    icon:"🔗" },
  { key:"sfFeasibility",  label:"Salesforce Feasibility",icon:"☁️" },
];

const DOR_CRITERIA = [
  { key:"userStoryFormat",    label:"User story format",                desc:"Role, capability, business value (As a / I want / So that)" },
  { key:"acceptanceCriteria", label:"Acceptance criteria",              desc:"Complete and testable (Given/When/Then or equivalent)" },
  { key:"scopeDefined",       label:"Scope clearly defined",            desc:"What's in, what's out; not blended or open-ended" },
  { key:"sfObjectsFieldsUi",  label:"Salesforce objects / fields / UI", desc:"Objects, fields, pages, flows, components identified" },
  { key:"businessRules",      label:"Business rules and validations",   desc:"Decision logic, validations, statuses, calculations" },
  { key:"dependencies",       label:"Dependencies identified",          desc:"Upstream/downstream stories, integrations, data, teams" },
  { key:"securityDataNfrs",   label:"Security, data, and NFRs",         desc:"Permissions, sharing, performance, compliance, audit" },
  { key:"testingScenarios",   label:"Testing notes",                    desc:"Happy path and exception scenarios" },
];

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("PDF.js failed to load"));
    document.head.appendChild(s);
  });
}

/* ── SLDS-style UPPERCASE label ── */
const sldsLabel = {
  fontSize:11, fontWeight:700, color:C.textMuted,
  textTransform:"uppercase", letterSpacing:0.5,
  display:"block",
};

/* ── AI generated pill ── */
function AIPill({ text="AI generated", style={} }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:C.aiBg, color:C.ai,
      padding:"3px 10px", borderRadius:9999,
      fontSize:11, fontWeight:700, letterSpacing:0.2,
      ...style,
    }}>
      <span>✨</span>{text}
    </span>
  );
}

/* ── Copy button ── */
function CopyButton({ text, style={} }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text||"").then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} style={{
      background:"none",
      border:`1px solid ${copied ? C.success : C.border}`,
      borderRadius:6, padding:"3px 10px",
      fontSize:11, fontWeight:600, cursor:"pointer",
      color: copied ? C.success : C.textMuted,
      fontFamily:"inherit",
      display:"inline-flex", alignItems:"center", gap:4,
      transition:"all 0.15s",
      ...style,
    }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ── Mode toggle (SLDS button-group / segmented control) ── */
function ModeToggle({ mode, onChange }) {
  return (
    <div style={{
      display:"flex", background:C.surfaceAlt,
      border:`1px solid ${C.border}`, borderRadius:9999,
      padding:4, gap:4,
    }}>
      {[
        { id:"agile",     label:"🔄  Sprint Ready",     sub:"Story-by-story · DoR check",   color:C.agile, bg:C.agileBg },
        { id:"waterfall", label:"🏗️  Gate / Handoff",  sub:"Stage-gate · Document review", color:C.gate,  bg:C.gateBg },
      ].map(m => {
        const active = mode===m.id;
        return (
          <div key={m.id} onClick={() => onChange(m.id)} style={{
            flex:1, padding:"10px 16px", borderRadius:9999, cursor:"pointer", textAlign:"center",
            background: active ? m.bg : "transparent",
            border: active ? `1px solid ${m.color}` : "1px solid transparent",
            transition:"all 0.15s",
          }}>
            <div style={{ fontSize:13, fontWeight:600, color: active ? m.color : C.text, marginBottom:2 }}>{m.label}</div>
            <div style={{ fontSize:11, color:C.textMuted }}>{m.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Startup / API key modal ── */
function StartupModal({ onSave, onCancel, hasExistingKey }) {
  const [keyInput, setKeyInput] = useState("");
  const [modelInput, setModelInput] = useState(
    () => localStorage.getItem("handoffiq_model") || "claude-sonnet-4-6"
  );
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"rgba(250,248,255,0.88)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div style={{
        background:"#fff",
        border:`1px solid ${C.border}`,
        borderRadius:20,
        padding:"36px 40px", maxWidth:520, width:"100%",
        boxShadow:`0 24px 80px rgba(126,20,255,0.18), 0 0 0 1px ${C.border}`,
        animation:"fadeUp 0.3s ease forwards",
        fontFamily:FONT,
      }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"5px 14px", background:C.primaryBg,
          border:`1px solid ${C.primary}44`,
          borderRadius:9999, fontSize:11, fontWeight:700,
          letterSpacing:"0.18em", color:C.primary,
          textTransform:"uppercase", marginBottom:18,
        }}>✦ Connect</div>
        <h2 style={{
          fontSize:26, fontWeight:800, color:C.text,
          margin:"0 0 8px", letterSpacing:"-0.02em",
        }}>
          Connect an Anthropic API key
        </h2>
        <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.6, marginBottom:20 }}>
          Paste your API key to enable AI-powered readiness analysis. Your key stays in your browser only.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={e=>setKeyInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter" && keyInput.trim()) onSave(keyInput.trim(), modelInput); }}
          placeholder="sk-ant-..."
          autoComplete="off"
          style={{
            width:"100%", padding:"13px 16px",
            background:C.surfaceAlt, border:`1px solid ${C.borderStrong}`,
            borderRadius:8, color:C.text,
            fontFamily:FONT_MONO, fontSize:13, outline:"none",
            marginBottom:12, boxSizing:"border-box",
          }}
        />
        <select
          value={modelInput}
          onChange={e=>setModelInput(e.target.value)}
          style={{
            width:"100%", padding:"12px 14px",
            background:C.surfaceAlt, border:`1px solid ${C.borderStrong}`,
            borderRadius:8, color:C.text,
            fontFamily:FONT, fontSize:13, outline:"none",
            cursor:"pointer", marginBottom:20, boxSizing:"border-box",
          }}
        >
          {MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.label} — {m.sub}</option>
          ))}
        </select>
        <div style={{
          padding:"12px 16px", marginBottom:24,
          background:"rgba(186,5,23,0.04)",
          borderLeft:`2px solid ${C.error}55`,
          borderRadius:"0 8px 8px 0",
          fontSize:12, color:C.textMuted, lineHeight:1.6,
        }}>
          Your key stays in your browser for this session only. It is sent directly to api.anthropic.com from your machine, never to Slalom or any third party.
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {hasExistingKey && (
            <button onClick={onCancel} style={{
              flex:1, padding:"11px 22px",
              background:"transparent", color:C.textMuted,
              border:`1px solid ${C.border}`,
              borderRadius:9999, fontSize:13, fontWeight:600,
              cursor:"pointer", fontFamily:FONT, transition:"all 0.15s",
            }}>Cancel</button>
          )}
          <button
            onClick={() => { if(keyInput.trim()) onSave(keyInput.trim(), modelInput); }}
            disabled={!keyInput.trim()}
            style={{
              flex:1, padding:"11px 22px",
              background: keyInput.trim() ? C.primary : C.border,
              color: keyInput.trim() ? "#fff" : C.textSubtle,
              border:"none", borderRadius:9999,
              fontSize:13, fontWeight:700,
              cursor: keyInput.trim() ? "pointer" : "not-allowed",
              fontFamily:FONT, transition:"all 0.15s",
              letterSpacing:"0.02em",
            }}
          >Continue →</button>
        </div>
      </div>
    </div>
  );
}

/* ── Score ring ── */
function ScoreRing({ score, color, label, size=160 }) {
  const r = (size/2)-10, circ = 2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, flexShrink:0 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth="10"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3 }}>
          <span style={{ fontSize:size*0.24, fontWeight:800, color, lineHeight:1, fontFamily:FONT_MONO }}>{score}</span>
          <span style={{ fontSize:size*0.07, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>out of 100</span>
        </div>
      </div>
      <span style={{ fontSize:11, color, letterSpacing:1.2, fontWeight:700, textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}

/* ── Sprint verdict badge (SLDS full-pill) ── */
function Verdict({ v }) {
  const map = {
    READY:  { color:C.success, bg:C.successBg, icon:"✓" },
    REFINE: { color:C.warning, bg:C.warningBg, icon:"!" },
    DEFER:  { color:C.error,   bg:C.errorBg,   icon:"✕" },
  };
  const s = map[v] || map.REFINE;
  return (
    <span style={{
      fontSize:11, color:s.color, background:s.bg,
      borderRadius:9999, padding:"3px 10px",
      fontWeight:700, letterSpacing:0.5,
      whiteSpace:"nowrap",
    }}>
      {s.icon} {v}
    </span>
  );
}

/* ── DoR check row ── */
function DorRow({ criterion, data }) {
  const pass = data?.pass;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        width:20, height:20, borderRadius:9999, marginTop:1, flexShrink:0,
        background: pass ? C.successBg : C.errorBg,
        color: pass ? C.success : C.error,
        fontSize:12, fontWeight:700,
      }}>{pass ? "✓" : "✕"}</span>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{criterion.label}</span>
          <span style={{ fontSize:11, color:C.textMuted }}>— {criterion.desc}</span>
        </div>
        {data?.note && <p style={{ fontSize:12, color: pass ? C.textMuted : C.warning, lineHeight:1.6 }}>{data.note}</p>}
        {!pass && data?.fix && (
          <div style={{
            marginTop:8, background:C.aiBg+"55",
            border:`1px solid ${C.aiBg}`, borderLeft:`3px solid ${C.ai}`,
            borderRadius:8, padding:"10px 12px",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
              <AIPill text="Suggested fix"/>
              <CopyButton text={data.fix}/>
            </div>
            <p style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{data.fix}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section divider ── */
function Divider({ step, label, color=C.primary }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, margin:"28px 0 18px" }}>
      <div style={{
        width:28, height:28, borderRadius:9999,
        background:color, color:"#fff",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:700, flexShrink:0,
      }}>{step}</div>
      <span style={{ fontSize:12, color:C.text, letterSpacing:1.2, fontWeight:700, textTransform:"uppercase" }}>{label}</span>
      <div style={{ flex:1, height:1, background:C.border }}/>
    </div>
  );
}

/* ── Example callout ── */
function Example({ label, text, accent }) {
  if (!text) return null;
  const useAI = accent === C.ai || !accent;
  const c = accent || C.ai;
  return (
    <div style={{
      marginTop:10,
      background: useAI ? C.aiBg+"55" : "#fff",
      border:`1px solid ${useAI ? C.aiBg : C.border}`,
      borderLeft:`3px solid ${c}`,
      borderRadius:8, padding:"10px 12px",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
        {useAI
          ? <AIPill text={label}/>
          : <span style={{ fontSize:11, color:c, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</span>}
        <CopyButton text={text}/>
      </div>
      <p style={{ fontSize:12, color:C.text, lineHeight:1.65 }}>{text}</p>
    </div>
  );
}

/* ── Package row ── */
function PackageRow({ icon, item, detail, tag, tagColor, tagBg, children }) {
  return (
    <div style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <span style={{ fontSize:16, marginTop:1 }}>{icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{item}</span>
            {tag && <span style={{
              fontSize:11, color:tagColor, background:tagBg,
              borderRadius:9999, padding:"2px 10px",
              fontWeight:700, letterSpacing:0.5,
            }}>{tag}</span>}
          </div>
          <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{detail}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Dim bar ── */
function DimBar({ dim, data }) {
  const score = data?.score ?? 0;
  const color = score>=7 ? C.success : score>=5 ? C.warning : C.error;
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:13, color:C.text, fontWeight:600 }}>{dim.icon} {dim.label}</span>
        <span style={{ fontSize:13, fontWeight:700, color }}>{score}/10</span>
      </div>
      <div style={{ height:8, background:C.border, borderRadius:9999, overflow:"hidden", marginBottom:8 }}>
        <div style={{
          height:"100%", width:`${score*10}%`, background:color,
          borderRadius:9999, transition:"width 1.1s cubic-bezier(0.4,0,0.2,1)",
        }}/>
      </div>
      {data?.finding    && <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{data.finding}</p>}
      {data?.suggestion && <p style={{ fontSize:12, color:C.warning, marginTop:4 }}>→ {data.suggestion}</p>}
      <Example label="Example" text={data?.example} accent={C.ai}/>
    </div>
  );
}

/* ── Spinner ── */
const SPINNER_MESSAGES = {
  agile: [
    "Reading your user stories…",
    "Checking Definition of Ready criteria…",
    "Evaluating acceptance criteria completeness…",
    "Assessing story sizing and dependencies…",
    "Scoring testability and data model clarity…",
    "Flagging gaps and missing edge cases…",
    "Rewriting stories for sprint readiness…",
    "Finalising sprint recommendations…",
  ],
  gate: {
    default: [
      "Reviewing handoff package…",
      "Evaluating clarity and testability…",
      "Assessing business value alignment…",
      "Checking dependency and data risks…",
      "Mapping Salesforce capabilities…",
      "Identifying missing NFRs…",
      "Drafting improvement plan…",
      "Rewriting stories for delivery readiness…",
    ],
    "ba-dev": [
      "Reviewing requirements and user stories…",
      "Checking acceptance criteria completeness…",
      "Assessing data model and field definitions…",
      "Evaluating edge cases and error handling…",
      "Checking UI/UX specification coverage…",
      "Mapping Salesforce standard capabilities…",
      "Identifying missing non-functional requirements…",
      "Generating build-ready improvement plan…",
    ],
    "arch-delivery": [
      "Reviewing solution design document…",
      "Evaluating architecture clarity and completeness…",
      "Checking NFR and performance coverage…",
      "Assessing integration and dependency risks…",
      "Reviewing data migration and rollback strategy…",
      "Mapping components to Salesforce capabilities…",
      "Identifying implementation ambiguities…",
      "Generating delivery readiness improvement plan…",
    ],
    "dev-qa": [
      "Reviewing build completion artefacts…",
      "Checking test data and sandbox availability…",
      "Evaluating known defects documentation…",
      "Assessing AC-to-test-scenario traceability…",
      "Checking edge cases and error paths flagged…",
      "Evaluating deployment and test setup notes…",
      "Scoring handoff completeness for QA…",
      "Generating QA readiness recommendations…",
    ],
    "workstream": [
      "Reviewing cross-team handoff package…",
      "Checking shared dependency documentation…",
      "Evaluating interface contracts and schemas…",
      "Assessing team assumptions and risk flags…",
      "Checking timeline and milestone alignment…",
      "Scoring inter-team communication clarity…",
      "Identifying coordination gaps…",
      "Generating cross-workstream improvement plan…",
    ],
  },
};

function Spinner({ mode, handoffType }) {
  const messages = mode === "agile"
    ? SPINNER_MESSAGES.agile
    : (SPINNER_MESSAGES.gate[handoffType] || SPINNER_MESSAGES.gate.default);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 1800);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div style={{ textAlign:"center", padding:"36px 0" }}>
      <div style={{ position:"relative", width:80, height:80, margin:"0 auto 18px" }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            position:"absolute", inset:0,
            border:`2px solid ${C.ai}`, borderRadius:"50%",
            animation:`ping 2s ease-out ${i*0.65}s infinite`,
          }}/>
        ))}
        <div style={{ position:"absolute", inset:"34%", background:C.ai, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14 }}>✨</div>
      </div>
      <p style={{ fontSize:13, color:C.ai, fontWeight:600, marginBottom:4 }}>{messages[idx]}</p>
      <p style={{ fontSize:11, color:C.textMuted, letterSpacing:0.5 }}>Powered by Slalom HandoffIQ</p>
    </div>
  );
}

/* ══ PROMPTS ══ */
const WATERFALL_PROMPT = `You are a delivery accelerator for IT and Salesforce implementation projects. Analyse the provided handoff artifacts and return ONLY a single valid JSON object — no markdown, no preamble, no trailing text.

{"deliveryScore":<0-100, 40% package + 60% quality>,"summary":"<3 sentences: verdict, strength, risk>","package":{"present":[{"item":"<name>","detail":"<15 words>"}],"incomplete":[{"item":"<name>","detail":"<15 words>","suggestion":"<15 words>","example":"<35 words showing completed version>"}],"missing":[{"item":"<name>","detail":"<15 words>","impact":"<12 words>","example":"<35 words showing what should exist>"}]},"qualityDimensions":{"clarity":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words>"},"testability":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words of sample Given/When/Then>"},"businessValue":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words>"},"dependencyRisk":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words>"},"dataImpact":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words>"},"sfFeasibility":{"score":<1-10>,"finding":"<15 words>","suggestion":"<15 words>","example":"<35 words>"}},"improvementPlan":{"improvedStories":[{"original":"<exact quote from artifact, 40 words max>","improved":"<full rewrite with role/action/outcome + AC>","reason":"<10 words>"}],"missingNFRs":[{"area":"<Security|Scale|Reporting|Migration|Compliance|Performance>","detail":"<15 words>","impact":"<12 words>","recommendation":"<full usable NFR statement, 45 words>"}],"salesforceCapabilities":[{"requirement":"<10 words>","standardCapability":"<15 words>","customizationNeeded":"<15 words>"}]}}

Rules: package.present max 3; incomplete+missing max 3 each with examples; improvedStories max 2 full rewrites; missingNFRs max 3 with usable statements; sfCapabilities max 3. Be specific to the artifact.`;

function buildWaterfallPrompt(handoffType) {
  const skill = getSkillForContext("waterfall", handoffType);
  if (!skill) return WATERFALL_PROMPT;
  return `${skill.md}\n\n---\n\n${WATERFALL_PROMPT}\n\nApply the skill's evaluation framework above as your evaluation lens — surface risk-gate gaps in the JSON's package.missing and improvementPlan.missingNFRs arrays. The JSON output shape MUST remain exactly as specified.`;
}

function buildAgilePrompt(handoffType) {
  const skill = getSkillForContext("agile", handoffType);
  const skillBlock = skill?.md || "";
  const criteria = skill?.criteria || DOR_CRITERIA;

  const dorChecksSchema = criteria
    .map(c => `"${c.key}":{"pass":<true|false>,"note":"<10-15 words of evidence>","fix":"<concrete remediation if failing, 30-40 words>"}`)
    .join(",");

  const outputBinding = `---
OUTPUT BINDING (HandoffIQ)

You operate as the skill above. Produce your response in EXACTLY TWO PARTS, in this order.

PART 1 — A single valid JSON object. No preamble, no code fences, no commentary. Just the JSON object, matching this shape exactly. The JSON does NOT contain a reportMarkdown field.

{"sprintReadinessScore":<0-100, average across all stories computed as round((rawScore/8)*100)>,"summary":"<2 sentences: overall sprint health and biggest recurring gap>","stories":[{"id":"<Story N>","title":"<story title or first 8 words>","verdict":"<READY|REFINE|DEFER>","score":<0-100 = round((rawScore/8)*100)>,"rawScore":<0-8 integer count of criteria passing>,"primaryReason":"<one sentence>","dorChecks":{${dorChecksSchema}},"topFix":"<single most important fix, 20 words>","improvedStory":"<full rewritten story with role/want/value + 2 sample ACs — concrete and specific, or null if already READY>"}],"sprintRecommendation":{"ready":["<story title>"],"refine":["<story title>"],"defer":["<story title>"],"advice":"<2 sentences on sprint planning recommendation>"}}

PART 2 — On a NEW line immediately after the closing brace of the JSON, write this exact sentinel on its own line:

===MARKDOWN REPORT===

PART 3 — Below the sentinel, write the polished Markdown report as the skill specifies (executive summary table, per-story sections with criterion table, deficient areas, BA-ready remediation wording, developer handoff risk statement). Write it as PLAIN MARKDOWN. Do NOT JSON-escape it. Newlines, quotes, pipes, and triple-backtick code fences are all fine — they are raw Markdown, not inside a JSON string.

Verdict mapping: rawScore 7-8 → READY; 5-6 → REFINE; 0-4 → DEFER.
Override rule: if acceptanceCriteria.pass is false OR no clear business outcome is identifiable, cap the verdict at REFINE even if rawScore would otherwise yield READY.
Rules: analyse every story found; be direct and evidence-based; do not inflate scores; do not invent missing details; improvedStory must be fully written; the Markdown report must include all sections from the skill specification.`;

  return `${skillBlock}\n\n${outputBinding}`;
}

/* ══ MAIN APP ══ */
export default function HandoffRadar() {
  const [mode, setMode]               = useState("agile");
  const [step, setStep]               = useState("setup");
  const [handoffType, setHandoffType] = useState("ba-dev");
  const [files, setFiles]             = useState([]);
  const [pasteText, setPasteText]     = useState("");
  const [showPaste, setShowPaste]     = useState(false);
  const [results, setResults]         = useState(null);
  const [analyzing, setAnalyzing]     = useState(false);
  const [error, setError]             = useState("");
  const [dragOver, setDragOver]       = useState(false);
  const [expandedStory, setExpandedStory] = useState(null);
  const [expandAll, setExpandAll]         = useState(false);
  const fileRef = useRef();
  const [apiKey, setApiKey]                   = useState(()=>localStorage.getItem("handoffiq_api_key")||"");
  const [selectedModel, setSelectedModel]     = useState(()=>localStorage.getItem("handoffiq_model")||"claude-sonnet-4-6");
  const [showStartupModal, setShowStartupModal] = useState(()=>!localStorage.getItem("handoffiq_api_key"));

  const [savedAnalyses, setSavedAnalyses] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("handoffiq_saved_analyses")||"[]"); } catch{ return []; }
  });
  const [showHistory, setShowHistory]     = useState(false);
  const [saveFlash, setSaveFlash]         = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingName, setEditingName]       = useState("");

  const activeSkill = mode === "agile" ? getSkillForContext("agile", handoffType) : null;
  const dorCriteria = activeSkill?.criteria || DOR_CRITERIA;

  const renameSavedAnalysis = (id, name) => {
    setSavedAnalyses(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, name } : a);
      localStorage.setItem("handoffiq_saved_analyses", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => { loadPdfJs().catch(()=>{}); }, []);
  useEffect(() => { if (step === "results") window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const readFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (["txt","md"].includes(ext)) return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsText(file); });
    if (ext==="docx") { const buf=await file.arrayBuffer(); return (await mammoth.extractRawText({arrayBuffer:buf})).value; }
    if (["csv","xlsx"].includes(ext)) {
      const buf=await file.arrayBuffer();
      const wb=XLSX.read(buf,{type:"array"});
      return wb.SheetNames.map(name=>{
        const rows=XLSX.utils.sheet_to_csv(wb.Sheets[name]);
        return wb.SheetNames.length>1 ? `--- Sheet: ${name} ---\n${rows}` : rows;
      }).join("\n\n");
    }
    if (ext==="pdf") {
      let lib; try { lib=await loadPdfJs(); } catch { throw new Error("PDF reader unavailable — use Paste text."); }
      const pdf=await lib.getDocument({data:await file.arrayBuffer()}).promise;
      let t=""; for(let i=1;i<=pdf.numPages;i++){const p=await pdf.getPage(i);const c=await p.getTextContent();t+=c.items.map(x=>x.str).join(" ")+"\n";}
      if(!t.trim()) throw new Error("No text extracted — use Paste text.");
      return t;
    }
    throw new Error(`Unsupported: .${ext}`);
  };

  const handleFiles = async (fileList) => {
    setError("");
    for (const file of Array.from(fileList)) {
      try { const c=await readFile(file); setFiles(prev=>prev.find(f=>f.name===file.name)?prev:[...prev,{name:file.name,content:c,size:file.size}]); }
      catch(e) { setError(e.message); }
    }
  };

  const addPaste = () => {
    if (!pasteText.trim()) return;
    setFiles(prev=>[...prev,{name:`Pasted content ${prev.length+1}`,content:pasteText.trim(),size:pasteText.length}]);
    setPasteText(""); setShowPaste(false);
  };

  const saveKeyAndModel = (k, m) => {
    localStorage.setItem("handoffiq_api_key", k);
    localStorage.setItem("handoffiq_model", m);
    setApiKey(k); setSelectedModel(m); setShowStartupModal(false);
  };

  const safeParseJson = (text) => {
    let s = (text || "").trim();
    if (s.startsWith("```json")) s = s.slice(7).trim();
    else if (s.startsWith("```"))  s = s.slice(3).trim();
    if (s.endsWith("```"))         s = s.slice(0, -3).trim();
    const first = s.indexOf("{");
    const last  = s.lastIndexOf("}");
    if (first >= 0 && last > first) s = s.slice(first, last + 1);

    try { return JSON.parse(s); } catch { /* try recovery */ }
    try {
      let r = s;
      r = r.replace(/(["\]}\d])\s*(?:\\[nrt]\s*)+([,\]}])/g, "$1$2");
      r = r.replace(/,(\s*[\]}])/g,"$1");
      r = r.replace(/,\s*"[^"]*"\s*:\s*$/,"");
      if((r.match(/(?<!\\)"/g)||[]).length%2!==0) r+='"';
      const oa=(r.match(/\[/g)||[]).length-(r.match(/\]/g)||[]).length;
      const oo=(r.match(/\{/g)||[]).length-(r.match(/\}/g)||[]).length;
      r+="]".repeat(Math.max(0,oa))+"}".repeat(Math.max(0,oo));
      return JSON.parse(r);
    } catch (e) {
      console.error("[HandoffIQ] JSON parse failed:", e.message);
      console.error("[HandoffIQ] Response head (first 400 chars):", s.slice(0, 400));
      console.error("[HandoffIQ] Response tail (last 400 chars):", s.slice(-400));
      throw new Error(`Couldn't parse model response (${e.message}). Open the browser console for the response excerpt.`);
    }
  };

  const analyze = async () => {
    if (!files.length) { setError("Upload at least one artifact first."); return; }
    if (!apiKey) { setError("Please set your Anthropic API key first."); setShowStartupModal(true); return; }
    setAnalyzing(true); setError(""); setExpandedStory(null);
    const combined = files.map(f=>`=== ${f.name} ===\n${f.content}`).join("\n\n");
    const types = mode==="agile" ? AGILE_TYPES : WATERFALL_TYPES;
    const activeType = types.find(t=>t.id===handoffType);
    const typeLabel = activeType?.label||handoffType;
    const agileContext = mode==="agile" && activeType
      ? `\n\nHandoff-specific DoR focus: ${activeType.dorFocus}\nAdditional context: ${activeType.extra}`
      : "";
    try {
      const res = await fetch("/api/analyse",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":apiKey,
        },
        body:JSON.stringify({
          model:selectedModel, max_tokens:64000,
          system: mode==="agile" ? buildAgilePrompt(handoffType) : buildWaterfallPrompt(handoffType),
          messages:[{role:"user",content:`Handoff type: ${typeLabel}${agileContext}\n\nArtifacts:\n${combined}`}],
        }),
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message);
      const raw = data.content.map(c=>c.text||"").join("");
      const SENTINEL = "===MARKDOWN REPORT===";
      const sentinelIdx = raw.indexOf(SENTINEL);
      const jsonPart = sentinelIdx >= 0 ? raw.slice(0, sentinelIdx) : raw;
      const mdPart   = sentinelIdx >= 0 ? raw.slice(sentinelIdx + SENTINEL.length).trim() : "";

      const parsed = safeParseJson(jsonPart);
      if (mode === "agile") {
        if (mdPart) parsed.reportMarkdown = mdPart;
        if (Array.isArray(parsed?.stories)) {
          parsed.stories.forEach(s => {
            if (s?.dorChecks?.acceptanceCriteria?.pass === false && s.verdict === "READY") {
              s.verdict = "REFINE";
            }
          });
        }
      }
      setResults(parsed);
      setStep("results");
      const types = mode==="agile" ? AGILE_TYPES : WATERFALL_TYPES;
      const label = types.find(t=>t.id===handoffType)?.label || handoffType;
      const entry = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        mode, handoffType,
        handoffLabel: label,
        fileNames: files.map(f=>f.name),
        score: mode==="agile" ? (parsed?.sprintReadinessScore??0) : (parsed?.deliveryScore??0),
        results: parsed,
      };
      setSavedAnalyses(prev => {
        const updated = [entry, ...prev].slice(0, 10);
        localStorage.setItem("handoffiq_saved_analyses", JSON.stringify(updated));
        return updated;
      });
      setSaveFlash(true);
      setTimeout(()=>setSaveFlash(false), 2500);
    } catch(e) { setError("Analysis failed: "+e.message); }
    finally { setAnalyzing(false); }
  };

  const reset = () => { setStep("setup"); setResults(null); setFiles([]); setError(""); setPasteText(""); setShowPaste(false); };
  const stepIdx = ["setup","upload","results"].indexOf(step);

  const accentColor   = mode==="agile" ? C.agile   : C.gate;
  const accentBg      = mode==="agile" ? C.agileBg : C.gateBg;
  const score         = mode==="agile" ? (results?.sprintReadinessScore??0) : (results?.deliveryScore??0);
  const scoreColor    = score>=75 ? C.success : score>=50 ? C.warning : C.error;
  const scoreLabel    = mode==="agile"
    ? (score>=75?"Sprint ready":score>=50?"Needs refining":"Not sprint ready")
    : (score>=75?"Delivery ready":score>=50?"Needs work":"Not ready");
  const activeTypes       = mode==="agile" ? AGILE_TYPES : WATERFALL_TYPES;
  const activeHandoffLabel = activeTypes.find(t=>t.id===handoffType)?.label || handoffType;

  /* ── SLDS-style reusable styles ── */
  const card = {
    background:C.surface,
    border:`1px solid ${C.border}`,
    borderRadius:8,                          // Cosmos card 8px
    boxShadow:C.shadow1,
    padding:"20px 22px",
  };

  // Primary button — full pill with purple glow
  const btn = {
    background:C.primary, color:"#fff", border:"none",
    borderRadius:9999, padding:"10px 24px",
    fontSize:13, fontWeight:700, cursor:"pointer",
    fontFamily:"inherit", letterSpacing:"0.01em",
    boxShadow:"0 4px 12px rgba(126,20,255,0.22)",
    transition:"all 0.15s",
  };

  // Neutral button — full pill with border
  const btnSec = {
    background:C.surface, color:C.primary,
    border:`1px solid ${C.border}`,
    borderRadius:9999, padding:"10px 24px",
    fontSize:13, fontWeight:600, cursor:"pointer",
    fontFamily:"inherit", transition:"all 0.15s",
  };

  // Input — SLDS keeps 4px radius for form fields
  const inp = {
    width:"100%",
    background:C.surface,
    border:`1px solid ${C.borderStrong}`,
    borderRadius:4,
    padding:"8px 12px",
    color:C.text, fontSize:13,
    fontFamily:"inherit", boxSizing:"border-box",
  };

  return (
    <div style={{ background:C.pageBg, minHeight:"100vh", color:C.text, fontFamily:FONT }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.3s ease forwards}
        @keyframes ping{0%{transform:scale(0.3);opacity:0.8}100%{transform:scale(2.4);opacity:0}}
        @keyframes gradientShift{0%{background-position:0% 0%}100%{background-position:200% 0%}}
        input:focus, textarea:focus, select:focus { outline:none; border-color:${C.primary} !important; box-shadow:0 0 0 3px ${C.primary}22; }
        button:hover:not(:disabled){ filter:brightness(0.93); }
      `}</style>
      {/* Animated gradient band — bottom of viewport */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, height:4, zIndex:100,
        background:"linear-gradient(90deg,#7e14ff 0%,#863bff 50%,#47bfff 100%)",
        backgroundSize:"200% 100%",
        animation:"gradientShift 8s linear infinite",
        pointerEvents:"none",
      }}/>

      {/* Startup modal */}
      {showStartupModal && (
        <StartupModal
          hasExistingKey={!!apiKey}
          onSave={saveKeyAndModel}
          onCancel={()=>setShowStartupModal(false)}
        />
      )}

      {/* ── Glassmorphic App Bar ── */}
      <header style={{
        background:"rgba(255,255,255,0.82)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`,
        height:56,
        padding:"0 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:11,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <svg width="22" height="22" viewBox="0 0 80 80" style={{ flexShrink:0 }}>
            <path d="M 41 4 A 36 36 0 1 1 35 4.5" fill="none" stroke={C.primary} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 22 41 L 33 52 L 58 28" fill="none" stroke="#863bff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight:700, fontSize:14, letterSpacing:0.2, color:C.text }}>
            Slalom Handoff<span style={{
              background:"linear-gradient(135deg,#7e14ff 0%,#47bfff 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text", fontWeight:800,
            }}>IQ</span>
          </span>
          <span style={{
            background: mode==="agile" ? C.primaryBg : C.accentBg,
            color: mode==="agile" ? C.primary : C.accent,
            border: `1px solid ${mode==="agile" ? C.primary : C.accent}44`,
            borderRadius:9999, padding:"2px 10px",
            fontSize:10, fontWeight:700, letterSpacing:"0.1em",
            textTransform:"uppercase",
          }}>
            {mode==="agile" ? "Agile mode" : "Gate mode"}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {savedAnalyses.length > 0 && (
            <button onClick={()=>setShowHistory(s=>!s)} style={{
              background: showHistory ? C.primaryBg : "transparent",
              color: showHistory ? C.primary : C.textMuted,
              border:`1px solid ${C.border}`,
              borderRadius:9999, padding:"5px 13px",
              fontSize:11, fontWeight:600, cursor:"pointer",
              display:"flex", alignItems:"center", gap:5,
              transition:"all 0.15s",
            }}>
              📂 History ({savedAnalyses.length})
            </button>
          )}
          {saveFlash && (
            <span style={{ fontSize:11, color:C.success, fontWeight:600, animation:"fadeUp 0.3s ease" }}>✓ Saved</span>
          )}
          <Link to="/about" style={{
            color:C.textMuted, fontSize:12, fontWeight:600,
            textDecoration:"none", padding:"5px 13px",
            borderRadius:9999,
            border:`1px solid ${C.border}`,
            transition:"all 0.15s",
            letterSpacing:0.1,
          }}
            onMouseEnter={e=>{e.currentTarget.style.color=C.primary;e.currentTarget.style.borderColor=C.primary+"55";}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.textMuted;e.currentTarget.style.borderColor=C.border;}}
          >About</Link>
          {apiKey
            ? <>
                <span style={{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color:C.success, fontSize:8 }}>●</span>
                  {MODELS.find(m=>m.id===selectedModel)?.label || "Sonnet 4.6"}
                </span>
                <button onClick={()=>setShowStartupModal(true)} style={{
                  background:"transparent", color:C.primary,
                  border:`1px solid ${C.border}`,
                  borderRadius:9999, padding:"5px 13px",
                  fontSize:11, fontWeight:600, cursor:"pointer",
                  transition:"all 0.15s",
                }}>Change key</button>
              </>
            : <button onClick={()=>setShowStartupModal(true)} style={{
                background:C.errorBg, color:C.error,
                border:`1px solid ${C.error}33`,
                borderRadius:9999, padding:"5px 13px",
                fontSize:11, fontWeight:600, cursor:"pointer",
              }}>⚠ Set API key</button>
          }
        </div>
      </header>

      {/* History Panel */}
      {showHistory && (
        <>
        <div onClick={()=>setShowHistory(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", zIndex:19,
        }}/>
        <div style={{
          position:"fixed", top:48, right:0, bottom:0, width:360,
          background:C.surface, borderLeft:`1px solid ${C.border}`,
          boxShadow:"-4px 0 16px rgba(0,0,0,0.12)",
          zIndex:20, display:"flex", flexDirection:"column",
          animation:"fadeUp 0.2s ease",
        }}>
          <div style={{
            padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <span style={{ fontWeight:700, fontSize:14, color:C.text }}>Saved Analyses</span>
            <button onClick={()=>setShowHistory(false)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontSize:18, color:C.textMuted, lineHeight:1,
            }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"12px 0" }}>
            {savedAnalyses.map(entry => {
              const date = new Date(entry.savedAt);
              const label = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
              const scoreColor = entry.score >= 70 ? C.success : entry.score >= 40 ? C.warning : C.error;
              const scoreBg   = entry.score >= 70 ? C.successBg : entry.score >= 40 ? C.warningBg : C.errorBg;
              const isEditing = editingEntryId === entry.id;
              const primaryName = entry.name || entry.handoffLabel;
              const commitRename = () => {
                const trimmed = editingName.trim();
                renameSavedAnalysis(entry.id, trimmed || undefined);
                setEditingEntryId(null);
              };
              return (
                <div key={entry.id} style={{
                  margin:"4px 12px", borderRadius:8,
                  border:`1px solid ${C.border}`, overflow:"hidden",
                }}>
                  <button onClick={()=>{
                    if (isEditing) return;
                    setMode(entry.mode);
                    setHandoffType(entry.handoffType);
                    setResults(entry.results);
                    setStep("results");
                    setShowHistory(false);
                  }} style={{
                    width:"100%", background:C.surfaceAlt, border:"none",
                    padding:"12px 14px", cursor: isEditing ? "default" : "pointer", textAlign:"left",
                    display:"flex", flexDirection:"column", gap:5,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:C.text, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{primaryName}</span>
                      <span style={{
                        background:scoreBg, color:scoreColor,
                        borderRadius:9999, padding:"1px 8px", fontSize:11, fontWeight:700,
                        flexShrink:0,
                      }}>{entry.score}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textMuted }}>
                      {entry.mode === "agile" ? "Agile" : "Gate"} · {entry.handoffLabel}
                    </div>
                    <div style={{ fontSize:10, color:C.textSubtle, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.fileNames.join(", ")}</div>
                    <div style={{ fontSize:10, color:C.textSubtle }}>{label}</div>
                  </button>
                  {isEditing ? (
                    <div style={{ borderTop:`1px solid ${C.border}`, padding:"8px", display:"flex", flexDirection:"column", gap:6 }}>
                      <input
                        autoFocus
                        value={editingName}
                        onChange={e=>setEditingName(e.target.value)}
                        onKeyDown={e=>{
                          if (e.key === "Enter") commitRename();
                          else if (e.key === "Escape") setEditingEntryId(null);
                        }}
                        placeholder="Name this analysis"
                        style={{
                          width:"100%", fontSize:12, padding:"6px 8px",
                          border:`1px solid ${C.borderStrong}`, borderRadius:6,
                          fontFamily:"inherit", color:C.text, background:"#fff",
                          boxSizing:"border-box",
                        }}
                      />
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={commitRename} style={{
                          flex:1, background:C.primary, color:"#fff", border:"none",
                          borderRadius:6, padding:"5px", fontSize:11, fontWeight:600, cursor:"pointer",
                        }}>Save</button>
                        <button onClick={()=>setEditingEntryId(null)} style={{
                          flex:1, background:"none", color:C.textMuted, border:`1px solid ${C.border}`,
                          borderRadius:6, padding:"5px", fontSize:11, fontWeight:600, cursor:"pointer",
                        }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                      <button onClick={()=>{
                        setEditingEntryId(entry.id);
                        setEditingName(entry.name || "");
                      }} style={{
                        flex:1, background:"none", border:"none",
                        borderRight:`1px solid ${C.border}`,
                        padding:"6px", fontSize:11, color:C.textSubtle,
                        cursor:"pointer",
                      }}>✎ Rename</button>
                      <button onClick={()=>{
                        setSavedAnalyses(prev => {
                          const updated = prev.filter(a=>a.id!==entry.id);
                          localStorage.setItem("handoffiq_saved_analyses", JSON.stringify(updated));
                          return updated;
                        });
                      }} style={{
                        flex:1, background:"none", border:"none",
                        padding:"6px", fontSize:11, color:C.textSubtle,
                        cursor:"pointer",
                      }}>Remove</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.border}` }}>
            <button onClick={()=>{
              setSavedAnalyses([]);
              localStorage.removeItem("handoffiq_saved_analyses");
              setShowHistory(false);
            }} style={{
              width:"100%", background:C.errorBg, color:C.error,
              border:`1px solid ${C.error}33`, borderRadius:6,
              padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer",
            }}>Clear all saved analyses</button>
          </div>
        </div>
        </>
      )}


      {/* ── Sub-bar (only shown on results screen, for the New Analysis button) ── */}
      {results && (
        <div style={{
          background:C.surface,
          borderBottom:`1px solid ${C.border}`,
          padding:"12px 28px",
          display:"flex", alignItems:"center", justifyContent:"flex-end",
        }}>
          <button onClick={reset} style={btnSec}>↺  New analysis</button>
        </div>
      )}

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px" }}>

        {/* ── Step indicator (SLDS path-style) ── */}
        <div style={{ display:"flex", marginBottom:32, gap:6 }}>
          {["Configure","Upload","Results"].map((s,i)=>{
            const done      = i<stepIdx;
            const current   = i===stepIdx;
            const clickable = done;
            const bg        = done ? C.success : current ? C.primary : C.surface;
            const fg        = done || current ? "#fff" : C.textMuted;
            const border    = done ? C.success : current ? C.primary : C.border;
            const steps     = ["setup","upload","results"];
            return (
              <div key={s} onClick={()=>{ if(clickable) setStep(steps[i]); }} style={{
                flex:1, padding:"10px 14px",
                background:bg, color:fg,
                border:`1px solid ${border}`,
                borderRadius:9999,
                fontSize:12, fontWeight:600,
                textAlign:"center",
                transition:"all 0.3s",
                letterSpacing:0.3,
                cursor: clickable ? "pointer" : "default",
              }}>
                {done ? `✓  ${s}` : `${i+1}.  ${s}`}
              </div>
            );
          })}
        </div>

        {/* ══ SETUP ══ */}
        {step==="setup" && (
          <div className="fu">

            {/* Mode toggle */}
            <div style={{ ...card, marginBottom:20 }}>
              <label style={{ ...sldsLabel, marginBottom:12 }}>Analysis mode</label>
              <ModeToggle mode={mode} onChange={m=>{setMode(m);setResults(null);setHandoffType("ba-dev");}}/>
              <div style={{
                fontSize:12, color:C.text, marginTop:14, lineHeight:1.65,
                padding:"12px 14px", background:accentBg, borderRadius:8,
                borderLeft:`3px solid ${accentColor}`,
              }}>
                {mode==="agile"
                  ? "Agile mode analyses each user story individually against a Definition of Ready. Output is a per-story READY / REFINE / DEFER verdict with specific fixes — ideal before sprint planning."
                  : "Gate mode evaluates the full handoff package for completeness and quality across 6 dimensions. Produces an improvement plan with NFR recommendations and Salesforce capability mapping — ideal for PI Planning or phase handoffs."}
              </div>
            </div>

            {/* Handoff type */}
            <div style={{ ...card, marginBottom:16 }}>
              <label style={{ ...sldsLabel, marginBottom:14 }}>Handoff type</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {(mode==="agile" ? AGILE_TYPES : WATERFALL_TYPES).map(t=>{
                  const active = handoffType===t.id;
                  return (
                    <div key={t.id} onClick={()=>setHandoffType(t.id)}
                      onMouseEnter={e=>{ if(!active){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=C.shadowLift; e.currentTarget.style.borderColor=accentColor+"66"; }}}
                      onMouseLeave={e=>{ if(!active){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=C.border; }}}
                      style={{
                        padding:"14px", borderRadius:10, cursor:"pointer",
                        border: active ? `2px solid ${accentColor}` : `1px solid ${C.border}`,
                        background: active
                          ? `linear-gradient(180deg, ${accentBg} 0%, ${C.surface} 100%)`
                          : `linear-gradient(180deg, ${C.surface} 0%, ${C.pageBg} 100%)`,
                        boxShadow: active ? C.shadow2 : "none",
                        transition:"all 0.2s",
                        position:"relative", overflow:"hidden",
                      }}>
                      {active && <div style={{
                        position:"absolute", top:0, left:0, right:0, height:3,
                        background:accentColor, borderRadius:"10px 10px 0 0",
                      }}/>}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:16 }}>{t.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:active?accentColor:C.text }}>{t.label}</span>
                      </div>
                      <p style={{ fontSize:11, color:C.textMuted, marginLeft:24 }}>{t.desc}</p>
                    </div>
                  );
                })}
              </div>
              {mode==="agile" && AGILE_TYPES.find(t=>t.id===handoffType)?.dorFocus && (
                <div style={{
                  marginTop:12, padding:"11px 14px",
                  background:C.aiBg+"66",
                  border:`1px solid ${C.aiBg}`,
                  borderLeft:`3px solid ${C.ai}`,
                  borderRadius:8,
                }}>
                  <div style={{ marginBottom:5 }}>
                    <AIPill text="DoR focus for this handoff"/>
                  </div>
                  <p style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{AGILE_TYPES.find(t=>t.id===handoffType).dorFocus}</p>
                </div>
              )}
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:24 }}>
              <button style={btn} onClick={()=>setStep("upload")}>Continue →</button>
            </div>
          </div>
        )}

        {/* ══ UPLOAD ══ */}
        {step==="upload" && (
          <div className="fu">
            <p style={{ fontSize:13, color:C.textMuted, marginBottom:22, lineHeight:1.6 }}>
              {mode==="agile"
                ? "Upload your user stories document. Each story will be analysed individually."
                : "Upload your handoff artifacts. PDF, DOCX, XLSX, CSV, TXT supported."}
            </p>
            <div onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}}
              style={{
                ...card, textAlign:"center", padding:"44px 20px", cursor:"pointer",
                background: dragOver
                  ? `linear-gradient(180deg, ${C.primaryBg} 0%, ${C.surface} 100%)`
                  : `linear-gradient(180deg, ${C.surface} 0%, ${C.pageBg} 100%)`,
                border: dragOver ? `2px dashed ${C.primary}` : `2px dashed ${C.border}`,
                boxShadow: dragOver ? C.shadow2 : "none",
                transition:"all 0.2s", marginBottom:10,
              }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📂</div>
              <p style={{ fontSize:14, color:C.text, fontWeight:500 }}>
                Drop files here or <span style={{ color:C.primary, fontWeight:700 }}>browse</span>
              </p>
              <p style={{ fontSize:12, color:C.textMuted, marginTop:5 }}>PDF · DOCX · XLSX · CSV · TXT · MD</p>
              <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.txt,.md,.csv,.xlsx" style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
            </div>

            <div style={{ textAlign:"center", marginBottom:12 }}>
              <button onClick={()=>setShowPaste(s=>!s)} style={{
                background: showPaste ? C.primaryBg : C.surface,
                color:C.primary, border:`1px solid ${C.border}`,
                borderRadius:9999, padding:"8px 20px",
                fontSize:12, fontWeight:600, cursor:"pointer",
                fontFamily:"inherit", transition:"all 0.15s",
              }}>
                {showPaste ? "▲ Hide text paste" : "📋 Or paste text directly"}
              </button>
            </div>

            {showPaste && (
              <div style={{ ...card, marginBottom:12 }}>
                <label style={{ ...sldsLabel, marginBottom:8 }}>Paste content</label>
                <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)}
                  placeholder={mode==="agile"?"Paste user stories here — include story description and acceptance criteria…":"Paste solution design, requirements, or handoff notes…"}
                  style={{ ...inp, minHeight:140, resize:"vertical", lineHeight:1.6 }}/>
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
                  <button onClick={addPaste} disabled={!pasteText.trim()} style={{ ...btn, opacity:pasteText.trim()?1:0.5 }}>
                    + Add as artifact
                  </button>
                </div>
              </div>
            )}

            {files.length>0 && (
              <div style={{ ...card, marginBottom:12 }}>
                <label style={{ ...sldsLabel, marginBottom:12 }}>Artifacts loaded ({files.length})</label>
                {files.map((f,i)=>(
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 12px", borderRadius:8,
                    background:C.surfaceAlt, marginBottom:6,
                    border:`1px solid ${C.border}`,
                  }}>
                    <span>{f.name.startsWith("Pasted")?"📝":"📄"}</span>
                    <span style={{ flex:1, fontSize:13, color:C.text }}>{f.name}</span>
                    <span style={{ fontSize:11, color:C.textMuted }}>{f.size>1024?`${(f.size/1024).toFixed(1)} KB`:`${f.size} B`}</span>
                    <button onClick={()=>setFiles(prev=>prev.filter((_,j)=>j!==i))} style={{
                      background:"none", border:"none",
                      color:C.textMuted, cursor:"pointer", fontSize:18, lineHeight:1,
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div style={{
                padding:"12px 16px",
                background:C.errorBg,
                border:`1px solid ${C.error}33`,
                borderLeft:`3px solid ${C.error}`,
                borderRadius:8,
                fontSize:13, color:C.error, marginBottom:12, lineHeight:1.6,
              }}>⚠  {error}</div>
            )}

            {analyzing && <Spinner mode={mode} handoffType={handoffType}/>}

            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <button style={btnSec} onClick={()=>setStep("setup")}>← Back</button>
              <button style={{ ...btn, opacity:(!files.length||analyzing)?0.5:1 }} disabled={!files.length||analyzing} onClick={analyze}>
                {analyzing?"Analysing…":mode==="agile"?"✨ Check sprint readiness":"✨ Run analysis"}
              </button>
            </div>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {step==="results" && results && (
          <div className="fu">

            {/* Hero score */}
            <div style={{
              ...card,
              display:"flex", gap:28, alignItems:"center",
              marginBottom:20,
              borderTop:`4px solid ${scoreColor}`,
            }}>
              <ScoreRing score={score} color={scoreColor} label={scoreLabel}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, flexWrap:"wrap" }}>
                  <label style={sldsLabel}>
                    {mode==="agile"?"Sprint readiness score":"Delivery readiness score"}
                  </label>
                  <AIPill/>
                </div>
                <p style={{ fontSize:14, color:C.text, lineHeight:1.7 }}>{results.summary}</p>

                {/* Agile summary pills */}
                {mode==="agile" && results.sprintRecommendation && (
                  <div style={{ display:"flex", gap:20, marginTop:18, flexWrap:"wrap" }}>
                    {[
                      {label:"Ready",  items:results.sprintRecommendation.ready,  color:C.success},
                      {label:"Refine", items:results.sprintRecommendation.refine, color:C.warning},
                      {label:"Defer",  items:results.sprintRecommendation.defer,  color:C.error},
                    ].map(s=>(
                      <div key={s.label} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.items?.length||0}</div>
                        <div style={{ ...sldsLabel, marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Waterfall summary pills */}
                {mode==="waterfall" && (
                  <div style={{ display:"flex", gap:24, marginTop:18, flexWrap:"wrap" }}>
                    {[
                      {label:"Present",    n:results.package?.present?.length||0,    color:C.success},
                      {label:"Incomplete", n:results.package?.incomplete?.length||0, color:C.warning},
                      {label:"Missing",    n:results.package?.missing?.length||0,    color:C.error},
                      {label:"NFR gaps",   n:results.improvementPlan?.missingNFRs?.length||0, color:C.ai},
                    ].map(s=>(
                      <div key={s.label} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.n}</div>
                        <div style={{ ...sldsLabel, marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════ AGILE RESULTS ══════════════════ */}
            {mode==="agile" && (
              <>
                {results.reportMarkdown && (
                  <div style={{
                    ...card, marginBottom:20,
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    flexWrap:"wrap", gap:12,
                  }}>
                    <div>
                      <label style={sldsLabel}>Readiness report</label>
                      <p style={{ fontSize:12, color:C.textMuted, marginTop:4, lineHeight:1.5 }}>
                        Polished Markdown report — share with your BA or paste into Confluence / Jira.
                      </p>
                      <p style={{ fontSize:11, color:C.textSubtle, marginTop:4 }}>
                        Sprint readiness rubric: <em>User Story Readiness Evaluator</em> by Kanika Singla
                      </p>
                    </div>
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <CopyButton text={results.reportMarkdown}/>
                      <button onClick={() => {
                        const blob = new Blob([results.reportMarkdown], { type:"text/markdown" });
                        const url  = URL.createObjectURL(blob);
                        const a    = document.createElement("a");
                        a.href = url;
                        a.download = `handoffiq-readiness-${new Date().toISOString().slice(0,10)}.md`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }} style={{
                        background:"none",
                        border:`1px solid ${C.border}`,
                        borderRadius:6, padding:"3px 10px",
                        fontSize:11, fontWeight:600, cursor:"pointer",
                        color:C.textMuted, fontFamily:"inherit",
                        display:"inline-flex", alignItems:"center", gap:4,
                        transition:"all 0.15s",
                      }}>Download .md</button>
                    </div>
                  </div>
                )}

                {results.sprintRecommendation?.advice && (
                  <div style={{
                    ...card, marginBottom:20,
                    borderLeft:`3px solid ${C.ai}`,
                    background:C.aiBg+"33",
                  }}>
                    <div style={{ marginBottom:8 }}>
                      <AIPill text="Sprint planning recommendation"/>
                    </div>
                    <p style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{results.sprintRecommendation.advice}</p>
                  </div>
                )}

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", margin:"28px 0 18px" }}>
                  <Divider step="1" label="Story-by-story analysis" color={C.primary}/>
                  {results.stories?.length > 1 && (
                    <button onClick={()=>{ setExpandAll(s=>!s); setExpandedStory(null); }} style={{
                      background:"none", border:`1px solid ${C.borderStrong}`,
                      borderRadius:16, padding:"5px 14px",
                      fontSize:11, fontWeight:600, color:C.textMuted,
                      cursor:"pointer", fontFamily:"inherit", flexShrink:0, marginLeft:12,
                    }}>
                      {expandAll ? "Collapse all" : "Expand all"}
                    </button>
                  )}
                </div>

                {results.stories?.map((story,si)=>{
                  const isOpen = expandAll || expandedStory===si;
                  const passCount = story.dorChecks ? Object.values(story.dorChecks).filter(v=>v?.pass).length : 0;
                  const totalCount = dorCriteria.length;
                  const verdictColor = story.verdict==="READY"?C.success:story.verdict==="DEFER"?C.error:C.warning;
                  return (
                    <div key={si} style={{
                      ...card, marginBottom:12,
                      borderLeft:`3px solid ${verdictColor}`,
                    }}>
                      <div onClick={()=>{
                        if(expandAll){ setExpandAll(false); setExpandedStory(si); }
                        else setExpandedStory(isOpen?null:si);
                      }} style={{ cursor:"pointer" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
                            <span style={{
                              fontSize:10, fontWeight:700, color:C.textMuted,
                              background:C.surfaceAlt, border:`1px solid ${C.border}`,
                              borderRadius:9999, padding:"2px 10px", minWidth:62, textAlign:"center",
                              letterSpacing:0.5,
                            }}>{story.id}</span>
                            <span style={{ fontSize:14, fontWeight:600, color:C.text, flex:1 }}>{story.title}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <Verdict v={story.verdict}/>
                            <span style={{ fontSize:12, color:C.textMuted, whiteSpace:"nowrap", fontWeight:600 }}>{passCount}/{totalCount} DoR</span>
                            <span style={{ color:C.textMuted, fontSize:12 }}>{isOpen?"▲":"▼"}</span>
                          </div>
                        </div>
                        <div style={{ height:6, background:C.border, borderRadius:9999, marginTop:12, overflow:"hidden" }}>
                          <div style={{
                            height:"100%", width:`${(passCount/totalCount)*100}%`,
                            background:verdictColor, borderRadius:9999,
                            transition:"width 1s ease",
                          }}/>
                        </div>
                        {!isOpen && story.topFix && (
                          <div style={{
                            marginTop:10, display:"flex", alignItems:"flex-start", gap:8,
                            padding:"8px 12px",
                            background:C.aiBg+"55",
                            border:`1px solid ${C.aiBg}`,
                            borderRadius:8,
                          }}>
                            <span style={{ color:C.ai, fontSize:13 }}>✨</span>
                            <span style={{ fontSize:12, color:C.text, lineHeight:1.55 }}>
                              <strong style={{ color:C.ai }}>Top fix · </strong>{story.topFix}
                            </span>
                          </div>
                        )}
                      </div>

                      {isOpen && (
                        <div style={{ marginTop:20 }}>
                          <label style={{ ...sldsLabel, marginBottom:4 }}>Definition of Ready checklist</label>
                          <div>
                            {dorCriteria.map(crit=>(
                              <DorRow key={crit.key} criterion={crit} data={story.dorChecks?.[crit.key]}/>
                            ))}
                          </div>

                          {story.improvedStory && (
                            <>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", margin:"22px 0 10px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <label style={sldsLabel}>Improved story</label>
                                  <AIPill/>
                                </div>
                                <CopyButton text={story.improvedStory}/>
                              </div>
                              <div style={{
                                background:C.aiBg+"55",
                                border:`1px solid ${C.aiBg}`,
                                borderLeft:`3px solid ${C.ai}`,
                                borderRadius:8, padding:"14px 16px",
                              }}>
                                <p style={{ fontSize:13, color:C.text, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{story.improvedStory}</p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* ══════════════════ WATERFALL RESULTS ══════════════════ */}
            {mode==="waterfall" && (
              <>
                <Divider step="1" label="Package check" color={C.primary}/>

                {results.package?.present?.length>0 && (
                  <div style={{ ...card, marginBottom:12 }}>
                    <label style={{ ...sldsLabel, color:C.success, marginBottom:4 }}>✓  Complete and present</label>
                    {results.package.present.map((p,i)=>(
                      <PackageRow key={i} icon="✅" item={p.item} detail={p.detail} tag="COMPLETE" tagColor={C.success} tagBg={C.successBg}/>
                    ))}
                  </div>
                )}

                {results.package?.incomplete?.length>0 && (
                  <div style={{ ...card, marginBottom:12 }}>
                    <label style={{ ...sldsLabel, color:C.warning, marginBottom:4 }}>!  Incomplete</label>
                    {results.package.incomplete.map((p,i)=>(
                      <PackageRow key={i} icon="⚠️" item={p.item} detail={p.detail} tag="INCOMPLETE" tagColor={C.warning} tagBg={C.warningBg}>
                        {p.suggestion && <p style={{ fontSize:12, color:C.warning, marginTop:5 }}>→ {p.suggestion}</p>}
                        <Example label="Suggested addition" text={p.example} accent={C.ai}/>
                      </PackageRow>
                    ))}
                  </div>
                )}

                {results.package?.missing?.length>0 && (
                  <div style={{ ...card, marginBottom:4 }}>
                    <label style={{ ...sldsLabel, color:C.error, marginBottom:4 }}>✕  Missing — blockers</label>
                    {results.package.missing.map((p,i)=>(
                      <PackageRow key={i} icon="🚫" item={p.item} detail={p.detail} tag="MISSING" tagColor={C.error} tagBg={C.errorBg}>
                        {p.impact && <p style={{ fontSize:12, color:C.error, marginTop:5 }}>⚡ Risk: {p.impact}</p>}
                        <Example label="What it should contain" text={p.example} accent={C.ai}/>
                      </PackageRow>
                    ))}
                  </div>
                )}

                <Divider step="2" label="Quality dimensions" color={C.primary}/>
                <div style={{ ...card, marginBottom:4 }}>
                  {QUALITY_DIMS.map(dim=><DimBar key={dim.key} dim={dim} data={results.qualityDimensions?.[dim.key]}/>)}
                </div>

                <Divider step="3" label="Improvement plan" color={C.ai}/>

                {results.improvementPlan?.improvedStories?.length>0 && (
                  <div style={{ ...card, marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <label style={sldsLabel}>Story rewrites</label>
                      <AIPill/>
                    </div>
                    {results.improvementPlan.improvedStories.map((s,i)=>{
                      const last = i===results.improvementPlan.improvedStories.length-1;
                      return (
                        <div key={i} style={{
                          paddingBottom:last?0:20,
                          marginBottom:last?0:20,
                          borderBottom:last?"none":`1px solid ${C.border}`,
                        }}>
                          <label style={{ ...sldsLabel, marginBottom:6 }}>Original</label>
                          <p style={{
                            fontSize:13, color:C.textMuted, lineHeight:1.7,
                            background:C.surfaceAlt, padding:"10px 14px",
                            borderRadius:8, border:`1px solid ${C.border}`,
                            fontStyle:"italic",
                          }}>{s.original}</p>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", margin:"14px 0 6px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <label style={sldsLabel}>Improved</label>
                              <AIPill/>
                            </div>
                            <CopyButton text={s.improved}/>
                          </div>
                          <p style={{
                            fontSize:13, color:C.text, lineHeight:1.7,
                            background:C.aiBg+"55",
                            padding:"10px 14px",
                            borderRadius:8,
                            border:`1px solid ${C.aiBg}`,
                            borderLeft:`3px solid ${C.ai}`,
                          }}>{s.improved}</p>
                          {s.reason && <p style={{ fontSize:12, color:C.textMuted, marginTop:8 }}>💡 {s.reason}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {results.improvementPlan?.missingNFRs?.length>0 && (
                  <div style={{ ...card, marginBottom:12 }}>
                    <label style={{ ...sldsLabel, color:C.warning, marginBottom:16 }}>🚧  Missing non-functional requirements</label>
                    {results.improvementPlan.missingNFRs.map((n,i)=>{
                      const last = i===results.improvementPlan.missingNFRs.length-1;
                      return (
                        <div key={i} style={{
                          paddingBottom:last?0:16,
                          marginBottom:last?0:16,
                          borderBottom:last?"none":`1px solid ${C.border}`,
                        }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                            <span style={{
                              fontSize:11, background:C.warningBg, color:C.warning,
                              borderRadius:9999, padding:"3px 10px",
                              fontWeight:700, letterSpacing:0.5, textTransform:"uppercase",
                            }}>{n.area}</span>
                            <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{n.detail?.split(".")[0]}</span>
                          </div>
                          <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{n.detail}</p>
                          {n.impact && <p style={{ fontSize:12, color:C.warning, marginTop:4 }}>⚡ Risk: {n.impact}</p>}
                          <Example label="Recommended requirement" text={n.recommendation} accent={C.ai}/>
                        </div>
                      );
                    })}
                  </div>
                )}

                {results.improvementPlan?.salesforceCapabilities?.length>0 && (
                  <div style={{ ...card, marginBottom:12 }}>
                    <label style={{ ...sldsLabel, color:C.primary, marginBottom:16 }}>☁️  Salesforce capability mapping</label>
                    {results.improvementPlan.salesforceCapabilities.map((c,i)=>{
                      const last = i===results.improvementPlan.salesforceCapabilities.length-1;
                      return (
                        <div key={i} style={{
                          paddingBottom:last?0:14,
                          marginBottom:last?0:14,
                          borderBottom:last?"none":`1px solid ${C.border}`,
                        }}>
                          <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8 }}>{c.requirement}</p>
                          <div style={{ display:"flex", gap:10, marginBottom:5, alignItems:"flex-start" }}>
                            <span style={{
                              fontSize:11, color:C.success, background:C.successBg,
                              borderRadius:9999, padding:"2px 10px",
                              fontWeight:700, letterSpacing:0.5, whiteSpace:"nowrap",
                            }}>SF STANDARD</span>
                            <span style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{c.standardCapability}</span>
                          </div>
                          {c.customizationNeeded && (
                            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                              <span style={{
                                fontSize:11, color:C.warning, background:C.warningBg,
                                borderRadius:9999, padding:"2px 10px",
                                fontWeight:700, letterSpacing:0.5, whiteSpace:"nowrap",
                              }}>CUSTOM NEED</span>
                              <span style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{c.customizationNeeded}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
              <button style={btnSec} onClick={reset}>↺  New analysis</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
