const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createServer, sessions } = require('../server');

test('Thinksy HTTP + frontend integration and usability smoke tests', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';

  const { Readable } = require('node:stream');
  const { EventEmitter } = require('node:events');

  function inMemoryDispatch(pathname, options = {}) {
    return new Promise((resolve) => {
      const req = new Readable({
        read() {
          if (options.body) this.push(options.body);
          this.push(null);
        }
      });
      req.url = pathname;
      req.method = options.method || 'GET';
      req.headers = {
        ...(options.headers || {}),
        ...(cookie ? { cookie } : {})
      };
      if (options.body && !req.headers['content-length']) {
        req.headers['content-length'] = String(Buffer.byteLength(options.body));
      }
      let resData = [];
      const resHeaders = {};
      const res = new EventEmitter();
      res.statusCode = 200;
      res.setHeader = (k, v) => { resHeaders[k.toLowerCase()] = v; };
      res.getHeader = (k) => resHeaders[k.toLowerCase()];
      res.writeHead = (status, headers = {}) => {
        res.statusCode = status;
        for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      };
      res.write = chunk => resData.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      res.end = chunk => {
        if (chunk) res.write(chunk);
        const buffer = Buffer.concat(resData);
        const bodyText = buffer.toString('utf8');
        const setCookie = resHeaders['set-cookie'];
        if (setCookie) {
          const val = Array.isArray(setCookie) ? setCookie[0] : setCookie;
          cookie = val.split(';')[0];
        }
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          headers: {
            get: (k) => resHeaders[k.toLowerCase()] || null
          },
          text: async () => bodyText,
          json: async () => JSON.parse(bodyText)
        });
      };
      server.emit('request', req, res);
    });
  }

  async function fetchWithSession(url, options = {}) {
    try {
      const response = await fetch(new URL(url, base), {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(cookie ? { cookie } : {})
        }
      });
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) cookie = setCookie.split(';')[0];
      return response;
    } catch {
      const pathname = typeof url === 'string' ? (url.startsWith('http') ? new URL(url).pathname : url) : (url.pathname || String(url));
      return await inMemoryDispatch(pathname, options);
    }
  }

  async function json(pathname, options) {
    const response = await fetchWithSession(pathname, options);
    const type = response.headers.get('content-type') || '';
    const raw = await response.text();
    assert.match(type, /application\/json/, `${pathname} must return JSON, not an HTML document`);
    return { response, data: JSON.parse(raw) };
  }

  try {
    await t.test('serves app shell and assets with correct content types', async () => {
      const home = await fetchWithSession('/');
      assert.equal(home.status, 200);
      assert.match(home.headers.get('content-type'), /text\/html/);
      assert.match(await home.text(), /Thinksy/);

      const js = await fetchWithSession('/app.js');
      assert.equal(js.status, 200);
      assert.match(js.headers.get('content-type'), /javascript/);
      assert.match(await js.text(), /Looks simple/);

      const css = await fetchWithSession('/styles.css');
      assert.equal(css.status, 200);
      assert.match(css.headers.get('content-type'), /text\/css/);
    });

    await t.test('health endpoint returns JSON and proves API is reachable', async () => {
      const { response, data } = await json('/api/health');
      assert.equal(response.status, 200);
      assert.deepEqual(data, { ok: true, service: 'thinksy-api', version: 1 });
    });

    await t.test('validates difficulty and returns correct clue budgets', async () => {
      const bad = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ difficulty: 'IMPOSSIBLE' })
      });
      assert.equal(bad.response.status, 400);
      assert.match(bad.data.error, /Easy, Medium or Hard/);

      for (const [difficulty, limit] of [['EASY', 7], ['MEDIUM', 10], ['HARD', 15]]) {
        const result = await json('/api/match', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ difficulty })
        });
        assert.equal(result.response.status, 200);
        assert.equal(result.data.difficulty, difficulty);
        assert.equal(result.data.limit, limit);
        assert.equal(result.data.remaining, limit);
        assert.equal(result.data.round, 1);
        assert.equal(result.data.puzzle.inputs.length, 16);
        assert.ok(result.data.puzzle.outputs.length >= 2);
      }
    });

    await t.test('supports Practice, Classic and Time Trial rules', async () => {
      const practice = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'PRACTICE', difficulty: 'HARD' })
      });
      assert.equal(practice.response.status, 200);
      assert.equal(practice.data.mode, 'PRACTICE');
      assert.equal(practice.data.difficulty, 'EASY');
      assert.equal(practice.data.limit, 7);
      assert.equal(practice.data.timeRemaining, null);

      const trial = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'TIME_TRIAL', difficulty: 'EASY' })
      });
      assert.equal(trial.response.status, 200);
      assert.equal(trial.data.mode, 'TIME_TRIAL');
      assert.equal(trial.data.difficulty, 'HARD');
      assert.equal(trial.data.limit, 15);
      assert.equal(trial.data.timeRemaining, 90);

      const classic = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'CLASSIC', difficulty: 'MEDIUM' })
      });
      assert.equal(classic.response.status, 200);
      assert.equal(classic.data.mode, 'CLASSIC');
      assert.equal(classic.data.difficulty, 'MEDIUM');
      assert.equal(classic.data.limit, 10);
      assert.equal(classic.data.timeRemaining, 120);
    });

    await t.test('ends a timed round when its server-side clock expires', async () => {
      const started = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'TIME_TRIAL' })
      });
      assert.equal(started.response.status, 200);
      const sid = cookie.split('=')[1];
      sessions.get(sid).roundStartedAt = Date.now() - 91_000;
      const timedOut = await json('/api/timeout', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}'
      });
      assert.equal(timedOut.response.status, 200);
      assert.equal(timedOut.data.roundDone, true);
      assert.equal(timedOut.data.result, 'TIMEOUT');
      assert.equal(timedOut.data.roundPoints, 0);
    });

    await t.test('enforces clue rules, duplicate protection, scoring and five-round match', async () => {
      const started = await json('/api/match', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ difficulty: 'HARD' })
      });
      assert.equal(started.response.status, 200);
      let match = started.data;

      const noGuess = await json('/api/guess', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ output: match.puzzle.outputs[0] })
      });
      assert.equal(noGuess.response.status, 400);

      const first = await json('/api/move', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: match.puzzle.inputs[0] })
      });
      assert.equal(first.response.status, 200);
      match = first.data;
      assert.equal(match.moves.length, 1);
      assert.equal(match.remaining, 14);

      const duplicate = await json('/api/move', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: match.puzzle.inputs[0] })
      });
      assert.equal(duplicate.response.status, 409);
      assert.match(duplicate.data.error, /already tested/);

      // The server owns the answer; retrieve it only from its in-memory test session.
      const sid = cookie.split('=')[1];
      const session = sessions.get(sid);
      for (let round = 1; round <= 5; round++) {
        if (round > 1) {
          const next = await json('/api/next', {
            method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}'
          });
          assert.equal(next.response.status, 200);
          match = next.data;
        }
        if (round > 1) {
          const clue = await json('/api/move', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ input: '1' })
          });
          assert.equal(clue.response.status, 200);
          match = clue.data;
        }
        const answer = session.activeRound.answer;
        const guess = await json('/api/guess', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ output: answer })
        });
        assert.equal(guess.response.status, 200);
        match = guess.data;
        assert.equal(match.result, 'CORRECT');
        assert.equal(match.roundDone, true);
      }
      assert.equal(match.matchDone, true);
      assert.equal(match.won, true);
      assert.equal(match.score, 5);
      assert.equal(match.round, 5);
    });

    await t.test('frontend renders, opens help, starts a real match and completes all rounds', async () => {
      const app = { innerHTML: '', addEventListener() {} };
      const guess = { value: '' };
      const document = {
        querySelector(selector) { return selector === '#app' ? app : selector === '#guess' ? guess : null; },
        addEventListener() {}
      };
      const context = {
        document,
        fetch: fetchWithSession,
        console, Date, Math, JSON, Array, String, Number, Boolean, Error, Set, Map, Promise, setTimeout
      };
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'), context);
      const run = async code => await vm.runInContext(code, context);

      assert.match(app.innerHTML, /Looks simple/);
      assert.match(app.innerHTML, /START PLAYING/);
      assert.match(app.innerHTML, /HOW TO PLAY/);
      assert.match(app.innerHTML, /UNKNOWN SYSTEM/);
      assert.match(app.innerHTML, /Try an input/);
      assert.doesNotMatch(app.innerHTML, /GAME MODE/);

      await run(`act({dataset:{act:'choose'}})`);
      assert.match(app.innerHTML, /Practice/);
      assert.match(app.innerHTML, /Classic/);
      assert.match(app.innerHTML, /Time Trial/);
      assert.match(app.innerHTML, /Easy/);
      assert.match(app.innerHTML, /Medium/);
      assert.match(app.innerHTML, /Hard/);
      assert.match(app.innerHTML, /START GAME/);

      await run(`act({dataset:{act:'help'}})`);
      assert.match(app.innerHTML, /THE GAME IN 30 SECONDS/);
      await run(`act({dataset:{act:'close-help'},classList:{contains:()=>false},closest:()=>({})})`);
      assert.doesNotMatch(app.innerHTML, /THE GAME IN 30 SECONDS/);

      await run(`act({dataset:{act:'mode',mode:'CLASSIC'}})`);
      await run(`act({dataset:{act:'level',level:'HARD'}})`);
      await run(`act({dataset:{act:'start'}})`);
      assert.equal(vm.runInContext('state.match.difficulty', context), 'HARD');
      assert.match(app.innerHTML, /The signal chamber/);

      const sid = cookie.split('=')[1];
      const session = sessions.get(sid);
      for (let round = 1; round <= 5; round++) {
        await run(`act({dataset:{act:'move',input:'1'}})`);
        assert.match(app.innerHTML, /USED/);
        assert.match(app.innerHTML, /disabled/);
        guess.value = session.activeRound.answer;
        await run(`act({dataset:{act:'guess'}})`);
        assert.equal(vm.runInContext('state.match.result', context), 'CORRECT');
        if (round < 5) await run(`act({dataset:{act:'next'}})`);
      }
      assert.equal(vm.runInContext('state.match.matchDone', context), true);
      assert.equal(vm.runInContext('state.match.won', context), true);
      assert.match(app.innerHTML, /MATCH COMPLETE/);
      assert.match(app.innerHTML, /BACK TO HOME/);
      assert.match(app.innerHTML, /ONE MORE MATCH/);

      // Verify opening Leaderboard modal from results screen
      await run(`act({dataset:{act:'open-leaderboard'}})`);
      assert.equal(vm.runInContext('state.leaderboardOpen', context), true);
      assert.match(app.innerHTML, /PLAY TO CLIMB/);

      // Verify PLAY TO CLIMB closes leaderboard modal and opens setup screen (play menu)
      await run(`act({dataset:{act:'choose'}})`);
      assert.equal(vm.runInContext('state.leaderboardOpen', context), false);
      assert.equal(vm.runInContext('state.screen', context), 'setup');
      assert.doesNotMatch(app.innerHTML, /PLAY TO CLIMB/);
      assert.match(app.innerHTML, /START GAME/);

      // Verify Profile -> Rewards Shop transitions cleanly without modal stacking
      await run(`act({dataset:{act:'open-profile'}})`);
      assert.equal(vm.runInContext('state.profileOpen', context), true);
      await run(`act({dataset:{act:'open-shop'}})`);
      assert.equal(vm.runInContext('state.shopOpen', context), true);
      assert.equal(vm.runInContext('state.profileOpen', context), false);

      // Verify closing shop cleanly
      await run(`act({dataset:{act:'close-shop'}})`);
      assert.equal(vm.runInContext('state.shopOpen', context), false);
    });

    await t.test('API client gives a helpful message instead of a DOCTYPE JSON parse error', async () => {
      const app = { innerHTML: '', addEventListener() {} };
      const document = { querySelector: () => app, addEventListener() {} };
      const htmlFetch = async () => new Response('<!doctype html><html><body>Preview fallback</body></html>', {
        status: 200, headers: { 'content-type': 'text/html' }
      });
      const context = { document, fetch: htmlFetch, console, Date, Math, JSON, Array, String, Number, Boolean, Error, Set, Map, Promise, setTimeout };
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'), context);
      let message = '';
      try { await vm.runInContext(`api('/api/match',{difficulty:'EASY'})`, context); }
      catch (error) { message = error.message; }
      assert.match(message, /HTML page instead of JSON/);
      assert.match(message, /npm start/);
      assert.doesNotMatch(message, /Unexpected token/);
    });


    await t.test('viewport layouts keep home, setup and game screens non-scrollable', () => {
      const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
      assert.match(css, /html, body \{ width: 100%; height: 100%; overflow: hidden; \}/);
      assert.match(css, /#app \{ width: 100%; height: 100dvh/);
      assert.match(css, /\.home-screen, \.setup-screen, \.game-screen \{ min-height: 0; height: calc\(100dvh[^}]*overflow: hidden/s);
      assert.match(css, /\.home-screen, \.setup-screen, \.game-screen \{ min-height: 0; height: calc\(100dvh/s);
      assert.match(css, /@media \(max-width: 720px\)/);
    });

    await t.test('client-side interactions cancel browser navigation and preserve the DOM tree', () => {
      const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
      assert.match(source, /event\.preventDefault\(\)/);
      assert.match(source, /function morphNode\(/);
      assert.match(source, /function morphChildren\(/);
      assert.match(source, /morphChildren\(app, template\.content\)/);
      assert.doesNotMatch(source, /location\.reload\(/);
    });

    await t.test('game interactions provide visible processing and pop transitions', () => {
      const js = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
      const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
      assert.match(js, /withFeedback\(api\('\/api\/move'/);
      assert.match(js, /THE MACHINE IS PROCESSING YOUR INPUT/);
      assert.match(js, /ui-pop-out/);
      assert.match(css, /@keyframes screen-pop/);
      assert.match(css, /@keyframes choice-pop/);
      assert.match(css, /@keyframes result-stamp/);
      assert.match(css, /@keyframes component-pop-out/);
      assert.match(css, /processing-pulse/);
    });

    await t.test('responsive and reduced-motion safeguards exist', () => {
      const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
      assert.match(css, /@media \(max-width: 720px\)/);
      assert.match(css, /@media \(max-width: 480px\)/);
      assert.match(css, /prefers-reduced-motion: reduce/);
      assert.match(css, /overflow-x: hidden/);
      assert.match(css, /grid-template-columns: 1fr/);
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
