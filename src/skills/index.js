// Skill registry. SKILL.md files are inlined at build time via Vite's ?raw import,
// so updating a skill folder requires a rebuild (npm run dev / npm run build).
import readinessMd from "./user-story-readiness-evaluator/SKILL.md?raw";
import integrationMd from "./integration-user-story-readiness/SKILL.md?raw";

export const SKILLS = {
  "user-story-readiness-evaluator": {
    id: "user-story-readiness-evaluator",
    name: "User Story Readiness Evaluator",
    author: "Kanika Singla",
    appliesTo: { mode: "agile" },
    md: readinessMd,
    criteria: [
      { key:"userStoryFormat",    label:"User story format",                desc:"Role, capability, business value (As a / I want / So that)" },
      { key:"acceptanceCriteria", label:"Acceptance criteria",              desc:"Complete and testable (Given/When/Then or equivalent)" },
      { key:"scopeDefined",       label:"Scope clearly defined",            desc:"What's in, what's out; not blended or open-ended" },
      { key:"sfObjectsFieldsUi",  label:"Salesforce objects / fields / UI", desc:"Objects, fields, pages, flows, components identified" },
      { key:"businessRules",      label:"Business rules and validations",   desc:"Decision logic, validations, statuses, calculations" },
      { key:"dependencies",       label:"Dependencies identified",          desc:"Upstream/downstream stories, integrations, data, teams" },
      { key:"securityDataNfrs",   label:"Security, data, and NFRs",         desc:"Permissions, sharing, performance, compliance, audit" },
      { key:"testingScenarios",   label:"Testing notes",                    desc:"Happy path and exception scenarios" },
    ],
  },
  "integration-user-story-readiness": {
    id: "integration-user-story-readiness",
    name: "Integration User Story Readiness",
    author: "Kanika Singla",
    appliesTo: { mode: "agile", handoffTypes: ["sf-integration", "integration-sf"] },
    md: integrationMd,
    criteria: [
      { key:"userStoryFormat",    label:"Integration story format",     desc:"User, system, business process, capability, business value" },
      { key:"acceptanceCriteria", label:"Acceptance criteria",          desc:"Successful processing, failure handling, missing data, expected source/target updates" },
      { key:"scopeDefined",       label:"Scope clearly defined",        desc:"API direction, events, middleware, mapping, retry, logging" },
      { key:"systemsDataFieldsUi",label:"Systems, data, fields, UI",    desc:"Applications, modules, entities, records, fields, statuses, screens, logs" },
      { key:"businessRules",      label:"Business rules and validations", desc:"Transformations, defaults, status transitions, upsert/merge, routing" },
      { key:"dependencies",       label:"Dependencies identified",      desc:"Source/target systems, middleware, owners, credentials, environments" },
      { key:"securityDataNfrs",   label:"Security, data, and NFRs",     desc:"Auth, encryption, audit, volume, performance, retry, monitoring, retention" },
      { key:"testingScenarios",   label:"Testing notes",                desc:"Happy + negative, edge, error, timeout, duplicate, unavailable-system scenarios" },
    ],
  },
};

// Pick the most-specific skill: handoff-type match first, then mode-level fallback.
export const getSkillForContext = (mode, handoffType) => {
  const list = Object.values(SKILLS);
  const specific = list.find(
    s => s.appliesTo.mode === mode && s.appliesTo.handoffTypes?.includes(handoffType)
  );
  if (specific) return specific;
  return list.find(s => s.appliesTo.mode === mode && !s.appliesTo.handoffTypes) || null;
};

// Back-compat shim — old callers can pass just the mode.
export const getSkillForMode = (mode) => getSkillForContext(mode, null);
