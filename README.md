# KH Mohammad Farhan — Portfolio

Static single page portfolio for KH Mohammad Farhan, a BCA graduate (Artificial
Intelligence, Cloud Computing and DevOps, CGPA 8.10) who builds full stack
software, business intelligence platforms and enterprise ERP systems. Based in
Bengaluru, open to relocation across the GCC on employer sponsorship.

Live at <https://farhan-portfolio-seven-opal.vercel.app>.

---

## Structure

```
farhan-portfolio/
├── index.html              # The portfolio page
├── 404.html                # Branded not found page
├── privacy.html            # What the site does with your information
├── style.css               # Hand maintained design system (not build output)
├── tailwind.css            # Generated Tailwind utilities, rebuilt by npm run build
├── app.js                  # Interactions: reveals, mobile menu, form, copy
├── input.css               # Tailwind build entry point
├── tailwind.config.js      # Theme: palette, type scale, spacing, radii
├── postcss.config.js       # PostCSS configuration
├── package.json            # npm scripts
├── vercel.json             # Deployment routes and content types
├── robots.txt              # Crawling rules
├── sitemap.xml             # Sitemap
├── favicon.svg             # Flat mark, no gradient
├── og-image.png            # Social sharing image (1200x630)
├── og-image.svg            # Vector version of the same image
├── assets/
│   ├── KH_Mohammad_Farhan_CV.txt
│   └── README_CV.txt
├── screenshots/            # Verification captures
└── scripts/
    ├── make-og-image.ps1   # Regenerates og-image.png
    ├── slice-screenshot.ps1
    ├── verify.mjs          # Scrolls the page and captures it
    ├── capture-secondary.mjs
    ├── check.mjs           # Behaviour checks
    └── overflow.mjs        # Reports any horizontal overflow
```

---

## Design system

The direction is **precise, technical, unhurried**. The world is the working
side of a business: ledgers, pipelines, instrument panels. That produces one
cool neutral ramp, one warm ochre accent, and monospace for anything a machine
would print.

**Palette** (defined in `style.css`, mirrored in `tailwind.config.js`)

| Role | Value |
| :--- | :--- |
| Page background | `#0c0e13` |
| Card | `#12151c` |
| Raised, inputs | `#171b23` |
| Active row | `#1e232d` |
| Hairline | primary text at 8% |
| Primary text | `#eef1f6` |
| Secondary text | `#a8b0bf` |
| Muted text and icons | `#7c8698` |
| Accent | `#d9a441` |
| Positive / negative | `#5bb98b` / `#e06c6c` |

**Type.** Geist for the interface, Geist Mono for figures, identifiers and
metadata. Named styles (`heading-1` … `caption-5`) are defined once in
`style.css` and every text element uses one of them. Headings sit at weight
500 so hierarchy comes from size rather than heaviness.

**Spacing.** A fixed scale of 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96,
exposed in Tailwind as `25`, `50`, `75`, `100`, `200` … `900`.

**Radius.** Controls 8, cards 12, panels 16.

**Motion.** One easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`. Transform and
opacity only. Every reveal fires once. Nothing loops. `prefers-reduced-motion`
is respected throughout.

**Icons.** One inline set, 24 by 24 grid, 1.5 stroke, 18px in the interface.
No emoji anywhere in the UI.

---

## Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Tailwind watch mode, rebuilds `tailwind.css` only |
| `npm run build` | Production build, minifies `tailwind.css` only. `style.css` is never touched |
| `npm run preview` | Local HTTP server on port 3000 |

`style.css` holds every component. Tailwind is used for layout utilities only,
so the two never fight over the same property.

---

## Verification

```powershell
# Behaviour checks: navigation, reveals, form validation, mobile menu
node scripts/check.mjs

# Capture the page at three widths after scrolling so reveals have fired
node scripts/verify.mjs screenshots 1440 1024 390

# Capture the 404 and privacy pages
node scripts/capture-secondary.mjs

# Check for horizontal overflow at a given width
node scripts/overflow.mjs 390
```

Playwright is required for all of these. If it is not installed:

```powershell
npm install -D playwright
npx playwright install chromium
```

---

## Deployment

### Vercel

```bash
npm install
npm run build
vercel --prod
```

### GitHub Pages

```bash
git push -u origin main
```

Then enable Pages on the `main` branch. The site is fully static, so no build
step is required for GitHub Pages, but run `npm run build` first so
`tailwind.css` is current.

---

## Contact

- Email: khmohammadfarhan.job@gmail.com
- LinkedIn: [linkedin.com/in/khmohammadfarhan](https://www.linkedin.com/in/khmohammadfarhan/)
- GitHub: [github.com/farhankh8](https://github.com/farhankh8)
- Location: Bengaluru, Karnataka, India

---

## Credits

The visual system was rebuilt following the `unslop` skill by Damir Sokolovsky
and the `landing-page-design` skill by Elaya. Typefaces are Geist and Geist
Mono from Google Fonts.

## Licence

© 2026 KH Mohammad Farhan.
