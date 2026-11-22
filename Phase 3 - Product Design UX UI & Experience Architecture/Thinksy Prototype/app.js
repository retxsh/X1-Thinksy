const app = document.querySelector('#app');

const defaultUser = {
  id: 'usr_default',
  name: 'Alex Chen',
  email: 'alex.chen@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  friendCode: 'THINK-ALEX-42',
  coins: 350,
  highScore: 4.5,
  dailyStreak: 3,
  longestStreak: 5,
  matchesPlayed: 12,
  matchesWon: 9,
  totalPoints: 42.5,
  unlockedThemes: ['default', 'arcade'],
  activeTheme: 'default',
  unlockedAvatars: ['default'],
  activeAvatar: 'default',
  isGoogle: true
};

const state = {
  screen: 'home',
  mode: 'CLASSIC',
  difficulty: 'EASY',
  loadingProgress: 0,
  loadingStatus: 'Connecting to neural logic core…',
  timerTick: null,
  activePane: 'investigate',
  match: null,
  selectedGuess: '',
  busy: false,
  busyAction: '',
  error: '',
  helpOpen: false,
  authOpen: false,
  profileOpen: false,
  leaderboardOpen: false,
  leaderboardTab: 'friends',
  shopOpen: false,
  copiedCode: false,
  user: { ...defaultUser },
  leaderboardData: null,
  shopData: null
};

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

// Keep the feedback animation perceptible while remaining snappy and responsive.
const withFeedback = promise => Promise.all([
  promise,
  new Promise(resolve => setTimeout(resolve, 80))
]).then(([result]) => result);

async function api(path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw Error('Cannot reach the Thinksy game server. Start the app with `npm start`, then open http://localhost:3000.');
  }

  const contentType = response.headers?.get?.('content-type') || '';
  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    if (raw.trimStart().startsWith('<!doctype') || raw.trimStart().startsWith('<html')) {
      throw Error('The game API returned an HTML page instead of JSON. You are likely using a static preview. Run Thinksy with `npm start` and open http://localhost:3000.');
    }
    throw Error('The game server returned an invalid response. Restart it with `npm start` and try again.');
  }

  if (!contentType.includes('application/json')) {
    throw Error('The game server response is misconfigured. Please restart Thinksy with `npm start`.');
  }
  if (!response.ok) throw Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

function header() {
  const user = state.user;
  return `
    <header class="site-header">
      <div class="header-left">
        <a class="brand" href="#" data-act="home" aria-label="Thinksy home">thinksy<span>.</span></a>
        <div class="header-center"><span class="status-dot"></span> A GAME OF HIDDEN RULES</div>
      </div>
      <div class="header-actions">
        <button class="nav-pill streak-pill" data-act="open-profile" title="Active Streak: ${user.dailyStreak} days">
          <span class="flame-icon">🔥</span>
          <span class="streak-text">${user.dailyStreak}d</span>
        </button>
        <button class="nav-pill coins-pill" data-act="open-shop" title="Coin Balance: ${user.coins} coins">
          <span class="coin-icon">🪙</span>
          <span class="coins-text">${user.coins}</span>
        </button>
        <button class="header-btn leaderboard-btn" data-act="open-leaderboard" aria-label="Open leaderboard">
          <span class="trophy-icon">🏆</span>
          <span class="btn-label">RANKS</span>
        </button>
        <button class="header-help" data-act="help" aria-label="How to play">HOW TO PLAY <span>↗</span></button>
        ${user.isGoogle ? `
          <button class="profile-pill-btn" data-act="open-profile" aria-label="User profile">
            <span class="avatar-letter">${user.name.charAt(0)}</span>
            <span class="profile-name">${esc(user.name.split(' ')[0])}</span>
          </button>
        ` : `
          <button class="google-auth-btn" data-act="open-auth" aria-label="Sign in with Google">
            <svg class="google-icon" viewBox="0 0 24 24" width="13" height="13"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>SIGN IN</span>
          </button>
        `}
      </div>
    </header>`;
}

function streakBar() {
  const user = state.user;
  const current = user.dailyStreak || 0;
  const longest = user.longestStreak || 0;
  const milestone = current < 3 ? 3 : current < 5 ? 5 : current < 7 ? 7 : current < 14 ? 14 : 30;
  const progressPercent = Math.min(100, Math.round((current / milestone) * 100));

  return `
    <section class="streak-bar-banner" role="region" aria-label="Daily streak status" data-act="open-profile" style="cursor: pointer;" title="View daily streak details in Profile">
      <div class="streak-bar-left">
        <span class="streak-flame">🔥</span>
        <div class="streak-metrics">
          <div class="streak-badge-row">
            <strong class="streak-count-title">${current}-DAY STREAK</strong>
            <span class="streak-best-badge">BEST: ${longest}d</span>
          </div>
          <p class="streak-subtitle">${current > 0 ? `Complete a match today to maintain your streak and reach the ${milestone}-day milestone!` : 'Play a match to ignite your daily streak and earn +100 bonus coins!'}</p>
        </div>
      </div>
      <div class="streak-bar-right">
        <div class="streak-target-label">
          <span>PROGRESS</span>
          <b>${current} / ${milestone} DAYS</b>
        </div>
        <div class="streak-track">
          <div class="streak-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    </section>`;
}

function home() {
  return `
    <main class="home-screen">
      <section class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span> OBSERVE&nbsp; · &nbsp;EXPERIMENT&nbsp; · &nbsp;INFER</div>
        <h1>Looks simple.<br><span class="headline-accent">Thinks deep.</span></h1>
        <p class="hero-lead">A tiny game for your big brain.</p>
        <p class="hero-description">There’s a hidden rule behind every machine. Test what goes in, study what comes out, and figure out the logic before your clues run out.</p>
        <div class="hero-actions">
          <button class="primary primary-large" data-act="start"><span>START PLAYING</span><span class="button-arrow">↗</span></button>
          <button class="secondary-action" data-act="choose"><span class="config-icon">⚙</span> Match Setup</button>
          <button class="secondary-action" data-act="help"><span class="play-icon">▶</span> How to play</button>
        </div>
        ${streakBar()}
        <div class="hero-meta"><span><i class="meta-check">✓</i> 5 quick rounds</span><span><i class="meta-check">✓</i> No downloads</span><span><i class="meta-check">✓</i> Just your brain</span></div>
      </section>
      <section class="hero-visual" aria-label="Animated hidden-rule machine simulation">
        <div class="visual-topline"><span>THINKSY / SYSTEM 001</span><span class="live-label"><i></i> SYSTEM ONLINE</span></div>
        <div class="machine-stage">
          <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div>
          <span class="orbit-node node-a"></span><span class="orbit-node node-b"></span><span class="orbit-node node-c"></span>
          <div class="machine-card"><div class="machine-card-top"><span>UNKNOWN SYSTEM</span><span class="machine-dots">•••</span></div><div class="machine-symbol">⌁</div><div class="machine-card-bottom"><span class="pulse-bar"></span><span>SYSTEM ACTIVE</span></div></div>
          <div class="float-chip chip-input"><small>INPUT</small><b>2, 4, 6</b><span class="chip-signal">↗</span></div>
          <div class="float-chip chip-output"><small>OUTPUT</small><b>···</b><span class="chip-signal">✳</span></div>
          <div class="float-note"><span class="note-spark">✦</span><span>Every clue<br>gets you closer.</span></div>
        </div>
        <div class="visual-bottomline"><span>INPUT <b>→</b> PROCESS <b>→</b> OUTPUT</span><span>CRACK THE LOGIC</span></div>
      </section>
      <section class="how-strip home-how">
        <div class="how-title"><span class="eyebrow">HOW TO PLAY</span><b>Three steps.<br><i>One hidden rule.</i></b></div>
        <div class="how-step"><span>01</span><b>Try an input</b><small>Feed the machine.</small></div>
        <div class="how-step"><span>02</span><b>Spot pattern</b><small>Compare your clues.</small></div>
        <div class="how-step"><span>03</span><b>Make call</b><small>Score > 3 to win.</small></div>
      </section>
      <footer class="home-footer"><span>THINKSY<span class="footer-mark">.</span> A LITTLE GAME FOR CURIOUS MINDS.</span><span>SCORE > 3 TO WIN</span></footer>
    </main>`;
}

