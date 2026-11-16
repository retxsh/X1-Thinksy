# Contributing to Thinksy

Thank you for your interest in contributing to **Thinksy**.

Thinksy is an exploration of experimental reasoning through interactive systems. It explores how players can discover hidden rules, understand system behaviour, and predict outcomes through experimentation, pattern recognition, and observation.

We welcome thoughtful suggestions, research, feedback, and improvements that help strengthen the game's design, product direction, technical foundation, and overall experience.

This repository is intended to invite community input. Contributions are submitted through GitHub Pull Requests (PRs) and reviewed by the project maintainer.

**Repository:** [github.com/retxsh/X1-Thinksy](https://github.com/retxsh/X1-Thinksy)

## 1. What You Can Contribute

We welcome constructive contributions in areas such as:

- **Problem discovery and research:** Research findings, player behaviour, existing reasoning games, market observations, and opportunities in experimental reasoning.
- **Product strategy:** Product vision, positioning, gameplay principles, value proposition, and alternative approaches.
- **Gameplay and mechanics:** Game rules, challenge concepts, experimentation mechanics, progression systems, and difficulty design.
- **Requirements and planning:** Feature suggestions, player stories, use cases, gameplay workflows, and product requirements.
- **UI/UX:** Player journeys, usability feedback, interaction patterns, wireframe suggestions, and interface improvements.
- **Technical architecture:** Architecture feedback, technology recommendations, game engine design, data structures, deterministic systems, and technical considerations.
- **Testing and quality:** Gameplay edge cases, challenge solvability, determinism, fairness, inconsistencies, and validation approaches.
- **Business model and go-to-market:** Business models, audience segments, monetisation ideas, positioning, and distribution strategies.
- **General feedback:** Corrections, questions, alternative perspectives, and other relevant suggestions.

Please keep contributions relevant to Thinksy and explain the reasoning behind your suggestions.

## 2. Branching Policy — Read Before Opening a PR

The repository follows a two-branch contribution structure:

| Branch             | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `main`             | Official, stable version of Thinksy                              |
| `x1-thinksy-stack` | Community suggestions, proposed changes, and contribution review |

**All community contribution Pull Requests must target `x1-thinksy-stack`. Do not target `main`.**

The `main` branch is reserved for the official project documentation and approved changes. The project maintainer decides which accepted contributions, if any, should later be incorporated into `main`.

When opening a PR, check the **base branch** carefully:

- **Base repository:** `retxsh/X1-Thinksy`
- **Base branch:** `x1-thinksy-stack`
- **Head repository:** Your fork
- **Compare branch:** Your contribution branch

PRs opened against `main` are not considered community submissions under this policy. They may be closed with a request to reopen or retarget the contribution to `x1-thinksy-stack`.

This is a contribution policy; GitHub may still allow users to select `main` as a PR target. Please follow the instructions above.

## 3. How to Contribute

### Step 1: Fork the Repository

Visit the official [Thinksy repository](https://github.com/retxsh/X1-Thinksy) and use GitHub's **Fork** option to create your own copy.

### Step 2: Clone Your Fork

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR-USERNAME/X1-Thinksy.git
cd X1-Thinksy
```

### Step 3: Connect the Official Repository

Add the original Thinksy repository as an upstream remote and fetch its latest branches:

```bash
git remote add upstream https://github.com/retxsh/X1-Thinksy.git
git fetch upstream
```

### Step 4: Create a Contribution Branch

Create your working branch from the official `x1-thinksy-stack` branch:

```bash
git switch -c docs/short-description upstream/x1-thinksy-stack
```

Examples:

- `research/experimental-reasoning`
- `docs/product-strategy-feedback`
- `suggestions/new-game-mechanic`
- `improvements/challenge-design`
- `architecture/game-engine-feedback`
- `testing/deterministic-behaviour`

Use a descriptive branch name that reflects your contribution.

### Step 5: Make and Commit Your Changes

Keep your changes focused and preserve the repository's existing structure and Markdown formatting.

```bash
git add .
git commit -m "Add suggestion for [topic]"
```

### Step 6: Push Your Branch to Your Fork

```bash
git push -u origin docs/short-description
```

Replace `docs/short-description` with the name of your branch.

### Step 7: Open a Pull Request

On GitHub, open a Pull Request from your fork to the official Thinksy repository.

Before submitting, verify that:

- **Base repository:** `retxsh/X1-Thinksy`
- **Base branch:** `x1-thinksy-stack`
- **Head repository:** Your fork
- **Compare branch:** Your contribution branch

Include a clear title and explain:

1. What you are suggesting or changing.
2. Which problem, gameplay limitation, or opportunity it addresses.
3. Why you believe the change would improve Thinksy.
4. Any supporting research, references, examples, or assumptions.

## 4. Contribution Quality Guidelines

To make suggestions useful and easy to review:

- Be specific and constructive.
- Explain the reasoning behind a proposed change.
- Support factual or research-based claims with credible sources where possible.
- Distinguish verified findings from assumptions or personal opinions.
- Keep each PR focused on one topic or a closely related set of changes.
- Follow the existing document structure and formatting.
- Consider how proposed gameplay changes affect determinism, challenge fairness, and player experience.
- Avoid deleting or substantially rewriting existing material without explaining the reason.
- Do not include confidential, personal, or proprietary information.
- Do not present a suggestion as an approved product decision.

## 5. Review and Acceptance

The project maintainer, [@retxsh](https://github.com/retxsh), reviews contributions submitted to `x1-thinksy-stack`.

During review, the maintainer may:

- Accept the suggestion.
- Ask questions or request clarification.
- Request revisions or supporting evidence.
- Suggest an alternative approach.
- Decline the contribution if it is outside the project's scope or does not meet its needs.

A PR being submitted or reviewed does not guarantee acceptance or inclusion in Thinksy.

Accepted contributions merged into `x1-thinksy-stack` remain proposed or community-informed material until the maintainer decides whether they should be incorporated into the official documentation in `main`.

The project maintainer retains final authority over product direction, gameplay decisions, and changes to the official project.

## 6. Questions and Discussions

If you are unsure whether an idea is in scope, explain the idea and its relevance in your PR description. Keep discussions respectful, specific, and focused on improving Thinksy.

## 7. Thank You

Thank you for taking the time to explore Thinksy and share your perspective. Thoughtful research, creative gameplay ideas, constructive criticism, and practical technical suggestions are all valuable contributions.

**Explore. Experiment. Reason. Contribute.**
