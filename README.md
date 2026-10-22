# Ball No Ledge

Real Madrid, player by player. A small static site for getting to know the squad: where each player came from, how their first game went, and where the ones who left ended up.

## What's in it

- **Players** – the 2026-27 first team, 14 club legends and every other player with 40+ games since 2000 (120 profiles), plus a sortable table of all 260 players who have played for Madrid since 2000-01. Search, filter by position, status and country.
- **Player profiles** – bio, Madrid games/goals/assists (all competitions, up to date), honours, caps, club-by-club career, and for the hand-written profiles the debut, big games, records and stories. Current players also show their 2026-27 numbers.
- **Seasons** – this season match by match with scorers, goals and appearance leaders; then every season since 2000-01 with coach, league finish, cup runs, trophies and top scorer.
- **Transfers** – a flow diagram from the country each player was signed from, through Madrid, to where they went next. Filter by decade and position, search a player, tap a country or band to list the players.
- **Learn** – flashcards and a quiz (country, career path, shirt number).
- **Compare** – any two players side by side.

## Data

| File | What | Where it comes from |
| --- | --- | --- |
| `js/data.js` | 38 hand-written profiles (bio, debut, big games, stories) | written by hand |
| `js/history.js` | all players since 2000, profiles, honours, seasons, 2026-27 stats | **generated** by `research/build_history.py` from Wikipedia |
| `js/season.js` | 2026-27 results with scorers | updated by hand after each match |
| `js/players.js` | merges the above into one player list | |
| `images/players/` | photos, `credits.json` (author + licence), `headshots/` crops | **generated** by GitHub Actions |

### Updating after a match

1. Add the match to `RM_SEASON_MATCHES` in `js/season.js` and bump `RM_SEASON_UPDATED`.
2. Re-run the Wikipedia job for fresh totals: GitHub → Actions → *Wikipedia sources* → Run workflow (it commits to `research/wiki/`), pull, then `python3 research/build_history.py`.

### Photos

Photos are freely licensed images from Wikimedia Commons, fetched by the *Player photos* workflow (`.github/workflows/player-photos.yml`): add `"player-id": "Wikipedia article"` to `tools/photo_manifest.json` and push. The job downloads the image, records the author and licence in `images/players/credits.json` (shown on each profile, as the licences require), and crops a face-centred headshot with `tools/make_headshots.py`. If a crop misses the face, add a manual box to `OVERRIDES` in that script. Players with no free photo on Commons show their initials or shirt number.

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
js/app.js                  routing, players, seasons, profile panel, learn, compare
js/routes.js               transfer map (SVG flow diagram)
js/quiz.js                 flashcards and quiz questions
js/clubs.js                club -> country lookup for the transfer map
research/build_history.py  builds js/history.js from research/wiki/
tools/                     photo fetching and cropping, Wikipedia source fetching
```

Not affiliated with Real Madrid C.F.
