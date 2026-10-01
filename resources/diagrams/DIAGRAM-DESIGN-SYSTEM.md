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
| `--card-top` → `--card-bottom` | `#161616` → `#101010` | Card fill (vertical gradient) |
| `--border` | `#262626` | Card borders (1px) |
| `--chip-bg` | `#0A0A0A` | Code chip fill |
| `--chip-border` | `#2A2A2A` | Code chip border |
| `--text` | `#FFFFFF` | Titles, card headings |
| `--text-chip` | `#E5E7EB` | Code chip text |
| `--text-muted` | `#9CA3AF` | Subtitles, card descriptions |
| `--text-faint` | `#6B7280` | Footer, brand mark |
| `--text-dim` | `#4B5563` | Step numbers (`01`, `02`, …) |
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

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Eyebrow | JetBrains Mono | 15px | 600 | Uppercase, 3px tracking, green, leading green dot |
| Title | Inter | 48px | 800 | −1.2px tracking, one key term in green |
| Subtitle | Inter | 20px | 400 | Muted gray, one sentence |
| Card heading | Inter | 19px | 700 | Must fit on one line |
| Code chip | JetBrains Mono | 13.5px | 500 | Paths, commands, filenames |
| Card description | Inter | 15px | 400 | Muted gray, ≤ 3 lines |
| Arrow label | JetBrains Mono | 12.5px | 600 | Uppercase, 1px tracking, green |
| Step number | JetBrains Mono | 14px | 600 | Dim gray, top-right of card |
| Footer | Inter | 15px | 400/600 | Faint gray, bold labels in light gray |

Both fonts load from Google Fonts.

---

## Layout

The standard format is a **horizontal banner**: short and wide, so it sits in a doc without
taking over the page.

- **Canvas:** 1800px wide, height fits the content, rendered at **2×** (3600px wide PNG).
- **Padding:** 64px top, 72px sides and bottom.
- **Structure, top to bottom:** eyebrow → title → subtitle → diagram → footer.
- **Flow:** one row, left to right. Cards are 212px wide and never shrink; connectors fill the
  space between them (min 84px plus 10px padding each side, so labels never touch a card).
- **Cards:** 20px radius, 26/22/24px padding. Content order: icon tile (54px, 14px radius) →
  heading → code chip → description. Step number sits top-right.
- **Connectors:** a 2px line fading from transparent to green, ending in a green arrowhead, with
  the uppercase label above it.
- **Footer:** context on the left (for example, file locations), the `claude-howto` brand mark on
  the right with a green hyphen.

### Fitting the content

- Up to **6 nodes** in the row. For more, split into two banners.
- Keep each heading to 2–3 words so it fits on one line, and each description to one short
  sentence.
- Icons are inline SVG line icons (Feather/Lucide style): 2px stroke, green, round caps.

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

---

## Workflow: Adding a New Diagram

Most diagrams are **generated from a spec**, so they can't drift from the design system. Hand-build
a page only for a one-off layout the generator can't express (like the slash command banner).

### Generated diagrams (preferred)

1. **Add a spec** to [`specs.cjs`](specs.cjs). Pick a layout:
   - `graph`: columns of cards joined by curved connectors. Use it for flows, trees, hubs, and
     decisions. Set `columns` (each with optional `label` and its `nodes`) and `edges`
     (`from`, `to`, optional `label`, `dashed: true` for returns).
   - `sequence`: participant headers, lifelines, and numbered messages. Set `participants` and
     `steps` (`from`, `to`, `label`, `dashed`), or a `note` with `over: [id, id]`.
2. **Node options:** `icon` (a name from `lib/diagram.js`), `title`, `chip`, `desc`, `num`,
   `accent: true` for the single focus node, `q: true` for a decision question, and
   `spacer: true` for an invisible placeholder that keeps a connector clear of other cards.
3. **Tune spacing** with `colgap`, `cardMax`, `rowgap`, and `dense: true` for 6+ columns. Keep
   connector labels to one or two words so they fit in the gap.
4. **Build it:**

   ```bash
   node resources/diagrams/build.cjs <name>      # one diagram
   node resources/diagrams/build.cjs             # all of them
   ```

   This writes `src/<name>.html` and renders `<name>.png`.

### Hand-built diagrams

1. Copy the closest file in [`src/`](src/) and edit the content only, keeping its `<style>` block.
2. Render it with `node resources/diagrams/render.cjs src/<name>.html <name>.png`.

### Both

- The scripts need Puppeteer. If it's missing, run `npx -y puppeteer browsers install chrome`
  once.
- **Check the PNG** for clipped cards, wrapped headings, and labels touching cards or crossing
  connectors, and confirm the text is readable at the doc's normal width.
- **Embed it** right below the matching Mermaid block, keeping the Mermaid block:

  ```markdown
  ![<What the diagram shows, as one sentence>](resources/diagrams/<name>.png)
  ```

- **Commit the source and the PNG together**, so the image can always be re-rendered.

---

## Files

| Path | Purpose |
|------|---------|
| `DIAGRAM-DESIGN-SYSTEM.md` | This spec |
| `render.cjs` | Renders an HTML source to a 2× PNG (viewport matches the source's body width) |
| `build.cjs` | Generates `src/<name>.html` from a spec and renders it |
| `specs.cjs` | Specs for every generated diagram |
| `lib/theme.css` | Shared tokens and components (cards, chips, connectors, labels) |
| `lib/diagram.js` | Builds the `graph` and `sequence` layouts and the icon set |
| `src/*.html` | Source page for each diagram (generated, or hand-built) |
| `*.png` | Rendered images referenced from the docs |
