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
   it at the doc's normal width and confirm the headings and code chips are readable.
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
| `render.cjs` | Renders an HTML source to a 2× PNG (viewport matches the source's body width) |
| `src/*.html` | Editable source for each diagram (also serve as templates) |
| `*.png` | Rendered images referenced from the docs |
