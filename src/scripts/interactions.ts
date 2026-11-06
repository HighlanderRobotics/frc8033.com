const header = document.querySelector<HTMLElement>('.site-header');
const navToggle = header?.querySelector<HTMLButtonElement>('.nav-toggle');
const dropdowns = [...document.querySelectorAll<HTMLDetailsElement>('.nav-dropdown')];
header?.setAttribute('data-enhanced', '');
const closeDropdowns = (except?: HTMLDetailsElement) => dropdowns.forEach(details => { if (details !== except) details.open = false; });
const setNavigation = (open: boolean) => {
  header?.toggleAttribute('data-nav-open', open);
  navToggle?.setAttribute('aria-expanded', String(open));
  navToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (!open) closeDropdowns();
};
navToggle?.addEventListener('click', () => setNavigation(!header?.hasAttribute('data-nav-open')));
dropdowns.forEach(details => {
  details.addEventListener('toggle', () => { if (details.open) closeDropdowns(details); });
  details.addEventListener('focusout', e => { if (e.relatedTarget && !details.contains(e.relatedTarget as Node)) details.open = false; });
  details.addEventListener('keydown', e => {
    if (e.key === 'Escape' && details.open) {
      e.stopPropagation(); details.open = false; details.querySelector('summary')?.focus();
    }
  });
});
document.addEventListener('click', e => { if (header && !header.contains(e.target as Node)) { closeDropdowns(); setNavigation(false); } });
header?.addEventListener('keydown', e => { if (e.key === 'Escape') { setNavigation(false); navToggle?.focus(); } });
header?.addEventListener('focusout', e => { if (e.relatedTarget && !header.contains(e.relatedTarget as Node)) closeDropdowns(); });
matchMedia('(min-width: 901px)').addEventListener('change', () => setNavigation(false));
document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach(form => {
  // No submission is claimed until a real form service is configured and tested.
  const note = document.createElement('p');
  note.textContent = 'To contact the team, this preview opens your email app with your message. Your email app must send it to complete delivery.';
  note.setAttribute('role', 'note'); form.prepend(note);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const message = [...fields.entries()].map(([key, value]) => `${key}: ${value}`).join('\n\n');
    location.href = `mailto:frc8033@piedmontmakers.org?subject=${encodeURIComponent('Highlander Robotics website inquiry')}&body=${encodeURIComponent(message)}`;
  });
});
