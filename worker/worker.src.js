// Mock Interviews GmbH - application API (Cloudflare Worker)
//
// GET  /slots?role=<slug>  -> { taken: [slotId, ...] }
// POST /apply (multipart)  -> { ok: true, id } and saves everything to a PRIVATE GitHub repo
//
// Required settings (Worker > Settings > Variables):
//   GITHUB_TOKEN   (secret)  fine-grained token: Contents read/write + Issues read/write on the data repo only
//   GITHUB_OWNER             e.g. tharun-kumar-korinepalli
//   GITHUB_REPO              e.g. mock-interviews-data
//   ALLOWED_ORIGIN           e.g. https://tharun-kumar-korinepalli.github.io
//
// The ROLES and SETTINGS blocks below are generated from assets/jobs.js and assets/config.js
// by build-worker.js. Do not edit them by hand.

/*__GENERATED__*/

const MAX_FILE = 5 * 1024 * 1024;
const BRANCH = "main";
const recent = new Map(); // simple per-instance rate limit

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin || "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "vary": "Origin",
      "cache-control": "no-store"
    }
  });
}

function gh(env, path, init) {
  init = init || {};
  init.headers = Object.assign({
    "authorization": "Bearer " + env.GITHUB_TOKEN,
    "accept": "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "mock-interviews-worker",
    "content-type": "application/json"
  }, init.headers || {});
  return fetch("https://api.github.com/repos/" + env.GITHUB_OWNER + "/" + env.GITHUB_REPO + path, init);
}

async function ghJson(env, path, init) {
  const r = await gh(env, path, init);
  const text = await r.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return { status: r.status, body };
}

function b64FromBytes(bytes) {
  let s = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(s);
}
function b64FromText(text) { return b64FromBytes(new TextEncoder().encode(text)); }

