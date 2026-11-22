# Thinksy: Phase 3: Product Design, UX/UI & Experience Architecture

## Why This Phase Exists

Phase 1 established the problem space and the opportunity for Thinksy:
make logical reasoning feel like interactive discovery rather than a
passive quiz. A player should learn a system by testing it, observing
its behaviour and using evidence to make a prediction.

Phase 2 translated that opportunity into a product direction. Thinksy is
a deterministic reasoning game built around a hidden rule. The player
chooses inputs, observes outputs, compares evidence, infers the rule and
commits to a prediction. A five-round match gives the experience
structure, while clue efficiency, timed play and progression provide
challenge and reasons to return.

Phase 3 translates that direction into an experience that can be
designed, evaluated and handed to engineering. It defines the player
journey, game structure, information architecture, screen
responsibilities, low-fidelity wireframes, interaction patterns,
interface states, responsive behaviour, visual system and usability
evaluation plan.

The objective is not to add every possible game feature. It is to make
the first complete reasoning experience coherent and testable. A player
should understand the objective, start a match, investigate the hidden
system, make a prediction, understand the result and decide whether to
play again without needing to understand the internal implementation.

This document is an experience and implementation-aligned design
specification. The wireframes are structural representations, not final
visual mockups. Implemented behaviour is distinguished from limitations
and future recommendations. The supplied QA report is treated as
evidence from the source artefact; it is not presented as a new test run
or a substitute for player research.

## What We Are Designing

The primary design problem is not how to make a number puzzle look like
an arcade game. It is how to help a player move confidently from
uncertainty to an evidence-based prediction.

The experience has to make five things clear at all times:

1.  **What am I investigating?** The challenge and objective must be
    understandable without revealing the hidden rule.
2.  **What can I test?** Available inputs, used inputs and remaining
    clues must be visible.
3.  **What did the system return?** Each output must remain associated
    with the input that produced it.
4.  **What am I predicting?** The final prediction must be distinct from
    another experiment and must be deliberately committed.
5.  **How did I perform?** The player must understand the round result,
    points, final score and match outcome.

The game workspace is the centre of the product. Setup, evidence,
prediction, result feedback and progression should support that
experience rather than compete with it. The interface should preserve
the satisfaction of discovery: the hidden rule remains undisclosed until
the player has committed to a prediction or the round has otherwise
resolved.

# 1. Experience Design Principles

### 1.1 Discovery before explanation

The reward is the moment a player recognises the relationship between
inputs and outputs. Make experimentation easy while keeping the rule
undisclosed until resolution.

### 1.2 Every experiment creates evidence

An input submission is a clue. The returned output must be associated
with that input and added to the evidence history. Players should not
need to remember information the interface can retain.

### 1.3 Separate experimenting from predicting

Submitting an input tests the system. Selecting an output and locking in
a guess commits the player’s answer. The investigation area is for
gathering evidence; the prediction area is for making the final call.

### 1.4 Make constraints visible

Clue budget, round number, current score, difficulty and remaining time
are part of the rules. They must remain visible during play.

### 1.5 Explain the result

A correct answer confirms the discovery and shows points earned. An
incorrect answer reveals the hidden rule and target output. A failed
prediction should still teach the player something about the system.

### 1.6 Make scoring predictable

Players should understand how clue efficiency affects points and what
final score is required to win. Scoring must be consistent and
server-authoritative.

### 1.7 Progression supports the game

Streaks, coins, achievements, cosmetics and leaderboards can encourage
return play. They must not compete with the investigation workspace.

### 1.8 Keep interactions responsive

Selecting inputs and outputs should feel immediate. Network activity
should use stable processing feedback rather than disruptive full-screen
replacement.

### 1.9 Preserve the established visual identity

The current baseline is a dark arcade environment with fresh green
accents, restrained glow, system-console details and animated machine
imagery. Future changes should improve clarity and quality without
redesigning the product without a clear reason.

### 1.10 Responsive behaviour is part of the experience

The game must remain usable on desktop, tablet and mobile. Layouts may
reorganise, but the relationship between input, output, evidence and
prediction must remain clear.

------------------------------------------------------------------------

# 2. Primary Player and Design Scenario

## 2.1 Primary player

The primary player is someone who enjoys puzzles, pattern recognition,
logic challenges and short interactive games. Thinksy should be
approachable without assuming formal mathematical training.

This is a product-design hypothesis, not a validated demographic
profile. Age, occupation, education and preferred device should not be
assumed without research.

## 2.2 Primary scenario

A player opens Thinksy and understands that the objective is to discover
a hidden rule. They start a match, choose a mode and difficulty, enter
the signal chamber, test inputs, compare returned outputs and make a
final prediction.

The game evaluates the prediction, awards points according to clue
efficiency and moves to the next round. After five rounds, the player
sees a final score, win-or-loss status, performance statistics and
rewards. They can replay, return home or inspect the leaderboard.

## 2.3 Secondary scenarios

- A first-time player opens How to Play before starting.
- A player chooses Practice to learn without a countdown.
- A confident player chooses Hard to work with a larger clue budget and
  shorter timer.
- A player runs out of time and reviews the revealed rule.
- A player uses output candidate chips to make a prediction.
- A returning player checks their streak, personal best and coin
  balance.
- A player compares their standing on the friends leaderboard.
- A player spends coins on a theme, avatar or badge.
- A player retries after a loss or moves to a higher difficulty after a
  win.
- A player signs out or switches the displayed account.

## 2.4 Experience boundaries

Thinksy is a single-player reasoning game with profile and leaderboard
presentation. It should not be described as real-time multiplayer.

The supplied implementation does not establish production-grade Google
OAuth, a durable social graph, cross-device identity guarantees or a
production-scale leaderboard service. Those require separate product and
engineering work.

------------------------------------------------------------------------

# 3. End-to-End Player Journey

## 3.1 Primary journey

``` mermaid
flowchart TD
    A[Open Thinksy] --> B[Understand the hidden-rule game]
    B --> C{Need instructions?}
    C -->|Yes| D[Open How to Play]
    D --> E[Return to Home]
    C -->|No| E
    E --> F[Start Playing / Match Setup]
    F --> G[Choose mode and difficulty]
    G --> H[Start Game]
    H --> I[Enter Signal Chamber]
    I --> J[Choose an available input]
    J --> K[Observe returned output]
    K --> L[Review experiment history]
    L --> M{Ready to predict?}
    M -->|No| J
    M -->|Yes| N[Select output candidate]
    N --> O[Lock in guess]
    O --> P[Evaluate round]
    P --> Q{Round five?}
    Q -->|No| R[Show round result]
    R --> S[Next Round]
    S --> J
    Q -->|Yes| T[Calculate match result]
    T --> U[Show score, statistics and rewards]
    U --> V{Next action}
    V -->|Replay| F
    V -->|Home| E
    V -->|Leaderboard| W[Compare standings]
```

## 3.2 Journey stages and player needs

| Stage             | Player intention               | Interface responsibility                       | Completion evidence                |
|:------------------|:-------------------------------|:-----------------------------------------------|:-----------------------------------|
| Home              | Understand the premise         | Explain the game and expose Start Playing      | Player can identify the objective  |
| Help              | Learn the interaction          | Explain input, evidence and prediction         | Player understands the loop        |
| Setup             | Choose a suitable challenge    | Explain modes, clues and timers                | Mode and difficulty are clear      |
| Match start       | Enter the game                 | Initialise the round and show transition       | Active match is visible            |
| Investigate       | Gather clues                   | Present inputs and prevent invalid experiments | Input/output evidence is recorded  |
| Compare           | Infer the rule                 | Preserve the experiment sequence               | Player can review prior evidence   |
| Predict           | Commit to an answer            | Present candidates and a lock-in action        | Valid prediction is submitted      |
| Round result      | Understand performance         | Show correctness, points and rule reveal       | Player understands the outcome     |
| Continue          | Complete the match             | Start the next round                           | Round advances correctly           |
| Match result      | Understand overall performance | Show score, outcome, stats and rewards         | Player understands final result    |
| Progression       | Track improvement              | Expose personal best, streak and coins         | Player can see progress            |
| Social comparison | Compare standings              | Show friends/global views                      | Player can identify their position |
| Replay            | Play again                     | Start a fresh match                            | New match begins cleanly           |

