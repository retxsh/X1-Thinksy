# Thinksy — Phase 2: Product Strategy & Definition

## Why This Phase Exists

Phase 1 identified a direction worth exploring: a game where players investigate unfamiliar systems, run experiments and work out how those systems behave. This phase turns that direction into product choices. It defines what Thinksy is, who it is intended for, what the first version should include and what can wait.

## What We’ve Established So Far

Existing games already use hidden rules, deduction, pattern recognition and experimentation. Thinksy's leading product hypothesis is to build on those familiar ideas with systems whose behaviour can depend on previous interactions. Players would need to choose useful experiments, interpret the results and predict what happens next. This direction is promising, but it has not yet been validated with players.

## What This Means for This Phase

The goal is to make the product direction specific enough to guide design and engineering. That means setting a clear product definition, audience hypothesis, gameplay model, scope, principles and measures for evaluating the first playable version—without treating untested assumptions as facts.

## 1. Product Direction

Thinksy should not become another collection of unrelated puzzle games. Its identity should come from one central activity: investigating a system whose rules are not immediately visible.

A player encounters an unfamiliar system, tries different inputs, studies the outputs and develops an explanation of how it works. In more advanced challenges, earlier actions may change the system and affect what happens next.

This gives Thinksy a clear direction, but it also sets a constraint: new features should strengthen this experience rather than distract from it.

The first version needs to answer one question:

**Is it satisfying to understand an unfamiliar system by choosing experiments, interpreting evidence and predicting what it will do next?**

Everything in the initial product should help answer that question.

## 2. Product Vision

Thinksy aims to make the process of figuring things out into a game.

Players should be able to explore something unfamiliar, interact with it within clear rules, build an explanation from what they observe and show that they understand its behaviour. The satisfaction should come from reaching an insight through their own reasoning.

The longer-term ambition is to create a game with enough depth to reward repeated play. That depth should come from richer systems and more interesting challenges, not simply from adding more features.

### Mission

**Make curiosity playable.**

Thinksy gives players systems to investigate and rewards them for discovering how those systems work.

### Product promise

**You are not given the rule. You discover it.**

This is a statement about the intended experience. It does not mean challenges should be vague or open-ended. Every challenge still needs clear instructions, consistent feedback and a fair route to a solution.

## 3. What Thinksy Is

Thinksy is a single-player intellectual reasoning game in which players investigate hidden deterministic systems through controlled experiments.

A player submits an input or sequence of inputs. The system returns an output and may update its internal state. By comparing results across experiments, the player forms and tests explanations of the system's rules. The challenge is complete when the player can correctly infer or predict its behaviour.

This definition describes the activity, not the final interface. The machine metaphor is a useful way to present the game, but Thinksy is not limited to a literal machine, a particular visual style or a specific set of input controls.

### What it is

- A reasoning game built around experimentation and deduction.
- A game where players choose what to test.
- A deterministic environment where outcomes can be understood from evidence.
- A progression from simple relationships to systems with conditions, sequences and memory.
- A focused experience where understanding is the main source of progress.

### What it is not

- A general-purpose brain-training platform.
- A collection of unrelated puzzle games.
- A coding tutorial or programming environment.
- A random guessing game.
- A simulation whose behaviour changes unpredictably.
- A competitive platform whose value depends on leaderboards or multiplayer.

These boundaries help keep the product focused. Features that do not strengthen the central investigation experience should not shape the first release.

## 4. Who Thinksy Is For

Thinksy should initially be designed around what people enjoy doing, rather than a broad demographic definition.

The primary audience hypothesis is people who voluntarily spend time on logic puzzles, strategy games, pattern challenges and other activities that reward careful thought. They enjoy working something out, not just receiving an answer.

They may enjoy:

- Discovering patterns and relationships.
- Solving problems where the answer is not immediately obvious.
- Testing an idea and learning from the result.
- Challenges that become understandable through effort.
- Seeing evidence build towards a conclusion.

They do not need to be programmers, mathematicians or specialists. The game should teach its own rules through play.

### Primary audience: curious problem-solvers

These players are likely to value the satisfaction of insight and mastery. They should have room to form theories, test ideas and revise their understanding.

### Secondary audience: competitive puzzle players

