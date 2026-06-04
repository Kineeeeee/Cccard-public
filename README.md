# Cccard - Real-time Multiplayer Card Game (Tiến Lên Miền Nam)

🎮 **[PLAY LIVE DEMO HERE](https://cccard-com.onrender.com/)** 🎮
*(Invite a friend to open the link and play together in real-time)*

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black?logo=socket.io)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Jest](https://img.shields.io/badge/Tested_with-Jest-red?logo=jest)

A high-performance, real-time multiplayer implementation of the traditional Vietnamese card game **Tiến Lên Miền Nam**. Built from scratch with a focus on defensive programming, decoupled architecture, and seamless real-time state synchronization.

---

## 🌟 Key Features

- **Real-time Multiplayer Gameplay:** Low-latency card playing and state synchronization using WebSocket (`Socket.IO`).
- **Resilient Connection Handling:** Robust disconnect/reconnect system. If a player drops, their state is preserved. If they don't return within the timeout window, they seamlessly transition into a "Ghost Player" (Auto-pass) to prevent game deadlocks.
- **Advanced State Management:** Custom Flux/Redux-like Dispatcher on the frontend (Vanilla JS) that strictly separates UI rendering from network logic.
- **Event-driven Backend:** Deeply decoupled backend architecture. Actions, Flow, Rules, and Emitters are strictly separated to maintain the Single Responsibility Principle.
- **Comprehensive Unit Testing:** The core game engine is locked down by a massive suite of **73 Jest Test Cases**, ensuring rock-solid stability for complex rules (card validation, instant win conditions, penalty calculations).

---

## 🛠 Tech Stack

### Frontend (Client)
- **Vanilla JavaScript** (ES6 Modules)
- **Custom Flux-like Architecture** (Centralized State & Dispatchers)
- **Socket.IO Client**

### Backend (Server)
- **Node.js & Express**
- **Socket.IO** (Real-time Bidirectional Event-based Communication)
- **Jest** (Unit Testing & Mocking)

---

## 🏗 Architecture Overview

The system is designed with a strict unidirectional data flow to prevent race conditions and state desynchronization across clients.

### Backend Flow (Event-Driven)
```text
[Socket Events] ➔ [Actions (startGame, playCards)] ➔ [Flow / Rules Engine] ➔ [State Mutation] ➔ [Emitters] ➔ [Clients]
```

### Frontend Flow (Flux-like)
```text
[Socket Listeners] ➔ [State Store Update] ➔ [Render Pipeline] ➔ [DOM Update]
```

---

## 🗂 Project Structure

```text
GAME-REALTIME/
│
├── client/                 # Frontend Application
│   ├── css/                # Styling
│   ├── js/
│   │   ├── render/         # UI rendering functions (pure views)
│   │   ├── socket/         # Socket event listeners
│   │   ├── state/          # Global state store & Dispatchers
│   │   └── utils/          # Helpers
│   └── index.html          # Entry point
│
├── server/                 # Backend Node.js Server
│   ├── config/             # Constants & Environment configs
│   ├── emitters/           # Outbound socket event dispatchers
│   ├── engine/             # Core Game Logic (The "Brain")
│   │   ├── actions/        # Player intents (playCards, passTurn, quitGame)
│   │   ├── rules/          # Validation (compareCombos, checkInstantWin)
│   │   ├── scoring/        # Penalty & Chop calculations
│   │   └── utils/          # Flow control (getNextPlayer, context)
│   ├── managers/           # In-memory Room & Player persistence
│   ├── socket/             # Inbound socket handlers
│   ├── timers/             # Async operations (Turn countdowns, Ghost cleanup)
│   └── test/               # Jest Unit Tests (73 Test Cases)
│
├── .env.example
├── package.json
└── server.js               # Server Entry Point
```

---

## 🚀 Installation & Setup

**1. Clone the repository and install dependencies:**
```bash
npm install
```

**2. Configure Environment Variables:**
Create a `.env` file in the root directory based on `.env.example`:
```env
PORT=3000
PING_TIMEOUT=60000
PING_INTERVAL=25000
DISCONNECT_TIMEOUT=30000
DISCONNECT_CHECK_INTERVAL=5000
```

**3. Run the Development Server:**
```bash
npm run dev
```

**4. Run Production Server:**
```bash
npm start
```

---

## 🧪 Testing

The core game engine is fully tested using **Jest**. The test suite covers card sorting, validation, scoring, turn passing, player removal, and ghost player timeouts.

Run the test suite:
```bash
npm run test
```

*Expected Output: `Test Suites: 21 passed, 21 total | Tests: 73 passed, 73 total`*

---

## 🛣 Roadmap / Future Improvements

- [ ] Mobile Responsive UI Overhaul
- [ ] Implement Database Persistence (MongoDB / PostgreSQL) for Match History & Leaderboards.
- [ ] Add AI Bots for single-player practice.
- [ ] Spectator Mode improvements.
- [ ] JWT Authentication & User Accounts.

---

## 📜 License

This project is licensed under the MIT License.
