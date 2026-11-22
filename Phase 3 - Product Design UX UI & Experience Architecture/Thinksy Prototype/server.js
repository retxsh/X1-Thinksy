const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'data', 'db.json');

const DIFFICULTY = {
  EASY: { limit: 7, seconds: 180 },
  MEDIUM: { limit: 10, seconds: 120 },
  HARD: { limit: 15, seconds: 90 }
};

const RULES = {
  EASY: [
    { title: 'The double signal', fn: n => n * 2 },
    { title: 'The offset machine', fn: n => n + 5 },
    { title: 'The triple pulse', fn: n => n * 3 },
    { title: 'The odd sequence', fn: n => n * 2 + 1 }
  ],
  MEDIUM: [
    { title: 'The compound signal', fn: n => n * 3 + 2 },
    { title: 'The square shift', fn: n => n * n + 1 },
    { title: 'The rising offset', fn: n => n * 2 + (n % 2 ? 3 : 1) },
    { title: 'The weighted sequence', fn: n => n * 4 - 3 }
  ],
  HARD: [
    { title: 'The quadratic chamber', fn: n => n * n + 2 * n + 1 },
    { title: 'The cubic signal', fn: n => n * n * n - 2 * n },
    { title: 'The modular cycle', fn: n => ((n * n * 3 + 7) % 97) + 10 },
    { title: 'The compound growth', fn: n => n * n * 2 + n * 3 + 1 }
  ]
};

// Database state management
let db = {
  users: {},
  friends: [],
  globalTop: [],
  shop: []
};

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      db = JSON.parse(raw);
    }
  } catch {
    // Keep in-memory defaults if file read fails
  }
}

function saveDb() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // In-memory fallback
  }
}

loadDb();

function getOrCreateUser(userId) {
  if (userId && db.users[userId]) return db.users[userId];
  const defaultUser = db.users['usr_google_default'];
  if (defaultUser) return defaultUser;

  const newUser = {
    id: 'usr_guest_' + crypto.randomBytes(4).toString('hex'),
    name: 'Guest Player',
    email: 'guest@thinksy.game',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    isGoogle: false,
    friendCode: 'THINK-GUEST-1',
    coins: 100,
    highScore: 0,
    dailyStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    matchesPlayed: 0,
    matchesWon: 0,
    totalPoints: 0,
    unlockedThemes: ['default'],
    activeTheme: 'default',
    unlockedAvatars: ['default'],
    activeAvatar: 'default',
    achievements: [],
    matchHistory: []
  };
  db.users[newUser.id] = newUser;
  saveDb();
  return newUser;
}

const sessions = new Map();

function buildPuzzle(difficulty, seed = 0) {
  const rules = RULES[difficulty] || RULES.EASY;
  const rule = rules[Math.abs(seed) % rules.length];
  const targetInput = 17;
  const answer = String(rule.fn(targetInput));
  const offsets = [-11, -5, -2, 3, 7, 13, 19];
  const outputs = [answer, ...offsets.map(n => String(Number(answer) + n))]
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => Number(a) - Number(b));
  const puzzle = {
    category: difficulty === 'EASY' ? 'FOUNDATION SYSTEMS' : difficulty === 'MEDIUM' ? 'PATTERN SYSTEMS' : 'COMPLEX SYSTEMS',
    title: 'The signal chamber',
    description: 'A deterministic machine transforms every input using one hidden rule. Build evidence before you make your call.',
    objective: `Predict the output for input ${targetInput}. Use experiments to uncover the system's rule.`,
    inputs: Array.from({ length: 16 }, (_, i) => String(i + 1)),
    outputs
  };
  return { puzzle, answer, ruleTitle: rule.title };
}

function makeRound(difficulty, seed, round) {
  const built = buildPuzzle(difficulty, seed + round * 3);
  return {
    puzzle: built.puzzle,
    answer: built.answer,
    ruleTitle: built.ruleTitle,
    moves: [],
    roundDone: false,
    result: null,
    roundPoints: 0
  };
}