These players enjoy comparing performance, improving scores and testing their ability against others. They may become important if Thinksy develops a fair way to measure reasoning quality.

They are a secondary audience because competition should amplify a compelling game, not compensate for a weak one.

### Audience not prioritised at launch

The first version should not be designed primarily for:

- People looking for a broad library of casual mini-games.
- Players who mainly want reflex-based action.
- Users seeking formal cognitive assessment or claims about intelligence.
- Competitive players who expect ranked multiplayer from their first session.

These people may still enjoy Thinksy, but their expectations should not determine the initial product.

### Audience confidence

This is a reasoned starting hypothesis based on the product category and comparable games. It is not a validated audience segment. The first playable version needs to show whether these motivations translate into actual enjoyment and repeat play.

## 5. Positioning and Value Proposition

Thinksy should be positioned as an **experimental reasoning game**.

The phrase communicates that players actively investigate, test and discover. It also leaves room for the systems to become more sophisticated without changing the product's identity.

### Positioning statement

For people who enjoy figuring things out, Thinksy is a reasoning game where players uncover how unfamiliar systems work by experimenting with inputs, studying outputs and predicting behaviour.

Unlike a conventional quiz or fixed-answer puzzle, Thinksy makes the investigation itself part of the challenge.

### Core value proposition

**Discover the rules. Understand the system. Predict what happens next.**

The value is the experience of moving from uncertainty to understanding.

### Messaging principles

Product language should communicate curiosity, discovery and mastery. Avoid claims about intelligence or cognitive improvement that have not been supported by evidence.

Useful language:

- Experiment.
- Discover.
- Infer.
- Predict.
- Understand the system.
- Find the rule.

Avoid claims such as:

- Become smarter.
- Increase your IQ.
- Scientifically improve your intelligence.
- The world's first hidden-rule game.
- Unlimited brain training.

These either require evidence Thinksy does not have or claim ownership of a category it does not own.

## 6. The Core Gameplay Model

The core loop is the most important part of the product strategy. Every feature in the first version should make this loop clearer, more satisfying or more challenging.

1. **Encounter:** The player sees an unfamiliar system and the challenge objective.
2. **Inspect:** The player understands the available inputs, outputs and constraints.
3. **Experiment:** The player chooses an input or sequence and submits it.
4. **Observe:** The system returns a deterministic result and, where relevant, updates its internal state.
5. **Compare:** The player reviews the new result alongside previous experiments.
6. **Infer:** The player develops an explanation of the rules.
7. **Predict:** The player applies that explanation to a new case or predicts what happens next.
8. **Resolve:** The game confirms the result and provides useful feedback.

Each experiment should feel like a decision. Players should not simply press buttons until an answer appears.

### The role of the system

The system is the puzzle and the environment the player is trying to understand. It should behave consistently and provide enough evidence for its rules to be inferred.

Players do not need access to the system's internal implementation. They need a reliable way to interact with it and understand the consequences of each action.

### Determinism is non-negotiable

If the same system begins in the same state and receives the same sequence of inputs, it must produce the same sequence of outputs and state changes.

This is essential to fair reasoning. If identical experiments can produce different outcomes without an explanation the player can discover, they cannot tell whether their own assumptions are wrong or the game is inconsistent.

Randomness may be used to select or generate a challenge before play begins. It should not undermine the rules within an active challenge.

## 7. The Role of State and Memory

Stateful behaviour is the leading product distinction to explore.

In a simple system, an output depends only on the current input. In a stateful system, the output can also depend on the system's current internal condition, which may have changed because of earlier inputs.

Players must reason not only about what an input does, but also about what it changes and how that change affects later behaviour.

For example, a system might:

- Count how many times a particular input has been used.
- Switch behaviour after a certain sequence.
- Remember the previous input.
- Change an internal mode when a condition is met.
- Produce different outputs depending on its current state.

These are examples of possible behaviours, not a commitment to include every one in the first release.

The key design principle is that state must be inferable. Players may not see the internal state directly, but they need enough consistent evidence to reason about it.

A hidden state that cannot be inferred is not an interesting mystery. It is an arbitrary obstacle.

## 8. Progression and Difficulty

