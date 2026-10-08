import { el, decoratePlaceholders, findMedia } from '../../scripts/wr3.js';

/**
 * Authoring:
 *   optional first row: eyebrow paragraph + H2 heading (an empty second cell is ignored)
 *   then one row per product card, two cells:
 *     cell 1: image
 *     cell 2: H3 title, short description, link (the whole card becomes clickable)
 */
export default function decorate(block) {
  decoratePlaceholders(block);
  const rows = [...block.children];
  const wrap = el('div', 'wr3-wrap');

  // a first row holding an H1/H2 is the section heading, whether it has one cell or two
  if (rows[0] && rows[0].querySelector('h1, h2') && !rows[0].querySelector('h3, a')) {
    const head = el('div', 'wr3-products-head');
    [...rows.shift().children].forEach((cell) => head.append(...cell.children));
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
