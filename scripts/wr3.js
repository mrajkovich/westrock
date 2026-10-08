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
 * Replaces authoring hints ("camera emoji Add image: ...") with a styled placeholder.
 * Real pictures are left untouched, so authoring an image removes the placeholder.
 * @param {Element} root
 * @param {{dark?: boolean}} [opts]
 */
export function decoratePlaceholders(root, opts = {}) {
  root.querySelectorAll('p, div').forEach((el) => {
    if (el.children.length) return;
    const text = el.textContent.trim();
    if (!text.startsWith(PLACEHOLDER_PREFIX)) return;
    const ph = document.createElement('div');
    ph.className = `wr3-ph${opts.dark ? ' wr3-ph-dark' : ''}`;
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', 'Image placeholder');
    ph.textContent = placeholderLabel(text);
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
