// Skill registry. SKILL.md files are inlined at build time via Vite's ?raw import,
// so updating a skill folder requires a rebuild (npm run dev / npm run build).
import readinessMd from "./user-story-readiness-evaluator/SKILL.md?raw";

export const SKILLS = {
  "user-story-readiness-evaluator": {
    id: "user-story-readiness-evaluator",
    name: "User Story Readiness Evaluator",
    author: "Kanika Singla",
    appliesTo: ["agile"],
    md: readinessMd,
  },
};

export const getSkillForMode = (mode) =>
  Object.values(SKILLS).find((s) => s.appliesTo.includes(mode)) || null;
