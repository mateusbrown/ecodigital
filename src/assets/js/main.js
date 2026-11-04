import '../css/style.css';
import recyclingData from '../data/reciclacao.json';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !expanded);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const updateTopButton = () => backToTop.classList.toggle('is-visible', window.scrollY > 420);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  updateTopButton();
}

const homeTotal = document.querySelector('[data-home-total]');
if (homeTotal) homeTotal.textContent = recyclingData.total_reciclado.toLocaleString('pt-BR');

const leadingMaterial = Object.entries({ papel: recyclingData.papel, vidro: recyclingData.vidro, metal: recyclingData.metal, plástico: recyclingData.plastico })
  .sort((first, second) => second[1] - first[1])[0];
const homeLeading = document.querySelector('[data-home-leading]');
if (homeLeading && leadingMaterial) homeLeading.textContent = leadingMaterial[0];

const calculator = document.querySelector('#impact-calculator');
if (calculator) {
  const updateImpact = () => {
    const values = new FormData(calculator);
    const bottles = Math.max(0, Number(values.get('bottles')) || 0);
    const cans = Math.max(0, Number(values.get('cans')) || 0);
    const sheets = Math.max(0, Number(values.get('sheets')) || 0);
    const co2 = bottles * 18 + cans * 14 + sheets * 3;
    const water = bottles * 2 + cans * 1.5 + sheets * 0.4;
    const energy = bottles * 22 + cans * 31 + sheets * 8;
    calculator.querySelector('[data-impact="co2"]').textContent = `${co2.toLocaleString('pt-BR')} g`;
    calculator.querySelector('[data-impact="water"]').textContent = `${water.toLocaleString('pt-BR')} L`;
    calculator.querySelector('[data-impact="energy"]').textContent = `${energy.toLocaleString('pt-BR')} Wh`;
  };
  calculator.addEventListener('input', updateImpact);
  updateImpact();
}