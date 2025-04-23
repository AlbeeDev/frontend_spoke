# Spoke (WIP)
⚠️ This project is a work-in-progress. It's currently a dev-focused prototype for learning fullstack deployment
> A work-in-progress full-stack communication platform inspired by Discord and Element.  
> The goal is not to deliver any sort of consumer level software but to manage a complete app lifecycle: from database design to frontend/backend development, containerization, and deployment.

![Project Stage](https://img.shields.io/badge/Status-Actively%20Developing-blue?labelColor=white)
![Backend](https://img.shields.io/badge/Backend-Deployed%20%28Docker%29-purple?labelColor=white)
![Frontend](https://img.shields.io/badge/Frontend-GitHub%20Pages%20%28WIP%29-red?labelColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?labelColor=white)
![Feature](https://img.shields.io/badge/WIP-Messaging%20/%20Calls-grey?labelColor=yellow)

---

## 🧪 Current Status

- ✅ **Account System**: registration (dev-restricted), login, basic authentication
- ✅ **Friend System**: request, accept/deny, listing
- 🟡 **Basic real-time messaging**: works but security and robustness are still under consideration.
- 🔄 **Calls**: design in progress (WebRTC-based)
- ⚙️ **Backend**: Node.js (Dockerized) running on remote PC, exposed via Nginx proxy (planned HTTPS)
- 🧱 **Frontend**: Vue 3 with Vite, build-ready, planning GH Pages deployment
- 🌍 **Database**: MongoDB, functional and indexed, hosted remotely
- 🧪 **Dev Goal**: Learn end-to-end deployment, .env usage across environments, and full app ownership

---

## 🛠️ Tech Stack

| Layer      | Technology                                                      | Notes                                    |
|------------|-----------------------------------------------------------------|------------------------------------------|
| Frontend   | **Vue 3 + Vite**                                                | Will be deployed via GitHub Pages        |
| Backend    | **Node.js + Express**                                           | Dockerized + exposed via Nginx (planned) |
| Database   | **MongoDB**                                                     | Currently running remotely               |
| Deployment | **Docker**, **Nginx Proxy Manager**, **GitHub Pages** (planned) | Docker used for backend containerization |
| Hosting    | Local PC w/ DDNS                                                | Domain exposed using NPM                 |