## 3.3 Core game state model

``` mermaid
stateDiagram-v2
    [*] --> Home
    Home --> Setup: Start Playing
    Setup --> Starting: Start Game
    Starting --> ActiveRound: Match created
    ActiveRound --> ProcessingInput: Submit input
    ProcessingInput --> ActiveRound: Output returned
    ActiveRound --> ProcessingGuess: Lock in guess
    ProcessingGuess --> RoundResult: Guess evaluated
    ActiveRound --> TimedOut: Server timer expires
    TimedOut --> RoundResult
    RoundResult --> ActiveRound: Next round
    RoundResult --> MatchResult: Fifth round complete
    MatchResult --> Setup: Replay
    MatchResult --> Home: Back to Home
    Home --> Profile: Open profile
    Home --> Leaderboard: Open ranks
    Home --> RewardsShop: Open coins
```

The state model distinguishes an active round from a completed round and
a completed match. The client countdown is a display; the server is
authoritative for timed-mode expiry and score evaluation.

------------------------------------------------------------------------

# 4. Game Modes, Difficulty and Rules

## 4.1 Game modes

| Mode       | Purpose                       | Difficulty                          |           Clue budget | Timer                        | Match structure                           |
|:-----------|:------------------------------|:------------------------------------|----------------------:|:-----------------------------|:------------------------------------------|
| Practice   | Learn without time pressure   | Easy                                |           7 per round | None                         | Five-round flow in current implementation |
| Classic    | Standard match                | Player selects Easy, Medium or Hard | Depends on difficulty | 3:00 / 2:00 / 1:30 per round | Five rounds                               |
| Time Trial | Fast, high-pressure challenge | Hard, fixed                         |          15 per round | 1:30 per round               | Five rounds                               |

**Server-enforced constraints:** - Practice forces Easy and removes the
timer. - Time Trial forces Hard. - Classic accepts Easy, Medium or
Hard. - Timed modes use server-side elapsed time. - A new round starts a
fresh round clock.

## 4.2 Difficulty levels

| Difficulty | Clues per round | Time per round | Intended feel                                     |
|:-----------|----------------:|---------------:|:--------------------------------------------------|
| Easy       |               7 |    180 seconds | Learn simple relationships                        |
| Medium     |              10 |    120 seconds | Infer more involved patterns                      |
| Hard       |              15 |     90 seconds | Solve more complex transformations under pressure |

Difficulty labels are product-facing descriptions, not a scientifically
validated measure of player ability.

## 4.3 Challenge structure

The current server generates deterministic numeric transformation
challenges.

- Available experiment inputs are numeric values 1 through 16.
- Each input can be tested once per round.
- The system returns the output associated with the hidden rule.
- The target prediction is for input 17.
- The player selects a predicted output from the candidate set.
- At least one experiment is required before predicting.
- A round ends after a valid prediction or timeout.
- The fifth round completes the match.

The server selects a rule from the difficulty-specific rule set. The
hidden rule is not included in the active public match payload before
resolution. The answer and rule title are returned after the round ends
so the interface can explain the result.

## 4.4 Current rule families

| Difficulty | Rule title            | Transformation                                    |
|:-----------|:----------------------|:--------------------------------------------------|
| Easy       | The double signal     | (2n)                                              |
| Easy       | The offset machine    | (n + 5)                                           |
| Easy       | The triple pulse      | (3n)                                              |
| Easy       | The odd sequence      | (2n + 1)                                          |
| Medium     | The compound signal   | (3n + 2)                                          |
| Medium     | The square shift      | (n^2 + 1)                                         |
| Medium     | The rising offset     | (2n + 3) for odd inputs; (2n + 1) for even inputs |
| Medium     | The weighted sequence | (4n - 3)                                          |
| Hard       | The quadratic chamber | (n^2 + 2n + 1)                                    |
| Hard       | The cubic signal      | (n^3 - 2n)                                        |
| Hard       | The modular cycle     | (((3n^2 + 7) ) + 10)                              |
| Hard       | The compound growth   | (2n^2 + 3n + 1)                                   |

These are the current authored server rules, not evidence that the
catalogue is complete or already balanced through player research.

## 4.5 Scoring rules

A correct prediction earns 1.0 or 0.5 points depending on clue
efficiency.

| Outcome                      | Condition                                                        | Points |
|:-----------------------------|:-----------------------------------------------------------------|-------:|
| Efficient correct prediction | Correct using no more than half the clue budget, rounded down    |    1.0 |
| Late correct prediction      | Correct after the efficient threshold but within the clue budget |    0.5 |
| Incorrect prediction         | Wrong output selected                                            |      0 |
| Timeout                      | Server timer expires before round completion                     |      0 |

Efficient thresholds:

| Difficulty | Clue limit | Full-point threshold |
|:-----------|-----------:|---------------------:|
| Easy       |          7 |              3 clues |
| Medium     |         10 |              5 clues |
| Hard       |         15 |              7 clues |

\[ =

\]

## 4.6 Match win/loss criteria

A match contains five rounds and has a maximum score of 5.0.

- **Win:** final score is greater than or equal to 3.0.
- **Loss:** final score is below 3.0.

The result screen must show the actual score and threshold. A score
below 3.0 must not be presented as a victory.

## 4.7 Match completion data

At match completion, the server records round number, correctness,
points, clues used, player guess, correct answer and rule title.

The final result includes win/loss, score, correct rounds, total clues
used, clue efficiency, previous high score, new personal-best status,
streak changes, coins earned, reward breakdown and per-round summary.

These server-calculated values are the source for the final result UI.

------------------------------------------------------------------------

# 5. Information Architecture

## 5.1 Primary navigation

| Area           | Purpose                              | Entry point                 | Priority                        |
|:---------------|:-------------------------------------|:----------------------------|:--------------------------------|
| Home           | Explain the game and start playing   | Brand / home                | Must have                       |
| Match Setup    | Choose mode and difficulty           | Start Playing / Match Setup | Must have                       |
| How to Play    | Understand the core loop             | Header and Home             | Must have                       |
| Game Workspace | Investigate and predict              | Active match                | Must have                       |
| Round Result   | Review outcome and continue          | After prediction or timeout | Must have                       |
| Match Result   | Review final score and replay        | After round five            | Must have                       |
| Profile        | View stats, streak and friend code   | Profile / streak control    | Should have                     |
| Leaderboard    | Compare friends and global standings | Ranks control               | Should have                     |
| Rewards Shop   | Spend virtual coins on cosmetics     | Coin balance                | Should have                     |
| Account        | Sign in, switch account or sign out  | Header/profile              | Current implementation boundary |

## 5.2 Sitemap

``` mermaid
flowchart TD
    A[Thinksy] --> B[Home]
    A --> C[Match Setup]
    A --> D[How to Play]
    A --> E[Profile]
    A --> F[Leaderboard]
    A --> G[Rewards Shop]
    C --> H[Practice]
    C --> I[Classic]
    C --> J[Time Trial]
    I --> K[Easy / Medium / Hard]
    H --> L[Game Workspace]
    J --> L
    K --> L
    L --> M[Investigate]
    L --> N[Evidence History]
    L --> O[Prediction]
    O --> P[Round Result]
    P --> Q[Next Round]
    P --> R[Match Result]
    Q --> L
    R --> S[Replay]
    R --> B
    R --> F
    E --> T[Player Statistics]
    E --> U[Friend Code]
    G --> V[Themes]
    G --> W[Avatars]
    G --> X[Badges]
```

## 5.3 Navigation rules

- The Thinksy brand returns to Home.
- Start Playing opens a separate Match Setup screen.
- Setup shows the selected mode and difficulty.
- Practice and Time Trial constrain difficulty; the UI explains the
  constraint.
