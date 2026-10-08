import { el } from '../../scripts/wr3.js';

/**
 * Authoring: one row, two cells.
 *   cell 1: brand link
 *   cell 2: navigation links (the last link is shown as the highlighted action)
 */
export default function decorate(block) {
  const [brandCell, linksCell] = block.querySelectorAll(':scope > div > div');
  const brand = brandCell?.querySelector('a');
  const links = [...(linksCell?.querySelectorAll('a') || [])];

  const bar = el('div', 'wr3-nav-bar wr3-wrap');
  if (brand) {
    brand.className = 'wr3-nav-brand';
    bar.append(brand);
  } else {
    bar.append(el('span', 'wr3-nav-brand', brandCell?.textContent.trim() || ''));
  }

  const nav = el('nav', 'wr3-nav-links');
  nav.id = 'wr3-nav-links';
  nav.setAttribute('aria-label', 'Main');
  links.forEach((a, i) => {
    a.className = i === links.length - 1 ? 'wr3-nav-cta' : 'wr3-nav-link';
    nav.append(a);
  });

  const toggle = el('button', 'wr3-nav-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(el('span'));
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    block.classList.toggle('wr3-nav-open', open);
  });

  bar.append(toggle, nav);
  block.replaceChildren(bar);
}
