(function () {
  "use strict";

  var C = window.MI_CONFIG;
  var JOBS = window.MI_JOBS;
  var MAX_FILE = 5 * 1024 * 1024;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function dateObj(iso) { return new Date(iso + "T12:00:00Z"); }
  function fmtLong(iso) {
    return dateObj(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }
  function fmtShort(iso) {
    return dateObj(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  }
  function weekendLabel(job) {
    var a = dateObj(job.interviewDays[0]), b = dateObj(job.interviewDays[1]);
    var m = b.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
    return a.getUTCDate() + " and " + b.getUTCDate() + " " + m;
  }
  function todayBerlin() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: C.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function isOpen(job) { return todayBerlin() <= job.applyBy; }
  function addMinutes(time, mins) {
    var p = time.split(":"), t = (+p[0]) * 60 + (+p[1]) + mins;
    return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  }
  function slotId(job, day, time) { return job.slug + "|" + day + "T" + time; }
  function findJob(slug) { for (var i = 0; i < JOBS.length; i++) if (JOBS[i].slug === slug) return JOBS[i]; return null; }

  function setCommon() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    var c = $("#contact-link"); if (c) { c.href = "mailto:" + C.contactEmail; c.textContent = C.contactEmail; }
  }

  /* ---------------- Index ---------------- */
  function renderIndex() {
    setCommon();
    var depts = [], locs = [];
    JOBS.forEach(function (j) {
      if (depts.indexOf(j.department) < 0) depts.push(j.department);
      if (locs.indexOf(j.location) < 0) locs.push(j.location);
    });
    depts.sort().forEach(function (d) { $("#f-dept").insertAdjacentHTML("beforeend", "<option>" + esc(d) + "</option>"); });
    locs.sort().forEach(function (l) { $("#f-loc").insertAdjacentHTML("beforeend", "<option>" + esc(l) + "</option>"); });
    $("#stat-roles").textContent = JOBS.filter(isOpen).length;

    function draw() {
      var q = $("#q").value.trim().toLowerCase(), d = $("#f-dept").value, l = $("#f-loc").value;
      var list = JOBS.filter(function (j) {
        if (d && j.department !== d) return false;
        if (l && j.location !== l) return false;
        if (!q) return true;
        var hay = [j.title, j.department, j.summary, j.tech.join(" "), j.tasks.join(" "), j.requirements.join(" ")].join(" ").toLowerCase();
        return hay.indexOf(q) >= 0;
      });
      if (!list.length) { $("#job-list").innerHTML = '<div class="empty">No positions match your search.</div>'; return; }
      $("#job-list").innerHTML = list.map(function (j) {
        var open = isOpen(j);
        return '<a class="job-row" href="job.html?role=' + encodeURIComponent(j.slug) + '">' +
          '<div><h3>' + esc(j.title) + ' (m/f/d)</h3>' +
          '<div class="job-meta">' +
          '<span>' + esc(j.department) + '</span>' +
          '<span>' + esc(j.location) + ', ' + esc(j.workModel.split(" ")[0]) + '</span>' +
          '<span>' + esc(j.type) + '</span>' +
          '<span>' + esc(j.level) + '</span>' +
          '</div></div>' +
          '<div style="text-align:right">' +
          (open ? '<span class="tag">Interviews ' + esc(weekendLabel(j)) + '</span>' : '<span class="tag closed">Applications closed</span>') +
          '<div class="arrow" style="margin-top:8px">View job &rarr;</div></div></a>';
      }).join("");
    }
    ["#q", "#f-dept", "#f-loc"].forEach(function (s) { $(s).addEventListener("input", draw); });
    draw();
  }

  /* ---------------- Job page ---------------- */
  function list(items) { return "<ul>" + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>"; }
  function paras(items) { return items.map(function (i) { return "<p>" + esc(i) + "</p>"; }).join(""); }

  function renderJob() {
    setCommon();
    var slug = new URLSearchParams(location.search).get("role");
    var job = findJob(slug);
    var root = $("#job-root");
    if (!job) {
      root.innerHTML = '<div class="container legal-page"><h1>Position not found</h1><p>This position does not exist or is no longer online.</p><p><a class="btn" href="index.html#jobs">See all open positions</a></p></div>';
      return;
    }
    document.title = job.title + " (m/f/d) | Mock Interviews GmbH";
    var open = isOpen(job);

    root.innerHTML =
      '<div class="job-hero"><div class="container">' +
        '<div class="crumbs"><a href="index.html">Careers</a> / <a href="index.html#jobs">Open positions</a> / ' + esc(job.department) + '</div>' +
        '<h1>' + esc(job.title) + ' (m/f/d)</h1>' +
        '<div class="job-meta"><span>' + esc(job.location) + '</span><span>' + esc(job.workModel) + '</span><span>' + esc(job.type) + '</span><span>' + esc(job.level) + '</span></div>' +
        (open ? '<a class="btn" href="#apply">Apply for this job</a>' : '<span class="tag closed">Applications for this role are closed</span>') +
      '</div></div>' +
      '<div class="container job-layout">' +
        '<article class="job-body">' +
          '<h2>About the team</h2>' + paras(job.team) +
          '<h2>About the role</h2>' + paras(job.role) +
          '<h2>What you will do</h2>' + list(job.tasks) +
          '<h2>What you bring</h2>' + list(job.requirements) +
          '<h2>Nice to have</h2>' + list(job.nice) +
          '<h2>Tech we use</h2><div class="chips">' + job.tech.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join("") + '</div>' +
          '<h2>What we offer</h2>' + list([
            "A fair, structured interview with the person who decides: our CEO.",
            "Written feedback on your CV, cover letter, answers and interview.",
            "A clear picture of what German and European employers expect for this role in 2026."
          ]) +
          '<h2>Your interview</h2><p>Interviews for this role take place on <strong>' + esc(fmtLong(job.interviewDays[0])) + '</strong> and <strong>' + esc(fmtLong(job.interviewDays[1])) + '</strong>. You pick your slot in the application form. Each interview lasts ' + esc(C.interviewLength) + ' and is held by ' + esc(C.interviewer) + '.</p>' +
        '</article>' +
        '<aside class="job-aside"><div class="card">' +
          '<ul class="facts">' +
            fact("Team", job.department) +
            fact("Location", job.location) +
            fact("Work model", job.workModel) +
            fact("Employment", job.type) +
            fact("Level", job.level) +
            fact("Interview weekend", fmtShort(job.interviewDays[0]) + " and " + fmtShort(job.interviewDays[1])) +
            fact("Apply by", fmtLong(job.applyBy) + ", 23:59") +
            fact("Interviewer", C.interviewer + ", CEO") +
          '</ul>' +
          (open ? '<a class="btn block" href="#apply">Apply now</a>' : '<button class="btn block" disabled>Applications closed</button>') +
          '<p class="small" style="margin:12px 0 0">Questions? <a href="mailto:' + esc(C.contactEmail) + '">' + esc(C.contactEmail) + '</a></p>' +
        '</div></aside>' +
      '</div>' +
      '<div class="apply-wrap" id="apply"><div class="container"><div class="apply-card" id="apply-card">' +
        (open ? formHtml(job) : '<h2>Applications closed</h2><p class="lead">The application deadline for this role has passed. Please look at the other open positions.</p><a class="btn" href="index.html#jobs">See open positions</a>') +
      '</div></div></div>';

    if (open) wireForm(job);
  }

  function fact(k, v) { return '<li><span class="k">' + esc(k) + '</span><span class="v">' + esc(v) + '</span></li>'; }

  function field(o) {
    var req = o.required ? ' required' : '';
    var star = o.required ? '<span class="req">*</span>' : '';
    var id = "f-" + o.name;
    var input;
    if (o.type === "select") {
      input = '<select id="' + id + '" name="' + o.name + '"' + req + '><option value="">Please select</option>' +
        o.options.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join("") + '</select>';
    } else if (o.type === "textarea") {
      input = '<textarea id="' + id + '" name="' + o.name + '" maxlength="' + (o.max || 2000) + '"' + (o.min ? ' minlength="' + o.min + '"' : '') + req + '></textarea>' +
        '<div class="counter"><span data-count="' + o.name + '">0</span> / ' + (o.max || 2000) + ' characters</div>';
    } else {
      input = '<input id="' + id + '" name="' + o.name + '" type="' + o.type + '"' + req +
        (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') +
        (o.minv ? ' min="' + o.minv + '"' : '') + (o.maxlength ? ' maxlength="' + o.maxlength + '"' : ' maxlength="200"') + '>';
    }
    return '<div class="field' + (o.full ? ' full' : '') + '"><label for="' + id + '">' + esc(o.label) + star + '</label>' +
      (o.hint ? '<span class="hint">' + esc(o.hint) + '</span>' : '') + input +
      '<span class="error">' + esc(o.error || "Please fill in this field.") + '</span></div>';
  }

  function fileField(name, label, required, hint) {
    return '<div class="field full"><label for="f-' + name + '">' + esc(label) + (required ? '<span class="req">*</span>' : '') + '</label>' +
      '<div class="drop" data-drop="' + name + '"><span class="icon">PDF</span><span class="text" data-file-label="' + name + '"><strong>Upload a file</strong> or drag it here. ' + esc(hint) + '</span>' +
      '<input id="f-' + name + '" type="file" name="' + name + '" accept="application/pdf,.pdf"' + (required ? ' required' : '') + '></div>' +
      '<span class="error">Please upload a PDF file up to 5 MB.</span></div>';
  }

  function slotsHtml(job) {
    return job.interviewDays.map(function (day) {
      return '<div class="slot-day"><h4>' + esc(fmtLong(day)) + '</h4><div class="slots">' +
        C.slotTimes.map(function (t) {
          var id = slotId(job, day, t), dom = "s-" + day + "-" + t.replace(":", "");
          return '<div class="slot"><input type="radio" name="slot" id="' + dom + '" value="' + esc(id) + '" required>' +
            '<label for="' + dom + '">' + esc(t) + '<small>to ' + esc(addMinutes(t, 45)) + '</small></label></div>';
        }).join("") + '</div></div>';
    }).join("");
  }

  function formHtml(job) {
    var qs = job.questions.map(function (q, i) {
      return field({ name: "q" + (i + 1), label: (i + 1) + ". " + q, type: "textarea", required: true, full: true, min: 80, max: 2000, error: "Please answer in at least 80 characters." });
    }).join("");

    return '<h2>Apply for ' + esc(job.title) + ' (m/f/d)</h2>' +
      '<p class="lead">Fields marked with <span style="color:var(--err)">*</span> are required. Applications close on ' + esc(fmtLong(job.applyBy)) + ' at 23:59.</p>' +
      '<div id="form-notice"></div>' +
      '<form id="apply-form" novalidate>' +
        '<input type="hidden" name="role" value="' + esc(job.slug) + '">' +
        '<div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +

        '<fieldset><legend>Personal details</legend><p class="legend-note">We use these details only to contact you about this application.</p><div class="grid-2">' +
          field({ name: "salutation", label: "Salutation", type: "select", options: ["Ms", "Mr", "Mx", "Prefer not to say"] }) +
          field({ name: "title", label: "Academic title", type: "text", placeholder: "Optional, for example Dr." }) +
          field({ name: "firstName", label: "First name", type: "text", required: true, auto: "given-name" }) +
          field({ name: "lastName", label: "Last name", type: "text", required: true, auto: "family-name" }) +
          field({ name: "email", label: "Email address", type: "email", required: true, auto: "email", error: "Please enter a valid email address." }) +
          field({ name: "phone", label: "Phone number", type: "tel", required: true, auto: "tel", placeholder: "+49 ..." }) +
          field({ name: "city", label: "Current city", type: "text", required: true, auto: "address-level2" }) +
          field({ name: "linkedin", label: "LinkedIn profile", type: "url", placeholder: "https://www.linkedin.com/in/...", error: "Please enter a full URL starting with https://" }) +
          field({ name: "portfolio", label: "GitHub or portfolio", type: "url", full: true, placeholder: "https://github.com/...", error: "Please enter a full URL starting with https://" }) +
        '</div></fieldset>' +

        '<fieldset><legend>Education</legend><div class="grid-2">' +
          field({ name: "university", label: "University", type: "text", required: true, placeholder: "e.g. Technische Hochschule Würzburg-Schweinfurt" }) +
          field({ name: "program", label: "Degree program", type: "text", required: true, placeholder: "e.g. M.Sc. Artificial Intelligence" }) +
          field({ name: "semester", label: "Current status", type: "select", required: true, options: ["1st semester", "2nd semester", "3rd semester", "Writing master's thesis", "Graduated", "Other"] }) +
          field({ name: "graduation", label: "Graduation (expected or actual)", type: "month", required: true }) +
          field({ name: "thesis", label: "Master's thesis topic", type: "text", full: true, placeholder: "Optional, if already known", maxlength: 300 }) +
        '</div></fieldset>' +

        '<fieldset><legend>Documents</legend><p class="legend-note">PDF only, up to 5 MB per file.</p><div class="grid-2">' +
          fileField("cv", "CV / résumé", true, "Max. 5 MB.") +
          fileField("coverLetter", "Cover letter", true, "Addressed to Mock Interviews GmbH. Max. 5 MB.") +
          fileField("additional", "Certificates or transcript", false, "Optional. Max. 5 MB.") +
        '</div></fieldset>' +

        '<fieldset><legend>Questions about the role</legend><p class="legend-note">Short, concrete answers work best. These answers will come up in your interview.</p><div class="grid-2">' + qs + '</div></fieldset>' +

        '<fieldset><legend>Availability and expectations</legend><div class="grid-3">' +
          field({ name: "startDate", label: "Earliest start date", type: "date", required: true }) +
          field({ name: "notice", label: "Notice period", type: "select", required: true, options: ["None", "Up to 1 month", "1 to 3 months", "More than 3 months"] }) +
          field({ name: "salary", label: "Salary expectation (EUR gross per year)", type: "number", required: true, minv: "0", placeholder: "e.g. 60000" }) +
          field({ name: "german", label: "German level", type: "select", required: true, options: ["Native", "C2", "C1", "B2", "B1", "A2", "A1", "None"] }) +
          field({ name: "english", label: "English level", type: "select", required: true, options: ["Native", "C2", "C1", "B2", "B1", "A2 or lower"] }) +
          field({ name: "source", label: "How did you hear about us?", type: "select", required: true, options: ["University / lecture", "Friend or classmate", "LinkedIn", "Other"] }) +
        '</div></fieldset>' +

        '<fieldset><legend>Book your interview slot<span class="req" style="color:var(--err)">*</span></legend>' +
          '<p class="legend-note">' + esc(C.interviewFormat) + '. ' + esc(C.interviewLength) + '. Times in German time. Grey slots are already booked.</p>' +
          '<div id="slot-status" class="small" style="margin-bottom:12px">Loading available slots...</div>' +
          '<div class="field full" id="slot-field">' + slotsHtml(job) + '<span class="error">Please choose an interview slot.</span></div>' +
        '</fieldset>' +

        '<fieldset><legend>Consent</legend>' +
          '<div class="field full" id="consent-field">' +
            '<label class="check"><input type="checkbox" name="consentPrivacy" value="yes" required><span>I have read the <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a> and agree that Mock Interviews GmbH stores my data for this mock interview and deletes it no later than 6 months after the interview.<span class="req" style="color:var(--err)">*</span></span></label>' +
            '<label class="check"><input type="checkbox" name="consentTruth" value="yes" required><span>I confirm that the information in my application is true and complete.<span class="req" style="color:var(--err)">*</span></span></label>' +
            '<span class="error">Please confirm both statements.</span>' +
          '</div>' +
        '</fieldset>' +

        '<button class="btn block" type="submit" id="submit-btn">Submit application</button>' +
        '<p class="small" style="text-align:center;margin-top:12px">By submitting, your application is sent securely to Mock Interviews GmbH.</p>' +
      '</form>';
  }

  function notice(type, html) {
    var n = $("#form-notice");
    n.innerHTML = html ? '<div class="notice ' + type + '">' + html + '</div>' : "";
    if (html) n.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function loadSlots(job) {
    var status = $("#slot-status");
    if (!C.apiUrl) { status.textContent = "Online booking opens soon."; return Promise.resolve(); }
    return fetch(C.apiUrl.replace(/\/$/, "") + "/slots?role=" + encodeURIComponent(job.slug))
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (data) {
        var taken = data.taken || [];
        var free = 0;
        $all('input[name="slot"]').forEach(function (el) {
          var t = taken.indexOf(el.value) >= 0;
          el.disabled = t;
          if (t && el.checked) el.checked = false;
          if (!t) free++;
        });
        status.textContent = free ? free + " of " + (C.slotTimes.length * 2) + " slots still free." : "All slots for this role are booked. Please write to " + C.contactEmail + ".";
      })
      .catch(function () { status.textContent = "Could not load the latest bookings. You can still choose a slot; we will confirm it when you submit."; });
  }

  function validate(form) {
    var ok = true, first = null;
    $all(".field", form).forEach(function (f) { f.classList.remove("invalid"); });
    function bad(el) {
      var f = el.closest(".field"); if (f) f.classList.add("invalid");
      ok = false; if (!first) first = el;
    }
    $all("input, select, textarea", form).forEach(function (el) {
      if (el.type === "radio" || el.type === "checkbox" || el.type === "hidden" || el.closest(".hp")) return;
      if (el.type === "file") {
        var file = el.files[0];
        if (el.required && !file) return bad(el);
        if (file && (file.size > MAX_FILE || !/\.pdf$/i.test(file.name))) return bad(el);
        return;
      }
      var v = el.value.trim();
      if (el.required && !v) return bad(el);
      if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return bad(el);
      if (v && el.type === "url" && !/^https?:\/\/\S+\.\S+/.test(v)) return bad(el);
      if (v && el.minLength > 0 && v.length < el.minLength) return bad(el);
    });
    if (!$('input[name="slot"]:checked', form)) bad($('input[name="slot"]', form));
    $all('input[type="checkbox"][required]', form).forEach(function (c) { if (!c.checked) bad(c); });
    if (first) first.closest(".field").scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  function wireForm(job) {
    var form = $("#apply-form");
    loadSlots(job);

    $all("textarea", form).forEach(function (t) {
      t.addEventListener("input", function () { $('[data-count="' + t.name + '"]').textContent = t.value.length; });
    });
    $all('input[type="file"]', form).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var f = inp.files[0], lab = $('[data-file-label="' + inp.name + '"]'), drop = inp.closest(".drop");
        if (f) {
          lab.innerHTML = "<strong>" + esc(f.name) + "</strong> (" + (f.size / 1024 / 1024).toFixed(2) + " MB). Click to replace.";
          drop.classList.add("has-file");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      notice("", "");
      if (!validate(form)) { notice("err", "Please check the highlighted fields."); return; }
      if (!C.apiUrl) { notice("err", "Online applications are not open yet. Please try again later."); return; }
      var btn = $("#submit-btn");
      btn.disabled = true; btn.textContent = "Sending your application...";
      var fd = new FormData(form);
      fetch(C.apiUrl.replace(/\/$/, "") + "/apply", { method: "POST", body: fd })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.status === 200 && res.body.ok) return showSuccess(job, fd, res.body.id);
          if (res.status === 409) {
            loadSlots(job);
            notice("err", "Sorry, this slot was just booked by someone else. Please choose another slot and submit again.");
          } else {
            notice("err", esc(res.body.error || "Something went wrong. Please try again."));
          }
          btn.disabled = false; btn.textContent = "Submit application";
        })
        .catch(function () {
          notice("err", "We could not reach the server. Please check your connection and try again. If it keeps failing, write to " + esc(C.contactEmail) + ".");
          btn.disabled = false; btn.textContent = "Submit application";
        });
    });
  }

  function icsFor(job, slot, name) {
    var parts = slot.split("|")[1].split("T"), day = parts[0].replace(/-/g, ""), t = parts[1].replace(":", "");
    var end = addMinutes(parts[1], 45).replace(":", "");
    var lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mock Interviews GmbH//Careers//EN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@mock-interviews",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART;TZID=Europe/Berlin:" + day + "T" + t + "00",
      "DTEND;TZID=Europe/Berlin:" + day + "T" + end + "00",
      "SUMMARY:Interview " + job.title + " - Mock Interviews GmbH",
      "DESCRIPTION:Interview with " + C.interviewer + ". The video link will be sent by email.",
      "END:VEVENT", "END:VCALENDAR"
    ];
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
  }

  function showSuccess(job, fd, id) {
    var slot = fd.get("slot"), p = slot.split("|")[1].split("T");
    $("#apply-card").innerHTML =
      '<div class="success"><div class="tick">&#10003;</div>' +
      '<h2>Thank you, ' + esc(fd.get("firstName")) + '. Your application is in.</h2>' +
      '<p>We received your application for <strong>' + esc(job.title) + ' (m/f/d)</strong>.</p>' +
      '<p>Your interview: <strong>' + esc(fmtLong(p[0])) + ', ' + esc(p[1]) + ' to ' + esc(addMinutes(p[1], 45)) + '</strong> (German time) with ' + esc(C.interviewer) + '.</p>' +
      '<p>Your reference number is <span class="ref">' + esc(id) + '</span>. Please keep it.</p>' +
      '<p>You will receive two emails at ' + esc(fd.get("email")) + ' an application confirmation right away, and about 30 minutes later your <strong>Mock Interview Confirmation</strong> with the Zoom link. Please also check your spam folder.</p>' +
      '<p style="margin-top:22px"><a class="btn" download="interview.ics" href="' + icsFor(job, slot) + '">Add to calendar</a> <a class="btn secondary" href="index.html#jobs">See other positions</a></p>' +
      '</div>';
    $("#apply-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.MI = { renderIndex: renderIndex, renderJob: renderJob, setCommon: setCommon };
})();
