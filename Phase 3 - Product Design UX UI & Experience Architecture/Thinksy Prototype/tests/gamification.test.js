const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer, sessions } = require('../server');

test('Gamification, Authentication, Streaks, Coins and Leaderboard API tests', async t => {
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
    const raw = await response.text();
    return { response, data: JSON.parse(raw) };
  }

  try {
    await t.test('authenticates with Google and creates persistent user profile', async () => {
      const me = await json('/api/auth/me');
      assert.equal(me.response.status, 200);
      assert.ok(me.data.user);

      const login = await json('/api/auth/google', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Connor',
          email: 'sarah.connor@gmail.com',
          avatar: 'https://example.com/sarah.jpg'
        })
      });
      assert.equal(login.response.status, 200);
      assert.equal(login.data.user.name, 'Sarah Connor');
      assert.equal(login.data.user.email, 'sarah.connor@gmail.com');
      assert.equal(login.data.user.isGoogle, true);
      assert.match(login.data.user.friendCode, /^THINK-SARA-/);

      // Verify profile is persistent on session
      const meAfter = await json('/api/auth/me');
      assert.equal(meAfter.data.user.name, 'Sarah Connor');
    });

    await t.test('calculates friends and global leaderboards with standing microcopy', async () => {
      const lb = await json('/api/leaderboard');
      assert.equal(lb.response.status, 200);
      assert.ok(Array.isArray(lb.data.friends));
      assert.ok(Array.isArray(lb.data.global));
      assert.ok(lb.data.userRankFriends >= 1);
      assert.ok(typeof lb.data.standingNote === 'string');
      assert.match(lb.data.standingNote, /(ranked #1|points behind|Win one more match)/);

      // Current user is present in friends list
      const currentUserInFriends = lb.data.friends.find(p => p.isUser);
      assert.ok(currentUserInFriends);
      assert.equal(currentUserInFriends.name, 'Sarah Connor');
    });

    await t.test('handles rewards shop purchases, coin deductions, and equipping', async () => {
      const shop = await json('/api/shop');
      assert.equal(shop.response.status, 200);
      assert.ok(Array.isArray(shop.data.items));
      assert.ok(shop.data.items.length >= 3);

      // Purchase Cyberpunk Theme (cost: 200)
      const initialCoins = shop.data.coins;
      const buy = await json('/api/shop/purchase', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ itemId: 'theme_cyberpunk' })
      });
      assert.equal(buy.response.status, 200);
      assert.equal(buy.data.user.coins, initialCoins - 200);
      assert.ok(buy.data.user.unlockedThemes.includes('theme_cyberpunk'));

      // Cannot purchase again
      const buyAgain = await json('/api/shop/purchase', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ itemId: 'theme_cyberpunk' })
      });
      assert.equal(buyAgain.response.status, 400);
      assert.match(buyAgain.data.error, /already own/);

      // Equip purchased theme
      const equip = await json('/api/shop/equip', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'theme', value: 'theme_cyberpunk' })
      });
      assert.equal(equip.response.status, 200);
      assert.equal(equip.data.user.activeTheme, 'theme_cyberpunk');
    });

    await t.test('enforces winning criteria (score >= 3.0) and awards victory coins + streak', async () => {
      const started = await json('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'CLASSIC', difficulty: 'EASY' })
      });
      assert.equal(started.response.status, 200);

      const sid = cookie.split('=')[1];
      const session = sessions.get(sid);
      const userBeforeCoins = session.user.coins;
      const userBeforeWins = session.user.matchesWon;

      // Play 5 rounds: guess correctly 4 rounds, wrong on 1 round -> Score = 4.0 (>= 3.0 -> WIN)
      for (let r = 1; r <= 5; r++) {
        if (r > 1) {
          await json('/api/next', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{}'
          });
        }
        await json('/api/move', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ input: '1' })
        });

        const active = session.activeRound;
        const validWrong = active.puzzle.outputs.find(o => o !== active.answer);
        const guessAnswer = r <= 4 ? active.answer : validWrong; // 4 correct, 1 wrong
        const guessRes = await json('/api/guess', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ output: guessAnswer })
        });
        assert.equal(guessRes.response.status, 200);
        if (r === 5) {
          assert.equal(guessRes.data.matchDone, true);
          assert.equal(guessRes.data.won, true);
          assert.equal(guessRes.data.score, 4.0);
          assert.ok(guessRes.data.details);
          assert.equal(guessRes.data.details.roundsWon, 4);
          assert.equal(guessRes.data.details.roundsLost, 1);
          assert.ok(guessRes.data.details.coinsEarned >= 180); // 15 base + 80 correct + 100 victory
          assert.ok(session.user.coins > userBeforeCoins);
          assert.ok(session.user.matchesWon > userBeforeWins);
          assert.ok(session.user.dailyStreak >= 1);
        }
      }
    });

    await t.test('enforces losing criteria (score < 3.0) without victory bonus but rewards effort', async () => {
      const started = await json('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'CLASSIC', difficulty: 'EASY' })
      });
      assert.equal(started.response.status, 200);

      const sid = cookie.split('=')[1];
      const session = sessions.get(sid);

      // Play 5 rounds: only 2 correct, 3 wrong -> Score = 2.0 (< 3.0 -> LOSS)
      for (let r = 1; r <= 5; r++) {
        if (r > 1) {
          await json('/api/next', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{}'
          });
        }
        await json('/api/move', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ input: '1' })
        });

        const active = session.activeRound;
        const validWrong = active.puzzle.outputs.find(o => o !== active.answer);
        const guessAnswer = r <= 2 ? active.answer : validWrong;
        const guessRes = await json('/api/guess', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ output: guessAnswer })
        });
        assert.equal(guessRes.response.status, 200);
        if (r === 5) {
          assert.equal(guessRes.data.matchDone, true);
          assert.equal(guessRes.data.won, false);
          assert.equal(guessRes.data.score, 2.0);
          assert.ok(guessRes.data.details);
          assert.equal(guessRes.data.details.roundsWon, 2);
          assert.equal(guessRes.data.details.roundsLost, 3);
          // Effort reward: 15 base + 40 correct = 55 coins, but NO 100-coin victory bonus
          assert.equal(guessRes.data.details.coinsEarned, 55);
        }
      }
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
