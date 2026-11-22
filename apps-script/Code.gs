/**
 * Mock Interviews GmbH - email sender (Google Apps Script, runs in Tharun's Google account)
 *
 * The Cloudflare Worker calls this web app after an application is saved. It then:
 *   1. emails the student "Application received"
 *   2. creates the interview in Tharun's Google Calendar with a Google Meet link
 *   3. emails the student "Mock Interview Confirmation" with the Meet link and a calendar file
 *   4. emails Tharun a short summary with a link to the application on GitHub
 *
 * Setup: run setup() once, copy the MAIL_SECRET from the log into the Cloudflare Worker,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */

var CFG = {
  company: "Mock Interviews GmbH",
  ceo: "Tharun Kumar Korine Palli",
  title: "CEO",
  ownerEmail: "korinetharunkumarpalli@gmail.com",
  careersUrl: "https://tharun-kumar-korinepalli.github.io/mock-interviews/",
  timeZone: "Europe/Berlin",
  minutes: 45
};

function setup() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty("MAIL_SECRET");
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    props.setProperty("MAIL_SECRET", secret);
  }
  // Touch Gmail and Calendar so Google asks for permission now.
  GmailApp.getAliases();
  CalendarApp.getDefaultCalendar();
  Logger.log("MAIL_SECRET = " + secret);
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("MAIL_SECRET");
    if (!secret || d.secret !== secret) return out({ ok: false, error: "forbidden" });
    if (d.test === true) return out({ ok: true, test: true });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var start = toDate(d.slotDate, d.slotTime);
      var end = new Date(start.getTime() + CFG.minutes * 60000);
      var meet = createEvent(d, start, end);

      sendReceived(d);
      sendInterview(d, start, end, meet);
      notifyOwner(d, start, meet);
    } finally {
      lock.releaseLock();
    }
    return out({ ok: true });
  } catch (err) {
    console.error(err);
    return out({ ok: false, error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// "2026-12-12" + "10:00" in Europe/Berlin -> Date
function toDate(day, time) {
  var p = day.split("-"), t = time.split(":");
  var guess = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], +t[0], +t[1]));
  var offset = Utilities.formatDate(guess, CFG.timeZone, "Z"); // e.g. +0100
  var sign = offset[0] === "-" ? -1 : 1;
  var mins = sign * (parseInt(offset.substr(1, 2), 10) * 60 + parseInt(offset.substr(3, 2), 10));
  return new Date(guess.getTime() - mins * 60000);
}

function fmtDay(date) { return Utilities.formatDate(date, CFG.timeZone, "EEEE, d MMMM yyyy"); }
function fmtTime(date) { return Utilities.formatDate(date, CFG.timeZone, "HH:mm"); }

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function greeting(d) {
  var name = [d.title, d.lastName].filter(String).join(" ");
  if (d.salutation === "Ms") return "Dear Ms " + name + ",";
  if (d.salutation === "Mr") return "Dear Mr " + name + ",";
  return "Dear " + d.firstName + " " + d.lastName + ",";
}

/** Creates the event in Tharun's calendar. Returns the Google Meet link, or "" if Meet is not available. */
function createEvent(d, start, end) {
  var title = "Mock Interview: " + d.firstName + " " + d.lastName + " (" + d.roleTitle + ")";
  var desc = "Reference: " + d.id + "\nCandidate: " + d.firstName + " " + d.lastName + " <" + d.email + ">\nPhone: " + d.phone +
    "\nProgram: " + d.program + ", " + d.university + "\n\nApplication on GitHub: " + d.folderUrl;
  try {
    // Needs the Advanced Calendar service (Services > Google Calendar API). Adds a Google Meet link.
    var ev = Calendar.Events.insert({
      summary: title,
      description: desc,
      start: { dateTime: start.toISOString(), timeZone: CFG.timeZone },
      end: { dateTime: end.toISOString(), timeZone: CFG.timeZone },
      conferenceData: { createRequest: { requestId: d.id, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] }
    }, "primary", { conferenceDataVersion: 1, sendUpdates: "none" });
    return ev.hangoutLink || "";
  } catch (e) {
    console.warn("Advanced Calendar not available, using CalendarApp: " + e);
    CalendarApp.getDefaultCalendar().createEvent(title, start, end, { description: desc });
    return "";
  }
}

function layout(heading, bodyHtml) {
  return '<div style="background:#f5f7fa;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f1b2d">' +
    '<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e3e8ef;border-radius:10px;overflow:hidden">' +
    '<div style="background:#0b3d91;padding:20px 28px">' +
    '<span style="display:inline-block;background:#ffffff;color:#0b3d91;font-weight:bold;font-size:13px;border-radius:6px;padding:6px 8px;margin-right:10px">MI</span>' +
    '<span style="color:#ffffff;font-weight:bold;font-size:17px">Mock Interviews GmbH</span></div>' +
    '<div style="padding:28px 28px 8px">' +
    '<h1 style="font-size:21px;margin:0 0 18px;color:#0f1b2d">' + esc(heading) + '</h1>' + bodyHtml + '</div>' +
    '<div style="padding:18px 28px 26px;font-size:14px;line-height:1.6;color:#3b4a5f">Kind regards,<br><b>' + esc(CFG.ceo) + '</b><br>' + esc(CFG.title) + ', ' + esc(CFG.company) + '</div>' +
    '<div style="border-top:1px solid #e3e8ef;padding:14px 28px;font-size:11px;color:#6b7889">' + esc(CFG.company) +
    ' is a training simulation for AI master\'s students and not a real employer. ' +
    '<a href="' + CFG.careersUrl + 'privacy.html" style="color:#6b7889">Privacy notice</a></div></div></div>';
}

