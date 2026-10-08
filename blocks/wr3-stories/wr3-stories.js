import { el, decoratePlaceholders, findMedia } from '../../scripts/wr3.js';

/**
 * Authoring:
 *   row 1: one cell with the H2 (optional eyebrow paragraph above it)
 *   row 2: one cell per story. The FIRST story is featured, the rest are supporting.
 *          Each cell: image, H3 title, "Read more" link.
 *   row 3 (optional): one cell with a link, e.g. "View our success stories"
 */
export default function decorate(block) {
  decoratePlaceholders(block);
  const [headRow, storyRow, footRow] = [...block.children];
  const wrap = el('div', 'wr3-wrap');

  const head = el('div', 'wr3-stories-head');
  head.append(...headRow.firstElementChild.children);
  if (!head.querySelector('.wr3-eyebrow')) {
    head.prepend(el('span', 'wr3-eyebrow', 'Customer stories'));
  }
  wrap.append(head);

  const stories = [...storyRow.children].map((cell, i) => {
    const article = el('article', `wr3-story ${i === 0 ? 'wr3-story-feature' : 'wr3-story-mini'}`);
    const media = el('div', 'wr3-story-media');
    const pic = findMedia(cell);
    if (pic) media.append(pic);
    const body = el('div', 'wr3-story-body');
    body.append(el('span', 'wr3-tag', 'Customer Story'));
    cell.querySelectorAll('h1, h2, h3, h4').forEach((h) => body.append(h));
    const link = cell.querySelector('a');
    if (link) {
      link.classList.add(i === 0 ? 'wr3-btn' : 'wr3-link');
      if (i === 0) link.classList.add('wr3-btn-ghost');
      const p = el('p', 'wr3-story-cta');
      p.append(link);
      body.append(p);
    }
    article.append(media, body);
    return article;
  });

  const [feature, ...rest] = stories;
  const grid = el('div', 'wr3-stories-grid', feature, el('div', 'wr3-stories-side', ...rest));
  wrap.append(grid);

  const footLink = footRow?.querySelector('a');
  if (footLink) {
    footLink.classList.add('wr3-link');
    wrap.append(el('p', 'wr3-stories-foot', footLink));
  }

  block.replaceChildren(wrap);
}
