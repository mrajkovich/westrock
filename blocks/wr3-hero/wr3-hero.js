import {
  el, decoratePlaceholders, decorateButtons, findMedia,
} from '../../scripts/wr3.js';

/**
 * Authoring: one row, two cells.
 *   cell 1: breadcrumb paragraph (links separated by "/"), H1, optional lead paragraph,
 *           button link in its own paragraph
 *   cell 2: circular lifestyle image (square, 740x740 recommended)
 */
export default function decorate(block) {
  const [textCell, mediaCell] = block.querySelectorAll(':scope > div > div');
  decoratePlaceholders(block);

  const text = el('div', 'wr3-hero-text');
  let seenHeading = false;
  [...textCell.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName)) seenHeading = true;
    if (!seenHeading && child.tagName === 'P') {
      if (child.querySelectorAll('a').length > 1) {
        // several links before the heading: breadcrumb trail
        const nav = el('nav', 'wr3-hero-crumbs');
        nav.setAttribute('aria-label', 'Breadcrumb');
        nav.innerHTML = child.innerHTML;
        text.append(nav);
      } else {
        // plain text before the heading becomes the eyebrow
        text.append(el('span', 'wr3-eyebrow', child.textContent.trim()));
      }
    } else {
      text.append(child);
    }
  });
  decorateButtons(text);
  text.querySelectorAll('p:not(.wr3-btn-wrap)').forEach((p) => p.classList.add('wr3-hero-lead'));

  const media = el('div', 'wr3-hero-media');
  const picture = mediaCell ? findMedia(mediaCell) : null;
  if (picture) {
    const frame = el('div', 'wr3-hero-frame');
    frame.append(picture);
    media.append(el('span', 'wr3-hero-ring'), frame);
  }

  block.replaceChildren(el('div', 'wr3-hero-grid wr3-wrap', text, media));
}
