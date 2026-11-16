# Thinksy — Phase 1: Problem Discovery & Research

## Why This Phase Exists

Before building Thinksy, we need to understand the space it wants to enter. There are already plenty of puzzle and logic games. The question is not whether people enjoy solving puzzles. It is whether Thinksy can offer a kind of reasoning experience that feels worth coming back to.

This phase looks at existing games, the mechanics they use, and the opportunity Thinksy could explore. It is based on desk research and an initial product hypothesis, not direct player validation.

## 1. The Starting Idea

Thinksy starts with a simple idea: give players a system they do not understand, let them interact with it, show them what happens, and let them work out the rules.

The enjoyment should come from figuring something out. A player tries an input, studies the result, compares it with earlier attempts, and gradually builds an explanation of how the system works.

The question is: **what would make this experience different enough from the puzzle games that already exist?**

Hidden rules, pattern recognition, deduction and experimentation are established game mechanics. A new interface or a different presentation of those mechanics is not enough on its own. Thinksy needs a clear reason to exist.

This research focuses on three questions:

- What do existing games already do well?
- What kind of experience could Thinksy add to that space?
- Is there a clear product direction worth taking into design and development?

## 2. What Already Exists

A number of games already ask players to discover something hidden. Some use tests and clues to reveal a rule. Others ask players to narrow down a code or recognise a pattern. Many add daily challenges, progression or competition around that core activity.

A few are especially relevant to Thinksy.

### Cluepool

