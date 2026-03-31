# Tic-Tac-Toe Multiplayer (Frontend)

A premium, modern Tic-Tac-Toe experience built with Next.js and Nakama. Features real-time multiplayer, timed game modes, and global rankings.

## 🚀 Setup and Installation

### Prerequisites
- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **Nakama Server**: Running (see backend instructions)

### Quick Start
1.  **Clone the repository** (if not already done).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env.local` file in the root (optional, defaults to localhost:7350):
    ```env
    NEXT_PUBLIC_NAKAMA_HOST=127.0.0.1
    NEXT_PUBLIC_NAKAMA_PORT=7350
    NEXT_PUBLIC_NAKAMA_KEY=defaultkey
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture and Design Decisions

### Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 (Custom Glassmorphism)
- **Animations**: Framer Motion for smooth transitions and micro-interactions.
- **Icons**: Lucide React.
- **Multiplayer**: Nakama JavaScript SDK (@heroiclabs/nakama-js).

### Design Strategy
- **Aesthetic**: Modern "Glassmorphism" with vibrant HSL colors and deep dark-mode backgrounds.
- **Responsiveness**: Fully responsive layout designed for both desktop and mobile play.
- **State Management**: React `useState` and `useRef` for high-performance socket event handling.

---

## 🌐 API/Server Configuration

The frontend communicates with Nakama via:
- **WebSocket**: Used for real-time match state synchronization (OpCodes: 1 for Moves, 2 for State Broadcast).
- **RPCs**:
    - `create_match`: Initializes a new authoritative game.
    - `find_match_by_code`: Locates a specific match using a 6-character code.
- **Leaderboards**: Fetches from the `global_rankings` record set.

---

## 🛠️ How to Test Multiplayer

Testing multiplayer locally is easy:
1.  **Open two different browser tabs** (or one normal and one incognito) at `http://localhost:3000`.
2.  **Tab 1**: Enter a username and click "Classic" or "Timed". Click "Create New Match". Note the Game Code.
3.  **Tab 2**: Enter a different username. Enter the 6-digit Game Code and click "Join".
4.  **Play**: Moves made in one tab will reflect instantly in the other!

---

## 🚢 Deployment Process

### Vercel (Recommended)
1.  Push your code to GitHub.
2.  Connect your repository to Vercel.
3.  Add the environment variables (`NEXT_PUBLIC_NAKAMA_HOST`, etc.) pointing to your production Nakama instance.
4.  Deploy!

### Docker
You can also containerize the frontend using a standard `Dockerfile` for Next.js and deploy to any cloud provider (GCP, AWS).
