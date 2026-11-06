# Nikoo Vali · Portfolio

A responsive portfolio featuring all five experiences and three projects from Nikoo’s resume. Built with semantic HTML, CSS, and a small amount of JavaScript; no build step or package installation is required.

## Local development

Clone the repository and start a local server (Python 3 required):

```sh
git clone https://github.com/nikoov/Portfolio_Nikoo.git
cd Portfolio_Nikoo
python3 -m http.server 3000 --bind 127.0.0.1
```

Open http://localhost:3000 in your browser. On Windows, use `py -m http.server 3000 --bind 127.0.0.1` if `python3` is unavailable.

If you already have a local checkout, run `git pull origin main` from its directory before starting the server.

The server serves `index.html`, styles, scripts, the portrait, and the resume in `assets/`. Stop it with Ctrl+C. Google Fonts are optional; system fonts are used when unavailable.

## Updating content

Edit `index.html` for experience summaries, projects, skills, and contact links. Replace `assets/Nikoo-Vali-Resume.pdf` when updating the downloadable resume. Project illustrations are concept visualizations, not screenshots of the applications.

## Deployment

Publish the repository as a static site using GitHub Pages (main branch, repository root), Netlify, or another static host. No environment variables or secrets are needed.