[Cluepool](https://developers.reddit.com/apps/cluepool) is a close reference for the hidden-rule format. Players submit tests and see whether they satisfy an unknown rule. Each result helps them narrow down the possibilities.

What stands out is that players choose what to test. Deciding which experiment will be useful is part of the challenge.

Cluepool also shows that this format can support practice, daily challenges and competitive scoring. Thinksy should not present hidden-rule discovery or experimentation as a new invention.

### Turing Machine

[Turing Machine](https://www.hachetteboardgames.com/products/turing-machine), by Scorpion Masqué, asks players to identify a hidden code using a set of mechanical verifiers. Players use the evidence to eliminate possibilities and find the correct combination.

It is a useful reference for how a limited set of rules can create a challenging game. The difficulty comes from understanding how the clues relate to one another, rather than from giving players an unlimited number of actions.

The publisher has reported more than seven million generated online problems. This is a publisher-reported figure, not an independently verified measure of active players or commercial demand.

### SYNAPSE

[SYNAPSE](https://1vs1.games/) brings hidden-rule deduction into a browser-based competitive format. Players infer an unknown visual transformation from examples, with ranked one-versus-one play and other modes.

It shows how a deduction mechanic can become a direct competition between players. That could be a future direction for Thinksy, but it does not mean multiplayer should come before the core game is enjoyable on its own.

### Other useful references

These products are not direct substitutes, but they offer useful examples of how intellectual games are presented and played.

- [Matiks](https://matiks.com/) combines short reasoning challenges with duels, daily activity and leaderboards.
- [Chess.com](https://www.chess.com/) shows how one core activity can support different formats, including puzzles, timed challenges and survival modes.
- [GeoGuessr](https://www.geoguessr.com/) shows how an individual skill-based challenge can grow into a competitive experience with rankings and progression.
- [The New York Times Connections](https://www.nytimes.com/games/connections) demonstrates the appeal of a short daily puzzle that people can complete, discuss and return to.

These examples do not prove that Thinksy will work. They do show that players already have plenty of ways to spend time on logic and reasoning games. A hidden rule, a daily puzzle or a leaderboard is not enough to make Thinksy distinctive.

## 3. The Direction Worth Exploring

There are two ways a player could interact with an unfamiliar system.

In a simple version, the player enters an input and receives an output. The system follows a fixed rule. By trying different inputs, the player works out the pattern.

Thinksy could go a step further.

The player enters an input, receives an output, and changes the system in some way. The next input may produce a different result because of what happened earlier. The player has to understand not only the rule, but also how the system behaves over time.

For example:

- The same input may produce different outputs depending on what happened before.
- An action may change an internal condition that the player cannot see directly.
- Two simple rules may interact and produce a less obvious result.
- The order of actions may change the final outcome.

This gives the player more to investigate: the relationship between inputs, history, hidden state and outputs.

The working idea for this is **stateful experimental reasoning**.

It is a product hypothesis, not a proven advantage. Stateful systems could make the game more interesting, but they could also make it confusing. Players need enough information to understand what changed and why.

### Choosing useful experiments

There is another part of the experience worth making central: deciding what to test.

Imagine a player has three possible explanations for how a machine works. They could choose an input that confirms what they already suspect, or choose one that would produce a different result under each explanation.

The second test tells them more.

Thinksy could reward players for asking useful questions, not just for guessing the final answer. The quality of an experiment becomes part of the skill.

Scoring based on how efficiently someone reaches a solution is one possibility. It is not unique by itself—Turing Machine, for example, already considers the number of questions in its competitive structure. The more interesting direction is to combine thoughtful experiment selection with systems that remember previous interactions.

## 4. Who Might Enjoy Thinksy

Thinksy is an entertainment product, not a tool that solves a practical problem. The question is whether there are players who would choose it because they enjoy working things out.

The initial audience is better described by what people enjoy than by age, job title or other demographics.

The likely player:

- Enjoys puzzles, logic games, strategy or pattern recognition.
- Likes discovering an answer rather than being shown one.
- Is willing to try an idea, see it fail and change their explanation.
- Enjoys challenges that become clearer through effort.
- May also enjoy comparing their reasoning or performance with others.

This is an initial audience hypothesis. It has not been validated through player research, and it does not tell us how large the audience might be.

A useful way to describe the opportunity is:

> Build a game for people who enjoy figuring things out. Let them investigate an unfamiliar system, choose useful experiments and understand how its behaviour changes over time.

That gives Thinksy a clearer direction than positioning it as another brain-training app or a collection of difficult puzzles.

## 5. The Experience to Build Around

Thinksy should feel like an investigation, not a quiz.

A player encounters a machine whose behaviour is unknown. They give it an input and see what comes back. They try something else, compare the results and gradually form an explanation.

The satisfying moment should be when the player understands why the machine behaves the way it does—not simply when they get an answer right.

A basic gameplay loop could be:

1. **Observe:** Look at the machine and the information available at the start.
2. **Experiment:** Choose an input or sequence and submit it.
3. **Compare:** Study the output alongside previous results.
4. **Form a theory:** Work out what might explain the behaviour.
5. **Test the theory:** Choose another experiment to distinguish between possible explanations.
6. **Predict:** Use the explanation to anticipate what the system will do.
7. **Solve:** Show that the system is understood, rather than relying on a lucky guess.

The system should behave consistently. Given the same starting conditions and the same sequence of inputs, it should produce the same outputs. Without that consistency, players cannot reliably learn its rules.

### A possible progression

The game can become more challenging by introducing new kinds of behaviour, rather than simply adding more possible answers.

| Stage | System behaviour | What the player works out |
|---|---|---|
| 1. Patterns | Fixed input-output relationships | The basic rule |
| 2. Conditions | Different outcomes under different conditions | Conditional logic |
| 3. Sequences | Input order changes the outcome | Sequence and order |
| 4. Memory | Previous actions influence future behaviour | Hidden internal state |
| 5. Interacting systems | Multiple rules affect one another | Combined behaviour |

This is a proposed progression, not a final level design. Each stage should make sense before the next one is introduced.

Memory and hidden state could be particularly important to Thinksy's identity. They could also be the point where the game becomes hard to follow. The design needs to make changes understandable without revealing the answer.

## 6. What Not to Build Yet

It is easy to make a game look more complete by adding daily challenges, streaks, leaderboards, tournaments, multiplayer, achievements, multiple modes and a large puzzle library.

Some of these may be useful later. None of them proves that the main gameplay is enjoyable.

Thinksy should remain one coherent game built around investigating unknown systems. New modes should offer different ways to experience that mechanic, rather than turn the product into a collection of unrelated games.

For the first version, the priority should be:

- One core game built around an unknown deterministic system.
- A clear relationship between player inputs and system outputs.
- A gradual introduction of patterns, conditions, sequences and state.
- A visible record of experiments so players can refer back to earlier results.
- A way to make and verify predictions.
- A scoring approach that can eventually recognise reasoning quality and experiment efficiency.

Classic play, timed challenges, daily machines, survival formats and eventually competitive or cooperative play are possible future formats. They are not initial commitments.

Leaderboards, leagues, tournaments, multiplayer, monetisation and a large content library can wait until the core experience gives players a reason to return.

## 7. Risks to Keep in Mind

The direction is promising enough to explore, but it comes with some clear design risks.

| Risk | Why it matters |
|---|---|
| The game feels like homework | Players may understand the mechanic without enjoying it. |
| Rules feel arbitrary | Players cannot tell the difference between a difficult challenge and an unfair one. |
| Experiments reveal too little | Players may use attempts without learning anything useful. |
| Experiments reveal too much | The answer may become obvious too quickly. |
| State is hard to follow | Players may lose track of what the system remembers. |
| Complexity grows too quickly | New mechanics may feel like extra rules rather than deeper reasoning. |
| Players have little reason to return | Solving one machine may be satisfying but not lead to repeat play. |
| Competition rewards speed over thought | Players may rush instead of choosing useful experiments. |

Challenge quality also needs careful attention. If Thinksy eventually generates or selects hidden systems, each challenge must have a valid solution, behave consistently and give players enough information to infer the intended rules.

A challenge with several indistinguishable solutions is not necessarily difficult; it may simply be ambiguous.

Cluepool's published development notes are a useful reference for this problem. Its challenge validation considers uniqueness, solvability, ambiguity, truthful clues and challenge rotation. Thinksy will need a similarly careful standard before generated challenges become a dependable part of the game.

## 8. What We Still Don't Know

Desk research helps us understand the category and identify a possible direction. It cannot tell us whether people will enjoy playing Thinksy.

Some important questions remain:

- Will players understand how to interact with the machine?
- Will they enjoy choosing their own experiments, or would they rather receive clues?
- Does stateful behaviour make the game more interesting, or just harder to follow?
- How difficult should a challenge be before it stops being enjoyable?
- Will players want to return after solving a few machines?
- Would competition improve the experience or distract from the reasoning?
- Should challenges be handcrafted, generated, or built using a combination of both?

These questions should influence the first playable version. They should not be answered through assumptions alone.

### Research limitations

This phase is based on desk research, existing product references and an initial product thesis.

No direct player interviews, moderated gameplay sessions, controlled experiments, retention studies or willingness-to-pay research have been conducted.

The competitor review confirms that related mechanics and formats already exist. It does not establish competitors' market share, active player numbers, retention or commercial performance. Publisher and developer claims are treated as claims from those sources unless independently verified.

The motivation research below offers a useful design perspective, but findings from broader video-game studies cannot automatically be applied to Thinksy.

The following remain unvalidated:

- There is a meaningful audience for this specific experience.
- Stateful experimental reasoning will feel distinctive to players.
- Players will enjoy choosing their own experiments.
- Experiment efficiency can become a satisfying measure of mastery.
- The core mechanic can support repeat play without depending on social features or a constant supply of new content.

## 9. Phase 1 Decision

The research gives us a reason to continue with Thinksy, but not a reason to assume the idea is already validated.

Games built around hidden rules, deduction, testing and pattern recognition already exist. Thinksy needs to offer more than a different presentation of those mechanics.

The direction worth taking forward is a game where players investigate a deterministic system whose behaviour can depend on previous interactions. They experiment, compare results, form explanations and use those explanations to predict what happens next.

Two ideas should guide the next phase:

**Stateful experimental reasoning:** Previous actions can influence future behaviour, giving players a system they need to understand over time.

**Meaningful experiment selection:** Players should be able to choose tests that help them distinguish between possible explanations.

These ideas work together. Stateful systems create more interesting questions; thoughtful experimentation gives players a way to answer them.

The first version should focus on finding out whether this interaction is enjoyable. It should not start by trying to prove that Thinksy can become a competitive gaming platform.

**Phase 1 outcome:** Proceed to Product Strategy & Definition with stateful experimental reasoning as the leading product direction. Its differentiation, audience appeal and repeat-play potential remain unvalidated.

## Phase 1 Completion Record

| Area | Outcome |
|---|---|
| Product category | Hidden-rule deduction and reasoning games |
| Existing references | Cluepool, Turing Machine, SYNAPSE and adjacent puzzle products |
| Initial audience | People who enjoy logic, experimentation and intellectual challenges |
| Core opportunity | Investigating unfamiliar systems through experiments |
| Leading product hypothesis | Stateful experimental reasoning |
| Supporting design idea | Experiment selection as a player skill |
| Proposed progression | Patterns → conditions → sequences → memory → interacting systems |
| Market validation | Not completed |
| Player validation | Not completed |
| Commercial validation | Not completed |
| Decision | Proceed to Phase 2 |

## Research References

1. **Cluepool:** [Game overview and development notes](https://developers.reddit.com/apps/cluepool). Hidden-rule deduction, player experiments, daily challenges and challenge validation.
2. **Turing Machine:** [Official publisher product page](https://www.hachetteboardgames.com/products/turing-machine). Deduction through verifiers, hidden codes and increasingly complex problems.
3. **Turing Machine:** [Official rulebook](https://turingmachine.info/files/rules/rules_EN.pdf). Problem structure, verifier interactions and solo/cooperative play.
4. **SYNAPSE:** [Official game website](https://1vs1.games/). Hidden visual transformations, ranked play and competitive logic duels.
5. **Ryan, R. M., Rigby, C. S. & Przybylski, A. (2006).** *The Motivational Pull of Video Games: A Self-Determination Theory Approach.* Motivation and Emotion. [Research paper](https://doi.org/10.1007/s11031-006-9051-8).
6. **Przybylski, A. K., Rigby, C. S. & Ryan, R. M. (2010).** *A Motivational Model of Video Game Engagement.* Review of General Psychology. [Research paper](https://doi.org/10.1037/a0019440).

---

**Phase 1 is complete.** The main decision is to build around the experience of understanding a system, not simply solving a hidden-rule puzzle.
