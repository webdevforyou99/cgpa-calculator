# Monetag setup

All Monetag settings live in `src/config/monetag.ts`. They are intentionally
not exposed in the public website UI.

## Head tag

For MultiTag, In-Page Push, Vignette, or another format that Monetag instructs
you to put in the document head:

1. Copy the tag from the approved site/zone in the Monetag publisher dashboard.
2. In `monetagConfig.headScripts`, add an object with a unique local `id`, the
   exact HTTPS value from the tag's `src`, and `location: 'head'`.
3. Copy tag attributes such as `data-zone` into the object's `attributes` map.
4. Set the top-level `monetagConfig.enabled` value to `true`.

Do not paste the surrounding `<script>` markup. The loader creates the script
element safely from the configured `src` and attributes. Only HTTPS sources are
accepted. Each `id` and source pair is loaded once, including in React strict
mode.

## In-content placement

The optional placement keys are `belowHeader`, `betweenSections`, and
`aboveFooter`. Use these only when Monetag says that the selected format may be
rendered at a specific document location.

For a placement, set `enabled: true`, choose an optional `minHeight`, and set
`script` to the same object shape used above with `location: 'placement'`.
Unused placements must remain disabled with `script: null`; they render no
placeholder or empty space.

## Service worker formats

If Monetag supplies a service worker file for an HTTPS push format, download
the exact file from the Monetag dashboard and place it in `public/` using the
filename Monetag specifies. Vite will copy it to the deployed site. Follow the
dashboard instructions for the required scope; a GitHub Pages project site is
served below `/cgpa-calculator/`.

Ad blockers, unavailable inventory, account review, or an unapproved domain can
prevent ads from appearing even when the integration is correct.