function p(html) { return '<p style="font-size:14px;line-height:1.6;color:#3b4a5f;margin:0 0 14px">' + html + '</p>'; }

function table(rows) {
  return '<table style="width:100%;border-collapse:collapse;margin:6px 0 18px;font-size:14px">' + rows.map(function (r) {
    return '<tr><td style="padding:9px 12px;background:#f5f7fa;border:1px solid #e3e8ef;width:38%;color:#6b7889">' + esc(r[0]) +
      '</td><td style="padding:9px 12px;border:1px solid #e3e8ef;color:#0f1b2d"><b>' + r[1] + '</b></td></tr>';
  }).join("") + '</table>';
}

function sendReceived(d) {
  var subject = "Application received: " + d.roleTitle + " | " + CFG.company;
  var html = layout("Thank you for your application", [
    p(esc(greeting(d))),
    p("Thank you for applying for the position of <b>" + esc(d.roleTitle) + "</b> at " + esc(CFG.company) + ". We have received your application and your documents."),
    table([["Position", esc(d.roleTitle)], ["Reference number", esc(d.id)], ["Submitted", esc(Utilities.formatDate(new Date(d.submittedAt), CFG.timeZone, "d MMMM yyyy, HH:mm"))]]),
    p("Your interview details follow in a separate email titled <b>Mock Interview Confirmation</b>. Please keep your reference number for any questions."),
    p("If you need to change your booking, reply to this email.")
  ].join(""));
  GmailApp.sendEmail(d.email, subject, stripHtml(html), { htmlBody: html, name: CFG.company, replyTo: CFG.ownerEmail });
}

function sendInterview(d, start, end, meet) {
  var subject = "Mock Interview Confirmation: " + d.roleTitle + ", " + fmtDay(start) + " at " + fmtTime(start);
  var rows = [
    ["Position", esc(d.roleTitle)],
    ["Date", esc(fmtDay(start))],
    ["Time", esc(fmtTime(start) + " to " + fmtTime(end) + " (German time)")],
    ["Interviewer", esc(CFG.ceo + ", " + CFG.title)],
    ["Format", meet ? 'Google Meet: <a href="' + esc(meet) + '" style="color:#0b3d91">' + esc(meet) + '</a>' : "Video call. The link follows by email before the interview."],
    ["Reference number", esc(d.id)]
  ];
  var html = layout("Mock Interview Confirmation", [
    p(esc(greeting(d))),
    p("We are pleased to invite you to an interview for the position of <b>" + esc(d.roleTitle) + "</b>. Your interview is confirmed:"),
    table(rows),
    '<p style="font-size:14px;line-height:1.6;color:#3b4a5f;margin:0 0 6px"><b>How to prepare</b></p>' +
    '<ul style="font-size:14px;line-height:1.6;color:#3b4a5f;margin:0 0 16px;padding-left:20px">' +
    '<li>Read the job description again: <a href="' + CFG.careersUrl + 'job.html?role=' + encodeURIComponent(d.role) + '" style="color:#0b3d91">' + esc(d.roleTitle) + '</a>.</li>' +
    '<li>Be ready to walk through one project from your CV in detail.</li>' +
    '<li>Expect questions on the fundamentals of the role and one practical case.</li>' +
    '<li>Join 5 minutes early with a working camera and microphone.</li></ul>',
    p("A calendar file is attached. If you cannot attend, please reply to this email at least 48 hours before the interview.")
  ].join(""));
  var ics = Utilities.newBlob(icsText(d, start, end, meet), "text/calendar", "mock-interview.ics");
  GmailApp.sendEmail(d.email, subject, stripHtml(html), { htmlBody: html, name: CFG.company, replyTo: CFG.ownerEmail, attachments: [ics] });
}

function notifyOwner(d, start, meet) {
  var subject = "New application: " + d.firstName + " " + d.lastName + " | " + d.roleTitle + " | " + fmtDay(start) + " " + fmtTime(start);
  var html = layout("New application", table([
    ["Candidate", esc(d.firstName + " " + d.lastName)],
    ["Position", esc(d.roleTitle)],
    ["Interview", esc(fmtDay(start) + ", " + fmtTime(start))],
    ["Email", esc(d.email)],
    ["Phone", esc(d.phone)],
    ["Program", esc(d.program + ", " + d.university)],
    ["Meet link", meet ? esc(meet) : "-"],
    ["Reference", esc(d.id)],
    ["Application, CV, cover letter", '<a href="' + esc(d.folderUrl) + '" style="color:#0b3d91">Open on GitHub</a>']
  ]));
  GmailApp.sendEmail(CFG.ownerEmail, subject, stripHtml(html), { htmlBody: html, name: CFG.company });
}

function icsText(d, start, end, meet) {
  function z(dt) { return Utilities.formatDate(dt, "UTC", "yyyyMMdd'T'HHmmss'Z'"); }
  var desc = "Interview with " + CFG.ceo + " for " + d.roleTitle + ". Reference " + d.id + "." + (meet ? " Google Meet: " + meet : "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mock Interviews GmbH//Interviews//EN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + d.id + "@mock-interviews",
    "DTSTAMP:" + z(new Date()),
    "DTSTART:" + z(start),
    "DTEND:" + z(end),
    "SUMMARY:Mock Interview: " + d.roleTitle + " (Mock Interviews GmbH)",
    "DESCRIPTION:" + desc.replace(/,/g, "\\,"),
    meet ? "LOCATION:" + meet : "LOCATION:Video call",
    "BEGIN:VALARM", "TRIGGER:-PT30M", "ACTION:DISPLAY", "DESCRIPTION:Mock interview in 30 minutes", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
}

function stripHtml(html) {
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|tr|li|h1|div)>/gi, "\n").replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim();
}