- Exiting an active match returns Home through the exit action.
- A round result offers Next Round when the match is not complete.
- Round five leads to the final match result.
- Replay starts a fresh match.
- Profile, leaderboard and shop should not obscure the meaning of an
  active game state.
- Modal overlays need an obvious close action and must not close when
  the player clicks inside dialog content.

------------------------------------------------------------------------

# 6. Screen Inventory and Responsibilities

| ID   | Screen/component              | Primary purpose                         | Main action                  |
|:-----|:------------------------------|:----------------------------------------|:-----------------------------|
| S-01 | Home                          | Explain Thinksy and invite play         | Start Playing                |
| S-02 | How to Play modal             | Teach the interaction loop              | Got it, let’s play           |
| S-03 | Match Setup                   | Configure a match                       | Start Game                   |
| S-04 | Match Loading                 | Communicate initialisation              | Wait for match               |
| S-05 | Game Workspace                | Gather evidence and predict             | Submit input / Lock in guess |
| S-06 | Round Result                  | Explain correctness and points          | Next Round                   |
| S-07 | Final Match Result            | Show outcome and progression            | Replay / Home / Leaderboard  |
| S-08 | Authentication modal          | Select or enter player identity         | Continue                     |
| S-09 | Profile modal                 | Review personal statistics and identity | Copy code / Sign out         |
| S-10 | Leaderboard modal             | Compare friends and global standings    | Switch tab                   |
| S-11 | Rewards Shop modal            | Browse cosmetic rewards                 | Buy / Equip                  |
| S-12 | Processing and error feedback | Communicate pending or failed actions   | Retry / Continue             |

Each screen should answer one primary player question. Avoid turning the
game workspace into a dashboard or allowing progression features to
compete with the investigation.

------------------------------------------------------------------------

# 7. Low-Fidelity Wireframes

The following structural wireframes describe hierarchy and
responsibilities rather than replacing the final visual design. All
screens follow the same order: **navigation → purpose → primary content
→ supporting information → action**.

## 7.1 Home

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│thinksy.       A GAME OF HIDDEN RULES              STREAK 3d   COINS 350   HELP   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ OBSERVE · EXPERIMENT · INFER           │ THINKSY / SYSTEM 001                    │
│ Looks simple.                          │ UNKNOWN MACHINE                         │
│ Thinks deep.                           │ [        ⌁        ]                     │
│                                        │ INPUT → PROCESS → OUTPUT                │
│                                                                                  │
│A tiny game for your big brain.                                                   │
│Test inputs, study outputs and find the hidden rule before clues run out.         │
│                                                                                  │
│[ START PLAYING ]    [ MATCH SETUP ]    [ HOW TO PLAY ]                           │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│YOUR STREAK                                                                       │
│┌──────────────────────────────────────────────────────────────────────────────┐  │
││  3-DAY STREAK · BEST: 5d                              PROGRESS 3 / 5 DAYS    │  │
│└──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│HOW TO PLAY                                                                       │
│01  Try input                  02  Spot pattern                  03  Make call    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Design intent:** Communicate the game premise immediately and keep the first action unmistakable. Start Playing is the primary action; Match Setup and How to Play remain secondary. The machine visual reinforces the hidden-system metaphor, while the streak panel encourages return play without competing with the core game objective.

**Responsive behaviour:** The hero content stacks on narrow screens. The machine visual may be simplified or hidden on small mobile screens. The streak information and three-step guide become full-width stacked sections, with primary actions remaining easy to reach.

## 7.2 How to Play

``` text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ THE GAME IN 30 SECONDS                                [ × ]                      │
│ Three steps. One hidden rule.                                                    │
│                                                                                  │
│ 01  Feed the machine       Choose an input. See what comes out.                  │
│ 02  Connect the dots       Compare clues to spot the pattern.                    │
│ 03  Lock in your answer    Predict output. Score ≥ 3 to win.                     │
│                                                                                  │
│ 5 ROUNDS · SCORE ≥ 3 TO WIN      [ GOT IT, LET'S PLAY ]                          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The modal teaches the mental model, not the answer to an active puzzle.

## 7.3 Match Setup

``` text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ← BACK                         THINKSY / MATCH SETUP       01 / 02               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ YOUR GAME, YOUR RULES                                                            │
│ Choose how you want to play.                                                     │
│                                                                                  │
│ 01 / GAME MODE                                                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                         │
│ │ PRACTICE       │ │ CLASSIC        │ │ TIME TRIAL     │                         │
│ │ Untimed        │ │ Standard match │ │ Hard · 90 sec  │                         │
│ │ 7 clues        │ │ 3 / 2 / 1.5 min│ │ Beat the clock │                         │
│ └────────────────┘ └────────────────┘ └────────────────┘                         │
│                                                                                  │
│ 02 / DIFFICULTY                                                                  │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                         │
│ │ EASY           │ │ MEDIUM         │ │ HARD           │                         │
│ │ 7 clues · 3:00 │ │ 10 clues · 2:00│ │ 15 clues · 1:30│                         │
│ └────────────────┘ └────────────────┘ └────────────────┘                         │
│ PRACTICE · UNTIMED                      [ START GAME ]                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Mode and difficulty are separate decisions. When Practice or Time Trial
is selected, the fixed difficulty is shown as locked rather than
selectable.

## 7.4 Match Loading

``` text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         [ SPINNER ]                                              │
│                      Starting match…                                             │
│                Preparing the signal chamber                                      │
│                     ━━━━━━━━━━━━━                                                │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Loading is transitional. A server failure must produce an actionable
error rather than an indefinite loading state.

## 7.5 Game Workspace

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│← EXIT MATCH                         THINKSY / CLASSIC                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│SCORE 1.0 / 5       ROUND 2 / 5       CLUES 5 / 10       MEDIUM       TIME 1:42   │
├──────────────────────────────────────────────────────────────────────────────────┤
│PATTERN SYSTEMS                                                                   │
│The signal chamber                                                                │
│A deterministic machine transforms each input using one hidden rule.              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 01 / INVESTIGATE                      │ 02 / MAKE YOUR CALL                      │
│ Choose an unused input.               │ Predict the machine output.              │
│                                       │ TARGET INPUT: 17                         │
│ [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]            │ [ 22 ]  [ 24 ]  [ 26 ]  [ 28 ]           │
│ [ 5 ]  [ 6 ]  [ 7 ]  [ 8 ]            │                                          │
│ [ 9 ] [ 10 ] [ 11 ] [ 12 ]            │ [ LOCK IN GUESS ]                        │
│ [ 13 ] [ 14 ] [ 15 ] [ 16 ]           │                                          │
│                                       │ At least one clue is required.           │
├──────────────────────────────────────────────────────────────────────────────────┤
│YOUR EVIDENCE                                                                     │
│01   2 → 8          02   4 → 14          03   6 → 20          + 2 EARLIER         │
└──────────────────────────────────────────────────────────────────────────────────┘```

**Design intent:** The left panel is dedicated to experiments and evidence; the right panel is reserved for the final prediction. The scorebar keeps match constraints visible without competing with the task.

The interface displays the three most recent evidence rows and indicates when earlier experiments exist. The complete move history remains in match state.

**Responsive behaviour:** Keep the panels side by side on wide screens. On narrow screens, stack them in task order: investigate first, then make the prediction. The mobile workspace may scroll vertically.

## 7.6 Processing Feedback

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│01 / INVESTIGATE                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    THE MACHINE IS PROCESSING YOUR INPUT                          │
│                                                                                  │
│                    Please wait while the result is confirmed.                    │
│                                                                                  │
│                    [ PROCESSING ]                                                │
│                                                                                  │
│Inputs are temporarily disabled while this request is pending.                    │
│                                                                                  │
│The workspace will return to its previous state when processing ends.             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

A fixed processing area prevents the workspace from shifting while a request is pending. The message should identify whether the player submitted an experiment, locked in a prediction or requested the next round. Inputs remain disabled only for the duration of the relevant pending request.

