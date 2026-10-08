/**
 * Shared helpers for the wr3-* landing page blocks.
 */

const PLACEHOLDER_PREFIX = '\u{1F4F7}'; // camera emoji used by authors as "add image here"

/**
 * Extracts a short label from an authoring hint such as
 * "Add image: natupol-terra-hero-680x450.jpg (680x450px)".
 * @param {string} text
 * @returns {string}
 */
function placeholderLabel(text) {
  const file = text.match(/[\w-]+\.(?:jpe?g|png|webp|gif|svg)/i);
  return file ? file[0] : 'Image';
}

/**
 * Sample photos (CC0, see media/wr3/SOURCES.md) shown for known placeholder filenames until
 * a real image is authored. Authoring a picture, or a link to an image, replaces them.
 */
const SAMPLES = {
  'flowerpackaging_740x740.jpeg': 'hero',
  'shipping-boxes.jpg': 'products1',
  'insulated-boxes.jpg': 'products2',
  'bouquet-sleeves.jpg': 'products3',
  'plant-trays.jpg': 'products4',
  'display-racks.jpg': 'products5',
  'cards-envelopes.jpg': 'products6',
  'cards-and-envelopes.jpg': 'products6',
  'flower-food-packets.jpg': 'products7',
  'custom-solutions.jpg': 'products8',
  'natupol-terra-hero-680x450.jpg': 'story1',
  'house-of-botanique2.jpg': 'story2',
  'flower-ecommerce-packaging3.jpg': 'story3',
  'sust_packaging_component_r1_quote.jpg': 'sustain1',
  'bpp_ecommercebox.jpg': 'sustain2',
  'request-a-sales-call-min.png': 'callout',
};

const IMAGE_LINK = /\.(?:jpe?g|png|webp|gif|avif)(?:[?#].*)?$/i;

function makePicture(src, alt = '') {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  picture.append(img);
  return picture;
}

/**
 * Replaces authoring hints ("camera emoji Add image: ...") with a sample photo when one is
 * known for that filename, otherwise with a styled placeholder. Also turns a paragraph that
 * holds only a link to an image file (e.g. /media/wr3/hero.jpg) into a picture.
 * Real pictures are left untouched, so authoring an image replaces the placeholder.
 * @param {Element} root
 * @param {{dark?: boolean}} [opts]
 */
export function decoratePlaceholders(root, opts = {}) {
  root.querySelectorAll('p > a:only-child').forEach((a) => {
    const p = a.parentElement;
    if (p.textContent.trim() === a.textContent.trim() && IMAGE_LINK.test(a.getAttribute('href') || '')) {
      p.replaceChildren(makePicture(a.getAttribute('href'), ''));
    }
  });

  root.querySelectorAll('p, div').forEach((el) => {
    if (el.children.length) return;
    const text = el.textContent.trim();
    if (!text.startsWith(PLACEHOLDER_PREFIX)) return;
    const label = placeholderLabel(text);
    const sample = SAMPLES[label.toLowerCase()];
    if (sample) {
      el.replaceWith(makePicture(`/media/wr3/${sample}.jpg`));
      return;
    }
    const ph = document.createElement('div');
    ph.className = `wr3-ph${opts.dark ? ' wr3-ph-dark' : ''}`;
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', 'Image placeholder');
    ph.textContent = label;
    el.replaceWith(ph);
  });
}

/**
 * Returns the media element (picture/img or placeholder) found in a container,
 * or null. Call decoratePlaceholders first.
 * @param {Element} root
 * @returns {Element|null}
 */
export function findMedia(root) {
  const sel = 'picture, img, .wr3-ph';
  const el = root.matches(sel) ? root : root.querySelector(sel);
  if (!el) return null;
  return el.closest('picture') || el;
}

/**
 * Adds a button class to links that are the only content of a paragraph.
 * @param {Element} root
 * @param {string} [variant] e.g. 'ghost' or 'light'
 */
export function decorateButtons(root, variant = '') {
  root.querySelectorAll('p > a:only-child').forEach((a) => {
    a.classList.add('wr3-btn');
    if (variant) a.classList.add(`wr3-btn-${variant}`);
    a.closest('p').classList.add('wr3-btn-wrap');
  });
}

/**
 * Creates an element with a class name and optional children.
 * @param {string} tag
 * @param {string} [className]
 * @param {...(Node|string)} children
 * @returns {HTMLElement}
 */
export function el(tag, className = '', ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}
