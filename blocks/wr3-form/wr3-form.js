import { el } from '../../scripts/wr3.js';

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Ireland', 'Germany',
  'France', 'Netherlands', 'Spain', 'Italy', 'Mexico', 'Brazil', 'Other'];
const INDUSTRIES = ['Home & Garden', 'Food & Beverage', 'Retail & E-commerce',
  'Agriculture', 'Industrial', 'Other'];

/** Maps an authored label to a field definition. */
function fieldFor(label) {
  const required = label.trim().endsWith('*');
  const text = label.replace('*', '').trim();
  const key = text.toLowerCase();
  const id = `wr3-${key.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  const name = key.replace(/[^a-z0-9]+(.)?/g, (m, c) => (c ? c.toUpperCase() : ''));
  const base = {
    id, name, label: text, required,
  };
  if (key.includes('email')) return { ...base, tag: 'input', type: 'email', autocomplete: 'email' };
  if (key.includes('country')) return { ...base, tag: 'select', options: COUNTRIES };
  if (key.includes('industry')) return { ...base, tag: 'select', options: INDUSTRIES };
  if (key.includes('help') || key.includes('message')) return { ...base, tag: 'textarea', full: true };
  if (key.startsWith('first')) return { ...base, tag: 'input', type: 'text', autocomplete: 'given-name' };
  if (key.startsWith('last')) return { ...base, tag: 'input', type: 'text', autocomplete: 'family-name' };
  if (key.includes('company')) return { ...base, tag: 'input', type: 'text', autocomplete: 'organization' };
  if (key.includes('phone')) return { ...base, tag: 'input', type: 'tel', autocomplete: 'tel' };
  return { ...base, tag: 'input', type: 'text' };
}

function buildField(def) {
  const wrap = el('div', `wr3-field${def.full ? ' wr3-field-full' : ''}`);
  const label = el('label', '', def.label);
  label.htmlFor = def.id;
  if (def.required) label.append(el('i', '', ' *'));

  const input = document.createElement(def.tag);
  input.id = def.id;
  input.name = def.name;
  if (def.type) input.type = def.type;
  if (def.autocomplete) input.autocomplete = def.autocomplete;
  if (def.required) input.required = true;
  if (def.tag === 'select') {
    input.append(new Option('Select\u2026', ''));
    def.options.forEach((o) => input.append(new Option(o, o)));
  }
  wrap.append(label, input);
  return wrap;
}

/**
 * Authoring: one row, two cells.
 *   cell 1: H2, intro paragraph, "* Mandatory Field" note
 *   cell 2: one paragraph per field label ("First Name *"), then a link paragraph.
 *           The label decides the field type (email, country, industry, message...).
 *           The link text becomes the submit button; its URL is the endpoint the
 *           form data is POSTed to as JSON.
 */
export default function decorate(block) {
  const [introCell, fieldsCell] = block.querySelectorAll(':scope > div > div');

  const intro = el('div', 'wr3-form-intro');
  if (!introCell.querySelector('.wr3-eyebrow')) {
    intro.append(el('span', 'wr3-eyebrow', 'Contact us'));
  }
  intro.append(...introCell.children);

  const form = el('form', 'wr3-form-card');
  form.noValidate = true;
  const grid = el('div', 'wr3-form-grid');
  let endpoint = '';
  let submitLabel = 'Submit';

  [...fieldsCell.children].forEach((child) => {
    const link = child.querySelector('a');
    if (link) {
      endpoint = link.getAttribute('href') || '';
      submitLabel = link.textContent.trim() || submitLabel;
    } else if (child.textContent.trim()) {
      grid.append(buildField(fieldFor(child.textContent)));
    }
  });

  const button = el('button', 'wr3-form-submit', submitLabel);
  button.type = 'submit';
  const status = el('p', 'wr3-form-status');
  status.setAttribute('role', 'status');
  grid.append(el('div', 'wr3-field wr3-field-full', button, status));
  form.append(grid);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !f.checkValidity());
      f.classList.toggle('wr3-invalid', bad);
      if (bad) valid = false;
    });
    status.className = 'wr3-form-status';
    if (!valid) {
      status.classList.add('wr3-form-error');
      status.textContent = 'Please complete the highlighted fields.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Submitting\u2026';
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.submittedAt = new Date().toISOString();
      payload.page = window.location.pathname;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });
      if (!resp.ok) throw new Error(resp.status);
      form.reset();
      status.classList.add('wr3-form-ok');
      status.textContent = 'Thank you. We\u2019ll get back to you as soon as we can.';
    } catch (err) {
      status.classList.add('wr3-form-error');
      status.textContent = 'Something went wrong. Please try again.';
    } finally {
      button.disabled = false;
    }
  });

  block.replaceChildren(el('div', 'wr3-form-layout wr3-wrap', intro, form));
}
