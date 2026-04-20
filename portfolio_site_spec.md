# Portfolio Site Spec — kleer001.github.io

## Purpose

A single portfolio page that gives freelance clients, small studios, and recruiters fast proof of competence and range. The page itself isn't the sale — specific repo READMEs and marketplace listings close work. This page establishes "this person ships, has taste, and knows where they fit."

## Audience

- **Primary:** Freelance clients posting Blender/Houdini/Nuke Python-automation gigs on BlenderNation, SideFX forum, Upwork. They want fast "yes, can do" evidence.
- **Secondary:** DCC-adjacent AI startups (Nfinite, Axio, tools teams at Foundry/SideFX, early-stage creative-AI shops) who might consider a contract or remote full-time.
- **Not the audience:** Staff-SWE recruiters, big-iron data platforms, anyone screening for "10+ years distributed systems."

## Voice & Tone

Clean, professional, no bullshit. Sentences you could email to a hiring manager without cringing. Honest about AI-assistance as method — not defensive, not boastful.

No puffy titles like "agent infrastructure engineer." Genre-appropriate, specific labels only.

**Say:**
- "Technical artist and pipeline builder."
- "AI-assisted tools for DCC software."
- "Architecture, domain knowledge, and taste are mine. Implementation leans heavily on Claude."
- Concrete numbers where they exist (e.g. "175 tools across 25 Blender subsystems").

**Don't say:**
- "Full-stack engineer" — misleading at this level.
- "Senior" or "expert" — sets a bar the portfolio can't back up.
- "Passion for," "revolutionizing," "cutting-edge" — empty language.
- Anything that would fail a 2-minute technical screen.

## Hero (three lines, no more)

1. One-line identity (role label).
2. One-line method (the AI-assisted disclosure).
3. One-line invite (availability + contact).

## Section structure

### 1. DCC + AI Tools (the distinctive lane)

- **MCP trilogy** — nuke-mcp, houdini-mcp, blender-mcp presented as ONE hero unit. One wide card, three links inside. Mention the 175-tool figure for blender-mcp.
- **funkworks** — "Reddit-mined pain points → Claude-classified → shipped plugins." The meta-pipeline is the story, not any single plugin.
- **shot-gopher** — ML-assisted VFX shot processing with opinionated destructive workflow.

### 2. DCC Tools (no AI)

- **houdini_remote_render** — HDAs + cross-platform bootstrap scripts. USDZ packaging for portable renders.
- **windows_error_ae** — AE + Nuke plugin with seeded randomness. Glitch aesthetic, artist-usable.

### 3. LLM & Agent Tooling

- **Text_Loom** — TUI node graph for procedural LLM text editing. 19 stars.
- **Salad_Loom** — absurdist companion.
- **claude-slash-bob** — Claude Code skill for session handoff.
- **desloppify** — agent harness for code cleanup.

### 4. Games & Experiments

- **galapagos3** — Rust + wgpu evolutionary art, Karl Sims reference. **Disclose per-card:** "Rust implementation heavily Claude-assisted; evolutionary design and Sims-lineage framing are mine."
- **passtally** — browser-based board game tribute.
- **BrainMaze** — pygame educational maze game.
- **arithmeticVerisimilitude** — combinatorial arithmetic explorer.
- **2018NaNoGenMo** — procedural novel generation.

### 5. Footer

- Link to full GitHub profile.
- Email (published directly, not behind a form).
- Optional availability/capacity note.

## Cut list (do not link)

- hello-world, sandbox-repo, ReadyToStart — throwaway.
- PotionWorld, WHAM, plasma-5-sbbclock — too thin to justify card space.
- mpea, affirmations, talk-like-an-X, cuesubplot — fine repos, dilute the pitch.

## Content per project card

1. Repo name + one-line description.
2. One "what makes this notable" sentence — architecture, scale, or technique.
3. Tech tags.
4. Link.

No long descriptions. Repo READMEs carry the detail.

## Design decisions still open

1. **Stack.** Plain HTML/CSS vs Astro vs Jekyll. Leaning plain static HTML + one CSS file — zero maintenance, matches the restrained tone, ships today.
2. **Headliner weight.** MCP trilogy as one wide card with three repo links vs three equal cards. "One bet, three targets" reads stronger than repetition — leaning one wide card.
3. **AI-disclosure placement.** Hero line, about blurb, or per-project only. Leaning: one hero line ("Implementation leans heavily on Claude; I don't pretend otherwise") plus per-project call-outs where the repo wouldn't exist without heavy AI help (galapagos3 most obviously).
4. **Visual reference.** No reference established. Worth browsing BenMcEwan's Nuke page, Platige devs' personal sites, various github.io pages to find a restraint level you like.
5. **Images / demos.** galapagos3 and windows_error_ae have strong visuals; funkworks has pipeline-diagram potential; MCP trilogy is harder to visualize. A short looping gif per card where one exists; skip where it would be forced.
6. **Contact.** Published email vs form. Lower friction wins for freelance — publish the email.

## What this page is NOT

- A resume.
- A blog.
- A marketplace/storefront. (If funkworks or windows_error_ae go commercial, those live on Superhive / Gumroad / Foundry Marketplace / Orbolt and are linked from the portfolio.)
- A "hire me for anything" page. Staff-SWE work, modeling, compositing, and traditional VFX artistry are explicitly out of scope.
