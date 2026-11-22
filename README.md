# Mock Interviews GmbH careers site

Careers website for the AI mock interview program run by Tharun Kumar Korine Palli.
Seven roles, each with its own interview weekend two weeks apart. Students apply online,
upload CV and cover letter, answer role questions and book an interview slot.

Mock Interviews GmbH is a training simulation, not a real employer.

## How it works

- `index.html`, `job.html`: static site on GitHub Pages.
- `assets/jobs.js`: the seven job descriptions, interview dates and role questions.
- `assets/config.js`: contact email, slot times, and `apiUrl` of the Cloudflare Worker.
- `worker/`: Cloudflare Worker that saves each application (JSON, README, CV, cover letter)
  in one commit to the private repo `mock-interviews-data` and blocks the booked slot.
  No student data is ever stored in this public repo.

## Changing dates or roles

1. Edit `assets/jobs.js` (and `assets/config.js` for slot times).
2. Run `node worker/build-worker.js` and paste `worker/dist/worker.js` into the Cloudflare Worker editor.
3. Commit and push. GitHub Pages updates in about a minute.
