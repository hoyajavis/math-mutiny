# Math Mutiny

Math Mutiny is a gamified, local-first multiplication learning application designed to help kids master their math facts (from 0x0 to 12x12) without the friction of traditional flashcards. 

The application uses an advanced **Latency-Adjusted FSRS (Free Spaced Repetition Scheduler)** to automatically adjust difficulty based on the user's accuracy and speed, providing an optimized learning path.

## 🚀 Features

* **Three Unique Game Modes:**
  * **Sequential (Ladder Mode):** Problem selection is fixed and predictable. The player chooses a specific times table (e.g., 2) and climbs up the ladder from `2 x 0` to `2 x 12`, then descends back down from `2 x 11` to `2 x 0`. It is designed for initial memorization.
  * **Random Mode:** Problem selection is pure, unweighted randomness. The app generates a set of 20 random problems across all 1-12 pairs, providing a quick, generalized test of knowledge without relying on historical performance data.
  * **Boss Fight (Challenge Mode):** Problem selection is driven entirely by the Latency-Adjusted FSRS algorithm. The app evaluates all 169 possible facts, calculating weights based on spaced repetition due dates and memory stability. Overdue problems and those with low accuracy/high latency are heavily prioritized, while "Easy" problems are pushed out. Unseen problems are given a baseline priority to ensure full coverage over time.
* **Frictionless Spaced Repetition (SRS):**
  * Powered by `ts-fsrs` and `dexie`.
  * The app infers memory stability automatically. If a student answers quickly and correctly, the fact is pushed further into the future. If they hesitate or miss, it returns sooner.
  * No manual self-rating (e.g., "Hard", "Good", "Easy") required!
* **Local-First Architecture:**
  * All progress, mastery stats, and event logs are stored securely in the browser using IndexedDB. 
  * Blazing fast performance with zero network latency.
* **XP & Mastery Tracking:** Earn XP for correct answers, build streaks, and visualize table mastery with dynamic color-coding.

## 🥚 Easter Eggs & Hidden Features

Math Mutiny includes a few hidden surprises to keep learning fun and unpredictable:
* **Over-The-Top "Zero" Celebration:** Correctly answering any problem involving a `0` triggers an excessive, screen-shaking "ZERO ANNIHILATION!" event with multiple explosions.
* **The Runaway Button:** A sneaky "EASY MODE" button lurks on the home screen. Try to click it—if you can catch it, you might just earn a secret 500 XP bounty!
* **The Sarcasm Bot:** Answer questions to trigger a variety of snarky, humorous remarks from the resident robot coach. It has a vast vocabulary of both praise and absolute disappointment.
* **Fake Developer Console:** Click the `>_` terminal button in the bottom right corner to open a retro hacker terminal. Try commands like `/bot dance`, `/spin`, `/matrix`, or `/help`.
* **Interactive Arcade UI:** The UI uses Framer Motion for heavy, tactile feedback. When answering a sequence correctly, expect rockets, lasers, and particle explosions via the custom `EffectOverlay` rendering engine! 
* **Math-Zilla Taunts:** During Boss Fights, the bosses actively taunt the player as the timer ticks down.
* **Retro Arcade Audio:** Hidden within the interactions are custom-synthesized 8-bit sound effects (lasers, explosions, and power-ups) built purely with the Web Audio API.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion (`motion/react`)
* **Database / SRS:** IndexedDB via [Dexie.js](https://dexie.org/), [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the Vite development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or the port specified in your terminal).

### Build for Production

To build the application for production:
```bash
npm run build
```
This will compile the application into the `dist/` directory. You can preview the production build using:
```bash
npm run start
```

## 🧠 How the Latency-Adjusted FSRS Works

Instead of asking users to rate their memory, Math Mutiny uses **accuracy** and **latency (speed)** to calculate FSRS grades:
- **Easy (4):** Correct answer in ≤ 2.5 seconds.
- **Good (3):** Correct answer in ≤ 6.0 seconds.
- **Hard (2):** Correct answer in > 6.0 seconds.
- **Again (1):** Incorrect answer.

The current memory state is stored in `factStates`, while a detailed history of response times is kept in `attemptLogs` within IndexedDB to prevent UI blocking.