function setup() {
  const modes = [
    { value: 'PRACTICE', name: 'Practice', tag: 'LEARN THE MACHINE', note: 'Untimed · 7 clues · Easy set', icon: '○', detail: 'Explore the rules at your own pace.' },
    { value: 'CLASSIC', name: 'Classic', tag: 'THE ORIGINAL MATCH', note: '3 min / 2 min / 90 sec', icon: '⌘', detail: 'Five rounds. Choose your difficulty.' },
    { value: 'TIME_TRIAL', name: 'Time Trial', tag: 'BEAT THE CLOCK', note: 'Hard · 90 seconds / round', icon: '✳', detail: 'A fast, focused challenge.' }
  ];
  const levels = [
    { value: 'EASY', name: 'Easy', clues: '7 clues', time: '3:00', note: 'Warm up your logic', icon: '○' },
    { value: 'MEDIUM', name: 'Medium', clues: '10 clues', time: '2:00', note: 'Find the pattern', icon: '⌘' },
    { value: 'HARD', name: 'Hard', clues: '15 clues', time: '1:30', note: 'Think in systems', icon: '✳' }
  ];
  const mode = state.mode;
  const isPractice = mode === 'PRACTICE';
  const isTrial = mode === 'TIME_TRIAL';
  return `
    <main class="setup-screen">
      <div class="setup-topline"><button class="back-home" data-act="home">← BACK</button><span class="game-session">THINKSY / MATCH SETUP</span><span class="setup-step">01 <i>/</i> 02</span></div>
      <section class="setup-heading"><p class="eyebrow"><span class="eyebrow-line"></span> YOUR GAME, YOUR RULES</p><h1>Choose how<br><em>you want to play.</em></h1><p>Pick a mode, set your difficulty, then enter the machine.</p></section>
      ${streakBar()}
      <section class="mode-section"><div class="setup-section-head"><span>01 / GAME MODE</span><small>SELECT ONE</small></div>
        <div class="mode-options">${modes.map(item => `<button class="mode-card ${mode === item.value ? 'is-selected' : ''}" data-act="mode" data-mode="${item.value}" aria-pressed="${mode === item.value}"><span class="mode-icon">${item.icon}</span><span class="mode-copy"><b>${item.name}</b><small>${item.tag}</small><small class="mode-note">${item.note}</small></span><span class="mode-check">✓</span><span class="mode-detail">${item.detail}</span></button>`).join('')}</div>
      </section>
      <section class="level-section"><div class="setup-section-head"><span>02 / DIFFICULTY</span><small>${isPractice ? 'PRACTICE USES THE EASY CLUE SET' : isTrial ? 'TIME TRIAL IS LOCKED TO HARD' : 'CHOOSE YOUR LEVEL'}</small></div>
        <div class="level-options">${levels.map(level => {
          const selected = isPractice ? level.value === 'EASY' : isTrial ? level.value === 'HARD' : state.difficulty === level.value;
          const disabled = isPractice || isTrial;
          return `<button class="level-card ${selected ? 'is-selected' : ''} ${disabled ? 'is-locked' : ''}" data-act="level" data-level="${level.value}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}><span class="level-symbol">${level.icon}</span><span class="level-name">${level.name}</span><span class="level-meta">${level.clues} <i>·</i> ${isPractice ? 'NO TIMER' : level.time}</span><span class="level-check">✓</span></button>`;
        }).join('')}</div>
      </section>
      <div class="setup-footer"><div class="setup-summary"><span class="status-dot"></span><span>${isPractice ? 'PRACTICE MODE · UNTIMED' : isTrial ? 'TIME TRIAL · HARD · 90 SEC' : `CLASSIC MODE · ${state.difficulty} · ${state.difficulty === 'EASY' ? '3 MIN' : state.difficulty === 'MEDIUM' ? '2 MIN' : '90 SEC'}`}</span></div><button class="primary setup-start" data-act="start" ${state.busy ? 'disabled' : ''}>${state.busy ? 'STARTING…' : 'START GAME'} <span>↗</span></button></div>
    </main>`;
}

function loadingScreen() {
  const pct = state.loadingProgress || 0;
  return `
    <main class="loading-screen" role="region" aria-label="Loading game">
      <div class="loading-box">
        <div class="loading-spinner"></div>
        <h2>Starting match…</h2>
        <p class="loading-sub">Preparing the signal chamber</p>
        <div class="loading-bar">
          <div class="loading-bar-inner" style="width: ${pct}%;"></div>
        </div>
        <span class="loading-timer">4.7s</span>
      </div>
    </main>`;
}

function helpModal() {
  return `
    <div class="veil" data-act="close-help">
      <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" data-dialog>
        <button class="modal-close" data-act="close-help" aria-label="Close">×</button>
        <p class="eyebrow">THE GAME IN 30 SECONDS</p>
        <h2 id="help-title">Three steps.<br><span>One hidden rule.</span></h2>
        <div class="help-steps">
          <div class="help-step"><span class="help-number">01</span><div><b>Feed the machine</b><p>Choose an input. See what comes out.</p></div><span class="help-symbol">↗</span></div>
          <div class="help-step"><span class="help-number">02</span><div><b>Connect the dots</b><p>Compare clues to spot the pattern.</p></div><span class="help-symbol">⌁</span></div>
          <div class="help-step"><span class="help-number">03</span><div><b>Lock in your answer</b><p>Predict output. Score > 3 to win.</p></div><span class="help-symbol">✳</span></div>
        </div>
        <div class="help-bottom"><span>SCORE > 3 TO WIN · 5 ROUNDS</span><button class="primary" data-act="close-help">GOT IT, LET’S PLAY <span>↗</span></button></div>
      </section>
    </div>`;
}

function authModal() {
  return `
    <div class="veil" data-act="close-auth">
      <section class="auth-modal modal-box" role="dialog" aria-modal="true" aria-labelledby="auth-title" data-dialog>
        <button class="modal-close" data-act="close-auth" aria-label="Close">×</button>
        <div class="modal-header">
          <div class="google-badge-icon">
            <svg viewBox="0 0 24 24" width="28" height="28"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          </div>
          <p class="eyebrow">GOOGLE AUTHENTICATION</p>
          <h2 id="auth-title">Sign in to Thinksy</h2>
          <p class="modal-intro">Sync your daily streak, unlock coins, track your personal best, and compete on the friends leaderboard.</p>
        </div>

        <div class="auth-accounts-list">
          <button class="account-card" data-act="login-google" data-name="Alex Chen" data-email="alex.chen@gmail.com" data-avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80">
            <span class="account-avatar">AC</span>
            <div class="account-info">
              <b>Alex Chen</b>
              <small>alex.chen@gmail.com</small>
            </div>
            <span class="account-badge">CONTINUE ↗</span>
          </button>
          <button class="account-card" data-act="login-google" data-name="Maya Patel" data-email="maya.patel@gmail.com" data-avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80">
            <span class="account-avatar">MP</span>
            <div class="account-info">
              <b>Maya Patel</b>
              <small>maya.patel@gmail.com</small>
            </div>
            <span class="account-badge">CONTINUE ↗</span>
          </button>
        </div>

        <div class="auth-divider"><span>OR SIGN IN AS NEW USER</span></div>

        <form class="custom-auth-form" onsubmit="return false;">
          <input type="text" id="custom-name" placeholder="Enter your player name" class="auth-input" value="Jordan Lee" />
          <input type="email" id="custom-email" placeholder="your.email@gmail.com" class="auth-input" value="jordan.lee@gmail.com" />
          <button class="primary auth-submit-btn" data-act="login-custom">CONTINUE WITH GOOGLE <span>↗</span></button>
        </form>

        <p class="auth-secure-note">🔒 Google OAuth 2.0 Secure Authentication. Your progress is synced across sessions.</p>
      </section>
    </div>`;
}

function profileModal() {
  const user = state.user;
  const winRate = user.matchesPlayed ? Math.round(((user.matchesWon || 0) / user.matchesPlayed) * 100) : 0;
  return `
    <div class="veil" data-act="close-profile">
      <section class="profile-modal modal-box" role="dialog" aria-modal="true" aria-labelledby="profile-title" data-dialog>
        <button class="modal-close" data-act="close-profile" aria-label="Close">×</button>
        <div class="profile-hero">
          <div class="profile-avatar-large">${user.name.charAt(0)}</div>
          <div class="profile-hero-info">
            <div class="profile-name-row">
              <h2 id="profile-title">${esc(user.name)}</h2>
              <span class="verified-badge" title="Google Verified Account">✓ Google</span>
            </div>
            <p class="profile-email">${esc(user.email || 'Connected Account')}</p>
            <div class="friend-code-row">
              <small>FRIEND CODE:</small>
              <code class="friend-code">${esc(user.friendCode || 'THINK-ALEX-42')}</code>
              <button class="copy-code-btn" data-act="copy-code">${state.copiedCode ? 'COPIED!' : 'COPY'}</button>
            </div>
          </div>
        </div>

        <div class="profile-stats-grid">
          <div class="pstat-card">
            <small>HIGH SCORE</small>
            <strong>${(user.highScore || 0).toFixed(1)}<i>/5.0</i></strong>
            <span>Personal Best</span>
          </div>
          <div class="pstat-card">
            <small>DAILY STREAK</small>
            <strong>🔥 ${user.dailyStreak || 0}d</strong>
            <span>Best: ${user.longestStreak || 0}d</span>
          </div>
          <div class="pstat-card">
            <small>WIN RATE</small>
            <strong>${winRate}%</strong>
            <span>${user.matchesWon || 0}/${user.matchesPlayed || 0} won</span>
          </div>
          <div class="pstat-card">
            <small>COIN BALANCE</small>
            <strong>🪙 ${user.coins || 0}</strong>
            <span>Total earned</span>
          </div>
        </div>

        <div class="profile-achievements">
          <div class="achievements-head">
            <small>ACHIEVEMENTS UNLOCKED</small>
            <span class="achieve-count">4 / 6</span>
          </div>
          <div class="achieve-chips">
            <span class="achieve-chip unlocked" title="Win your first match">🏆 First Victory</span>
            <span class="achieve-chip unlocked" title="Reach a 3-day streak">🔥 Streak Keeper</span>
            <span class="achieve-chip unlocked" title="Score 4.0 or higher">⚡ Logic Master</span>
            <span class="achieve-chip unlocked" title="Solve with ≤ 2 clues">🎯 Sharp Intuition</span>
            <span class="achieve-chip locked" title="Reach a 7-day streak">🔒 Week Dominator</span>
            <span class="achieve-chip locked" title="Defeat Hard chamber">🔒 System Master</span>
          </div>
        </div>

        <div class="profile-actions-row">
          <button class="secondary-btn" data-act="open-shop">REWARDS SHOP (🪙 ${user.coins})</button>
          <button class="secondary-btn logout-btn" data-act="logout">SIGN OUT</button>
        </div>
      </section>
    </div>`;
}

function leaderboardModal() {
  const data = state.leaderboardData || {
    friends: [
      { id: 'f1', name: 'Maya Patel', totalPoints: 98.5, highScore: 5.0, dailyStreak: 6, coins: 620, isUser: false },
      { id: 'usr_me', name: state.user.name, totalPoints: state.user.totalPoints || 83.5, highScore: state.user.highScore || 5.0, dailyStreak: state.user.dailyStreak || 3, coins: state.user.coins || 350, isUser: true },
      { id: 'f2', name: 'Liam Vance', totalPoints: 76.0, highScore: 4.5, dailyStreak: 4, coins: 480, isUser: false },
      { id: 'f3', name: 'Elena Rostova', totalPoints: 61.5, highScore: 4.0, dailyStreak: 2, coins: 310, isUser: false },
      { id: 'f4', name: 'Marcus Brody', totalPoints: 42.0, highScore: 3.5, dailyStreak: 1, coins: 220, isUser: false },
      { id: 'f5', name: 'Samira Khan', totalPoints: 28.0, highScore: 3.0, dailyStreak: 0, coins: 150, isUser: false },
      { id: 'f6', name: 'David Kim', totalPoints: 24.5, highScore: 3.5, dailyStreak: 2, coins: 180, isUser: false },
      { id: 'f7', name: 'Zoe Washington', totalPoints: 19.0, highScore: 3.0, dailyStreak: 1, coins: 140, isUser: false },
      { id: 'f8', name: 'Carlos Mendez', totalPoints: 15.5, highScore: 2.5, dailyStreak: 1, coins: 110, isUser: false },
      { id: 'f9', name: 'Nina Petrov', totalPoints: 11.0, highScore: 2.0, dailyStreak: 0, coins: 90, isUser: false }
    ],
    global: [
      { name: 'Dr. Sarah Lin', totalPoints: 248.0, dailyStreak: 14, highScore: 5.0, coins: 2400 },
      { name: 'Kenji Sato', totalPoints: 212.5, dailyStreak: 11, highScore: 5.0, coins: 1850 },
      { name: 'Amara Okafor', totalPoints: 175.0, dailyStreak: 9, highScore: 4.5, coins: 1600 },
      { name: 'Viktor Morozov', totalPoints: 158.0, dailyStreak: 8, highScore: 5.0, coins: 1400 },
      { name: 'Chloe Dubois', totalPoints: 142.5, dailyStreak: 7, highScore: 4.5, coins: 1250 },
      { name: 'Lucas Andrade', totalPoints: 129.0, dailyStreak: 6, highScore: 4.5, coins: 1100 },
      { name: 'Priya Sharma', totalPoints: 118.5, dailyStreak: 8, highScore: 4.5, coins: 980 },
      { name: 'Soren Lindqvist', totalPoints: 106.0, dailyStreak: 5, highScore: 4.0, coins: 890 },
      { name: 'Yasmine Al-Mansoor', totalPoints: 97.5, dailyStreak: 6, highScore: 4.0, coins: 810 },
      { name: 'Mateo Rossi', totalPoints: 89.0, dailyStreak: 4, highScore: 4.0, coins: 750 }
    ],
    standingNote: '🔥 You are #2 among friends! Only 15.0 points behind Maya.'
  };

  const isFriends = state.leaderboardTab === 'friends';
  const list = isFriends ? data.friends : data.global;

  return `
    <div class="veil" data-act="close-leaderboard">
      <section class="leaderboard-modal modal-box" role="dialog" aria-modal="true" aria-labelledby="lb-title" data-dialog>
        <button class="modal-close" data-act="close-leaderboard" aria-label="Close">×</button>
        <div class="modal-header">
          <p class="eyebrow"><span class="eyebrow-line"></span> COMPETITION &amp; SOCIAL</p>
          <h2 id="lb-title">Leaderboard</h2>
          <div class="lb-tabs">
            <button class="lb-tab ${isFriends ? 'is-active' : ''}" data-act="leaderboard-tab" data-tab="friends">FRIENDS LEADERBOARD</button>
            <button class="lb-tab ${!isFriends ? 'is-active' : ''}" data-act="leaderboard-tab" data-tab="global">GLOBAL TOP 10</button>
          </div>
        </div>

        ${isFriends ? `
          <div class="standing-banner">
            <span class="standing-icon">⚡</span>
            <span>${esc(data.standingNote || 'Compete with friends to climb to #1!')}</span>
          </div>
        ` : ''}

        <div class="leaderboard-table-wrap">
          <div class="lb-row lb-header">
            <span class="lb-col-rank">RANK</span>
            <span class="lb-col-player">PLAYER</span>
            <span class="lb-col-streak">STREAK</span>
            <span class="lb-col-best">BEST</span>
            <span class="lb-col-points">POINTS</span>
          </div>
          <div class="lb-list">
            ${list.map((player, idx) => {
              const rank = idx + 1;
              const isMe = player.isUser || player.name === state.user.name;
              const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
              return `
                <div class="lb-row ${isMe ? 'is-me' : ''}">
                  <span class="lb-col-rank rank-badge ${rank <= 3 ? 'top-three' : ''}">${rankBadge}</span>
                  <div class="lb-col-player player-info">
                    <span class="player-avatar">${player.name.charAt(0)}</span>
                    <span class="player-name">${esc(player.name)} ${isMe ? '<b class="me-tag">(YOU)</b>' : ''}</span>
                  </div>
                  <span class="lb-col-streak">🔥 ${player.dailyStreak || 0}d</span>
                  <span class="lb-col-best">${(player.highScore || 0).toFixed(1)}</span>
                  <span class="lb-col-points points-val">${(player.totalPoints || 0).toFixed(1)} pts</span>
                </div>`;
            }).join('')}
          </div>
        </div>

        <div class="lb-footer">
          <div class="friend-share-box">
            <small>INVITE FRIENDS WITH YOUR CODE:</small>
            <code>${esc(state.user.friendCode || 'THINK-ALEX-42')}</code>
            <button class="copy-code-btn" data-act="copy-code">${state.copiedCode ? 'COPIED!' : 'COPY'}</button>
          </div>
          <button class="primary" data-act="choose">PLAY TO CLIMB <span>↗</span></button>
        </div>
      </section>
    </div>`;
}

function renderShopItemPreview(item) {
  if (item.type === 'theme') {
    const col = item.color || '#68c07a';
    return `<span class="theme-color-dot" style="background: ${col}; box-shadow: 0 0 10px ${col}88;"></span>`;
  }
  const icon = item.icon || (item.type === 'avatar' ? '👤' : '🎖');
  return `<span class="preview-emoji">${icon}</span>`;
}

function shopModal() {
  const user = state.user;
  const items = state.shopData?.items || [
    { id: 'theme_arcade', type: 'theme', name: 'Emerald Arcade', cost: 0, desc: 'Foundational Thinksy emerald phosphor matrix', color: '#68c07a', icon: '🕹️' },
    { id: 'theme_cyberpunk', type: 'theme', name: 'Cyberpunk Neon', cost: 200, desc: 'Electric cyan and neon violet palette for codebreakers', color: '#00f0ff', icon: '⚡' },
    { id: 'theme_midnight', type: 'theme', name: 'Midnight Obsidian', cost: 300, desc: 'Stealth deep slate with crisp gold accents', color: '#ffd700', icon: '🌙' },
    { id: 'theme_solar', type: 'theme', name: 'Solar Flare', cost: 400, desc: 'Radiant amber and cosmic orange heat signature', color: '#ff7b00', icon: '☀️' },
    { id: 'theme_ultraviolet', type: 'theme', name: 'Ultraviolet Chamber', cost: 450, desc: 'Vibrant neon purple and deep amethyst luminescence', color: '#c084fc', icon: '🔮' },
    { id: 'theme_matrix', type: 'theme', name: 'Phosphor Matrix', cost: 500, desc: 'Classic retro terminal green CRT phosphor glow', color: '#22c55e', icon: '📟' },
    { id: 'avatar_logic', type: 'avatar', name: 'Logic Core', cost: 0, desc: 'The foundational atomic logic processor', icon: '⚛' },
    { id: 'avatar_quantum', type: 'avatar', name: 'Quantum Core', cost: 150, desc: 'Entangled particle nexus for multi-state deduction', icon: '💠' },
    { id: 'avatar_neural', type: 'avatar', name: 'Neural Net', cost: 250, desc: 'Synaptic intelligence for adaptive pattern recognition', icon: '🧠' },
    { id: 'avatar_master', type: 'avatar', name: 'Chamber Master', cost: 350, desc: 'Crowned champion of hidden rules', icon: '👑' },
    { id: 'avatar_cipher', type: 'avatar', name: 'Cipher Key', cost: 300, desc: 'Master keyholder who unlocks hidden algorithmic rules', icon: '🗝️' },
    { id: 'avatar_oracle', type: 'avatar', name: 'High Oracle', cost: 450, desc: 'Omniscient visionary predicting systems before clues end', icon: '👁️' },
    { id: 'badge_architect', type: 'badge', name: 'System Architect', cost: 200, desc: 'Exclusive title badge for pattern decoders', icon: '⌘' },
    { id: 'badge_signal', type: 'badge', name: 'Signal Whisperer', cost: 250, desc: 'Attuned to subtle deterministic variations', icon: '📡' },
    { id: 'badge_speedster', type: 'badge', name: 'Clockwork Mind', cost: 300, desc: 'Conqueror of high-speed Time Trial chambers', icon: '⏱️' }
  ];

  const currentTab = state.shopTab || 'all';
  const filteredItems = currentTab === 'all' ? items : items.filter(i => i.type === currentTab);

  const unlockedThemes = user.unlockedThemes || ['default', 'theme_arcade', 'arcade'];
  const unlockedAvatars = user.unlockedAvatars || ['default', 'avatar_logic'];
  const unlockedBadges = user.unlockedBadges || [];

  const activeTheme = user.activeTheme || 'theme_arcade';
  const activeAvatar = user.activeAvatar || 'avatar_logic';
  const activeBadge = user.activeBadge || '';

  return `
    <div class="veil" data-act="close-shop">
      <section class="shop-modal modal-box" role="dialog" aria-modal="true" aria-labelledby="shop-title" data-dialog>
        <button class="modal-close" data-act="close-shop" aria-label="Close">×</button>
        <div class="modal-header">
          <p class="eyebrow"><span class="eyebrow-line"></span> REWARDS &amp; VIRTUAL CURRENCY</p>
          <div class="shop-title-row">
            <h2 id="shop-title">Rewards Shop</h2>
            <div class="shop-balance-pill">
              <span class="coin-icon">🪙</span>
              <strong>${user.coins || 0} COINS</strong>
            </div>
          </div>
          <p class="modal-intro">Spend your earned match victory and streak bonus coins to unlock customized themes, avatars, and badges.</p>

          <div class="shop-filter-tabs">
            <button class="shop-tab ${currentTab === 'all' ? 'is-active' : ''}" data-act="shop-tab" data-tab="all">ALL (${items.length})</button>
            <button class="shop-tab ${currentTab === 'theme' ? 'is-active' : ''}" data-act="shop-tab" data-tab="theme">THEMES (${items.filter(i => i.type === 'theme').length})</button>
            <button class="shop-tab ${currentTab === 'avatar' ? 'is-active' : ''}" data-act="shop-tab" data-tab="avatar">AVATARS (${items.filter(i => i.type === 'avatar').length})</button>
            <button class="shop-tab ${currentTab === 'badge' ? 'is-active' : ''}" data-act="shop-tab" data-tab="badge">BADGES (${items.filter(i => i.type === 'badge').length})</button>
          </div>
        </div>

        <div class="shop-items-grid">
          ${filteredItems.map(item => {
            const isUnlocked = item.cost === 0 ||
              (item.type === 'theme' && (unlockedThemes.includes(item.id) || unlockedThemes.includes(item.id.replace('theme_', '')))) ||
              (item.type === 'avatar' && (unlockedAvatars.includes(item.id) || unlockedAvatars.includes(item.id.replace('avatar_', '')))) ||
              (item.type === 'badge' && unlockedBadges.includes(item.id));

            const isEquipped =
              (item.type === 'theme' && (activeTheme === item.id || activeTheme === item.id.replace('theme_', ''))) ||
              (item.type === 'avatar' && (activeAvatar === item.id || activeAvatar === item.id.replace('avatar_', ''))) ||
              (item.type === 'badge' && activeBadge === item.id);

            const canAfford = (user.coins || 0) >= item.cost;

            return `
              <div class="shop-card ${isEquipped ? 'is-equipped' : ''}">
                <div class="shop-card-preview" style="border-color: ${item.color || 'rgba(157, 230, 169, 0.4)'};">
                  ${renderShopItemPreview(item)}
                </div>
                <div class="shop-card-info">
                  <div class="shop-card-title-row">
                    <b>${esc(item.name)}</b>
                    <span class="shop-type-tag tag-${item.type}">${item.type.toUpperCase()}</span>
                  </div>
                  <small>${esc(item.desc || (item.type === 'theme' ? 'Visual color theme' : 'Profile avatar'))}</small>
                </div>
                <div class="shop-card-action">
                  ${isEquipped ? `
                    <span class="equipped-tag">✓ EQUIPPED</span>
                  ` : isUnlocked ? `
                    <button class="secondary-btn equip-btn" data-act="equip-item" data-type="${item.type}" data-value="${item.id}">EQUIP</button>
                  ` : `
                    <button class="primary buy-btn" data-act="buy-item" data-item-id="${item.id}" ${!canAfford || state.busy ? 'disabled' : ''}>
                      <span>🪙 ${item.cost}</span>
                    </button>
                  `}
                </div>
              </div>`;
          }).join('')}
        </div>

        <div class="shop-footer">
          <span>Earn coins by winning matches (+100), setting personal records (+50), and daily streaks (+15/day).</span>
        </div>
      </section>
    </div>`;
}

function formatTime(seconds) {
  if (seconds == null) return '—';
  const value = Math.max(0, Number(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function workspace() {
  const match = state.match;
  const puzzle = match.puzzle;
  return `
    <main class="game-screen">
      <div class="game-topline"><button class="back-home" data-act="quit">← EXIT MATCH</button><span class="game-session">THINKSY / ${esc(match.mode.replace('_', ' '))}</span></div>
      <div class="scorebar">
        <div><small>YOUR SCORE</small><strong>${match.score}<i>/5</i></strong></div>
        <div><small>ROUND</small><strong>${match.round}<i>/5</i></strong></div>
        <div><small>CLUES LEFT</small><strong>${match.remaining}<i>/${match.limit}</i></strong></div>
        <div><small>DIFFICULTY</small><strong class="level-name">${esc(match.difficulty)}</strong></div>
        <div class="timer-stat"><small>TIME LEFT</small><strong>${match.mode === 'PRACTICE' ? '∞' : formatTime(match.timeRemaining)}</strong></div>
      </div>
      <section class="game-heading">
        <p class="eyebrow"><span class="eyebrow-line"></span> ${esc(puzzle.category)}</p>
        <h1>${esc(puzzle.title)}</h1>
        <p>${esc(puzzle.description)}</p>
      </section>
      <div class="play-grid">
        <section class="panel investigation-panel ${state.busy ? 'is-processing' : ''}">
          <div class="panel-head"><div><small>01 / INVESTIGATE</small><h2>Choose an input.</h2></div><span class="count">${match.moves.length} USED</span></div>
          <p class="hint">Each input is one clue. Study the output and compare it with your earlier experiments.</p>
          <div class="processing-slot" aria-live="polite">
            ${state.busy ? `<div class="processing-banner" role="status"><span class="processing-orb"></span><span>${state.busyAction === 'move' ? 'THE MACHINE IS PROCESSING YOUR INPUT' : state.busyAction === 'guess' ? 'CHECKING YOUR PREDICTION' : state.busyAction === 'next' ? 'PREPARING THE NEXT SYSTEM' : 'INITIALISING YOUR MATCH'}</span><span class="processing-dots">···</span></div>` : ''}
          </div>
          <div class="inputs">${puzzle.inputs.map(input => {
            const used = match.moves.some(move => move.input === input);
            return `<button class="${used ? 'used' : ''}" data-act="move" data-input="${esc(input)}" ${state.busy || match.roundDone || match.remaining === 0 || used ? 'disabled' : ''}>${esc(input)}${used ? '<span class="used-mark">✓ USED</span>' : '<span>↗</span>'}</button>`;
          }).join('')}</div>
          <div class="history">
            <div class="history-head"><small>YOUR EVIDENCE</small><small>${match.moves.length} / ${match.limit}</small></div>
            ${match.moves.length ? match.moves.slice(-3).map(move => `<div class="evidence"><span>${String(move.number).padStart(2, '0')}</span><b>${esc(move.input)}</b><i>→</i><strong>${esc(move.output)}</strong></div>`).join('') + (match.moves.length > 3 ? `<div class="history-more">+ ${match.moves.length - 3} EARLIER EXPERIMENTS</div>` : '') : '<div class="empty">Your clues will appear in this list.</div>'}
          </div>
        </section>
        <section class="panel guess-panel">
          <div class="guess-step"><small>02 / MAKE YOUR CALL</small><span class="guess-spark">✳</span></div>
          <h2>Predict the machine output</h2>
          <p class="hint">${esc(puzzle.objective)}</p>
          <div class="prediction-label-row">
            <span class="prediction-label-title">YOUR FINAL PREDICTION</span>
            <span class="prediction-status ${state.selectedGuess ? 'has-selection' : ''}">
              <span class="prompt-text">Choose an option:</span>
              <span class="selected-badge">SELECTED: <b class="selected-guess-badge-val">${esc(state.selectedGuess || '—')}</b></span>
            </span>
          </div>
          <div class="output-chips" role="group" aria-label="Output candidates">
            ${puzzle.outputs.map(output => `<button type="button" class="output-chip ${state.selectedGuess === String(output) ? 'is-selected' : ''}" data-act="select-guess" data-output="${esc(output)}" ${state.busy || match.roundDone ? 'disabled' : ''}>${esc(output)}</button>`).join('')}
          </div>
          <input type="hidden" id="guess" value="${esc(state.selectedGuess || '')}">
          <button class="primary" data-act="guess" ${state.busy || match.roundDone || !match.moves.length ? 'disabled' : ''}>LOCK IN GUESS <span>↗</span></button>
          <p class="fine">Your guess ends the round. You need at least one clue before guessing.</p>
        </section>
      </div>
    </main>
    ${match.roundDone ? resultModal() : ''}`;
}

function resultModal() {
  const match = state.match;
  const last = match.result;
  const user = state.user;
  const won = match.won;
  const isMatchDone = match.matchDone;

  if (!isMatchDone) {
    // Intermediate Round End Modal
    const isCorrect = last === 'CORRECT';
    const isTimeout = last === 'TIMEOUT';
    return `
      <div class="veil">
        <section class="result round-result ${isCorrect ? 'is-correct' : 'is-incorrect'}" role="dialog" aria-modal="true" aria-labelledby="result-title" data-dialog>
          <div class="result-confetti" aria-hidden="true">${isCorrect ? '<span>✳</span><span>✦</span><span>·</span><span>✧</span>' : '<span>✕</span><span>·</span>'}</div>
          <p class="eyebrow">ROUND ${match.round} COMPLETE</p>
          <div class="result-icon ${isCorrect ? 'good' : 'bad'}">${isCorrect ? '✓' : isTimeout ? '⏱' : '✕'}</div>
          <h2 id="result-title">${isCorrect ? 'You found the rule.' : isTimeout ? 'Time ran out.' : 'Not this time.'}</h2>
          <div class="round-feedback-card ${isCorrect ? 'feedback-success' : 'feedback-error'}">
            <p class="feedback-main">${isCorrect ? `Correct prediction! You earned ${match.roundPoints} ${match.roundPoints === 1 ? 'point' : 'points'}. Current score: ${match.score}/5.` : isTimeout ? `The clock reached zero before your guess. Score: ${match.score}/5.` : `Incorrect prediction. Score: ${match.score}/5.`}</p>
            ${!isCorrect && match.answer ? `
              <div class="rule-reveal">
                <span class="reveal-badge">THE HIDDEN RULE WAS</span>
                <strong>${esc(match.ruleTitle || 'System Transformation')}</strong>
                <small>Target output was: <b>${esc(match.answer)}</b></small>
              </div>
            ` : ''}
          </div>
          <div class="round-stats-row">
            <span>Round ${match.round}/5</span>
            <span>Clues used: ${match.moves.length}</span>
            <span class="${match.score >= 3.0 ? 'text-accent' : ''}">${match.score >= 3.0 ? '✓ Win criteria met' : `Needs ${(3.0 - match.score).toFixed(1)} more to win`}</span>
          </div>
          <button class="primary" data-act="next">NEXT ROUND <span>↗</span></button>
        </section>
      </div>`;
  }

  // Final Match Result: Distinct Winning Screen vs Losing Screen
  const details = match.details || {};
  const prevPB = details.previousHighScore ?? user.highScore ?? 0;
  const isNewPB = details.isNewHighScore || (match.score > prevPB);
  const coinsEarned = details.coinsEarned || (won ? 180 : 35);
  const rewards = details.rewards || [];

  return `
    <div class="veil">
      <section class="result match-result ${won ? 'is-winner' : 'is-loser'}" role="dialog" aria-modal="true" aria-labelledby="result-title" data-dialog>
        <div class="result-confetti" aria-hidden="true">
          ${won ? '<span>🏆</span><span>✨</span><span>✦</span><span>✳</span><span>🪙</span>' : '<span>⚡</span><span>·</span>'}
        </div>
        <p class="eyebrow">MATCH COMPLETE</p>
        <div class="outcome-badge ${won ? 'outcome-win' : 'outcome-loss'}">
          ${won ? 'VICTORY SECURED' : 'MATCH INCOMPLETE'}
        </div>
        <div class="result-icon ${won ? 'good' : ''}">${won ? '🏆' : '↗'}</div>
        <h2 id="result-title">${won ? 'You cracked the match.' : 'Match complete.'}</h2>

        <!-- Score Comparison Component -->
        <div class="score-compare-box">
          <div class="score-cell current-score">
            <small>FINAL SCORE</small>
            <div class="score-num">${match.score}<span>/5.0</span></div>
            <span class="outcome-status-pill ${won ? 'status-won' : 'status-lost'}">${won ? 'WIN (≥ 3.0)' : 'UNMET (< 3.0)'}</span>
          </div>
          <div class="score-cell-sep">VS</div>
          <div class="score-cell record-score">
            <small>PERSONAL BEST</small>
            <div class="record-num">${Math.max(prevPB, match.score).toFixed(1)}<span>/5.0</span></div>
            ${isNewPB ? '<span class="status-new-pb">🔥 NEW BEST!</span>' : `<span class="status-prev">PREVIOUS: ${prevPB.toFixed(1)}</span>`}
          </div>
        </div>

        <!-- Narrative Microcopy -->
        <p class="result-copy-narrative">
          ${won
            ? (isNewPB
                ? `Sensational! You beat your previous high score and cracked the chamber with ${match.score}/5.0!`
                : `Nicely reasoned! You scored ${match.score}/5.0 and won the match. Your personal best is ${prevPB.toFixed(1)}/5.0.`)
            : `You finished with ${match.score}/5.0. You need at least 3.0 points to win. One more round — your personal best is within reach!`}
        </p>

        <!-- Performance Statistics Grid -->
        <div class="performance-grid">
          <div class="perf-item">
            <small>ACCURACY</small>
            <strong>${details.roundsWon != null ? Math.round((details.roundsWon / 5) * 100) : Math.round((match.score / 5) * 100)}%</strong>
            <span>${details.roundsWon ?? Math.floor(match.score)}/5 correct</span>
          </div>
          <div class="perf-item">
            <small>CLUES USED</small>
            <strong>${details.totalCluesUsed ?? match.moves.length}</strong>
            <span>total clues</span>
          </div>
          <div class="perf-item">
            <small>EFFICIENCY</small>
            <strong>${details.clueEfficiency ?? (match.score / Math.max(1, details.totalCluesUsed || 10)).toFixed(2)}</strong>
            <span>pts / clue</span>
          </div>
          <div class="perf-item">
            <small>STREAK</small>
            <strong>🔥 ${user.dailyStreak}d</strong>
            <span>daily habit</span>
          </div>
        </div>

        <!-- Coins and Rewards Card -->
        <div class="coins-earned-card">
          <div class="coins-earned-head">
            <span>🪙 VIRTUAL REWARDS</span>
            <strong class="coins-total-num">+${coinsEarned} COINS</strong>
          </div>
          <div class="rewards-items-list">
            ${rewards.length ? rewards.map(r => `<div class="reward-entry"><span>${esc(r.label)}</span><b>+${r.coins}</b></div>`).join('') : `
              <div class="reward-entry"><span>Match Participation</span><b>+15</b></div>
              ${won ? '<div class="reward-entry"><span>Match Victory</span><b>+100</b></div>' : ''}
            `}
          </div>
        </div>

        <!-- Challenge Escalation for winners -->
        ${won && match.difficulty === 'EASY' ? `
          <div class="escalate-banner">
            <span>Ready for a bigger challenge?</span>
            <button class="escalate-btn" data-act="level-up" data-level="MEDIUM">TRY MEDIUM DIFFICULTY <span>↗</span></button>
          </div>
        ` : won && match.difficulty === 'MEDIUM' ? `
          <div class="escalate-banner">
            <span>Master the chamber:</span>
            <button class="escalate-btn" data-act="level-up" data-level="HARD">TRY HARD DIFFICULTY <span>↗</span></button>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="result-actions-stack">
          <button class="primary primary-large" data-act="replay" aria-label="${won ? 'One more match' : 'Try again (ONE MORE MATCH)'}">
            <span>${won ? 'ONE MORE MATCH' : 'TRY AGAIN'}</span>
            <span class="button-arrow">↗</span>
          </button>
          <div class="result-secondary-row">
            <button class="result-btn-secondary" data-act="home">
              <span>BACK TO HOME</span> <span>↗</span>
            </button>
            <button class="result-btn-secondary" data-act="open-leaderboard">
              <span>CHECK LEADERBOARD</span> <span>🏆</span>
            </button>
          </div>
        </div>
      </section>
    </div>`;
}