Thinksy should introduce complexity in a deliberate sequence. Each stage should add a new kind of reasoning while reusing what the player has already learned.

| Stage | System capability | What the player learns |
|---|---|---|
| 1. Patterns | Fixed input-output relationships | Identify a consistent rule |
| 2. Conditions | Behaviour changes under defined conditions | Infer conditional logic |
| 3. Sequences | Input order affects results | Reason about order and sequence |
| 4. Memory | Previous interactions affect future behaviour | Infer hidden state |
| 5. Interacting systems | Multiple rules influence the same outcome | Understand combined behaviour |

This is the intended progression, not a promise that the first release will contain a large campaign across all five stages.

The first playable version should establish the quality of the early stages and show that the move towards stateful behaviour is understandable. Later stages should be expanded only when the core experience justifies the added complexity.

### Difficulty should come from reasoning

Difficulty can increase through:

- More plausible explanations for the observed behaviour.
- Less obvious relationships between inputs and outputs.
- Conditions that require carefully chosen experiments.
- Sequences where order matters.
- State changes that must be inferred from several observations.
- Interactions between rules the player has already learned.

Difficulty should not come from unclear instructions, unexplained exceptions, inconsistent behaviour, excessive trial-and-error or arbitrary restrictions designed only to frustrate the player.

## 9. Experiment Design

Choosing experiments should be a core part of Thinksy, not just a way to reveal clues.

A useful experiment helps the player distinguish between possible explanations. The best experiment is not necessarily the most complicated input; it is the one that provides the most useful evidence.

For example, a challenge may have several possible rules that explain the results so far. The player could repeat a familiar test or choose an input for which those explanations predict different outcomes. The second choice is more informative.

Thinksy should make this kind of thinking possible without requiring players to understand formal information theory or technical terminology.

### Feedback on experiments

Feedback should help players understand what happened without revealing the answer too early.

The game should:

- Keep a readable history of submitted experiments and their results.
- Make it clear which input produced which output.
- Distinguish a new result from a repeated test.
- Explain the result of a completed challenge.
- Avoid treating an experiment as wrong simply because it did not confirm the player's current theory.

An experiment can be useful even when the player's prediction is incorrect. The product should preserve that distinction.

## 10. Initial Product Scope

The first release should be a small, complete version of the core game.

It should not attempt to deliver every progression stage, every possible format or a competitive ecosystem. Its job is to make the central experience playable and help establish whether people want more of it.

### Core capabilities

| Capability | Initial scope | Why it matters |
|---|---|---|
| Challenge introduction | Explain the objective and available interaction | Players need to know what they are investigating |
| Deterministic system | One clearly defined hidden system per challenge | Establishes a fair reasoning environment |
| Player inputs | Allow valid experiments to be submitted | Makes the player an active investigator |
| System outputs | Return consistent results | Supplies evidence |
| Experiment history | Show previous inputs and outputs | Supports comparison and hypothesis formation |
| Prediction or solution | Let the player demonstrate understanding | Gives the challenge a meaningful resolution |
| Result feedback | Explain the outcome and reveal the intended rule after completion | Makes each challenge useful to learn from |
| Progressive difficulty | Introduce a small sequence of increasingly expressive systems | Tests whether the mechanic can support progression |

### Content approach

Start with a curated set of deliberately designed challenges.

Handcrafted challenges make it easier to control clarity, difficulty, ambiguity and learning progression. They also make it easier to understand why a player succeeds or gets stuck.

Procedural generation may eventually help Thinksy produce variety at scale, but it creates a difficult validation problem. Generated challenges must be solvable, unambiguous and appropriately difficult. Building a generator before understanding what makes a good challenge would automate uncertainty rather than solve it.

The initial decision is to prioritise challenge quality over challenge quantity.

### Platform direction

The initial product should be browser-first, with a responsive interface that works on desktop and mobile screens.

This is a product direction, not a final technical architecture. The technical phase will determine the implementation. Browser-first delivery keeps the game easy to try without requiring an app installation.

The core interaction should work with mouse, keyboard and touch wherever practical. The experience should not assume that every player is using a desktop.

## 11. What Can Wait

Several features could become useful after the core game is established. They should not expand the first release.

