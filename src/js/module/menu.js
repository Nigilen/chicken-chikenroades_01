const menu = document.querySelector('.nav__list');
const burger = document.querySelector('.burger');
const menuLinks = menu.querySelectorAll('.nav__link');

const clearMenu = () => {
  menu.classList.remove('is-open');
  burger.classList.remove('burger--open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
};

burger.addEventListener('click', () => {
  menu.classList.toggle('is-open');
  burger.classList.toggle('burger--open');
  burger.setAttribute('aria-expanded', menu.classList.contains('is-open'));
  burger.setAttribute('aria-label', menu.classList.contains('is-open') ? 'Close menu' : 'Open menu');

  if (menu.classList.contains('is-open')) {
    menuLinks.forEach(link => {
      link.addEventListener('click', clearMenu);
    });
  }
});