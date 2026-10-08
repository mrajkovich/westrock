# WR3 landing page (flower packaging)

Blocks: `wr3-nav`, `wr3-hero`, `wr3-intro`, `wr3-products`, `wr3-band`, `wr3-stories`,
`wr3-sustain`, `wr3-form`, `wr3-callout`, `wr3-footer` (plus the legacy empty `wr3-page-chrome`).
Shared tokens and resets: the `WR3 landing page` section at the end of `styles/styles.css`.
Shared helpers: `scripts/wr3.js`. Brand colours: navy `#002D74` (`--wr3-navy`), blue `#0097F5` (`--wr3-blue`).

Every block is its own section in the da.live document, in this order. Images are optional:
a paragraph that starts with the camera emoji ("Add image: file.jpg") renders as a gradient
placeholder; replace it with a real image and the placeholder disappears.

| Block | Rows / cells |
|---|---|
| wr3-nav | 1 row, 2 cells: brand link, nav links (last link is shown as an outlined button) |
| wr3-hero | 1 row, 2 cells: [breadcrumb paragraph with links, H1, CTA link] and [square image 740x740] |
| wr3-intro | 1 cell: H2 lead, paragraphs, bullet list of `**Title**: text` |
| wr3-products | optional row 1 (1 cell: eyebrow paragraph + H2); then 1 row per card, 2 cells: [image] and [H3, description, link]. Use 8 rows for an 8-card grid |
| wr3-band | 1 cell: H2, paragraph, CTA link |
| wr3-stories | row 1: H2. row 2: one cell per story (first = featured): image, H3, "Read more" link. optional row 3: "View our success stories" link |
| wr3-sustain | row 1: H2. row 2: cell 1 = repeated [icon paragraph, H3, text] (3 stat cards); cell 2 = repeated [image, link paragraph] (2 image cards, link is the caption) |
| wr3-form | 1 row, 2 cells: [H2, intro, "* Mandatory Field"] and [one paragraph per field label, then a link]. Field type follows the label (email, country, industry, "How can we help you?"). A trailing `*` makes it required. The link text is the button label and its URL is the endpoint the JSON is POSTed to |
| wr3-callout | 1 row, 2 cells: [image] and [H2, paragraph, CTA link] |
| wr3-footer | row 1: one cell per column (cell 1 brand + tagline; others H4 + list of links); row 2: legal links and copyright |

Form note: the form POSTs `{ "data": { ... } }` as JSON to the URL in the link. The authored
value `/contact` is a page, not an endpoint; point it at your real form service before launch.