| Deferred feature | Why it can wait | When to reconsider |
|---|---|---|
| Ranked multiplayer | Needs fair scoring, matchmaking and a compelling competitive loop | Solo gameplay shows durable appeal |
| Global leaderboards | May reward speed or volume rather than reasoning | A meaningful, abuse-resistant score exists |
| Leagues and tournaments | Add operating and community complexity | There is evidence of an active competitive audience |
| Daily challenges | Need a dependable content pipeline and a reason to return | Challenge quality and repeat play are established |
| Large procedural content engine | Challenge validity and difficulty calibration are unresolved | A reliable challenge specification and validator exist |
| Social features | Do not establish the core mechanic | Players show a clear need to share or collaborate |
| Monetisation | Willingness to pay has not been studied | Core value and audience behaviour are better understood |
| Cognitive assessment claims | No evidence currently supports them | Appropriate scientific evidence and review exist |
| Unrelated mini-games | Would dilute the product identity | Not part of the current strategy |

Deferring a feature does not mean rejecting it permanently. It means the feature needs a reason to be included.

## 12. Scoring and Mastery

Scoring should reinforce the kind of thinking Thinksy wants to encourage.

A score based only on completion time could push players towards rushing and guessing. A score based only on the number of attempts could penalise players who carefully explore a system. Neither measure, by itself, captures reasoning quality.

The first version should record enough information to evaluate possible scoring models:

- Whether the player reaches the correct solution.
- How many experiments they use.
- Whether experiments are repeated.
- Whether the player can make a correct prediction on a new case.
- How much assistance or hinting was used, if hints are introduced.

These are possible signals, not a final formula.

The first release should prioritise clear completion and useful feedback over a complex scoring system. A competitive score should be introduced only when it can be explained simply and reflects a skill the game genuinely values.

The important distinction is between solving a challenge and understanding the system. A lucky guess should not be treated as equivalent to demonstrated understanding.

## 13. Product Principles

These principles should guide decisions across design and implementation.

1. **The system must be fair.** Every outcome follows consistent rules. Difficulty comes from discovering those rules, not unexplained exceptions.
2. **The player controls the investigation.** Players choose experiments and decide what to learn next. The game should not reduce the experience to passive clues.
3. **Every result must be interpretable.** Not every experiment needs to be useful, but every result must be understandable and reliable.
4. **Complexity must be earned.** New system behaviours should build on concepts the player has already encountered.
5. **State must be discoverable.** The system may hide its internal condition, but its effects must be observable and inferable.
6. **The game should reward understanding.** Completion, scoring and feedback should distinguish insight from random success wherever practical.
7. **One coherent game comes before more features.** New formats should extend the central mechanic rather than compete with it.
8. **Claims must match evidence.** Thinksy should not claim cognitive benefits or proven retention without appropriate evidence.

## 14. How We’ll Evaluate the First Version

Thinksy has no usage baseline yet. Setting arbitrary targets for retention, completion or engagement before a playable product exists would create false precision.

This phase therefore defines what success should mean and what the first tests should measure. Numerical thresholds can be set after initial usability and gameplay observations provide a baseline.

### Core experience measures

| Measure | What it tells us | Why it matters |
|---|---|---|
| Challenge start rate | Whether players begin after seeing the introduction | Tests initial appeal and clarity |
| First experiment rate | Whether players understand how to interact | Tests onboarding |
| Experiment-to-result success | Whether the interaction works reliably | Tests functional quality |
| Challenge completion rate | Whether players can reach a solution | Tests clarity and difficulty |
| Prediction accuracy | Whether players can apply inferred rules to a new case | Tests understanding rather than guessing |
| Experiment count to completion | How much investigation a challenge requires | Helps evaluate difficulty and efficiency |
| Hint usage, if available | Where players need assistance | Helps identify confusing rules or weak feedback |
| Abandonment point | Where players stop progressing | Helps identify friction and difficulty spikes |

### Return-play measures

Once real usage exists, measure:

- Whether players voluntarily start another challenge after completing one.
- Whether they return for another session.
- Whether they progress to more complex systems.
- Whether they replay challenges to improve their result.
- Whether they recommend or share the experience without being prompted.

These measures need to be read together. A high completion rate with no voluntary return may mean the game is understandable but not compelling. A low completion rate could point to difficulty, poor onboarding or a genuinely challenging experience. Observation is needed to tell the difference.

