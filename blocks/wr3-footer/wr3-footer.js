import { el } from '../../scripts/wr3.js';

/**
 * Authoring:
 *   row 1: one cell per column. Cell 1 is the brand (a bold/linked name and a tagline);
 *          the other cells are link columns (H4 heading + list of links).
 *   row 2: one cell with the legal links and the copyright line.
 */
export default function decorate(block) {
  const [columnsRow, legalRow] = [...block.children];
  const cols = el('div', 'wr3-footer-cols');

  [...columnsRow.children].forEach((cell, i) => {
    const col = el('div', i === 0 ? 'wr3-footer-brand' : 'wr3-footer-col');
    col.append(...cell.children);
    cols.append(col);
  });

  const legal = el('div', 'wr3-footer-legal');
  if (legalRow) legal.append(...legalRow.firstElementChild.children);

  block.replaceChildren(el('div', 'wr3-wrap', cols, legal));
}