function morphNode(current, next) {
  if (current.nodeType !== next.nodeType ||
      (current.nodeType === 1 && current.tagName !== next.tagName)) {
    current.replaceWith(next.cloneNode(true));
    return;
  }

  if (current.nodeType === 3) {
    if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
    return;
  }

  if (current.nodeType !== 1) return;

  for (const attribute of Array.from(current.attributes)) {
    if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
  }
  for (const attribute of Array.from(next.attributes)) {
    if (current.getAttribute(attribute.name) !== attribute.value) {
      current.setAttribute(attribute.name, attribute.value);
    }
  }

  morphChildren(current, next);

  // Keep controls in place, and preserve active user selection across renders
  if (current.tagName === 'SELECT') {
    const desired = state.selectedGuess || next.value || '';
    if (current.value !== desired) current.value = desired;
  }
}

function morphChildren(currentParent, nextParent) {
  const currentNodes = Array.from(currentParent.childNodes).filter(node => !node.__thinksyRemoving);
  const nextNodes = Array.from(nextParent.childNodes);
  const sharedLength = Math.min(currentNodes.length, nextNodes.length);

  for (let index = 0; index < sharedLength; index++) {
    morphNode(currentNodes[index], nextNodes[index]);
  }
  for (let index = sharedLength; index < nextNodes.length; index++) {
    currentParent.appendChild(nextNodes[index].cloneNode(true));
  }
  for (let index = currentNodes.length - 1; index >= nextNodes.length; index--) {
    const node = currentNodes[index];
    // Let overlays, toasts and other trailing components animate out instead
    // of disappearing abruptly. Ignore them in subsequent morph passes.
    if (node.nodeType === 1 && node.classList && node.addEventListener) {
      node.__thinksyRemoving = true;
      node.classList.add('ui-pop-out');
      const remove = () => node.parentNode && node.parentNode.removeChild(node);
      node.addEventListener('animationend', remove, { once: true });
      setTimeout(remove, 240);
    } else {
      currentParent.removeChild(node);
    }
  }
}

