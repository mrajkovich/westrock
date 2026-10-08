import { el, decoratePlaceholders, findMedia } from '../../scripts/wr3.js';

/**
 * Authoring:
 *   optional first row, single cell: eyebrow paragraph + H2 heading
 *   then one row per product card, two cells:
 *     cell 1: image
 *     cell 2: H3 title, short description, link (the whole card becomes clickable)
 */
export default function decorate(block) {
  decoratePlaceholders(block);
  const rows = [...block.children];
  const wrap = el('div', 'wr3-wrap');

  if (rows[0] && rows[0].children.length === 1) {
    const head = el('div', 'wr3-products-head');
    head.append(...rows.shift().firstElementChild.children);
    const first = head.firstElementChild;
    if (first?.tagName === 'P' && !first.querySelector('a')) first.className = 'wr3-eyebrow';
    wrap.append(head);
  }

  const grid = el('ul', 'wr3-products-grid');
  rows.forEach((row) => {
    const [imgCell, textCell] = row.children;
    const li = el('li', 'wr3-products-card');
    const media = el('div', 'wr3-products-media');
    const pic = imgCell ? findMedia(imgCell) : null;
    if (pic) media.append(pic);
    const body = el('div', 'wr3-products-body');
    if (textCell) body.append(...textCell.children);
    const link = body.querySelector('a');
    if (link) {
      link.classList.add('wr3-link');
      link.closest('p')?.classList.add('wr3-products-cta');
    }
    li.append(media, body);
    grid.append(li);
  });

  wrap.append(grid);
  block.replaceChildren(wrap);
}
