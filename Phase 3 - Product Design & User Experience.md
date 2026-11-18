# Thinksy — Phase 3: Product Design & Experience Architecture

## Why This Phase Exists

Phase 1 identified a direction worth exploring: a game built around investigating unfamiliar systems and learning how they behave. Phase 2 defined Thinksy as a single-player reasoning game where players experiment with inputs, study outputs and predict what a system will do.

This phase turns that product direction into a player experience. It defines how someone enters the game, interacts with a challenge, reviews evidence and reaches a conclusion.

The central design challenge is to keep the system's rules hidden without making the game itself confusing. Players should have to work out how the system behaves, but they should always understand how to interact with it.

This phase focuses on the experience and its structure. Visual styling, technical architecture and implementation details will be developed in later phases.

## 1. The Design Objective

Thinksy should feel like an investigation, not a conventional quiz.

A player encounters a system they do not understand. They try an input, study the result, compare it with earlier attempts and decide what to test next. Over time, they form an explanation and use it to make a prediction.

The satisfying moment should come from understanding why the system behaves the way it does, not simply from getting an answer right.

A successful experience should move through a series of moments:

1. **Curiosity:** What is this system doing?
2. **Exploration:** What happens if I try this?
3. **Recognition:** How does this result compare with the last one?
4. **Hypothesis:** What rule could explain these observations?
5. **Testing:** What experiment would distinguish between possible explanations?
6. **Understanding:** Can I explain why the system behaved this way?
7. **Prediction:** Can I work out what it will do next?
8. **Resolution:** Was my explanation correct, and what did I miss if it wasn't?

The design should make progress feel like the result of better experiments and stronger explanations, rather than repeated guessing.

The central design principle is:

**Make the investigation visible without making the answer visible.**

Players should be able to review the evidence they have collected. They should not have to remember every output or reconstruct a sequence from memory. At the same time, the interface should not reveal hidden internal state or explain the rule before the player has had a chance to discover it.

## 2. The Player Journey

The player journey should take someone from first contact with Thinksy to an independent investigation. It should work for a first-time player without becoming restrictive as challenges get harder.

### Arrival

The opening experience should communicate the premise quickly: there is a system, its behaviour is not fully known, and the player must work out how it works.

The player should be able to start a challenge without navigating a complicated menu or reading a long explanation.

### First challenge

The first challenge introduces the basic input-output exchange. The player needs to understand:

- What kind of input the system accepts.
- Where to enter or select that input.
- How to submit it.
- Where the result appears.
- How to run another experiment.

The first challenge should teach through interaction. Short instructions can explain a control when needed, but the player should not have to complete a long tutorial before playing.

### Guided interaction

A small amount of guidance can draw attention to the input control, output area or experiment history. This guidance should teach the interaction model, not reveal the hidden rule.

Once the player understands how to operate the system, they should be free to investigate it independently.

### Independent experimentation

The player chooses inputs, submits experiments and studies the returned outputs. Each experiment becomes part of the evidence available for the next decision.

This is where the central mechanic becomes active. The player is no longer following instructions; they are deciding what to test.

### Hypothesis and prediction

The player gradually forms an explanation of the system. The first version does not need a dedicated hypothesis editor or note-taking tool. It does need to make the evidence behind a hypothesis easy to inspect.

When the player is ready, they make a prediction. This should be a deliberate action, separate from submitting another experiment. The interface must make clear what is being predicted and when the answer is committed.

### Resolution and continuation

The game evaluates the prediction and explains the result. A correct answer should confirm the player's understanding. An incorrect answer should make it possible to review the evidence and continue experimenting, if the challenge rules allow it.

After resolution, the player should have a simple next step: continue to another challenge, return to challenge selection or leave the game. The completed result should remain accessible without forcing the player through a long post-game flow.

## 3. Information Architecture

Thinksy is one game, so its initial navigation should stay small. The proposed top-level areas are:

| Area | Purpose |
|---|---|
| Home | Explain the game and provide a clear route into play |
| Play | Present available challenges and progression |
| Challenge | Host the investigation experience |
| Results | Show the outcome and explain the challenge |
| Progress | Show completed challenges and current position |
| Settings | Provide essential experience and accessibility preferences |

A profile or account area can be considered when the identity and persistence model is clearer. It should not become a prominent destination before an account provides meaningful value.

### Home

Home should communicate the premise and make starting a game the primary action. It may include a short description, a featured challenge and a simple progress indicator for returning players.

It should not become a dashboard full of rankings, statistics and secondary features.

### Play and challenge selection