async function readBookings(env, ref) {
  const r = await ghJson(env, "/contents/bookings.json?ref=" + encodeURIComponent(ref));
  if (r.status === 404) return {};
  if (r.status !== 200) throw new Error("bookings read failed " + r.status);
  const raw = atob(r.body.content.replace(/\n/g, ""));
  const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function berlinToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function clean(v, max) {
  return String(v == null ? "" : v).replace(/\u0000/g, "").trim().slice(0, max || 300);
}
function slugPart(s) {
  return clean(s, 60).normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
}

async function readPdf(file, required, label) {
  if (!file || typeof file === "string" || file.size === 0) {
    if (required) throw new UserError("Please upload your " + label + " as a PDF.");
    return null;
  }
  if (file.size > MAX_FILE) throw new UserError("Your " + label + " is larger than 5 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!(bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)) {
    throw new UserError("Your " + label + " must be a PDF file.");
  }
  return bytes;
}

class UserError extends Error {}

function fmtDay(iso) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function markdown(a, role) {
  const L = [];
  L.push("# " + a.firstName + " " + a.lastName + " - " + role.title);
  L.push("");
  L.push("| | |");
  L.push("|---|---|");
  const rows = [
    ["Reference", a.id], ["Submitted", a.submittedAt], ["Role", role.title],
    ["Interview", fmtDay(a.slotDate) + ", " + a.slotTime + " (Europe/Berlin)"],
    ["Name", [a.salutation, a.title, a.firstName, a.lastName].filter(Boolean).join(" ")],
    ["Email", a.email], ["Phone", a.phone], ["City", a.city],
    ["LinkedIn", a.linkedin || "-"], ["GitHub / portfolio", a.portfolio || "-"],
    ["University", a.university], ["Program", a.program], ["Status", a.semester],
    ["Graduation", a.graduation], ["Thesis topic", a.thesis || "-"],
    ["Earliest start", a.startDate], ["Notice period", a.notice], ["Salary expectation", a.salary ? a.salary + " EUR" : "-"],
    ["German", a.german], ["English", a.english], ["Source", a.source]
  ];
  rows.forEach(r => L.push("| " + r[0] + " | " + String(r[1]).replace(/\|/g, "/").replace(/\n/g, " ") + " |"));
  L.push("");
  L.push("## Documents");
  L.push("- [CV](cv.pdf)");
  L.push("- [Cover letter](cover-letter.pdf)");
  if (a.files.additional) L.push("- [Certificates / transcript](certificates.pdf)");
  L.push("");
  L.push("## Answers");
  role.questions.forEach((q, i) => {
    L.push("");
    L.push("### " + (i + 1) + ". " + q);
    L.push("");
    L.push(a.answers["q" + (i + 1)] || "-");
  });
  L.push("");
  L.push("## Interviewer notes");
  L.push("");
  L.push("_Add your notes and score here after the interview._");
  L.push("");
  return L.join("\n");
}

async function handleApply(request, env, origin) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) return json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, 429, origin);
  hits.push(now); recent.set(ip, hits);

  const len = Number(request.headers.get("content-length") || 0);
  if (len > 17 * 1024 * 1024) return json({ ok: false, error: "Your files are too large." }, 413, origin);

  let form;
  try { form = await request.formData(); } catch (e) { return json({ ok: false, error: "Invalid form data." }, 400, origin); }

  if (clean(form.get("website"))) return json({ ok: true, id: "MI-OK" }, 200, origin); // honeypot

  const role = ROLES[clean(form.get("role"), 80)];
  if (!role) return json({ ok: false, error: "Unknown position." }, 400, origin);
  if (berlinToday() > role.applyBy) return json({ ok: false, error: "Applications for this role are closed." }, 400, origin);

  const slot = clean(form.get("slot"), 80);
  const m = /^([a-z0-9-]+)\|(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(slot);
  if (!m || m[1] !== role.slug || role.days.indexOf(m[2]) < 0 || SETTINGS.slotTimes.indexOf(m[3]) < 0) {
    return json({ ok: false, error: "Please choose a valid interview slot." }, 400, origin);
  }

  const a = {
    role: role.slug,
    roleTitle: role.title,
    slot, slotDate: m[2], slotTime: m[3],
    salutation: clean(form.get("salutation"), 40),
    title: clean(form.get("title"), 40),
    firstName: clean(form.get("firstName"), 80),
    lastName: clean(form.get("lastName"), 80),
    email: clean(form.get("email"), 160).toLowerCase(),
    phone: clean(form.get("phone"), 40),
    city: clean(form.get("city"), 80),
    linkedin: clean(form.get("linkedin"), 200),
    portfolio: clean(form.get("portfolio"), 200),
    university: clean(form.get("university"), 160),
    program: clean(form.get("program"), 160),
    semester: clean(form.get("semester"), 60),
    graduation: clean(form.get("graduation"), 10),
    thesis: clean(form.get("thesis"), 300),
    startDate: clean(form.get("startDate"), 10),
    notice: clean(form.get("notice"), 40),
    salary: clean(form.get("salary"), 12),
    german: clean(form.get("german"), 20),
    english: clean(form.get("english"), 20),
    source: clean(form.get("source"), 60),
    answers: {},
    consentPrivacy: form.get("consentPrivacy") === "yes",
    consentTruth: form.get("consentTruth") === "yes",
    files: {}
  };
  role.questions.forEach((q, i) => { a.answers["q" + (i + 1)] = clean(form.get("q" + (i + 1)), 2000); });

  const required = ["firstName", "lastName", "email", "phone", "city", "university", "program", "semester", "graduation", "startDate", "notice", "salary", "german", "english", "source"];
  for (const k of required) if (!a[k]) return json({ ok: false, error: "Please fill in all required fields." }, 400, origin);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) return json({ ok: false, error: "Please enter a valid email address." }, 400, origin);
  for (const k in a.answers) if (a.answers[k].length < 80) return json({ ok: false, error: "Please answer each role question in at least 80 characters." }, 400, origin);
  if (!a.consentPrivacy || !a.consentTruth) return json({ ok: false, error: "Please confirm the consent statements." }, 400, origin);

  let cv, cover, extra;
  try {
    cv = await readPdf(form.get("cv"), true, "CV");
    cover = await readPdf(form.get("coverLetter"), true, "cover letter");
    extra = await readPdf(form.get("additional"), false, "certificates file");
  } catch (e) {
    if (e instanceof UserError) return json({ ok: false, error: e.message }, 400, origin);
    throw e;
  }

  const stamp = new Date();
  a.submittedAt = stamp.toISOString();
  a.id = "MI-" + a.slotDate.replace(/-/g, "").slice(2) + "-" + crypto.randomUUID().slice(0, 6).toUpperCase();
  a.files = { cv: "cv.pdf", coverLetter: "cover-letter.pdf" };
  if (extra) a.files.additional = "certificates.pdf";

  const folder = "applications/" + role.slug + "/" + a.slotDate + "_" + a.slotTime.replace(":", "") + "_" + slugPart(a.lastName) + "-" + slugPart(a.firstName) + "_" + a.id;

  // Commit everything in one atomic commit. Retry if another application landed at the same time.
  for (let attempt = 0; attempt < 4; attempt++) {
    const ref = await ghJson(env, "/git/ref/heads/" + BRANCH);
    if (ref.status !== 200) throw new Error("ref read failed " + ref.status);
    const head = ref.body.object.sha;
    const commit = await ghJson(env, "/git/commits/" + head);
    const bookings = await readBookings(env, head);

    if (bookings[slot]) return json({ ok: false, error: "This slot is already booked." }, 409, origin);
    for (const k in bookings) {
      if (bookings[k].role === role.slug && bookings[k].email === a.email) {
        return json({ ok: false, error: "You have already applied for this position with this email address. Write to " + SETTINGS.contactEmail + " if you need to change your booking." }, 400, origin);
      }
    }
    bookings[slot] = { id: a.id, role: role.slug, name: a.firstName + " " + a.lastName, email: a.email, folder, bookedAt: a.submittedAt };

    const files = [
      { path: folder + "/application.json", content: b64FromText(JSON.stringify(a, null, 2)) },
      { path: folder + "/README.md", content: b64FromText(markdown(a, role)) },
      { path: folder + "/cv.pdf", content: b64FromBytes(cv) },
      { path: folder + "/cover-letter.pdf", content: b64FromBytes(cover) },
      { path: "bookings.json", content: b64FromText(JSON.stringify(bookings, null, 2)) }
    ];
    if (extra) files.push({ path: folder + "/certificates.pdf", content: b64FromBytes(extra) });

    const tree = [];
    for (const f of files) {
      const blob = await ghJson(env, "/git/blobs", { method: "POST", body: JSON.stringify({ content: f.content, encoding: "base64" }) });
      if (blob.status !== 201) throw new Error("blob failed " + blob.status);
      tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.body.sha });
    }
    const t = await ghJson(env, "/git/trees", { method: "POST", body: JSON.stringify({ base_tree: commit.body.tree.sha, tree }) });
    if (t.status !== 201) throw new Error("tree failed " + t.status);
    const c = await ghJson(env, "/git/commits", { method: "POST", body: JSON.stringify({
      message: "Application " + a.id + ": " + a.firstName + " " + a.lastName + " for " + role.title,
      tree: t.body.sha, parents: [head]
    }) });
    if (c.status !== 201) throw new Error("commit failed " + c.status);
    const upd = await ghJson(env, "/git/refs/heads/" + BRANCH, { method: "PATCH", body: JSON.stringify({ sha: c.body.sha, force: false }) });
    if (upd.status === 200) {
      // Best effort: one issue per application, so you get a GitHub notification and a list view.
      const link = "https://github.com/" + env.GITHUB_OWNER + "/" + env.GITHUB_REPO + "/tree/" + BRANCH + "/" + folder;
      await gh(env, "/issues", { method: "POST", body: JSON.stringify({
        title: "[" + role.title + "] " + a.firstName + " " + a.lastName + " - " + fmtDay(a.slotDate) + ", " + a.slotTime,
        body: "**Reference:** " + a.id + "\n**Interview:** " + fmtDay(a.slotDate) + ", " + a.slotTime + " (Europe/Berlin)\n**Email:** " + a.email +
          "\n**Phone:** " + a.phone + "\n**Program:** " + a.program + ", " + a.university + "\n\nFull application, CV and cover letter: " + link,
        labels: [role.slug]
      }) }).catch(() => null);
      return json({ ok: true, id: a.id }, 200, origin);
    }
    if (upd.status !== 422 && upd.status !== 409) throw new Error("ref update failed " + upd.status);
  }
  return json({ ok: false, error: "The server was busy. Please submit again." }, 503, origin);
}