function publicMatch(session) {
  const active = session.activeRound;
  const config = DIFFICULTY[session.difficulty];
  const timeRemaining = session.timerSeconds == null ? null : Math.max(0, session.timerSeconds - Math.floor((Date.now() - session.roundStartedAt) / 1000));
  return {
    mode: session.mode,
    difficulty: session.difficulty,
    timeRemaining,
    score: session.score,
    round: session.round,
    remaining: Math.max(0, config.limit - active.moves.length),
    limit: config.limit,
    moves: active.moves.map((move, index) => ({ number: index + 1, input: move.input, output: move.output })),
    roundDone: active.roundDone,
    matchDone: session.matchDone,
    puzzle: active.puzzle,
    user: session.user,
    ...(active.roundDone ? {
      result: active.result,
      roundPoints: active.roundPoints,
      answer: active.answer,
      ruleTitle: active.ruleTitle
    } : {}),
    ...(session.matchDone ? {
      won: session.won,
      details: session.matchResultDetails
    } : {})
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 32_768) {
        reject(Object.assign(new Error('Request body too large.'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(Object.assign(new Error('Request body must be valid JSON.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function send(res, status, payload, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(JSON.stringify(payload));
}

function getLeaderboardData(currentUser) {
  loadDb();
  // Build combined friends list with the current player
  const friendList = (db.friends || []).map(f => ({ ...f, isFriend: true, isUser: false }));
  const userEntry = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar,
    friendCode: currentUser.friendCode,
    coins: currentUser.coins,
    highScore: currentUser.highScore,
    dailyStreak: currentUser.dailyStreak,
    longestStreak: currentUser.longestStreak,
    matchesWon: currentUser.matchesWon,
    matchesPlayed: currentUser.matchesPlayed,
    totalPoints: currentUser.totalPoints,
    isFriend: true,
    isUser: true
  };

  const friendsSorted = [...friendList, userEntry].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.highScore !== a.highScore) return b.highScore - a.highScore;
    return b.dailyStreak - a.dailyStreak;
  });

  const userRankFriends = friendsSorted.findIndex(p => p.isUser) + 1;
  const leaderFriends = friendsSorted[0];

  let standingNote = '';
  if (userRankFriends === 1) {
    standingNote = '🏆 You are ranked #1 among your friends! Keep playing to defend your title.';
  } else if (userRankFriends === 2) {
    const diff = (leaderFriends.totalPoints - currentUser.totalPoints).toFixed(1);
    standingNote = `🔥 You are #2 among friends! Only ${diff} points behind ${leaderFriends.name.split(' ')[0]}.`;
  } else {
    const ahead = friendsSorted[userRankFriends - 2];
    const diff = (ahead.totalPoints - currentUser.totalPoints).toFixed(1);
    standingNote = `⚡ You are #${userRankFriends} among friends. Win one more match to overtake ${ahead.name.split(' ')[0]}!`;
  }

  const globalSorted = [...(db.globalTop || []), userEntry].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.dailyStreak - a.dailyStreak;
  });

  return {
    friends: friendsSorted,
    global: globalSorted.slice(0, 10),
    userRankFriends,
    standingNote
  };
}

function completeMatch(session) {
  const won = session.score >= 3.0;
  session.won = won;
  session.matchDone = true;

  const user = session.user;
  const prevHighScore = user.highScore || 0;
  const isNewHighScore = session.score > prevHighScore;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let streakIncremented = false;
  let streakReset = false;

  if (session.mode !== 'PRACTICE') {
    user.matchesPlayed = (user.matchesPlayed || 0) + 1;
    user.totalPoints = Number(((user.totalPoints || 0) + session.score).toFixed(1));

    if (won) {
      user.matchesWon = (user.matchesWon || 0) + 1;
      if (user.lastActiveDate === yesterday) {
        user.dailyStreak = (user.dailyStreak || 0) + 1;
        streakIncremented = true;
      } else if (user.lastActiveDate === today) {
        // Already active today; streak maintained
      } else {
        user.dailyStreak = 1;
        streakIncremented = true;
      }
      user.longestStreak = Math.max(user.longestStreak || 0, user.dailyStreak);
      user.lastActiveDate = today;
    } else {
      // Did not win match
      if (user.lastActiveDate !== today && user.lastActiveDate !== yesterday) {
        user.dailyStreak = 0;
        streakReset = true;
      }
    }

    if (isNewHighScore) {
      user.highScore = session.score;
    }
  }

  // Calculate Coin Economy Rewards
  const rewards = [];
  let coinsEarned = 0;

  if (session.mode !== 'PRACTICE') {
    // Base match participation
    const baseCoins = 15;
    rewards.push({ label: 'Match Participation', coins: baseCoins });
    coinsEarned += baseCoins;

    // Correct rounds bonus
    const roundsWon = session.roundSummary.filter(r => r.correct).length;
    if (roundsWon > 0) {
      const roundCoins = roundsWon * 20;
      rewards.push({ label: `${roundsWon} Correct System ${roundsWon === 1 ? 'Prediction' : 'Predictions'}`, coins: roundCoins });
      coinsEarned += roundCoins;
    }

    // Match victory bonus
    if (won) {
      const victoryCoins = 100;
      rewards.push({ label: 'Match Victory (Score ≥ 3.0)', coins: victoryCoins });
      coinsEarned += victoryCoins;
    }

    // High score celebration
    if (isNewHighScore) {
      const bestCoins = 50;
      rewards.push({ label: 'New Personal Best Score!', coins: bestCoins });
      coinsEarned += bestCoins;
    }

    // Daily streak reward
    if (streakIncremented && user.dailyStreak > 1) {
      const streakCoins = user.dailyStreak * 15;
      rewards.push({ label: `${user.dailyStreak}-Day Streak Extended`, coins: streakCoins });
      coinsEarned += streakCoins;
    }

    // Difficulty multiplier on Hard
    if (session.difficulty === 'HARD' && won) {
      const hardCoins = 60;
      rewards.push({ label: 'Hard Chamber Mastery Bonus', coins: hardCoins });
      coinsEarned += hardCoins;
    }

    user.coins = (user.coins || 0) + coinsEarned;
    saveDb();
  }

  const roundsWonCount = session.roundSummary.filter(r => r.correct).length;
  const totalClues = session.roundSummary.reduce((sum, r) => sum + r.cluesUsed, 0);

  session.matchResultDetails = {
    won,
    score: session.score,
    roundsWon: roundsWonCount,
    roundsLost: 5 - roundsWonCount,
    totalCluesUsed: totalClues,
    clueEfficiency: Number((session.score / Math.max(1, totalClues)).toFixed(2)),
    previousHighScore: prevHighScore,
    isNewHighScore,
    streakIncremented,
    streakReset,
    coinsEarned,
    rewards,
    roundSummary: session.roundSummary
  };
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const cookie = req.headers.cookie || '';
    let sid = cookie.split(';').map(x => x.trim()).find(x => x.startsWith('thinksy_sid='))?.split('=')[1];
    let session = sid ? sessions.get(sid) : null;
    const setCookie = !session;
    if (!session) {
      sid = crypto.randomBytes(18).toString('hex');
      session = {
        activeRound: null,
        mode: 'CLASSIC',
        difficulty: 'EASY',
        timerSeconds: 180,
        roundStartedAt: 0,
        score: 0,
        round: 0,
        matchDone: false,
        won: false,
        roundSummary: [],
        matchResultDetails: null,
        user: getOrCreateUser('usr_google_default'),
        seed: crypto.randomInt(1, 1_000_000)
      };
      sessions.set(sid, session);
    }
    const cookieHeader = setCookie ? { 'set-cookie': `thinksy_sid=${sid}; Path=/; HttpOnly; SameSite=Lax` } : {};

    try {
      if (req.method === 'GET' && url.pathname === '/api/health') {
        return send(res, 200, { ok: true, service: 'thinksy-api', version: 1 }, cookieHeader);
      }

      if (req.method === 'GET' && url.pathname === '/api/auth/me') {
        return send(res, 200, { ok: true, user: session.user }, cookieHeader);
      }

      if (req.method === 'GET' && url.pathname === '/api/leaderboard') {
        return send(res, 200, { ok: true, ...getLeaderboardData(session.user) }, cookieHeader);
      }

      if (req.method === 'GET' && url.pathname === '/api/shop') {
        loadDb();
        return send(res, 200, {
          ok: true,
          items: db.shop || [],
          coins: session.user.coins || 0,
          unlockedThemes: session.user.unlockedThemes || ['default', 'theme_arcade'],
          activeTheme: session.user.activeTheme || 'theme_arcade',
          unlockedAvatars: session.user.unlockedAvatars || ['default', 'avatar_logic'],
          activeAvatar: session.user.activeAvatar || 'avatar_logic',
          unlockedBadges: session.user.unlockedBadges || [],
          activeBadge: session.user.activeBadge || ''
        }, cookieHeader);
      }

      if ((req.method === 'GET' || req.method === 'HEAD') && (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/app.js' || url.pathname === '/styles.css' || url.pathname === '/favicon.svg')) {
        const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
        const mime = file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : file.endsWith('.svg') ? 'image/svg+xml' : 'text/html; charset=utf-8';
        const body = fs.readFileSync(path.join(ROOT, file));
        res.writeHead(200, { 'content-type': mime, 'cache-control': 'no-cache, no-store, must-revalidate', 'content-length': Buffer.byteLength(body), ...cookieHeader });
        if (req.method === 'HEAD') {
          res.end();
        } else {
          res.end(body);
        }
        return;
      }

      if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' }, cookieHeader);
      const body = await readBody(req);

      // Google Authentication route
      if (url.pathname === '/api/auth/google') {
        const name = String(body.name || 'Alex Chen').trim();
        const email = String(body.email || 'alex.chen@gmail.com').trim();
        const avatar = body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';
        
        let existingUser = Object.values(db.users).find(u => u.email === email);
        if (!existingUser) {
          const userId = 'usr_g_' + crypto.randomBytes(4).toString('hex');
          existingUser = {
            id: userId,
            name,
            email,
            avatar,
            isGoogle: true,
            friendCode: 'THINK-' + name.slice(0, 4).toUpperCase() + '-' + crypto.randomInt(10, 99),
            coins: 350,
            highScore: 4.5,
            dailyStreak: 3,
            longestStreak: 5,
            lastActiveDate: new Date().toISOString().slice(0, 10),
            matchesPlayed: 12,
            matchesWon: 9,
            totalPoints: 42.5,
            unlockedThemes: ['default', 'arcade'],
            activeTheme: 'default',
            unlockedAvatars: ['default'],
            activeAvatar: 'default',
            achievements: [],
            matchHistory: []
          };
          db.users[userId] = existingUser;
        } else {
          existingUser.name = name;
          existingUser.avatar = avatar;
          existingUser.isGoogle = true;
        }
        session.user = existingUser;
        saveDb();
        return send(res, 200, { ok: true, user: session.user }, cookieHeader);
      }

      if (url.pathname === '/api/auth/logout') {
        session.user = getOrCreateUser('usr_guest_demo');
        return send(res, 200, { ok: true, user: session.user }, cookieHeader);
      }

      if (url.pathname === '/api/friends/add') {
        const code = String(body.code || '').trim().toUpperCase();
        return send(res, 200, { ok: true, message: `Friend ${code || 'player'} connected to your leaderboard!` }, cookieHeader);
      }

      if (url.pathname === '/api/shop/purchase') {
        const itemId = String(body.itemId || '');
        const item = (db.shop || []).find(i => i.id === itemId);
        if (!item) return send(res, 404, { error: 'Item not found in rewards catalog.' }, cookieHeader);

        const alreadyOwned = (item.type === 'theme' && (session.user.unlockedThemes || []).includes(item.id)) ||
                            (item.type === 'avatar' && (session.user.unlockedAvatars || []).includes(item.id)) ||
                            (item.type === 'badge' && (session.user.unlockedBadges || []).includes(item.id));
        if (alreadyOwned) {
          return send(res, 400, { error: 'You already own this reward item.' }, cookieHeader);
        }

        if ((session.user.coins || 0) < item.cost) {
          return send(res, 400, { error: `Not enough coins. You need ${item.cost} coins (Balance: ${session.user.coins || 0}).` }, cookieHeader);
        }
        session.user.coins -= item.cost;
        if (item.type === 'theme') {
          session.user.unlockedThemes = session.user.unlockedThemes || ['default'];
          if (!session.user.unlockedThemes.includes(item.id)) session.user.unlockedThemes.push(item.id);
          session.user.activeTheme = item.id;
        } else if (item.type === 'avatar') {
          session.user.unlockedAvatars = session.user.unlockedAvatars || ['default'];
          if (!session.user.unlockedAvatars.includes(item.id)) session.user.unlockedAvatars.push(item.id);
          session.user.activeAvatar = item.id;
        } else if (item.type === 'badge') {
          session.user.unlockedBadges = session.user.unlockedBadges || [];
          if (!session.user.unlockedBadges.includes(item.id)) session.user.unlockedBadges.push(item.id);
          session.user.activeBadge = item.id;
        }
        saveDb();
        return send(res, 200, { ok: true, user: session.user, item }, cookieHeader);
      }

      if (url.pathname === '/api/shop/equip') {
        const value = String(body.value || body.itemId || '');
        const type = String(body.type || 'theme');
        if (type === 'theme') session.user.activeTheme = value;
        if (type === 'avatar') session.user.activeAvatar = value;
        if (type === 'badge') session.user.activeBadge = value;
        saveDb();
        return send(res, 200, { ok: true, user: session.user }, cookieHeader);
      }

      if (url.pathname === '/api/match') {
        const mode = String(body.mode || 'CLASSIC').toUpperCase();
        if (!['PRACTICE', 'CLASSIC', 'TIME_TRIAL'].includes(mode)) return send(res, 400, { error: 'Choose Practice, Classic or Time Trial.' }, cookieHeader);
        let difficulty = String(body.difficulty || 'EASY').toUpperCase();
        if (mode === 'PRACTICE') difficulty = 'EASY';
        if (mode === 'TIME_TRIAL') difficulty = 'HARD';
        if (!DIFFICULTY[difficulty]) return send(res, 400, { error: 'Choose Easy, Medium or Hard.' }, cookieHeader);
        session.mode = mode;
        session.difficulty = difficulty;
        session.timerSeconds = mode === 'PRACTICE' ? null : DIFFICULTY[difficulty].seconds;
        session.seed = crypto.randomInt(1, 1_000_000);
        session.score = 0;
        session.round = 1;
        session.matchDone = false;
        session.won = false;
        session.roundSummary = [];
        session.matchResultDetails = null;
        session.roundStartedAt = Date.now();
        session.activeRound = makeRound(difficulty, session.seed, session.round);
        return send(res, 200, publicMatch(session), cookieHeader);
      }

      if (!session.activeRound) return send(res, 409, { error: 'No active match. Start a new game.' }, cookieHeader);
      if (url.pathname === '/api/exit') {
        session.activeRound = null;
        session.matchDone = false;
        return send(res, 200, { ok: true }, cookieHeader);
      }
      if (session.matchDone) return send(res, 409, { error: 'This match is complete. Start another match.' }, cookieHeader);

      const timeExpired = session.timerSeconds != null && Date.now() - session.roundStartedAt >= session.timerSeconds * 1000;
      if (url.pathname === '/api/timeout') {
        if (!timeExpired) return send(res, 409, { error: 'The round timer has not expired.' }, cookieHeader);
        if (!session.activeRound.roundDone) {
          session.activeRound.roundDone = true;
          session.activeRound.result = 'TIMEOUT';
          session.activeRound.roundPoints = 0;
          session.roundSummary.push({
            round: session.round,
            correct: false,
            points: 0,
            cluesUsed: session.activeRound.moves.length,
            userGuess: 'TIMEOUT',
            answer: session.activeRound.answer,
            ruleTitle: session.activeRound.ruleTitle
          });
          if (session.round === 5) {
            completeMatch(session);
          }
        }
        return send(res, 200, publicMatch(session), cookieHeader);
      }
      if (timeExpired && !session.activeRound.roundDone) {
        session.activeRound.roundDone = true;
        session.activeRound.result = 'TIMEOUT';
        session.activeRound.roundPoints = 0;
        session.roundSummary.push({
          round: session.round,
          correct: false,
          points: 0,
          cluesUsed: session.activeRound.moves.length,
          userGuess: 'TIMEOUT',
          answer: session.activeRound.answer,
          ruleTitle: session.activeRound.ruleTitle
        });
        if (session.round === 5) {
          completeMatch(session);
        }
        return send(res, 409, { error: 'Time is up. The round has ended.' }, cookieHeader);
      }

      if (url.pathname === '/api/move') {
        const input = String(body.input ?? '');
        if (!session.activeRound.puzzle.inputs.includes(input)) return send(res, 400, { error: 'Choose one of the available inputs.' }, cookieHeader);
        if (session.activeRound.roundDone) return send(res, 409, { error: 'This round is already complete.' }, cookieHeader);
        if (session.activeRound.moves.some(move => move.input === input)) return send(res, 409, { error: 'You already tested that input. Choose a new experiment.' }, cookieHeader);
        if (session.activeRound.moves.length >= DIFFICULTY[session.difficulty].limit) return send(res, 409, { error: 'You have used all available clues. Make your prediction.' }, cookieHeader);
        const numericInput = Number(input);
        session.activeRound.moves.push({ input, output: ruleOutput(session.difficulty, session.seed + session.round * 3, numericInput) });
        return send(res, 200, publicMatch(session), cookieHeader);
      }

      if (url.pathname === '/api/guess') {
        if (session.activeRound.roundDone) return send(res, 409, { error: 'This round is already complete.' }, cookieHeader);
        if (!session.activeRound.moves.length) return send(res, 400, { error: 'Run at least one experiment before predicting.' }, cookieHeader);
        const output = String(body.output ?? '');
        if (!session.activeRound.puzzle.outputs.includes(output)) return send(res, 400, { error: 'Choose one of the listed outputs.' }, cookieHeader);
        const correct = output === session.activeRound.answer;
        const limit = DIFFICULTY[session.difficulty].limit;
        const points = correct ? (session.activeRound.moves.length <= Math.floor(limit / 2) ? 1 : 0.5) : 0;
        session.activeRound.roundDone = true;
        session.activeRound.result = correct ? 'CORRECT' : 'INCORRECT';
        session.activeRound.roundPoints = points;
        session.score += points;

        session.roundSummary.push({
          round: session.round,
          correct,
          points,
          cluesUsed: session.activeRound.moves.length,
          userGuess: output,
          answer: session.activeRound.answer,
          ruleTitle: session.activeRound.ruleTitle
        });

        if (session.round === 5) {
          completeMatch(session);
        }
        return send(res, 200, publicMatch(session), cookieHeader);
      }

      if (url.pathname === '/api/next') {
        if (!session.activeRound.roundDone) return send(res, 409, { error: 'Finish the current round before continuing.' }, cookieHeader);
        if (session.round >= 5) return send(res, 409, { error: 'The match is already complete.' }, cookieHeader);
        session.round += 1;
        session.roundStartedAt = Date.now();
        session.activeRound = makeRound(session.difficulty, session.seed, session.round);
        return send(res, 200, publicMatch(session), cookieHeader);
      }

      return send(res, 404, { error: 'Unknown game endpoint.' }, cookieHeader);
    } catch (error) {
      return send(res, error.status || 500, { error: error.message || 'Unexpected server error.' }, cookieHeader);
    }
  });
}

function ruleOutput(difficulty, seed, input) {
  const rules = RULES[difficulty] || RULES.EASY;
  const rule = rules[Math.abs(seed) % rules.length];
  return String(rule.fn(input));
}

if (require.main === module) {
  const defaultPort = Number(process.env.PORT || 3000);
  const startServer = (p) => {
    const serverInstance = createServer();
    serverInstance.once('error', err => {
      if (err.code === 'EADDRINUSE' && !process.env.PORT && p < 3010) {
        process.stdout.write(`Port ${p} in use, trying port ${p + 1}...\n`);
        startServer(p + 1);
      } else {
        process.stderr.write(`Failed to start on port ${p}: ${err.message}\n`);
        process.exit(1);
      }
    });
    serverInstance.listen(p, () => {
      process.stdout.write(`Thinksy running at http://localhost:${p}\n`);
    });
  };
  startServer(defaultPort);
}

module.exports = { createServer, buildPuzzle, DIFFICULTY, sessions };