The Play area gives access to available challenges. A curated sequence is a better starting point than a large catalogue. The selection experience should make it clear where a player can begin and what they can play next.

Difficulty labels may help players choose, but they should describe the authored challenge rather than imply a scientific measure of intelligence or ability.

### Challenge workspace

The challenge workspace is the central environment for the game. Players should be able to conduct the core investigation without moving between separate pages.

### Results and progress

Results should explain whether the challenge was completed, what the prediction demonstrated and what the player can do next.

Progress should initially answer simple questions:

- Which challenges have I completed?
- Where am I in the challenge sequence?
- Which challenges can I play next?

Streaks, rankings and detailed performance statistics can wait until there is evidence that they add value.

## 4. The Challenge Workspace

The workspace is where Thinksy's product promise becomes an actual interaction. It should bring four functional areas together:

1. **System:** The object being investigated and the context needed to understand the challenge.
2. **Input:** The controls used to submit an experiment.
3. **Output:** The observable response returned by the system.
4. **Experiment history:** The ordered record of previous inputs and outputs.

These should feel like parts of one investigation, not four unrelated panels.

### System

The system area introduces what the player is investigating. Depending on the challenge, it might be represented as a machine, sequence processor, symbolic interface or another visual metaphor.

It should communicate the objective, accepted input type and any visible constraints. It may also show a player-facing indication of the current state when that information is intentionally part of the challenge.

The hidden internal state must remain hidden unless the challenge is specifically designed to expose it as evidence.

### Input

The input area is where the player constructs and submits an experiment. Its controls should reflect the challenge.

A numeric system may use a number field. A sequence-based system may need a sequence builder. A system with a limited set of actions may use selectable controls. One generic input control should not be forced onto every challenge if it makes the interaction harder to understand.

The interface should clearly communicate when an input is incomplete or invalid, when it is ready to submit, when it has been submitted and when the system is processing it. Validation should prevent malformed actions without revealing the hidden rule.

### Output

The output area displays the result of the submitted experiment. The result should be prominent, stable and easy to compare with earlier results.

Numbers, sequences, symbols and state descriptions should retain the structure that matters to reasoning. The latest output should be easy to identify, while earlier outputs remain available in the history.

Animation can acknowledge that an experiment has been processed, but it should never obscure the evidence.

### Experiment history

Experiment history is a core gameplay feature, not a secondary activity log.

Each record should preserve:

- The input submitted.
- The output returned.
- Its position in the current attempt.
- Any visible sequence or state context needed to interpret the result.

Order matters, especially for stateful systems. The same input may produce a different output after earlier actions have changed the system. A history that shows isolated input-output pairs without sequence context could misrepresent what happened.

The first version can use a simple chronological list. Filtering, grouping, annotations and comparison tools should be added only if they solve a demonstrated problem.

### Workspace hierarchy

The challenge objective provides context. The system and input controls support the player's next action. The latest output makes the result visible. The history preserves accumulated evidence. The prediction action becomes available when the challenge rules allow it.

The spatial arrangement can change across screen sizes, but these functional relationships should remain intact.

## 5. The Core Interaction Model

The core interaction is:

**Construct → Submit → Observe → Compare → Continue**

The player constructs an input, submits it, observes the response, compares it with previous evidence and chooses what to do next.

### Construct

The player prepares an input using the controls provided by the challenge. The accepted format should be clear, but the interface should not reveal which input is likely to produce a particular output unless that information is part of the challenge.

### Submit

The player submits the experiment. The game should acknowledge the action and prevent accidental duplicate submissions. If processing takes time, the interface should communicate that clearly.

### Observe

The system returns an output. It should be presented as evidence, not as an interpretation. The game should not explain what the output means before the player has had an opportunity to reason about it.

### Compare

The player compares the latest result with earlier experiments. The interface must preserve the evidence and sequence required to make that comparison.

### Continue

The player chooses another experiment, makes a prediction, requests a permitted hint or exits the challenge. The next action remains the player's choice, subject to the challenge rules.

## 6. Stateful Systems and Memory

Stateful experimental reasoning is Thinksy's leading product thesis. The experience should support it from the beginning, even if the first challenge introduces state gradually.

In a stateless system, the output depends on the current input:

\[
y = f(x)
\]

In a stateful system, the output and next state depend on the current state and input:

\[
(s_{t+1}, y_t) = F(s_t, x_t)
\]

Where:

- \(s_t\) is the system's internal state before the experiment.
- \(x_t\) is the player's current input.
- \(y_t\) is the observable output.
- \(s_{t+1}\) is the system's internal state after the experiment.