## 7.7 Round Result

``` text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ROUND 2 COMPLETE                                                                 │
│                         [ ✓ ]                                                    │
│                  You found the rule.                                             │
│ Correct prediction! You earned 1 point.                                          │
│ Current score: 2.0 / 5.0                                                         │
│ Round 2/5     Clues used: 3       Needs 1.0 more to win                          │
│                     [ NEXT ROUND ]                                               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Incorrect and timeout states use distinct feedback and show the hidden
rule and target output after the round is resolved.

## 7.8 Final Match Result

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│MATCH COMPLETE                                                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                         VICTORY SECURED                                          │
│                      You cracked the match.                                      │
│                                                                                  │
│       FINAL SCORE                         PERSONAL BEST                          │
│        3.5 / 5.0                            4.0 / 5.0                            │
│        WIN: 3.0 OR MORE                     PREVIOUS: 4.0                        │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│PERFORMANCE                                                                       │
│ACCURACY             CLUES USED          EFFICIENCY          STREAK               │
│80%                  24                  0.15                4 days               │
├──────────────────────────────────────────────────────────────────────────────────┤
│VIRTUAL REWARDS                                           +155 COINS              │
│Match participation                                            +15                │
│Correct predictions                                            +40                │
│Match victory                                                  +100               │
├──────────────────────────────────────────────────────────────────────────────────┤
│[ ONE MORE MATCH ]                                                                │
│[ BACK TO HOME ]                                  [ CHECK LEADERBOARD ]           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The final score is the primary result. Personal best, performance and earned coins provide supporting context. A losing result must use a distinct loss treatment, state the final score clearly and offer **Try Again** without implying that the match was won. Reward amounts must reflect the server response.

## 7.9 Profile

``` text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ PLAYER PROFILE                                          [ × ]                    │
│ [AVATAR] Player name                     Account label                           │
│          player@example.com                                                      │
│ FRIEND CODE: THINK-PLAYER-42                   [ COPY ]                          │
│ HIGH SCORE  STREAK  WIN RATE  TOTAL POINTS  COINS                                │
│ 4.5 / 5    3 days  75%       42.5          350                                   │
│ ACHIEVEMENTS: First Victory · Streak Keeper · Logic Master                       │
│ [ SIGN OUT / SWITCH ACCOUNT ]                                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Profile is a supporting progression destination, not the primary game
screen.

## 7.10 Leaderboard

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│THINKSY LEADERBOARD                                                               │
│[ FRIENDS ]                                      [ GLOBAL TOP 10 ]                │
├──────────────────────────────────────────────────────────────────────────────────┤
│RANK   PLAYER                                  POINTS          STREAK             │
├──────────────────────────────────────────────────────────────────────────────────┤
│  1    Maya Patel                               58.0             7 days           │
│  2    YOU                                      42.5             3 days           │
│  3    Liam Vance                               39.0             2 days           │
│  4    Aanya Rao                                35.5             2 days           │
│  5    Noah Kim                                 31.0             1 day            │
├──────────────────────────────────────────────────────────────────────────────────┤
│YOUR POSITION                                                                     │
│You are currently #2 among friends.                                               │
│                                                                                  │
│FRIEND CODE: THINK-PLAYER-42                         [ COPY CODE ]                │
│[ ADD FRIEND ]                                                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The player’s row is highlighted so their standing is easy to locate. Friends and Global Top 10 are separate views. The supporting message explains the player’s current position within the selected leaderboard. Friend-code actions remain secondary to the ranking.

