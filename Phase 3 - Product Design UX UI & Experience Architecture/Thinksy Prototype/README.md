# Thinksy

A responsive, single-page deterministic reasoning game. Thinksy is designed around a viewport-first layout: the home, setup, and match screens fit the available screen height and do not use nested scroll areas.

## Run locally

Requirements: Node.js 18 or newer. No third-party npm packages are required.

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Do not open `index.html` directly or use a static-only preview. The game requires the included Node server for its `/api/*` endpoints.

## Player flow

1. **Home:** the animated machine simulation and How to Play guide are visible on the first screen.
2. **Start Playing:** opens a separate match-setup screen.
3. **Choose a mode:**
   - **Practice:** untimed, Easy clue set, 7 clues.
   - **Classic:** five-round match; choose Easy, Medium, or Hard.
   - **Time Trial:** Hard difficulty, 90 seconds per round.
4. **Choose difficulty:** Classic offers all three levels:
   - Easy — 7 clues, 3 minutes per round.
   - Medium — 10 clues, 2 minutes per round.
   - Hard — 15 clues, 90 seconds per round.
5. **Start Game:** enters the match only after mode and difficulty are selected.

The timer is enforced by the server for timed modes. Practice has no timer.

## Tests

```bash
npm test
```

The test suite covers the HTTP API, game rules, all three modes, server-side timeout handling, the home-to-setup-to-match flow, responsive viewport layout rules, and no-reload navigation.

## Project files

- `index.html` — app shell
- `styles.css` — visual system, animation, and responsive viewport layouts
- `app.js` — client-side screen flow and interactions
- `server.js` — game API, puzzle rules, scoring, and timers
- `tests/app.test.js` — integration and usability tests
- `QA_REPORT.md` — latest verification notes