The player may not see the internal state. They observe outputs and use the sequence of experiments to infer how the system changes.

### What the player needs to see

The player must be able to review the actions and outputs that led to the current point in the challenge. Earlier evidence should not disappear silently, and each output must remain clearly associated with its input.

If the current state affects the meaning of a new experiment, the history must preserve enough context for the player to reason about that dependency.

### What should remain hidden

The internal state and transition rule are part of the challenge. They should not be exposed by default.

The design needs to preserve the distinction between:

- What the system knows internally.
- What the player can observe.
- What the player can infer.
- What the player demonstrates through a prediction.

Phase 4 defines how the technical architecture protects this boundary. Phase 3 establishes it as an experience requirement.

### Reset and sequence behaviour

Reset behaviour needs particular care because state is part of the gameplay. The experience should distinguish between three actions:

- **Start a new challenge:** Begin with the challenge's defined initial state.
- **Reset the system:** Return the system to its initial state within the current challenge, if resetting is allowed.
- **Clear or retain history:** Change the visible experiment record according to the challenge rules and purpose of the reset.

These actions should not be hidden behind one ambiguous control. The player must understand whether an action changes the system state, the current attempt, the visible history or more than one of these.

The exact reset policy may differ by challenge and should be defined as part of its rules.

## 7. Onboarding and Progressive Learning

Onboarding should teach players how to investigate, not how to solve every challenge.

The proposed sequence is:

1. **Learn the exchange:** Submit an input and observe an output.
2. **Compare observations:** See how multiple experiments reveal a relationship.
3. **Distinguish explanations:** Understand that different hypotheses can fit some observations but not others.
4. **Reason about sequence:** Discover that previous interactions can affect later behaviour.
5. **Make a prediction:** Use the evidence to commit to an explanation of what the system will do.

The sequence should introduce one new reasoning demand at a time.

The first challenge should teach the basic interaction with minimal instruction. Short contextual prompts can explain a new control or concept, but the game should avoid explaining every possible experiment or telling players which test to run.

Stateful behaviour is central to the product thesis, but introducing it before the player understands the basic input-output exchange may create unnecessary cognitive load. A simpler challenge followed by a sequence-dependent one is a sensible starting recommendation. It still needs to be evaluated with actual players.

## 8. Hints, Feedback and Failure

Hints and feedback should support the investigation without replacing it.

### Three kinds of feedback

- **Interaction feedback** confirms that the interface received an action. For example, it acknowledges a submitted input or explains that a field is incomplete.
- **Challenge feedback** communicates whether an experiment was accepted, whether an input was valid or whether a prediction completed the challenge.
- **Reasoning feedback** helps the player understand the relationship between the evidence and the system's rule. It is most useful after a prediction or when a hint is requested.

These messages serve different purposes. Confirming that an input was accepted is not the same as confirming that the player's theory is correct.

### Incorrect predictions

An incorrect prediction should not automatically become a dead end. The game should clearly show that the prediction did not match the system's behaviour and, where the challenge rules permit, allow the player to inspect the evidence and continue experimenting.

The full solution should not be revealed immediately unless the challenge is complete or the player explicitly asks for an explanation.

### Hints

Hints are a possible feature, not an MVP commitment. If introduced, they could provide graduated assistance:

- Point towards an overlooked observation.
- Suggest a useful kind of experiment.
- Explain a relevant relationship more directly.

Hints should be tested carefully. Too much guidance could undermine the value of independent experimentation.

### Explanations after completion

A completed challenge should explain the hidden rule and connect it to the evidence the player observed. Depending on the challenge, the explanation should cover:

- What rule governed the system.
- Why the observed outputs occurred.
- How the order or history of inputs mattered, if relevant.
- What would happen under a new input or sequence.

The explanation should make the resolution understandable, not simply reveal the answer.

## 9. Challenge Experience Structure

A challenge is more than a hidden answer. It is a designed investigation with a defined system, allowed interactions, observable evidence and a completion condition.

Each challenge needs a consistent conceptual structure.

### Identity and context

Each challenge needs an identity and a short introduction. The introduction should establish the objective without revealing the solution.

It may communicate an approximate difficulty or the type of reasoning involved. These labels are product guidance, not validated measures of cognitive ability.

### System definition

At the design level, each challenge should define:

- Its initial condition.
- The types of input it accepts.
- The observable output format.
- Any constraints on experiments.
- Whether the system is stateless or stateful.
- The hidden rule or transition behaviour.
- The conditions under which the system changes state.

The structured implementation and validation format belongs to Phase 4.