function render() {
  const markup = header() +
    (state.screen === 'home' ? home() : state.screen === 'setup' ? setup() : state.screen === 'loading' ? loadingScreen() : workspace()) +
    (state.helpOpen ? helpModal() : '') +
    (state.authOpen ? authModal() : '') +
    (state.profileOpen ? profileModal() : '') +
    (state.leaderboardOpen ? leaderboardModal() : '') +
    (state.shopOpen ? shopModal() : '') +
    (state.error ? `<div class="toast" role="status">${esc(state.error)}</div>` : '');

  // Update the existing app tree instead of replacing the page contents.
  // This keeps the app a single-page experience and avoids full-screen flashes.
  if (typeof document.createElement === 'function' && app.replaceChildren) {
    const template = document.createElement('template');
    template.innerHTML = markup;
    morphChildren(app, template.content);
  } else {
    // Lightweight fallback for the isolated Node test harness.
    app.innerHTML = markup;
  }
}

function stopTimer() {
  if (state.timerTick && typeof clearInterval === 'function') clearInterval(state.timerTick);
  state.timerTick = null;
}

function startTimer() {
  stopTimer();
  if (!state.match || state.match.mode === 'PRACTICE' || state.match.roundDone || typeof setInterval !== 'function') return;
  state.timerTick = setInterval(async () => {
    if (!state.match || state.match.roundDone) return stopTimer();
    state.match.timeRemaining = Math.max(0, state.match.timeRemaining - 1);
    if (state.match.timeRemaining <= 0) {
      stopTimer();
      try {
        state.match = await api('/api/timeout', {});
      } catch (error) {
        state.error = error.message;
      }
      render();
      return;
    }
    const timerEl = document.querySelector('.timer-stat strong');
    if (timerEl) {
      timerEl.textContent = formatTime(state.match.timeRemaining);
      if (state.match.timeRemaining <= 15) {
        timerEl.classList.add('is-urgent');
      } else {
        timerEl.classList.remove('is-urgent');
      }
    } else {
      render();
    }
  }, 1000);
}