## 7.11 Rewards Shop

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│REWARDS SHOP                                             BALANCE: 350 COINS       │
│[ ALL ]             [ THEMES ]          [ AVATARS ]          [ BADGES ]           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ THEME                                 │ AVATAR                                   │
│ ┌─────────────────────────────────┐   │ ┌──────────────────────────────────┐     │
│ │                                 │   │ │                                  │     │
│ │          THEME PREVIEW           │  │ │          AVATAR PREVIEW           │    │
│ │                                 │   │ │                                  │     │
│ └─────────────────────────────────┘   │ └──────────────────────────────────┘     │
│ MIDNIGHT OBSIDIAN                     │ QUANTUM CORE                             │
│ 120 COINS                             │ 80 COINS                                 │
│ [ BUY / EQUIP ]                       │ [ BUY / EQUIP ]                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│Each reward displays its category, price, ownership and equipped state.           │
└──────────────────────────────────────────────────────────────────────────────────┘```

Reward cards use the same dimensions and information order. Each item communicates its category, preview, name, coin cost and current ownership/equipped state. Purchase and equip labels must reflect the item’s actual state; do not show a purchase action for an item already owned.

## 8.1 Match setup

| Interaction       | Expected behaviour            | Feedback                            |
|:------------------|:------------------------------|:------------------------------------|
| Select Practice   | Set Practice and force Easy   | Easy selected; difficulty locked    |
| Select Classic    | Allow difficulty selection    | Current difficulty remains selected |
| Select Time Trial | Set Time Trial and force Hard | Hard selected; difficulty locked    |
| Select difficulty | Update Classic difficulty     | Selected card and summary update    |
| Start Game        | Submit mode and difficulty    | Loading, then active match or error |
| Back              | Return Home                   | No match is started                 |

The server normalises fixed-mode difficulty rules.

## 8.2 Experiment interaction

| Interaction            | Expected behaviour                    | Feedback                           |
|:-----------------------|:--------------------------------------|:-----------------------------------|
| Select available input | Submit one experiment                 | Processing banner                  |
| Submit duplicate input | Reject duplicate                      | Used input remains unavailable     |
| Submit while pending   | Prevent concurrent submission         | Inputs disabled                    |
| Successful response    | Add input/output to history           | Evidence row and clue count update |
| Exhaust clue budget    | Prevent more experiments              | Prediction becomes next action     |
| Server failure         | Preserve context and clear busy state | Actionable error                   |

The server rejects invalid inputs, duplicates, completed rounds and
experiments beyond the clue budget.

## 8.3 Prediction interaction

| Interaction                | Expected behaviour             | Feedback                            |
|:---------------------------|:-------------------------------|:------------------------------------|
| Select output chip         | Set selected prediction        | Chip and selected label update      |
| Change output              | Replace current selection      | Previous chip deselected            |
| Guess without selection    | Do not submit                  | Validation message                  |
| Guess before an experiment | Do not submit                  | Guess action remains disabled       |
| Lock in valid guess        | Submit selected output         | Processing feedback                 |
| Correct prediction         | Award server-calculated points | Green result treatment              |
| Incorrect prediction       | Award zero                     | Red/amber treatment and rule reveal |
| Timeout                    | Resolve with zero              | Timeout treatment and rule reveal   |

Prediction is a one-time round-ending action. The player cannot change
the answer after evaluation.

## 8.4 Timer interaction

- Practice has no countdown.
- Classic uses the timer assigned to its difficulty.
- Time Trial always uses the Hard timer.
- The client displays remaining time.
- The server calculates expiry from the round start timestamp.
- Timeout resolves the round with zero points.
- The next round starts a fresh timer.
- The client display is not the authoritative scoring clock.

## 8.5 Round progression and completion

Next Round is available after a round result when the match is not
complete. The server rejects attempts to continue before round
completion or after round five.

At the end of round five, the server calculates score, win/loss,
performance, player statistics and eligible rewards. The client displays
those server-calculated values.

## 8.6 Profile and leaderboard

Profile exposes player name, email, friend code, high score, active and
longest streak, win rate, total points, coin balance and achievements
where data is available.

The Friends leaderboard combines the current player with the configured
friends list. The Global view shows the top ten entries. The player’s
row is highlighted and a standing note explains their relative position.

The current Add Friend affordance must be treated as incomplete: the
supplied route returns a confirmation message but does not persist a
durable friend relationship.

## 8.7 Rewards shop

| Interaction        | Expected behaviour                   | Feedback                     |
|:-------------------|:-------------------------------------|:-----------------------------|
| Open shop          | Retrieve catalogue and balance       | Shop modal opens             |
| Filter type        | Show all/themes/avatars/badges       | Active filter highlighted    |
| Buy item           | Validate item, ownership and balance | Balance updates on success   |
| Buy owned item     | Reject duplicate purchase            | Ownership state shown        |
| Insufficient coins | Reject purchase                      | Explain insufficient balance |
| Equip owned item   | Update active cosmetic               | Equipped state shown         |

The server validates purchase and duplicate ownership. The client
refreshes user and shop data after purchase/equip.

------------------------------------------------------------------------

# 9. Interface States and Error Recovery

## 9.1 Required state coverage

| State      | Where it applies                       | Required behaviour                     |
|:-----------|:---------------------------------------|:---------------------------------------|
| Default    | All screens                            | Show next meaningful action            |
| Hover      | Pointer controls                       | Restrained feedback                    |
| Focus      | Keyboard controls                      | Visible focus indicator                |
| Selected   | Mode, difficulty, output               | Clear selected state                   |
| Used       | Previously tested input                | Show input has been used               |
| Disabled   | Unavailable action                     | Prevent invalid interaction            |
| Processing | Start, move, guess, next, account/shop | Explain what is processing             |
| Success    | Correct guess, purchase, equip, copy   | Confirm exact action                   |
| Incorrect  | Wrong prediction                       | Distinct feedback and rule reveal      |
| Timeout    | Timed round                            | Explain expiry and zero points         |
| Empty      | No evidence                            | Explain clues appear after experiments |
| Error      | Network, server, validation            | Explain issue and recovery             |
| Modal      | Help, auth, profile, leaderboard, shop | Clear close behaviour                  |

## 9.2 Error message requirements

| Situation          | Message direction                                          | Recovery                            |
|:-------------------|:-----------------------------------------------------------|:------------------------------------|
| Server unreachable | Thinksy cannot reach the game server                       | Start/restart server and retry      |
| Static preview     | API returned HTML instead of JSON; run through Node server | `npm start`, then open local server |
| Invalid input      | Choose an available input                                  | Select listed input                 |
| Duplicate input    | Input was already tested                                   | Choose a new experiment             |
| No experiment      | Run at least one experiment before predicting              | Submit input                        |
| No output selected | Choose an output before locking in                         | Select candidate                    |
| Round complete     | Round has ended                                            | Next round                          |
| Time expired       | Round ended because time ran out                           | Review result                       |
| Match complete     | Start another match to continue                            | Replay                              |
| Insufficient coins | Item costs more than current balance                       | Earn coins or choose another item   |
| Item unavailable   | Reward item could not be found                             | Refresh shop                        |

## 9.3 Recovery principles

- Clear pending/busy state after success or failure.
- Do not leave controls disabled after a failed request.
- Preserve active match context when the server has not ended the round.
- Avoid full-screen replacement for ordinary input processing.
- Keep the selected output stable while the player is predicting.
- Use server responses as the source of truth after state-changing
  requests.
- Never show success before server confirmation.

------------------------------------------------------------------------

# 10. Responsive Experience

## 10.1 Design approach

Thinksy is browser-first and uses a compact game viewport. Desktop uses
a header and viewport-sized content. Home uses a two-column hero and
machine illustration. Setup uses mode and difficulty cards. The
workspace uses investigation and prediction panels.

On smaller screens, layouts reflow into a single-column experience. The
relationship between experimentation and prediction must remain clear.

## 10.2 Responsive behaviour

| Component    | Desktop                                            | Tablet                   | Mobile                               |
|:-------------|:---------------------------------------------------|:-------------------------|:-------------------------------------|
| Header       | Brand, status, streak, coins, ranks, help, profile | Reduced metadata         | Compact controls; labels hidden      |
| Home         | Two-column hero and machine visual                 | Tighter two-column       | Single column; machine visual hidden |
| Setup        | Three mode and difficulty cards                    | Reduced spacing          | Stacked full-width cards             |
| Scorebar     | Five metrics in one row                            | Compact metrics          | Three-column/two-row layout          |
| Workspace    | Two panels side by side                            | Tighter two-panel layout | Panels stacked                       |
| Inputs       | Four columns                                       | Four columns             | Four compact columns                 |
| Output chips | Four columns                                       | Four columns             | Four compact columns                 |
| Result modal | Centred modal                                      | Reduced padding          | Scrollable, compact statistics       |
| Leaderboard  | Wider rows                                         | Condensed columns        | Non-essential columns hidden         |
| Shop         | Multi-column grid                                  | Reduced columns          | Responsive cards                     |

## 10.3 Implemented breakpoints

The stylesheet includes rules at `1024px`, `900px`, `720px`, `480px`,
`360px`, a short-height desktop condition at `max-height: 680px` for
widths above `720px`, and `prefers-reduced-motion: reduce`.

These are implementation breakpoints, not proof that every
browser/device combination has been formally validated.

## 10.4 Viewport and scrolling

The CSS establishes a viewport-first layout. On wider screens, the app
shell and primary screens use `100dvh` and hidden overflow to avoid
unnecessary nested scrolling.

On mobile, Home, Setup and Game explicitly allow vertical scrolling
where content requires it. Modals also allow vertical scrolling within a
maximum height.

**Desktop prioritises fitting the experience to the viewport; mobile
prioritises access to all controls and content over a strict no-scroll
rule.**

## 10.5 Responsive requirements to preserve

- Prevent horizontal overflow on primary game screens.
- Keep input and output controls comfortably tappable.
- Preserve the relationship between each input and output.
- Keep prediction accessible.
- Keep score, clue budget and timer legible.
- Stack panels when two columns become too narrow.
- Ensure modal content can be reached by scrolling.
- Test at 320px width and short desktop viewport heights.
- Test long player names, large coin balances and multi-digit outputs.

------------------------------------------------------------------------

# 11. Visual Design System

## 11.1 Design direction

The final visual direction is **dark arcade / fresh green**. Thinksy
should feel like a compact logic console: focused, curious, slightly
mysterious and responsive.

The interface uses dark green-black surfaces, luminous green accents,
system labels, machine imagery and small motion cues. The machine
metaphor supports the reasoning task; it must not make the input/output
behaviour harder to understand.

## 11.2 Colour tokens

| Token           | Value                  | Intended use                   |
|:----------------|:-----------------------|:-------------------------------|
| Background      | `#07100B`              | Main background                |
| Background soft | `#0B1710`              | Secondary background           |
| Panel           | `#101D15`              | Primary panels                 |
| Panel 2         | `#14251A`              | Elevated surface               |
| Text            | `#F1F7F1`              | Primary text                   |
| Text dim        | `#D7E8DA`              | Supporting text                |
| Muted           | `#93A899`              | Secondary descriptions         |
| Green           | `#9DE6A9`              | Main accent and primary action |
| Green bright    | `#B7FFC1`              | Highlight and hover            |
| Green deep      | `#4E9B62`              | Deep accent                    |
| Error red       | `#E65C5C`              | Incorrect prediction           |
| Amber           | Contextual amber tones | Timeout and warning feedback   |

The CSS also uses translucent green borders and background overlays.
Colour must not be the only state indicator; correctness, error and
timeout also use text and icons.

## 11.3 Typography

- **Manrope:** primary interface and body typography.
- **DM Mono:** system labels, metadata, score labels and technical
  annotations.
- **Georgia / Times New Roman:** expressive heading accents.

The HTML loads Manrope and DM Mono from Google Fonts and declares system
fallbacks.

## 11.4 Layout and components

Use consistent panel padding, border radii and alignment. Keep the
workspace balanced between investigation and prediction. Keep the
scorebar compact and readable. Use restrained shadows and green glow to
establish focus. Ensure result modals remain readable with long reward
labels and large statistics.

