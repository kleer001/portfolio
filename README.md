# portfolio

Source for **https://kleer001.github.io/portfolio/** — a single-page index of the
projects in these repos, built for freelance clients, small studios, and DCC-adjacent
tools teams who want fast evidence of range.

The page is organised as a drawing set. Four sheets:

| Sheet | Section | What's in it |
|---|---|---|
| A-01 | DCC + AI tools | MCP servers for Blender, Houdini, Nuke and Natron |
| A-02 | DCC tools | houdini_remote_render, funkworks, shot-gopher |
| A-03 | LLM & agent tooling | Text_Loom, Salad_Loom, claude-slash-bob |
| A-04 | Games & experiments | galapagos3, passtally, BrainMaze, arithmeticVerisimilitude, 2018NaNoGenMo |

## How it's built

Hand-written HTML and CSS. No framework, no build step, no dependencies to install.

```
index.html            the whole page — every project entry is inline markup
styles-v3.css         the current stylesheet
app-v3.js             navigation, sheet switching, accent-colour swatches
galapagos.js          the animated background canvas
logos/                per-application SVG icons used in the A-01 and A-02 cards
portfolio_site_spec.md  purpose, audience, and voice — read this before editing copy
```

`portfolio v2.html`, `styles-v2.css`, and `app-v2.js` are the previous design, kept for
reference. The live site is v3.

GitHub Pages serves `main` from the repository root, so a push to `main` is a deploy.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

Opening `index.html` from disk mostly works — the scripts are plain `<script>` tags —
but serving it over HTTP is what Pages actually does, so preview that way.

## Adding a project

Entries are literal markup, not data. Open `index.html`, find the `<section>` for the
sheet you want (`#dccai`, `#dcc`, `#llm`, `#games`), and copy an existing card. Match the
surrounding structure; the CSS keys off those class names.

Read `portfolio_site_spec.md` first. It sets who the page is for and how it should sound,
and it is easy to write a card that is accurate and still off-voice.

Screenshots are not committed — `.gitignore` excludes `*.png`, so the working directory
holds design iterations that never reach the repo.
