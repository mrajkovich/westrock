/**
 * Legacy empty block kept so existing authored pages do not break.
 * It carries no content, so remove it from the page when convenient.
 */
export default function decorate(block) {
  block.closest('.wr3-page-chrome-wrapper')?.remove();
}
