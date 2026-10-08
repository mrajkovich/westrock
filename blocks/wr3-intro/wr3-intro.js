import { el } from '../../scripts/wr3.js';

/**
 * Authoring: one cell with an H2 (lead statement), body paragraphs,
 * and a bulleted list. Each bullet is "Bold title: description".
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  const head = el('div', 'wr3-intro-head');
  const list = cell.querySelector('ul');

  [...cell.children].forEach((child) => {
    if (child !== list) head.append(child);
  });

  if (list) {
    list.classList.add('wr3-intro-benefits');
    list.querySelectorAll('li').forEach((li) => {
      const title = li.querySelector('strong');
      if (!title) return;
      // drop the ": " separator that follows the bold title
      const next = title.nextSibling;
      if (next && next.nodeType === Node.TEXT_NODE) {
        next.textContent = next.textContent.replace(/^\s*:\s*/, '');
      }
    });
  }

  block.replaceChildren(el('div', 'wr3-wrap', head, ...(list ? [list] : [])));
}