### Completion condition

A challenge needs a clear definition of what it means to understand the system. The proposed primary mechanism is a prediction: the player provides an answer for a defined input or sequence, and the game evaluates it against the expected behaviour.

Some challenges may have more than one acceptable explanation or equivalent prediction. The challenge definition must specify the accepted solution set, particularly if the game later supports more open-ended reasoning.

### Explanation

Every challenge needs an explanation consistent with its actual system behaviour. This is part of challenge integrity. If the explanation cannot account for the outputs the player observed, the challenge is defective.

### Difficulty progression

The progression established in Phase 2 remains the starting framework:

| Progression | Reasoning demand |
|---|---|
| Patterns | Identify fixed relationships between inputs and outputs |
| Conditional logic | Discover rules that change according to conditions |
| Sequence-dependent behaviour | Understand that order affects results |
| Memory and hidden state | Infer behaviour influenced by earlier interactions |
| Interacting systems | Reason about multiple relationships or state changes |

This is a design framework, not a final level list. Individual challenges must be authored and evaluated to establish whether the progression is understandable and appropriately difficult.

## 10. Visual and Interaction Direction

The visual direction should support concentration, curiosity and the feeling of interacting with a system. The interface should feel like a purposeful workspace rather than a conventional quiz screen.

At this stage, the visual system is defined through principles. A final palette, typography system and component library are not established.

### Visual priorities

- Keep the system and current interaction prominent.
- Make inputs and outputs visually distinct.
- Make experiment history easy to scan.
- Distinguish current information from historical evidence.
- Use motion only when it communicates a meaningful system response.
- Avoid decoration that competes with the evidence.

A machine, console, instrument or other visual metaphor may make the experience tangible. The metaphor must remain secondary to the reasoning task; it should not make the actual input-output behaviour harder to understand.

The same interaction concepts should be represented consistently across challenges. An experiment, prediction and reset should each look and behave like distinct actions.

## 11. Responsive Experience and Accessibility

Thinksy's current direction is a browser-first, responsive experience. It should work across desktop, tablet and mobile screens.

The workspace may rearrange to suit the available space. On a wider screen, the system, input, output and history may appear alongside one another. On a narrower screen, they may be stacked or arranged more compactly.

The layout must preserve:

- Readable inputs and outputs.
- A clear relationship between each input and its output.
- Access to the full experiment sequence.
- A visible route to make a prediction.
- A clear distinction between current system context and historical evidence.

Exact breakpoints and layouts remain open for detailed interface design and implementation.

Accessibility is part of the interaction design, not a finishing task. The experience should aim to provide:

- Keyboard access to all essential controls.
- Visible focus states.
- Clear labels and instructions for input controls.
- Sufficient contrast between text, controls and interface states.
- Text alternatives for meaningful visual information.
- Error messages that explain how to correct an invalid action.
- Usability at different screen sizes and zoom levels.
- No reliance on colour alone to communicate success, failure or system state.
- Motion that does not prevent the player from understanding or using the interface.

The experiment history should also communicate event order clearly to assistive technologies. These are design requirements; implementation and testing must verify that they are met.

## 12. Scope of the Initial Experience

The initial experience should prove the core game before expanding into additional systems.

### Required for the first meaningful version

The first meaningful version should support:

- Entering and starting a challenge.
- Understanding the challenge objective.
- Submitting valid experiments.
- Receiving clear system outputs.
- Reviewing experiment history.
- Supporting simple and, where included, stateful behaviour.
- Making a prediction.
- Evaluating the prediction.
- Showing a useful result and explanation.
- Moving to another available challenge.
- Preserving basic progress if the chosen persistence model supports it.

The exact number of challenges is not decided. A small, carefully authored set is preferable to a large collection that has not been checked for correctness or quality.

### Deferred

The following remain outside the initial product commitment:

- Real-time multiplayer.
- Duel and co-operative play.
- Leaderboards and ranked leagues.
- Tournaments.
- Social feeds and community features.
- Complex streak and reward systems.
- A large procedural challenge-generation engine.
- Monetisation and subscription architecture.
- Cognitive scoring or claims about intelligence improvement.

These may become useful later. They do not establish whether the central investigation experience is compelling.

The first product needs to answer a smaller question:

**Is it satisfying to investigate Thinksy's systems, learn their behaviour and make a correct prediction?**

Until there is meaningful evidence, additional layers should remain secondary.

## 13. Design Risks and Open Questions

The design direction is a proposal, not a validated experience. Several questions remain open.

### How much should a challenge reveal at the beginning?