async function handleSlots(url, env, origin) {
  const role = ROLES[url.searchParams.get("role") || ""];
  if (!role) return json({ taken: [] }, 200, origin);
  const bookings = await readBookings(env, BRANCH);
  const taken = Object.keys(bookings).filter(k => k.indexOf(role.slug + "|") === 0);
  return json({ taken }, 200, origin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const reqOrigin = request.headers.get("origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    const origin = allowed.indexOf(reqOrigin) >= 0 ? reqOrigin : (allowed[0] || "*");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        "vary": "Origin"
      } });
    }
    try {
      if (request.method === "GET" && url.pathname === "/slots") return await handleSlots(url, env, origin);
      if (request.method === "POST" && url.pathname === "/apply") {
        if (allowed.length && allowed.indexOf(reqOrigin) < 0) return json({ ok: false, error: "Forbidden." }, 403, origin);
        return await handleApply(request, env, origin);
      }
      if (url.pathname === "/" || url.pathname === "/health") return json({ ok: true, service: "Mock Interviews GmbH applications" }, 200, origin);
      return json({ ok: false, error: "Not found." }, 404, origin);
    } catch (e) {
      console.log("error", e && e.stack || e);
      return json({ ok: false, error: "Server error. Please try again or write to " + SETTINGS.contactEmail + "." }, 500, origin);
    }
  }
};
