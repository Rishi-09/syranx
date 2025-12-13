# Syranx

Syranx is a full-stack AI chat application inspired by ChatGPT, built with a focus on **context-aware conversations**, **per-user memory**, and **threaded chats**.

---

# Test Yourself 
https://syranx.vercel.app

---
## ✨ Features

- 🧠 **Per-user AI memory** (shared across all chats)
- 💬 **Threaded conversations** with message history
- 🏷️ **Automatic smart chat titles**
- 🔐 **JWT-based authentication**
- 📱 Fully responsive UI

---

## 🏗️ Tech Stack

**Frontend:** React, Context API, Tailwind, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**AI:** Groq SDK (`llama-3.1-8b-instant`)

---

## 🧠 Memory Model

- System prompt defines assistant behavior
- User memory persists across all threads
- Thread messages remain isolated per chat
- No cross-user context leakage

---

## ⚙️ Setup

Create a `.env` file in `server/`:

```
# env
GROQ_API_KEY= your personal key ( i can't disclose mine :) )
JWT_SECRET=your_jwt_secret ( any  ,depends on you )
MONGO_URI=your_mongodb_uri ( your mongo atlas connection url)

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```
## 👤 Author
# Rishi
- Syranx may produce inaccurate responses. Always verify critical information.