function closeModals() {
  state.helpOpen = false;
  state.authOpen = false;
  state.profileOpen = false;
  state.leaderboardOpen = false;
  state.shopOpen = false;
}

async function startMatchWithLoading(mode, difficulty) {
  stopTimer();
  closeModals();
  state.screen = 'loading';
  state.loadingProgress = 0;
  state.loadingStatus = 'Connecting to neural logic core…';
  state.selectedGuess = '';
  state.busy = false;
  state.busyAction = '';
  render();

  const startTime = Date.now();
  const duration = (typeof window !== 'undefined' && window.__TEST_SPEED__) ? 50 : (typeof window === 'undefined' ? 0 : 4700);

  const matchPromise = api('/api/match', { mode: mode || state.mode, difficulty: difficulty || state.difficulty });

  if (duration <= 50) {
    state.match = await matchPromise;
    state.screen = 'game';
    startTimer();
    render();
    return;
  }

  await new Promise(resolve => {
    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      state.loadingProgress = progress;

      const bar = typeof document !== 'undefined' && document.querySelector ? document.querySelector('.loading-bar-inner') : null;
      if (bar) bar.style.width = `${progress}%`;

      if (elapsed >= duration) {
        resolve();
      } else {
        setTimeout(tick, 30);
      }
    }
    setTimeout(tick, 30);
  });

  state.match = await matchPromise;
  state.screen = 'game';
  startTimer();
  render();
}

