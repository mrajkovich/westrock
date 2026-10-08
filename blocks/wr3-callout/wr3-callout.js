import {
  el, decoratePlaceholders, decorateButtons, findMedia, makePicture,
} from '../../scripts/wr3.js';

/**
 * Authoring: one row, two cells.
 *   cell 1: image (about 240x280)
 *   cell 2: H2, supporting paragraph, button link
 * Rendered as the navy promotional strip above the footer.
 */
export default function decorate(block) {
  decoratePlaceholders(block, { dark: true });
  const [mediaCell, textCell] = block.querySelectorAll(':scope > div > div');
  decorateButtons(textCell, 'light');

  const media = el('div', 'wr3-callout-media');
  const pic = (mediaCell ? findMedia(mediaCell) : null) || makePicture('/media/wr3/callout.jpg');
  if (pic) media.append(pic);

  const text = el('div', 'wr3-callout-text', ...textCell.children);
  block.replaceChildren(el('div', 'wr3-callout-inner wr3-wrap', media, text));
}
