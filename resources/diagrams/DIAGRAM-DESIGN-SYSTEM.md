# Diagram Design System

Rules for every diagram image in this repo, so they all share one look. The reference image is
[`slash-commands-architecture.png`](slash-commands-architecture.png). When in doubt, match it.

This builds on the brand rules in [../DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md): black, white, gray,
and one green accent.

---

## Color Tokens

Use only these colors. Do not add blues, purples, or other accents.

| Token | Hex / Value | Used for |
|-------|-------------|----------|
| `--bg` | `#0A0A0A` | Page background (always dark) |
| `--card-top` → `--card-bottom` | `#181818` → `#111111` | Card fill (vertical gradient) |
| `--border` | `#2E2E2E` | Card borders (1.5px) |
| `--chip-bg` | `#0A0A0A` | Code chip fill |
| `--chip-border` | `#333333` | Code chip border |
| `--text` | `#FFFFFF` | Titles, card headings |
| `--text-chip` | `#F3F4F6` | Code chip text |
| `--text-muted` | `#C4C9D1` | Subtitles, card descriptions |
| `--text-faint` | `#9CA3AF` | Footer, brand mark |
| `--text-dim` | `#8B929C` | Step numbers (`01`, `02`, …) |
| `--accent` | `#22C55E` | Highlight word, eyebrow, icons, arrows, arrow labels, final-step border |
| `--accent-soft` | `rgba(34,197,94,.10)` | Icon tile fill |
| `--accent-line` | `rgba(34,197,94,.35)` | Icon tile border |
| `--glow` | `rgba(34,197,94,.16)` / `.10` | Radial background glows (top-left, bottom-right) |
| `--grid` | `rgba(255,255,255,.035)` | 40px background grid, faded at the edges |

### Accent rules

- Green is for **highlights only**: one word in the title, the eyebrow, icons, connectors, and
  the final/outcome node.
- Never use green as a large fill or for body text.
- Only **one** node gets the green border + glow, and it is the outcome or the focus of the diagram.

---

## Typography

Docs show images at roughly 700–900px wide, so a 1400px canvas is shrunk to about 55–65%.
Sizes below are chosen so that **no text drops under ~12px on screen** after that shrink.

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Eyebrow | JetBrains Mono | 22px | 700 | Uppercase, 3px tracking, green, leading green dot |
| Title | Inter | 72px | 800 | −2px tracking, one key term in green |
| Subtitle | Inter | 30px | 400 | Muted gray, one sentence |
| Card heading | Inter | 34px | 700 | Must fit on one line (2–3 words) |
| Code chip | JetBrains Mono | 23px | 600 | Paths, commands, filenames |
| Card description | Inter | 24px | 400 | Muted gray, ≤ 2 lines |
| Arrow label | JetBrains Mono | 18px | 700 | Uppercase, 1px tracking, green |
| Step number | JetBrains Mono | 24px | 700 | Gray, top-right of card |
| Footer | Inter / JetBrains Mono | 22px | 400–600 | Labels in light gray, paths in mono |

**Minimum size: 18px on the canvas.** Never go below it, and never use a text color darker
than `#8B929C` on the dark background.

Both fonts load from Google Fonts.

---

## Layout

- **Canvas:** 1400px wide, height fits the content, rendered at **2×** (2800px wide PNG).
  Do not widen the canvas; add rows instead, since a wider canvas shrinks the text.
- **Padding:** 64px top and sides, 56px bottom.
- **Structure, top to bottom:** eyebrow → title → subtitle → diagram → footer.
- **Grid:** 3 cards per row (`1fr 104px 1fr 104px 1fr`), connectors in the 104px gaps.
  Flows longer than 3 steps **snake**: row 1 runs left→right, a down arrow drops from the last
  card, and row 2 runs right→left, so every arrow is short and points to the next step.
  Step numbers (`01`–`06`) keep the reading order clear.
- **Cards:** 24px radius, 28px padding. Top row: icon tile (64px, 16px radius) on the left,
  step number on the right. Then heading → code chip → description.
- **Connectors:** 3px solid green line with a green arrowhead and the uppercase label above it
  (beside it for vertical arrows).
- **Footer:** context on the left (for example, file locations), the `claude-howto` brand mark on
  the right with a green hyphen.

### Fitting the content

- Up to **6 nodes** per image (2 rows of 3). For more, split into two images.
- Keep each heading to 2–3 words and each description to one short sentence.
- Icons are inline SVG line icons (Feather/Lucide style): 2.2px stroke, green, round caps.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|------|---------|
| Start from an existing source in `src/` | Export raw Mermaid renders as images |
| Keep the dark background and the single green accent | Introduce new colors or light backgrounds |
| Put real paths and commands in code chips | Use emoji as icons |
| Write alt text that describes the flow | Let a card heading wrap or clip |
| Keep the Mermaid block in the doc and add the image below it | Replace the Mermaid source with the image |
| Check the PNG by eye before committing | Commit without checking for overflow at the edges |
| Check readability at ~800px wide | Shrink fonts or widen the canvas to fit more nodes |

---

## Workflow: Adding a New Diagram

1. **Copy the template.** Duplicate the closest file in [`src/`](src/), for example
   `src/slash-commands-architecture.html` → `src/<topic>-<diagram>.html` (kebab-case).
2. **Edit the content only.** Change the eyebrow, title, subtitle, cards, labels, and footer.
   Leave the `<style>` block as is; if a token has to change, change it here and in every source.
3. **Render it:**

   ```bash
   node resources/diagrams/render.cjs \
     resources/diagrams/src/<name>.html \
     resources/diagrams/<name>.png
   ```

   The script needs Puppeteer. If it's missing, run `npx -y puppeteer browsers install chrome`
   once.
4. **Check the PNG** for clipped cards, wrapped headings, and labels touching cards. Then view
   it at about 800px wide (as it appears in the docs) and confirm every word is readable.
5. **Embed it** right below the matching Mermaid block:

   ```markdown
   ![<What the diagram shows, as one sentence>](resources/diagrams/<name>.png)
   ```

6. **Commit the source and the PNG together**, so the image can always be re-rendered.

---

## Files

| Path | Purpose |
|------|---------|
| `DIAGRAM-DESIGN-SYSTEM.md` | This spec |
| `render.cjs` | Renders an HTML source to a 2× PNG (1400px viewport) |
| `src/*.html` | Editable source for each diagram (also serve as templates) |
| `*.png` | Rendered images referenced from the docs |