### What numbers cannot tell us

Gameplay observation should also capture:

- What players think the system is doing.
- Which experiments they choose and why.
- Whether they understand how earlier actions affect current outcomes.
- When they experience an insight.
- When they feel confused or believe the system is unfair.
- Whether they want to play another challenge after finishing.

The quality of the reasoning experience matters more than activity volume alone.

## 15. Assumptions to Keep Visible

The strategy rests on assumptions that still need to be tested.

| Assumption | Current position | What would strengthen confidence |
|---|---|---|
| Players enjoy investigating unknown systems | Plausible, not validated for Thinksy | Observed voluntary play and positive feedback |
| Stateful behaviour adds meaningful depth | Leading product hypothesis | Players understand and enjoy challenges that use memory |
| Experiment choice is an engaging skill | Design hypothesis | Players make deliberate tests and value the results |
| The mechanic can support progression | Proposed, not validated | Players learn new system behaviours without excessive confusion |
| A curated challenge set is enough for an initial release | Product decision | A small set creates varied, satisfying experiences |
| Browser-first access is appropriate | Product direction | Usability across desktop and mobile |
| Players will return | Unknown | Repeat sessions and voluntary continuation |

Acknowledging uncertainty makes the strategy more useful. It shows which choices are grounded and which still need evidence.

## 16. Risks and Responses

**The product feels too abstract.** A hidden system can be intellectually interesting but emotionally distant. The interface needs to make the system's behaviour tangible, and players need to see progress after each interaction.

**Players do not know what to test.** Open experimentation can become overwhelming. Early challenges should constrain the available inputs and teach players how to compare outcomes before introducing more freedom.

**Stateful behaviour becomes confusing.** The game needs to preserve experiment history and communicate state changes through observable consequences. It should not rely on players remembering a long sequence without support.

**The game becomes trial and error.** Challenge design needs to make experiments informative. Players should be able to improve their understanding, not simply exhaust possible inputs.

**The product grows before the core loop is proven.** Multiplayer, generated content and competitive systems should remain deferred until the central experience demonstrates appeal.

**A challenge is easy to solve but hard to explain.** Each challenge needs a clear intended rule and a reliable way to verify that the player has understood it.

## 17. Decisions for the Next Phase

Phase 2 establishes the product direction. Phase 3 will turn that direction into a player experience: screens, interaction states, onboarding, challenge flow, feedback, experiment history and the rules governing how players move through a challenge.

The working product baseline is:

| Decision area | Direction |
|---|---|
| Product type | Single-player intellectual reasoning game |
| Core experience | Experiment, discover, infer and predict |
| Product thesis | Investigate unfamiliar deterministic systems |
| Leading distinction to explore | Stateful experimental reasoning |
| Supporting mechanic | Meaningful experiment selection |
| Primary audience | Curious problem-solvers who enjoy logic and discovery |
| Positioning | Experimental reasoning game |
| Progression | Patterns, conditions, sequences, memory and interacting systems |
| Initial content | Small, curated set of challenges |
| Platform direction | Browser-first and responsive |
| Initial priority | Prove the core gameplay experience |
| Deferred priorities | Multiplayer, rankings, leagues, monetisation and large-scale generation |
| Validation status | Product hypotheses remain unvalidated |

## Phase 2 Completion Record

| Area | Outcome |
|---|---|
| Product vision and mission | Defined |
| Product definition | Defined |
| Target audience hypothesis | Defined |
| Positioning and value proposition | Defined |
| Core gameplay model | Defined |
| Stateful system direction | Established |
| Progression strategy | Proposed |
| Initial product scope | Defined |
| Deferred features | Recorded |
| Scoring direction | Principles established; formula deferred |
| Success measures | Defined; numerical targets deferred until a baseline exists |
| Strategic assumptions and risks | Documented |
| Decision | Proceed to Phase 3 |

---

**Phase 2 decision:** Thinksy will be developed as one browser-first experimental reasoning game. Players discover how unfamiliar systems work by choosing experiments, interpreting evidence and making predictions. The first product needs to prove that this is a satisfying experience before investment in scale, competition or monetisation.
