import { el, decorateButtons } from '../../scripts/wr3.js';

/**
 * Authoring: one cell with an H2, a paragraph and a button link.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  decorateButtons(cell);
  block.replaceChildren(el('div', 'wr3-wrap', el('div', 'wr3-band-inner', ...cell.children)));
}
