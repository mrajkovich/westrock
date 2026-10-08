import { el, decoratePlaceholders, findMedia } from '../../scripts/wr3.js';

/**
 * Authoring:
 *   row 1: one cell with the H2 (optional eyebrow paragraph above it)
 *   row 2: two cells
 *     cell 1: repeating groups of  [icon paragraph] [H3 title] [description paragraph]
 *             (the first three groups become the stat cards)
 *     cell 2: repeating pairs of   [image] [link paragraph]
 *             (the first two pairs become image cards captioned by the link)
 */
function parseGroups(cell) {
  const kids = [...cell.children];
  return kids.map((child, i) => {
    if (child.tagName !== 'H3') return null;
    const prev = kids[i - 1];
    const next = kids[i + 1];
    return {
      icon: prev?.tagName === 'P' ? prev : null,
      title: child,
      text: next?.tagName === 'P' ? next : null,
    };
  }).filter(Boolean);
}

function parseImages(cell) {
  const pairs = [];
  let current = null;
  [...cell.children].forEach((child) => {
    const hasLink = child.querySelector('a');
    if (hasLink && current) {
      current.link = child.querySelector('a');
      pairs.push(current);
      current = null;
    } else if (!hasLink) {
      current = { media: findMedia(child) };
    }
  });
  return pairs.filter((p) => p.media);
}

export default function decorate(block) {
  decoratePlaceholders(block);
  const [headRow, bodyRow] = [...block.children];
  const wrap = el('div', 'wr3-wrap');

  const head = el('div', 'wr3-sustain-head');
  head.append(...headRow.firstElementChild.children);
  if (!head.querySelector('.wr3-eyebrow')) {
    head.prepend(el('span', 'wr3-eyebrow', 'Sustainability'));
  }
  wrap.append(head);

  const [statsCell, imagesCell] = bodyRow.children;
  const stats = statsCell ? parseGroups(statsCell) : [];
  const images = imagesCell ? parseImages(imagesCell) : [];
  const masonry = el('div', 'wr3-masonry');

  const areas = ['a', 'd', 'c'];
  stats.slice(0, 3).forEach((g, i) => {
    const card = el('div', `wr3-card wr3-card-stat wr3-area-${areas[i]}${i === 0 ? ' wr3-card-dark' : ''}`);
    if (g.icon) {
      const icon = el('span', 'wr3-card-icon', g.icon.textContent.trim());
      icon.setAttribute('aria-hidden', 'true');
      card.append(icon);
    }
    card.append(g.title);
    if (g.text) card.append(g.text);
    masonry.append(card);
  });

  const imageAreas = ['b', 'e'];
  images.slice(0, 2).forEach((img, i) => {
    const card = el('div', `wr3-card wr3-card-image wr3-area-${imageAreas[i]}`);
    card.append(img.media);
    if (img.link) {
      img.link.classList.add('wr3-card-caption');
      card.append(img.link);
    }
    masonry.append(card);
  });

  wrap.append(masonry);
  block.replaceChildren(wrap);
}
