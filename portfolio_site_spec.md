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

- **MCP quartet** — blender-mcp, houdini-mcp, nuke-mcp, natron-mcp presented as ONE hero unit. One wide card, four links inside. Give each server's tool count where its repo states one consistently (175 for blender-mcp).
- **usd_mcp_master** — OpenUSD composition debugger: which file is winning, and why. MCP server for agents, CLI for people.
- **image_gen** — local image and video generation on one 24 GB GPU, driven by a Claude Code agent.

### 2. DCC Tools (tools for humans)

- **houdini_remote_render** — HDAs + cross-platform bootstrap scripts. USDZ packaging for portable renders.
- **funkworks** — "forum-mined pain points → Claude-classified → shipped addons." The meta-pipeline is the story, not any single plugin.
- **shot-gopher** — automated VFX ingest. Lead with what comes out: depth, roto, clean plates, camera solves.

### 3. LLM & Agent Tooling

- **Text_Loom** — node graph for procedural LLM text editing, five front ends. Salad_Loom shares its card.
- **Claude Code skills** — one card, one line per skill, each linked to its repo.
- **meta_theory**, **ccwork**, **bird_brain** — one card each.

### 4. Games & Experiments

Every card on this sheet carries a live link a visitor can open or play.

- **galapagos3** — Rust + wgpu evolutionary art, Karl Sims reference. Also the hero's live background.
- **interlingua** — conlang built from a transformer's concept detectors.
- **Browser instruments** — drone_flute_synth and dub_synth on one card, with music_loom as their workbench.
- **parts_disco**, **treasure_trash**, **override**, **three_pm**, **finding_numbers**, **passtally** — browser games.

### 5. Footer

- Link to full GitHub profile.
- Email (published directly, not behind a form).
- Optional availability/capacity note.

## Selection rules

- **Scope stays DCC-adjacent.** The four sheets above are the whole page. Work outside them — document AI, OCR, general automation — does not get a card.
- **Public repos only.** A card links a repo a visitor can open.
- **Forks.** A fork that stays close to its upstream does not get a card. A fork that has grown into its own project can.

## Cut list (do not link)

- hello-world, sandbox-repo, ReadyToStart — throwaway.
- PotionWorld, WHAM, plasma-5-sbbclock — too thin to justify card space.
- mpea, affirmations, talk-like-an-X, cuesubplot — fine repos, dilute the pitch.
- BrainMaze, arithmeticVerisimilitude, 2018NaNoGenMo — too old or thin next to the playable work.
- desloppify — close fork, not original work.
- glyph_tracer — its README depends on a private repo.
- windows_error_ae — not featured.
- application_summary — document AI, outside the page's scope.

## Content per project card

1. Repo name + one-line description.
2. One "what makes this notable" sentence — architecture, scale, or technique.
3. Tech tags.
4. Link.

No long descriptions. Repo READMEs carry the detail.

## Design decisions

1. **Stack.** Plain static HTML + one CSS file. No build step.
2. **Headliner weight.** MCP quartet as one wide card with four repo links — "one bet, four targets."
3. **AI-disclosure placement.** One hero line ("Implementation leans heavily on Claude; I don't pretend otherwise"). No per-card call-outs.
4. **Visual reference.** Architectural drawing set: sheets, title blocks, room tags.
5. **Images / demos.** Live links where a project runs in the browser; mascots on funkworks and shot-gopher. Looping gifs per card are still open.
6. **Contact.** Published email. Lower friction wins for freelance.

## What this page is NOT

- A resume.
- A blog.
- A marketplace/storefront.
- A "hire me for anything" page. Staff-SWE work, modeling, compositing, and traditional VFX artistry are explicitly out of scope.