| Component         | Variants / states                           | Purpose                          |
|:------------------|:--------------------------------------------|:---------------------------------|
| Header            | Default, compact                            | Brand and progression navigation |
| Navigation pill   | Default, hover                              | Streak and coin balance          |
| Primary button    | Default, hover, active, disabled, loading   | Main task action                 |
| Secondary action  | Default, hover                              | Supporting navigation            |
| Mode card         | Default, selected                           | Practice, Classic, Time Trial    |
| Difficulty card   | Default, selected, locked                   | Easy, Medium, Hard               |
| Streak banner     | Current streak, milestone progress          | Return-play incentive            |
| Scorebar          | Normal, urgent timer                        | Match constraints                |
| Input button      | Available, hover, used, disabled            | Experiment selection             |
| Output chip       | Default, selected, disabled                 | Prediction selection             |
| Evidence row      | Default, newly added                        | Input/output association         |
| Processing banner | Move, guess, next, initialisation           | Stable feedback                  |
| Result modal      | Correct, incorrect, timeout, final win/loss | Resolution                       |
| Profile modal     | Default, copied-code state                  | Player identity and stats        |
| Leaderboard modal | Friends, Global                             | Ranking                          |
| Shop modal        | All, Themes, Avatars, Badges                | Cosmetic inventory               |
| Toast/error       | Success, warning, error                     | Action feedback                  |
| Modal close       | Default, hover, focus                       | Close action                     |

## 11.5 Motion and animation

The implementation uses motion for hero entrance, machine orbit,
floating elements, chip hover/selection, processing status, evidence
entrance, modal transitions, result celebration, streak progress and
timer urgency.

Motion should reinforce state changes. It must not delay input, hide
content or prevent task completion. The stylesheet includes a
reduced-motion media query that reduces animation and transition
durations when requested.

## 11.6 Brand expression

“Looks simple. Thinks deep.” and “A tiny game for your big brain.”
establish a light, confident tone. Interaction copy should remain
direct:

- Choose an input.
- Predict the machine output.
- Lock in guess.
- You found the rule.
- Not this time.
- Time ran out.

Avoid verbose explanations during active reasoning. Detailed explanation
belongs in Help and result states.

------------------------------------------------------------------------

# 12. Content Design and UX Writing

## 12.1 Language principles

- Use “input” for an experiment submitted to the machine.
- Use “output” for the system response and candidate answer.
- Use “clue” for the experiment budget and evidence gained.
- Use “prediction” or “guess” for the final committed answer.
- Use “round” for one hidden-rule challenge.
- Use “match” for the five-round sequence.
- Use “score” for points earned across rounds.
- Use “win” only when final score is at least 3.0.
- Keep errors calm, specific and actionable.
- Do not reveal the hidden rule before the round ends.

## 12.2 Preferred terminology

| Use             | Avoid                           | Reason                              |
|:----------------|:--------------------------------|:------------------------------------|
| Choose an input | Click a number                  | Describes the game action           |
| Experiment      | Random click                    | Frames action as evidence gathering |
| Output          | Result number                   | Consistent system language          |
| Evidence        | Click history                   | Emphasises reasoning                |
| Prediction      | Quiz answer                     | Reinforces inference                |
| Lock in guess   | Submit                          | Makes commitment explicit           |
| Round           | Level (for a match segment)     | Matches five-round structure        |
| Match           | Session (in player-facing copy) | Natural game language               |
| Clues left      | Attempts left                   | Matches the experiment metaphor     |
| Hidden rule     | Answer key                      | Preserves discovery                 |
| Match complete  | Game over                       | Neutral and reusable                |

## 12.3 Action hierarchy

Each screen should have one dominant action: Home—Start Playing;
Setup—Start Game; investigation—choose input; prediction—Lock in Guess;
round result—Next Round; final result—One More Match/Try Again;
profile—Copy Friend Code or close; leaderboard—switch tab; shop—Buy or
Equip.

------------------------------------------------------------------------

# 13. Accessibility and Inclusive Design

Accessibility is a design and implementation requirement, not a final
polish task.

### Keyboard and focus

- All essential controls should be keyboard-operable.
- Focus indicators must remain visible.
- Selected mode, difficulty and output states must be perceivable
  without a mouse.
- Modal focus should remain within the modal while open and return to
  the invoking control when closed.
- Escape should close supported overlays.
- Enter should submit a prediction only when the player is interacting
  with a valid prediction control.

The current implementation includes visible `:focus-visible` styling and
Escape-key modal handling. A complete focus trap and focus restoration
audit remains required.

### Colour and state

- Correct, incorrect and timeout states need text/icons as well as
  colour.
- Selected controls need a non-colour indicator.
- Used inputs must be distinguishable from available inputs.
- Text contrast must be measured against final surfaces.
- Small mono labels must remain readable on mobile.

### Motion

- Respect `prefers-reduced-motion`.
- Avoid motion that blocks interaction.
- Keep celebration animation decorative and non-essential.
- Communicate timer urgency through text and values, not animation
  alone.

### Responsive and input accessibility

- Touch targets must be large enough for reliable selection.
- Avoid horizontal scrolling.
- Preserve logical reading order when panels stack.
- Support browser zoom and responsive reflow.
- Do not make evidence comprehension dependent on animation.

The presence of CSS safeguards does not establish full WCAG conformance.
Keyboard, screen-reader, contrast and zoom audits remain necessary.

------------------------------------------------------------------------

# 14. Usability Testing and Validation Plan

## 14.1 What needs to be learned

The first player study should determine whether players can understand
and complete the reasoning loop without coaching.

Key questions:

- Can a first-time player explain the objective?
- Can they distinguish an experiment from a prediction?
- Do they understand the clue budget?
- Can they associate each output with its input?
- Do they know when to stop experimenting?
- Do they understand why an efficient correct answer earns more points?
- Do they understand the 3.0 match threshold?
- Does the rule reveal help after an incorrect prediction?
- Does timer pressure help or frustrate?
- Can players understand the mode constraints?
- Do streaks, coins and rankings add motivation or distract?
- Can players complete the loop on a narrow mobile viewport?

## 14.2 Proposed participants

Conduct an initial moderated qualitative study with approximately 5–8
participants. Include puzzle enthusiasts, casual players, mobile-first
players and desktop-first players. This is a proposed qualitative
sample, not a representative population.

## 14.3 Test tasks

| Task                           | What it tests           | Observe                                |
|:-------------------------------|:------------------------|:---------------------------------------|
| Explain Thinksy from Home      | Product comprehension   | Understanding of hidden-rule discovery |
| Open How to Play               | Help discoverability    | Clarity of the three-step loop         |
| Start Practice                 | Setup comprehension     | Fixed difficulty and no timer          |
| Submit two inputs              | Experiment interaction  | Clue and evidence understanding        |
| Review evidence                | History comprehension   | Input/output association               |
| Select an output               | Prediction interaction  | Candidate and selected state           |
| Submit an incorrect prediction | Result comprehension    | Understanding of rule reveal           |
| Complete a five-round match    | End-to-end loop         | Score and progression                  |
| Explain final score            | Scoring comprehension   | Understanding of 3.0 threshold         |
| Open leaderboard               | Feature discoverability | Rank and standing comprehension        |
| Buy/equip a cosmetic           | Rewards economy         | Cost and ownership comprehension       |
| Repeat on mobile               | Responsive usability    | Scrolling and control accessibility    |

## 14.4 Measures

| Measure                   | Definition                                   | Why it matters           |
|:--------------------------|:---------------------------------------------|:-------------------------|
| Task completion           | Whether task is completed                    | Basic usability          |
| Time on task              | Time needed for core actions                 | Friction                 |
| Misclicks                 | Unintended activation                        | Interaction clarity      |
| Duplicate attempts        | Repeated used inputs                         | Constraint comprehension |
| Prediction confidence     | Confidence before lock-in                    | Reasoning experience     |
| Scoring comprehension     | Ability to explain points and threshold      | Fairness                 |
| Rule-reveal comprehension | Ability to explain the rule after resolution | Learning value           |
| Replay intent             | Whether player wants another match           | Engagement               |
| Mobile completion         | Completion on mobile                         | Responsive quality       |
| Qualitative feedback      | Player explanation of confusion/enjoyment    | Product direction        |

