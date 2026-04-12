# Mimbre Website

This is a static website built from a Webflow export and deployed using Railway.

## 📁 Project Structure

* `index.html` – Main homepage
* `about.html`, `services.html`, `pricing.html` – Site pages
* `css/` – Stylesheets
* `js/` – JavaScript files
* `images/`, `videos/`, `fonts/` – Assets

## 🚀 Deployment

This project is configured to run on Railway using a simple static server.

### Start command

```bash
npm start
```

This runs:

```bash
serve . -l $PORT
```

## 🌐 Hosting

Deployed via Railway by connecting this repository and running the start script.

## 🛠 Notes

* This is a static site (no backend)
* Built originally using Webflow and exported as HTML/CSS/JS
* All files must remain in the root directory for proper asset loading

## 📦 Setup (optional local run)

```bash
npm install
npm start
```

Then open:

```
http://localhost:3000
```

---
