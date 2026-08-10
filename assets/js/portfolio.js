const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const resumeDialog = document.querySelector('#resume-request');
const resumeTriggers = document.querySelectorAll('[data-resume-request]');
const closeDialogButton = document.querySelector('[data-dialog-close]');
const copyEmailButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('[data-copy-status]');
const contactEmail = 'rodgersbiwott2016@gmail.com';

resumeTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if (resumeDialog?.showModal) resumeDialog.showModal();
  });
});

closeDialogButton?.addEventListener('click', () => resumeDialog?.close());
resumeDialog?.addEventListener('click', (event) => {
  if (event.target === resumeDialog) resumeDialog.close();
});

copyEmailButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(contactEmail);
  } catch {
    const field = document.createElement('textarea');
    field.value = contactEmail;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }

  if (copyStatus) copyStatus.textContent = 'Email copied — paste it into any email service.';
  if (copyEmailButton) copyEmailButton.textContent = 'Copied';
});
