// Builds worker/dist/worker.js from worker.src.js plus the roles in assets/jobs.js and assets/config.js.
// Run: node worker/build-worker.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "assets/config.js"), "utf8"), sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "assets/jobs.js"), "utf8"), sandbox);

const roles = {};
for (const j of sandbox.window.MI_JOBS) {
  roles[j.slug] = { slug: j.slug, title: j.title + " (m/f/d)", days: j.interviewDays, applyBy: j.applyBy, questions: j.questions };
}
const settings = { slotTimes: sandbox.window.MI_CONFIG.slotTimes, contactEmail: sandbox.window.MI_CONFIG.contactEmail };

const src = fs.readFileSync(path.join(__dirname, "worker.src.js"), "utf8");
const generated = "const ROLES = " + JSON.stringify(roles, null, 2) + ";\nconst SETTINGS = " + JSON.stringify(settings, null, 2) + ";";
fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist/worker.js"), src.replace("/*__GENERATED__*/", generated));
console.log("Wrote worker/dist/worker.js with " + Object.keys(roles).length + " roles");
