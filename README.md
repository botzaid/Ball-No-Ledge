# 👑 Real Madrid Player Lineage & Football Intelligence App

An interactive, responsive HTML5 web application crafted specifically for football fans following Real Madrid in La Liga and the UEFA Champions League.

Built to solve the challenge of learning player names, their origins, countries, transfer lineage, debut memories, and tracking where recent departures (e.g. Toni Kroos, Nacho Fernández, Joselu, Karim Benzema) went next.

---

## 🌟 Key Features

### 1. 🏟️ Squad Explorer
- **26 Real Madrid Stars & Legends**: Current 2024/2025/2026 squad (Mbappé, Vinícius Jr, Bellingham, Valverde, Modrić, Rodrygo, Camavinga, Tchouaméni, Güler, Endrick, Carvajal, Rüdiger, Courtois, Lunin, Brahim, Militão), recent departures (Toni Kroos, Nacho, Joselu, Benzema, Casemiro), and modern legends (Cristiano Ronaldo, Sergio Ramos, Marcelo, Gareth Bale, Zinedine Zidane).
- **Instant Search & Multi-Filters**: Filter by Position (Forwards, Midfielders, Defenders, Goalkeepers), Status (Current Squad, Recent Departures, Club Legends), and Nationality (13+ nations).
- **Sort Options**: Sort by shirt number, player name, arrival year, or Madrid trophies won.

### 2. ⚡ Player Deep Dive Modal (6 Rich Tabs)
- **Overview & Cabinet**: Full player vitals, birthplace, height, foot, transfer fee, current club, and trophy list.
- **🗺️ Career Lineage Flow**: Visual node roadmap displaying:
  `[Youth Academy / Roots]` ➔ `[Senior Breakthrough Club]` ➔ `[Transfer Fees & Stats]` ➔ `[Real Madrid Debut & Era]` ➔ `[Destination Club if Departed]`.
- **🌟 Debut & Notable Matches**: Official first match for Real Madrid (opponent, date, competition, scoreline, minutes played, debut story) plus memorable clutch performances.
- **🏅 Records & Madridista Lore**: Incredible fun facts, locker-room lore, childhood stories, and club/international records.
- **📸 Photo Gallery**: Visual photo gallery with captions.

### 3. 🕸️ Interactive Lineage Mindmap
- **Force-Directed Network Graph**: Real Madrid C.F. at the center hub, branching out to **Scouting Nations**, **Feeder / Previous Clubs** (e.g. Flamengo, Monaco, Dortmund, Santos, Chelsea, Bayern), **Players**, and **Departure Hubs** (e.g. Al-Qadsiah, Al-Gharafa, Al-Ittihad, Manchester United, Retirement).
- **Interactive Controls**: Drag nodes, zoom in/out, pan, reset view, and click any player node to open their full profile.

### 4. 🧠 Madridista Memory Trainer (Flashcards & Quizzes)
- **3D Flip Flashcards**: Practice flipping cards (Front: photo, number, position ➔ Back: country flag, youth academy, career path, and key fact). Includes "Mark as Learned" progress tracker and shuffle deck.
- **Speed Quiz Challenges**:
  - *Guess the Country*: Identify which country each player represents.
  - *Guess from Career Lineage*: Guess the player based on their club journey (e.g. `Monaco ➔ PSG ➔ Real Madrid`).
  - *Shirt Number Matcher*: Match players to their shirt numbers.
  - Keeps score, tracks streaks, and provides explanations.

### 5. ⚖️ Head-to-Head Player Comparison
- Compare any two Madridistas side-by-side (stats, debut match, transfer fees, trophies, and full career paths).

### 6. 🔊 Interactive Audio Feedback
- Subtle, synthesized Web Audio sound effects for button clicks, correct answers, and errors (zero external audio dependencies, toggleable on/off).

---

## 🚀 How to Run the App

### Option A: Open directly in your browser
Simply double-click or open [index.html](file:///Users/alammd@zomato.com/zgit/sandbox/RM%20Lineage/index.html) in any modern web browser (Google Chrome, Safari, Firefox, Edge, etc.).

### Option B: Run a local static server
From this directory:
```bash
python3 -m http.server 8000
```
Then visit:
```
http://localhost:8000
```

---

## 📂 Project Structure

```
RM Lineage/
├── index.html          # Main application markup & view sections
├── css/
│   └── styles.css      # Royal Real Madrid dark & gold styling, animations, responsive design
├── js/
│   ├── data.js         # Comprehensive dataset for 26 players (lineage, debuts, records, lore)
│   ├── mindmap.js      # Force-directed HTML5 canvas interactive network engine
│   ├── quiz.js         # Memory trainer flashcard & quiz challenge engine
│   └── app.js          # Main UI controller, filters, modals, compare tool & sound synthesizer
└── README.md           # Documentation & user guide
```