Too little context may make a challenge feel arbitrary. Too much may reveal the structure of the solution. The design needs to explain the interaction while preserving the mystery.

### How should players express a prediction?

A prediction could be a single output, a sequence of outputs, a state transition or another answer format. The format should follow the reasoning objective of the challenge. A universal prediction interface may not suit every system.

### How much history should remain visible?

History is essential, but a long sequence may become difficult to scan. The first version should favour a chronological record. Grouping, filtering or highlighting can be considered if testing shows that players struggle to compare evidence.

### Should players be able to reset freely?

Free resets may encourage exploration, but they may also remove the significance of sequence or make a challenge easier in unintended ways. Reset policy should be part of each challenge's design and clearly communicated.

### Are explicit notes or hypothesis tools necessary?

A notes feature could help with complex explanations, but it could also add friction. The first version should make experiment history easy to review. Dedicated hypothesis tools should be considered only if player behaviour demonstrates a need.

### How should difficulty be communicated?

Difficulty labels can help players choose challenges, but they can also create expectations. They should initially reflect authored challenge characteristics and be refined through play observations, not presented as a scientific assessment of the player.

### How much should a result explain?

A short explanation may be enough for a simple system. A stateful challenge may need a walkthrough showing how earlier actions changed later behaviour. The explanation should be proportional to the system's complexity and consistent with its actual rules.

## 14. Validation Plan

The design in this phase has not been validated through observed player behaviour.

Early evaluation should focus on whether people can understand and use the investigation workspace without being taught every action. Useful questions include:

- Can a first-time player identify the objective?
- Can they submit an experiment without confusion?
- Do they understand which output belongs to which input?
- Can they find and interpret earlier experiments?
- Do they notice when sequence affects behaviour?
- Can they distinguish an experiment from a prediction?
- Do they understand why a prediction was accepted or rejected?
- Does the interface preserve the feeling that they discovered the rule?
- Does the challenge feel fair, or does it feel arbitrary?

A useful early test would observe players attempting a small number of representative challenges: one simple challenge and one stateful challenge. This would expose different parts of the experience.

The team should record what players do and where they become confused. Completing a challenge does not, by itself, show that the interface was intuitive or the experience satisfying.

No usability results are claimed in this document. Prototype implementation and testing will take place in later phases, with formal testing and verification addressed in Phase 6.

## 15. Phase 3 Decision

Phase 3 turns the product direction into a defined experience. The challenge workspace is the centre of that experience, bringing the system, player inputs, outputs and experiment history together.

The design needs to preserve the mystery of the system while making the investigation clear. Players should be able to experiment independently, compare evidence, make a prediction and understand the result.

The decisions to carry forward are:

- The challenge workspace is the central environment for Thinksy's gameplay.
- The workspace brings together System, Input, Output and Experiment History.
- Experiment history must preserve the evidence and sequence needed for reasoning.
- The core interaction is **Construct → Submit → Observe → Compare → Continue**.
- A deliberate prediction is the primary way for a player to demonstrate understanding.
- Onboarding should teach the interaction model progressively without explaining the solution.
- Stateful behaviour should be introduced after the basic input-output exchange is understood.
- Reset behaviour must distinguish system state, challenge attempt and visible history.
- The initial product should focus on a small, curated set of challenges.
- The experience should be browser-first and responsive, with accessibility considered from the design stage.

Final visual styling, detailed component specifications and implementation choices remain open. Usability and enjoyment have not yet been validated.

**Phase 3 outcome:** Proceed to Technical Research & Systems Architecture with the challenge workspace and investigation flow as the central experience. The design remains a product proposal until it is tested with actual players.

## Phase 3 Completion Record

| Area | Outcome |
|---|---|
| Experience direction | Investigation through experimentation and prediction |
| Central environment | Challenge workspace |
| Workspace areas | System, Input, Output and Experiment History |
| Core interaction | Construct → Submit → Observe → Compare → Continue |
| Primary completion action | Player prediction |
| Stateful behaviour | Introduced progressively; sequence and history must remain understandable |
| Onboarding | Teach the interaction model without revealing hidden rules |
| Initial scope | Focused set of curated challenges and core investigation loop |
| Responsive direction | Browser-first across desktop, tablet and mobile |
| Accessibility | Included as a design requirement |
| Visual identity | Principles defined; final styling remains open |
| Usability validation | Not completed |
| Decision | Proceed to Phase 4 |

---

**Phase 3 is complete.** The main decision is to make the challenge workspace the place where players investigate systems, compare evidence and demonstrate what they have understood.