async function act(element) {
  const action = element.dataset?.act;
  if (!action) return;
  state.error = '';

  if (action === 'choose') {
    stopTimer();
    closeModals();
    state.screen = 'setup';
    render();
    return;
  }
  if (action === 'help') {
    closeModals();
    state.helpOpen = true;
    render();
    return;
  }
  if (action === 'close-help') {
    state.helpOpen = false;
    render();
    return;
  }
  if (action === 'open-auth') {
    closeModals();
    state.authOpen = true;
    render();
    return;
  }
  if (action === 'close-auth') {
    state.authOpen = false;
    render();
    return;
  }
  if (action === 'open-profile') {
    closeModals();
    state.profileOpen = true;
    render();
    return;
  }
  if (action === 'close-profile') {
    state.profileOpen = false;
    render();
    return;
  }
  if (action === 'open-leaderboard') {
    closeModals();
    state.busy = true;
    render();
    try {
      state.leaderboardData = await api('/api/leaderboard');
    } catch {
      // fallback to pre-seeded
    }
    state.busy = false;
    state.leaderboardOpen = true;
    render();
    return;
  }
  if (action === 'close-leaderboard') {
    state.leaderboardOpen = false;
    render();
    return;
  }
  if (action === 'leaderboard-tab') {
    state.leaderboardTab = element.dataset.tab;
    render();
    return;
  }
  if (action === 'open-shop') {
    closeModals();
    state.busy = true;
    render();
    try {
      state.shopData = await api('/api/shop');
    } catch {}
    state.busy = false;
    state.shopOpen = true;
    render();
    return;
  }
  if (action === 'close-shop') {
    state.shopOpen = false;
    render();
    return;
  }
  if (action === 'shop-tab') {
    state.shopTab = element.dataset.tab;
    render();
    return;
  }
  if (action === 'copy-code') {
    const code = state.user?.friendCode || 'THINK-ALEX-42';
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    state.copiedCode = true;
    render();
    setTimeout(() => {
      state.copiedCode = false;
      render();
    }, 2000);
    return;
  }
  if (action === 'login-google') {
    const name = element.dataset.name || 'Alex Chen';
    const email = element.dataset.email || 'alex.chen@gmail.com';
    const avatar = element.dataset.avatar || '';
    state.busy = true;
    render();
    try {
      const res = await api('/api/auth/google', { name, email, avatar });
      state.user = res.user;
      state.authOpen = false;
    } catch (err) {
      state.error = err.message;
    }
    state.busy = false;
    render();
    return;
  }
  if (action === 'login-custom') {
    const nameInput = document.querySelector('#custom-name');
    const emailInput = document.querySelector('#custom-email');
    const name = (nameInput?.value || 'Jordan Lee').trim();
    const email = (emailInput?.value || 'jordan.lee@gmail.com').trim();
    state.busy = true;
    render();
    try {
      const res = await api('/api/auth/google', { name, email });
      state.user = res.user;
      state.authOpen = false;
    } catch (err) {
      state.error = err.message;
    }
    state.busy = false;
    render();
    return;
  }
  if (action === 'logout') {
    try {
      await api('/api/auth/logout', {});
    } catch {}
    state.user = {
      ...defaultUser,
      id: 'usr_guest',
      name: 'Guest Player',
      email: '',
      isGoogle: false,
      dailyStreak: 0,
      coins: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      totalPoints: 0
    };
    state.profileOpen = false;
    render();
    return;
  }
  if (action === 'buy-item') {
    const itemId = element.dataset.itemId;
    state.busy = true;
    render();
    try {
      const res = await api('/api/shop/purchase', { itemId });
      state.user = res.user;
      state.shopData = await api('/api/shop');
    } catch (err) {
      state.error = err.message;
    }
    state.busy = false;
    render();
    return;
  }
  if (action === 'equip-item') {
    const type = element.dataset.type;
    const value = element.dataset.value;
    state.busy = true;
    render();
    try {
      const res = await api('/api/shop/equip', { type, value });
      state.user = res.user;
      state.shopData = await api('/api/shop');
    } catch (err) {
      state.error = err.message;
    }
    state.busy = false;
    render();
    return;
  }
  if (action === 'level-up') {
    stopTimer();
    closeModals();
    state.difficulty = element.dataset.level || 'MEDIUM';
    state.screen = 'setup';
    render();
    return;
  }

  try {
    if (action === 'home') {
      stopTimer();
      closeModals();
      state.screen = 'home';
      state.match = null;
      state.selectedGuess = '';
      render();
      return;
    }
    if (action === 'mode') {
      state.mode = element.dataset.mode;
      if (state.mode === 'PRACTICE') state.difficulty = 'EASY';
      if (state.mode === 'TIME_TRIAL') state.difficulty = 'HARD';
      render();
      return;
    }
    if (action === 'level') {
      if (state.mode !== 'CLASSIC') return;
      state.difficulty = element.dataset.level;
      render();
      return;
    }
    if (action === 'start' || action === 'replay') {
      await startMatchWithLoading(state.mode, state.difficulty);
      return;
    }
    if (action === 'move') {
      state.busy = true;
      state.busyAction = 'move';
      render();
      state.match = await withFeedback(api('/api/move', { input: element.dataset.input }));
      state.busy = false;
      state.busyAction = '';
      render();
      return;
    }
    if (action === 'select-guess') {
      state.selectedGuess = element.dataset.output;
      state.error = '';
      const sel = document.querySelector('#guess');
      if (sel) sel.value = element.dataset.output;
      if (typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('.output-chip').forEach(chip => {
          chip.classList.toggle('is-selected', chip.dataset.output === state.selectedGuess);
        });
      }
      const badge = document.querySelector('.selected-guess-badge-val');
      if (badge) badge.textContent = state.selectedGuess;
      const statusEl = document.querySelector('.prediction-status');
      if (statusEl) statusEl.classList.add('has-selection');
      return;
    }
    if (action === 'guess') {
      const output = document.querySelector('#guess')?.value || state.selectedGuess;
      if (!output) {
        state.error = 'Choose an output before locking in your guess.';
        render();
        return;
      }
      state.selectedGuess = output;
      state.busy = true;
      state.busyAction = 'guess';
      render();
      state.match = await withFeedback(api('/api/guess', { output }));
      if (state.match.roundDone) stopTimer();
      if (state.match.user) state.user = state.match.user;
      state.busy = false;
      state.busyAction = '';
      render();
      return;
    }
    if (action === 'next') {
      state.busy = true;
      state.busyAction = 'next';
      state.selectedGuess = '';
      render();
      state.match = await withFeedback(api('/api/next', {}));
      startTimer();
      state.busy = false;
      state.busyAction = '';
      render();
      return;
    }
    if (action === 'quit') {
      stopTimer();
      closeModals();
      await api('/api/exit', {});
      state.match = null;
      state.selectedGuess = '';
      state.screen = 'home';
      render();
    }
  } catch (error) {
    state.busy = false;
    state.busyAction = '';
    state.error = error.message;
    render();
  }
}

