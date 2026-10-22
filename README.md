# Ball No Ledge

Real Madrid, player by player. A small static site for getting to know the squad: where each player came from, how their first game went, and where the ones who left ended up.

## What's in it

- **Squad** – the 2026-27 first team (numbers as announced in August 2026), recent former players and club legends. Search by name, country, club or shirt number; filter by position, status and country.
- **Player profiles** – bio, profile facts, Madrid stats and trophies, club-by-club career, debut and big games, records and stories.
- **Career map** – a network of every player, their country, the club Madrid signed them from and where former players went. Drag, zoom (wheel or pinch), tap a player to open their profile.
- **Learn** – flashcards (first team or everyone; "known" progress is saved in the browser) and a quiz: country, career path or shirt number.
- **Compare** – two players side by side.

## Data

Everything lives in `js/data.js`.

- Squad list, shirt numbers, signings and departures: updated October 2026 (`RM_DATA_UPDATED`).
- Madrid appearance/goal/trophy figures for players who were already at the club in 2024 were written in late 2024 (`RM_STATS_AS_OF`) and the UI marks them as out of date where that matters. Players added in 2026 have no Madrid stats yet and show a dash.
- Players without a photo in `images/players/` show an empty numbered slot.

### Adding a player photo

1. Save the photo as `images/players/<player-id>.jpg` and set `photo: "images/players/<player-id>.jpg"` on the player.
2. Generate the face-centred crop used on cards, flashcards and the map:

   ```bash
   pip install opencv-python-headless pillow
   python3 tools/make_headshots.py
   ```

   This writes `images/players/headshots/<player-id>.jpg`. If the face detector picks the wrong spot, add a manual box to `OVERRIDES` in the script.

## Running it

It's plain HTML/CSS/JS with no build step.

```bash
python3 -m http.server 8000
# or: npm start
```

Then open http://localhost:8000. Deploys to Vercel as-is (`vercel.json`).

## Layout

```
index.html            markup for all four sections and the profile panel
css/styles.css        all styling
js/data.js            players and shared constants
js/app.js             routing, squad grid, profile panel, learn and compare views
js/mindmap.js         career map (canvas, force layout)
js/quiz.js            flashcard deck and quiz question generation
tools/make_headshots.py   builds images/players/headshots/
```

Not affiliated with Real Madrid C.F.