Do not set arbitrary pass rates before the first study. Establish a
baseline, identify repeated friction and revise. Automated tests do not
replace observed player research.

## 14.5 Study method

1.  Introduce Thinksy without explaining every control.
2.  Ask participants to think aloud during a short match.
3.  Observe hesitation, repeated actions and misunderstood feedback.
4.  Ask them to explain the rule they believe the machine follows.
5.  Ask when they think they should stop experimenting.
6.  Observe the final result and ask them to explain the score.
7.  Repeat representative tasks on mobile.
8.  Group findings by severity and frequency.
9.  Convert recurring issues into design or engineering actions.

------------------------------------------------------------------------

# 15. Prototype and Implementation Review

## 15.1 Final implementation reviewed

| File                | Responsibility                                                            |
|:--------------------|:--------------------------------------------------------------------------|
| `index.html`        | HTML shell, viewport metadata, font loading and app entry point           |
| `styles.css`        | Visual system, responsive layouts, components, animations and states      |
| `app.js`            | Client screens, game interaction, modal state, API calls and rendering    |
| `server.js`         | HTTP server, game rules, scoring, timers, player data, rewards and routes |
| `package.json`      | Project metadata, Node requirement and start/test scripts                 |
| `README.md`         | Local setup, player flow and project guide                                |
| `QA_REPORT.md`      | Feature summary and recorded automated test results                       |
| `tests/app.test.js` | Automated HTTP, game-rule and frontend integration tests                  |

The README specifies Node.js 18 or newer and no third-party npm packages
for the core server. Start through `npm start` and open
`http://localhost:3000`. Opening the HTML file directly is unsupported
because the game depends on `/api/*` endpoints.

## 15.2 Implemented experience capabilities

The supplied final implementation includes:

- Home screen, animated machine visual and How to Play modal.
- Separate Match Setup screen.
- Practice, Classic and Time Trial.
- Easy, Medium and Hard configuration.
- Match initialisation loading state.
- Five-round match structure.
- Server-side deterministic rule selection.
- Numeric input selection and input/output evidence history.
- Duplicate-input and clue-budget enforcement.
- Output candidate chips and explicit prediction submission.
- Correct, incorrect and timeout result states.
- Rule reveal after unsuccessful rounds.
- Round points and cumulative score.
- Server-side timed-mode enforcement.
- Final win/loss evaluation.
- Final score and personal-best comparison.
- Performance statistics and reward breakdown.
- Replay and return-home actions.
- Profile modal and player statistics.
- Daily streak presentation.
- Virtual coin balance and rewards shop.
- Themes, avatars and badges.
- Friends and global leaderboard views.
- Friend code presentation and copy interaction.
- Responsive layouts and reduced-motion CSS.

## 15.3 Implementation boundaries

### Authentication

The interface uses Google branding and a Google sign-in flow. The
supplied server route accepts a name, email and optional avatar in the
request body and associates that identity with a stored player record.
The supplied code does not demonstrate a complete Google OAuth redirect,
token verification, provider callback or verified ID-token validation.

**Status:** Google-branded account-selection experience is implemented.
Production Google OAuth is not verified and must not be claimed as
complete.

### User persistence and sessions

The server stores user-related data in `data/db.json` and maintains
active match sessions in an in-memory `Map`, associated with a session
cookie. User records can be written to a local JSON file, while active
match state is held in server memory. This does not establish a
production database, scalable session store, cross-device session
continuity or backup strategy.

### Friends and leaderboard

The leaderboard API combines the current user with configured friends
and global entries. The UI includes a friend code and Add Friend
affordance. The supplied friend-add route returns a confirmation message
but does not establish a durable friend relationship. Treat the current
social layer as configured/demo functionality until relationship storage
and invitations exist.

### Rewards economy

The server contains coin reward calculations and shop purchase/equip
routes. This is a working local implementation, not a production economy
service. Production deployment needs transaction integrity, concurrency
handling, auditability and anti-abuse controls.

### Challenge catalogue

The current server contains four authored rules per difficulty and
generates a numeric signal-chamber challenge. It is not a
general-purpose engine for arbitrary player-authored systems or a large
challenge catalogue.

### Match session persistence

Active match state is held in the in-memory server session map. A
process restart can invalidate active matches. Do not promise resumable
matches across server restarts until persistence is added.

## 15.4 API surface

| Method | Route                | Purpose                                                   |
|:-------|:---------------------|:----------------------------------------------------------|
| GET    | `/api/health`        | Server health                                             |
| GET    | `/api/auth/me`       | Retrieve current session player                           |
| POST   | `/api/auth/google`   | Associate player identity using submitted profile details |
| POST   | `/api/auth/logout`   | Sign out / clear account association                      |
| GET    | `/api/leaderboard`   | Retrieve friends and global ranking data                  |
| GET    | `/api/shop`          | Retrieve catalogue, balance and equipped items            |
| POST   | `/api/shop/purchase` | Purchase a cosmetic item                                  |
| POST   | `/api/shop/equip`    | Equip an owned item                                       |
| POST   | `/api/friends/add`   | Current friend-code response route                        |
| POST   | `/api/match`         | Start a match with mode and difficulty                    |
| POST   | `/api/move`          | Submit an experiment input                                |
| POST   | `/api/guess`         | Submit final output prediction                            |
| POST   | `/api/next`          | Advance to next round                                     |
| POST   | `/api/timeout`       | Resolve an expired timed round                            |
| POST   | `/api/exit`          | Exit active match                                         |

The server also serves the app shell and static assets. API responses
are JSON and use a session cookie for the current player session.

## 15.5 QA evidence supplied

The supplied `QA_REPORT.md` records coverage for:

- App shell and asset delivery.
- Health endpoint.
- Difficulty validation and clue budgets.
- All three game modes.
- Server-side timeout handling.
- Clue rules, duplicate protection, scoring and five-round match.
- Frontend flow from Home through match completion.
- API error handling when HTML is returned instead of JSON.
- Viewport layout and no-reload navigation checks.
- Processing feedback and transitions.
- Responsive and reduced-motion safeguards.
- Google-branded account association and profile persistence.
- Friends/global leaderboard calculations.
- Rewards shop purchases, coin deductions and equipping.
- Win criteria and victory rewards.
- Loss criteria and effort rewards.

The report records **19 tests passed, 0 failed**. This is automated
implementation evidence. It does not establish production security, real
Google OAuth, full device compatibility, accessibility conformance,
durable social functionality or validated player enjoyment.

------------------------------------------------------------------------

# 16. Design Risks and Open Questions

| Risk / question                                     | Why it matters                                          | How to resolve                                          |
|:----------------------------------------------------|:--------------------------------------------------------|:--------------------------------------------------------|
| Small current challenge set                         | Players may encounter repeated patterns                 | Expand catalogue after validating quality               |
| Rules may be too easy or too difficult              | Difficulty labels may not match experience              | Test and tune rules/clue budgets                        |
| Candidate outputs may reveal too much or too little | Prediction quality depends on alternatives              | Evaluate candidate generation                           |
| Clue efficiency threshold may feel arbitrary        | Players may not understand 1.0 vs 0.5                   | Test scoring comprehension                              |
| Timer pressure may reduce reasoning quality         | Time Trial may reward speed over insight                | Compare timed/untimed play                              |
| History shows only last three rows in current view  | Earlier clues may be needed                             | Test and consider expandable history                    |
| Progression UI may compete with primary action      | Home/header may feel dense                              | Observe first-time and returning players                |
| Mobile layout scrolls vertically                    | Viewport-first behaviour is relaxed on mobile           | Validate short/narrow devices                           |
| Google-branded sign-in may be mistaken for OAuth    | Users may assume verified identity                      | Implement actual OAuth before production claims         |
| Friend-add does not persist relationship            | Add Friend implies more than current route does         | Implement relationship storage and invitation lifecycle |
| JSON storage is not production-grade                | Concurrent writes and process failures affect integrity | Move to durable transactional storage                   |
| Match sessions are in memory                        | Active matches can be lost on restart                   | Add persistent session storage if required              |
| Leaderboard may use configured entries              | Players may assume live global coverage                 | Define source, update cadence and ranking               |
| Cosmetic economy can be exploited                   | Coin farming undermines economy                         | Add idempotency, audit and abuse controls               |
| Accessibility safeguards are unverified             | Presence of CSS does not prove usability                | Run keyboard, screen-reader and contrast audits         |