if (app && app.addEventListener) {
  app.addEventListener('click', event => {
    const element = event.target.closest('[data-act]');
    if (!element || element.disabled) return;

    // data-act controls are handled by this client-side router. Cancel the
    // browser's default anchor/submit navigation so interactions never reload.
    event.preventDefault();

    if (element.classList.contains('veil') && event.target.closest('[data-dialog]')) return;
    act(element);
  });

  app.addEventListener('change', event => {
    if (event.target && event.target.id === 'guess') {
      state.selectedGuess = event.target.value;
      state.error = '';
      if (typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('.output-chip').forEach(chip => {
          chip.classList.toggle('is-selected', chip.dataset.output === event.target.value);
        });
      }
    }
  });
}

if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (state.helpOpen || state.authOpen || state.profileOpen || state.leaderboardOpen || state.shopOpen) {
        closeModals();
        render();
      }
    } else if (event.key === 'Enter' && state.screen === 'game' && !state.busy && state.match && !state.match.roundDone) {
      const active = document.activeElement;
      if (active && (active.id === 'guess' || active.classList?.contains('output-chip'))) {
        event.preventDefault();
        const guessBtn = document.querySelector('[data-act="guess"]:not(:disabled)');
        if (guessBtn) act(guessBtn);
      }
    }
  });
}

// Initial client fetch for session profile
if (typeof fetch === 'function' && typeof window !== 'undefined') {
  api('/api/auth/me').then(res => {
    if (res?.user) {
      state.user = res.user;
      render();
    }
  }).catch(() => {});
}

render();
