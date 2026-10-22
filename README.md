# Ball No Ledge

Real Madrid, player by player. A small static site for getting to know the squad: where each player came from, how their first game went, and where the ones who left ended up.

## What's in it

- **Home** – a full-width photo of the Bernabéu (CC0, Wikimedia Commons; pick another with `tools/stadium.json`), the next fixture with a live countdown (or the live score during a game), a ticker of this season's results, season numbers and the faces of the squad.
- **Players** – the 2026-27 first team, 14 legends and every player with 40+ games since 2000 (120 profiles), plus a sortable table of all 260 players since 2000-01.
- **Seasons** – this season match by match with scorers, then every season since 2000-01: coach, finish, cup runs, trophies, top scorer.
- **Transfers** – a flow diagram from the country each player was signed from, through Madrid, to where they went. Press play to watch 2000–2026 year by year.
- **Play: Bernabéu Nights** – the quiz as a 90-minute match. Three levels (Academy, Galáctico, 92:48), ten mixed question types (faces, blurred photos, shirt numbers, transfers, arrival years, anagrams, missing letters, seasons, this season's scorers). Ten questions are ten shots: right answers are goals. Challenge a friend with a link that replays the same ten questions (their right answers become their goals), and share a 1080×1920 meme poster straight to Instagram Stories from a phone. Plus flashcards in the Training ground.
- **Compare** – any two players side by side.

## Keeping it live

| What | How | Needs |
| --- | --- | --- |
| Results, scorers, fixtures, appearances, career totals | *Refresh data* workflow runs every 2 hours, re-reads Wikipedia and rebuilds `js/history.js`; Vercel redeploys on each commit to `main` | nothing; runs once merged to `main` |
| Live score during a match | `api/live.js` (Vercel function) asks API-Football (every competition) or football-data.org (La Liga + Champions League), only from 15 min before kick-off to 2.5 h after, cached at the edge; the site polls it every minute while a game is on | a free key in Vercel → Project → Settings → Environment Variables: `API_FOOTBALL_KEY` (dashboard.api-football.com) or `FOOTBALL_DATA_TOKEN` (football-data.org), then redeploy. Check with `/api/live?force=1` |
| Next-match countdown | from the fixture list in `js/history.js` | nothing |

Without the key, everything works except the in-game live score; the home page shows the countdown instead.

## Data

| File | What | Where it comes from |
| --- | --- | --- |
| `js/data.js` | 38 hand-written profiles (bio, debut, big games, stories) | written by hand |
| `js/history.js` | all players since 2000, profiles, honours, seasons, 2026-27 stats | **generated** by `research/build_history.py` from Wikipedia |
| `js/season.js` | short notes for this season's matches | by hand (optional) |
| `js/players.js` | merges the above into one player list | |
| `images/players/` | photos, `credits.json` (author + licence), `headshots/` crops | **generated** by GitHub Actions |

### After a match

Nothing to do: the *Refresh data* workflow picks the result up from Wikipedia within a couple of hours of the page being updated. To force it: GitHub → Actions → *Refresh data* → Run workflow. Optionally add a one-line note for the match in `js/season.js`.

### Photos

Photos are freely licensed images from Wikimedia Commons, fetched by the *Player photos* workflow (`.github/workflows/player-photos.yml`): add `"player-id": "Wikipedia article"` to `tools/photo_manifest.json` and push. The job downloads the image, records the author and licence in `images/players/credits.json` (shown on each profile, as the licences require), and crops a face-centred headshot with `tools/make_headshots.py`. If a crop misses the face, add a manual box to `OVERRIDES` in that script. Players with no free photo on Commons show an illustrated shirt with their number or initials. If you own a photo (or have permission), save it as `images/players/<id>.jpg` and push; the job crops it.

## Running it

It's plain HTML/CSS/JS with no build step.

```bash
python3 -m http.server 8000
# or: npm start
```

Then open http://localhost:8000. Deploys to Vercel as-is (`vercel.json`).

## Layout

```
index.html                 markup for all views and the profile panel
css/styles.css             all styling and motion
js/app.js                  routing, home, players, seasons, profile panel, compare
js/game.js                 Bernabéu Nights quiz game, challenge links, story poster
js/motion.js               split-text reveals, tilt, trophy page transition, confetti
js/sound.js                synthesised sound effects and stadium music (Web Audio, off by default)
js/live.js                 live score polling and next-match countdown
js/routes.js               transfer map and year-by-year playback
js/quiz.js                 flashcard deck
api/live.js                Vercel function proxying API-Football or football-data.org
js/clubs.js                club -> country lookup for the transfer map
research/build_history.py  builds js/history.js from research/wiki/
tools/                     photo fetching and cropping, Wikipedia source fetching
```

Not affiliated with Real Madrid C.F.