## 16.1 Questions for Phase 4

- What is the production identity and authentication model?
- Which Google OAuth flow and token-verification strategy will be used?
- What database replaces local JSON persistence?
- How should match sessions survive restarts and multiple server
  instances?
- How should friend codes create durable relationships?
- What is the intended leaderboard scope and ranking formula?
- How should the challenge catalogue be authored, versioned and tested?
- Should future challenges support non-numeric systems?
- How should difficulty be calibrated from player behaviour?
- What anti-abuse controls are required for virtual currency?
- What match history and player analytics should be retained?
- What are hosting, latency, monitoring and backup requirements?

These are architecture decisions and should not be guessed in the design
specification.

------------------------------------------------------------------------

# 17. Phase 3 Decisions and Handoff

## 17.1 Final experience decisions

| Decision area       | Phase 3 direction                                                     |
|:--------------------|:----------------------------------------------------------------------|
| Product experience  | Deterministic hidden-rule reasoning game                              |
| Core promise        | Discover a system’s rule through experiments and prediction           |
| Primary interaction | Choose input → observe output → compare evidence → predict            |
| Central screen      | Game Workspace / Signal Chamber                                       |
| Match structure     | Five rounds                                                           |
| Modes               | Practice, Classic and Time Trial                                      |
| Difficulty          | Easy, Medium and Hard                                                 |
| Clue budgets        | 7 / 10 / 15 by difficulty                                             |
| Timers              | Untimed Practice; 180 / 120 / 90 seconds for timed difficulties       |
| Scoring             | 1.0 for efficient correct; 0.5 for later correct; 0 for wrong/timeout |
| Win threshold       | Final score ≥ 3.0 / 5.0                                               |
| Result feedback     | Round result, rule reveal, final score and performance                |
| Progression         | Personal best, streak, coins, cosmetics and leaderboards              |
| Visual direction    | Dark arcade with fresh green accents                                  |
| Typography          | Manrope, DM Mono and serif accent                                     |
| Responsive strategy | Desktop viewport-first; mobile stacked and scrollable where needed    |
| Accessibility       | Visible focus, reduced motion, clear state; formal audit outstanding  |
| Validation          | Moderated player testing in addition to automated tests               |
| Technical handoff   | Preserve server-authoritative rules, scoring and timers               |

## 17.2 Established

- Final visual and interaction direction is represented in the supplied
  application.
- Home, setup, game, result and progression experiences are documented.
- Game rules and score model are traceable to the server.
- Client/server API surface is identified.
- Supplied QA report records 19 passing automated tests.
- Implementation boundaries around identity, friends, persistence and
  sessions are documented.

## 17.3 Not approved as production capability

- Verified Google OAuth.
- Durable friend relationships and invitations.
- Production database and session infrastructure.
- Cross-device active match continuity.
- Production economy integrity and abuse prevention.
- Large or dynamically authored challenge catalogue.
- Full accessibility conformance.
- Moderated usability validation and difficulty balancing.
- Production monitoring, analytics, backup and recovery.

## 17.4 Phase 4 handoff requirements

Phase 4 should treat the current experience as the product constraint.
Technical architecture should support the game loop rather than forcing
the player experience to conform to infrastructure shortcuts.

Investigate:

1.  Authentication and identity verification.
2.  Persistent player profile and match-history storage.
3.  Match session lifecycle and recovery.
4.  Server-authoritative game rules, scoring and timers.
5.  Challenge authoring, selection, versioning and validation.
6.  Friend relationships and leaderboard data integrity.
7.  Virtual currency transactions and cosmetic inventory.
8.  Security, abuse prevention and rate limiting.
9.  Observability, error reporting, analytics and recovery.
10. Deployment, backup and scalability.

The engineering handoff should include the screen inventory, state
model, scoring rules, API contracts, responsive rules and implementation
boundaries documented above.

------------------------------------------------------------------------

# 18. Phase 3 Completion Record

| Area                            | Outcome                                                                    |
|:--------------------------------|:---------------------------------------------------------------------------|
| Product experience direction    | Defined as deterministic hidden-rule reasoning                             |
| Primary player scenario         | Defined                                                                    |
| End-to-end player journey       | Mapped                                                                     |
| Game modes                      | Practice, Classic and Time Trial documented                                |
| Difficulty and clue budgets     | Documented from server rules                                               |
| Timers                          | Documented, including server enforcement                                   |
| Scoring and win/loss            | Documented from server rules                                               |
| Current rule families           | Documented                                                                 |
| Information architecture        | Defined                                                                    |
| Sitemap                         | Included                                                                   |
| Screen inventory                | Defined                                                                    |
| Low-fidelity wireframes         | Included                                                                   |
| Core interactions               | Defined                                                                    |
| Interface states and recovery   | Defined                                                                    |
| Responsive behaviour            | Documented from CSS                                                        |
| Visual system                   | Current tokens and typography documented                                   |
| Motion and reduced motion       | Documented                                                                 |
| Accessibility                   | Requirements defined; formal audit outstanding                             |
| Profile, streak and rewards     | Documented                                                                 |
| Leaderboard                     | Documented with current implementation boundary                            |
| API surface                     | Identified from server implementation                                      |
| Implementation review           | Completed from supplied source files                                       |
| Automated QA evidence           | Supplied report records 19/19 passing                                      |
| Moderated usability testing     | Not yet conducted                                                          |
| Production auth and persistence | Not approved as complete                                                   |
| Phase 3 decision                | Experience documented; proceed to Phase 4 with limitations carried forward |

------------------------------------------------------------------------

## Phase 3 Decision

Thinksy’s final product experience is centred on a repeatable reasoning
loop:

**Choose an input → Observe the output → Compare the evidence → Infer
the rule → Make the prediction.**

The five-round match gives that loop structure. The scoring system
rewards efficient discovery. The result screen makes the outcome
understandable. Streaks, coins, cosmetics and leaderboards give players
reasons to return, while the game workspace remains the main event.

The supplied implementation provides a concrete experience rather than a
conceptual wireframe alone. Its game rules, score model, client/server
flow and responsive visual direction are documented in this phase. The
supplied QA report records 19 passing automated tests.

The next phase should not redesign the core experience by default. It
should strengthen the technical foundations behind it: verified
identity, durable data, reliable sessions, genuine friend relationships,
secure reward transactions and a scalable challenge system. Player
research should validate whether the game is understandable, fair,
satisfying and worth replaying.

**Phase 3 outcome:** Thinksy has a documented final product experience
and an implementation-aligned design reference. Proceed to Phase 4 —
Technical Research & Systems Architecture — with production limitations
and validation requirements explicitly carried forward.

## Reference to Earlier Phases

- **Phase 1 — Problem Discovery & Research:** Establishes the problem
  space, player hypothesis, market context and opportunity.
- **Phase 2 — Product Strategy, Vision, Definition & Brand Identity:**
  Establishes the product thesis, strategic direction, initial scope,
  success measures and brand direction.
- **Phase 3 — Product Design, UX/UI & Experience Architecture:**
  Translates product direction into the player journey, information
  architecture, game rules, screen structure, interaction model, visual
  system, responsive behaviour and implementation-aligned handoff.
- **Phase 4 — Technical Research & Systems Architecture:** Establishes
  production architecture, identity, persistence, game services,
  challenge system, social features, economy integrity and operational
  foundations.

**End of Phase 3 — Thinksy.**
