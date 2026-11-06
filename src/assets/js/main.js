import '../css/style.css';
import recyclingData from '../data/recicla.json';

function fnCalculaCO2(material, quantidade, unidade = 't') {
  const fatores = [
    {
      "key": "metal",
      "value": 1.759
    },
    {
      "key": "aluminio",
      "value": 10.563
    },
    {
      "key": "plastico",
      "value": 2.128
    },
    {
      "key": "papel",
      "value": 1.348
    },
    {
      "key": "vidro",
      "value": 0.354
    }
  ];

  let valor = 0;
  let f = 0;
  const fator = fatores.find(item => item.key === String(material).toLowerCase());

  if (fator) {
    f = fator.value;
    
    switch(unidade.toLowerCase()){
      case 't':
        f = f * 1;
        break;
      case 'k':
        f = f / 1000;
        break;
      case 'g':
        f = f / (1000 * 1000);
        break;
    }
    valor = quantidade * f;
  }
    
  return valor;
}

function fnCalculaCO2Total(obj,unidade = 't') {
  return fnCalculaCO2('metal', obj.metal,unidade) +
          fnCalculaCO2('aluminio', obj.aluminio,unidade) +
          fnCalculaCO2('plastico', obj.plastico,unidade) +
          fnCalculaCO2('papel', obj.papel,unidade) +
          fnCalculaCO2('vidro', obj.vidro,unidade);
  
}

function fnCalculaAgua(material, quantidade, unidade = 't') {
  const fatores = [
    {
      "key": "papel",
      "virgem": 52000,
      "value": 0.5
    },
    {
      "key": "aluminio",
      "virgem": 416667,
      "value": 0.76
    },
    {
      "key": "metal",
      "virgem": 26667,
      "value": 0.4
    },
    {
      "key": "plastico",
      "virgem": 23750,
      "value": 0.75
    },
    {
      "key": "vidro",
      "virgem": 2600,
      "value": 0.5
    }
  ];

  let valor = 0;
  let f = 0;
  const fator = fatores.find(item => item.key === String(material).toLowerCase());
  if (fator) {
    f = quantidade;
    
    switch(unidade.toLowerCase()){
      case 't':
        f = f * 1;
        break;
      case 'k':
        f = f / 1000;
        break;
      case 'g':
        f = f / (1000 * 1000);
        break;
    }
    valor = f * (fator.virgem - (fator.virgem * fator.value));
  }

  return valor;
}

function fnCalculaEnergia(material, quantidade, unidade = 't') {
  const fatores = [
    {
      "key": "papel",
      "virgem": 4167,
      "value": 0.4
    },
    {
      "key": "aluminio",
      "virgem": 300000,
      "value": 0.95
    },
    {
      "key": "metal",
      "virgem": 11250,
      "value": 0.4
    },
    {
      "key": "plastico",
      "virgem": 55000,
      "value": 0.8
    },
    {
      "key": "vidro",
      "virgem": 5000,
      "value": 0.1
    }
  ];

  let valor = 0;
  let f = 0;
  const fator = fatores.find(item => item.key === String(material).toLowerCase());
  if (fator) {
    f = quantidade;
    switch(unidade.toLowerCase()){
      case 't':
        f = f * 1;
        break;
      case 'k':
        f = f / 1000;
        break;
      case 'g':
        f = f / (1000 * 1000);
        break;
    }
    valor = f * (fator.virgem - (fator.virgem * fator.value));
  }
    
  return valor;
}

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

const data = [...recyclingData];

const dsUltimoAno = data.sort((a,b) => a.ano - b.ano).reverse()[0];

const homeAnoRef = document.querySelector('[data-home-ano-ref]');
if (homeAnoRef) homeAnoRef.textContent = "PAINEL DE REFERÊNCIA / " + dsUltimoAno.ano;

const homePercVar = document.querySelector('[data-home-percvar]');
if (homePercVar) {
  let supTag = document.createElement('sup');
  supTag.textContent = "%";
  homePercVar.textContent = dsUltimoAno.variacao.toLocaleString('pt-BR');
  homePercVar.appendChild(supTag);
}

const homeTotal = document.querySelector('[data-home-total]');
if (homeTotal) homeTotal.textContent = dsUltimoAno.total.toLocaleString('pt-BR');

const leadingMaterial = Object.entries({ Papel: dsUltimoAno.papel, Vidro: dsUltimoAno.vidro, Metal: dsUltimoAno.metal, Plástico: dsUltimoAno.plastico, Alumínio: dsUltimoAno.aluminio }).sort((first, second) => second[1] - first[1])[0];
const homeLeading = document.querySelector('[data-home-leading]');
if (homeLeading && leadingMaterial) {
  if (leadingMaterial[0] == "Alumínio")
    homeLeading.textContent = "Metal"
  else
    homeLeading.textContent = leadingMaterial[0]
}  

const co2Estimativa = fnCalculaCO2Total(dsUltimoAno) * 1000;

const homeCO2Est = document.querySelector('[data-home-co2-est]');
if (homeCO2Est && co2Estimativa) {
  let supTag = document.createElement('sup');
  supTag.textContent = "t";
  homeCO2Est.textContent = Number.parseFloat(co2Estimativa.toFixed(0)).toLocaleString();
  homeCO2Est.appendChild(supTag);
}

const calculator = document.querySelector('#impact-calculator');
if (calculator) {
  const updateImpact = () => {
    const pesoGarrafaPet = 50; //gramas
    const pesoLataAluminio = 15; //gramas
    const pesoFolhaPapel = 4.68; //gramas

    const values = new FormData(calculator);
    const bottles = Math.max(0, Number(values.get('bottles')) || 0);
    const cans = Math.max(0, Number(values.get('cans')) || 0);
    const sheets = Math.max(0, Number(values.get('sheets')) || 0);
    
    let bottlesWeight = bottles * pesoGarrafaPet;
    let cansWeight = cans * pesoLataAluminio;
    let sheetsWeight = sheets * pesoFolhaPapel;

    let co2 = 0.0000;
    let water = 0.0000;
    let energy = 0.0000;
    
    co2 = fnCalculaCO2('plastico',bottlesWeight,'g') + fnCalculaCO2('aluminio',cansWeight,'g') + fnCalculaCO2('papel',sheetsWeight,'g');
    water = fnCalculaAgua('plastico',bottlesWeight,'g') + fnCalculaAgua('aluminio',cansWeight,'g') + fnCalculaAgua('papel',sheetsWeight,'g');
    energy = fnCalculaEnergia('plastico',bottlesWeight,'g') + fnCalculaEnergia('aluminio',cansWeight,'g') + fnCalculaEnergia('papel',sheetsWeight,'g');

    const dataimpactco2 = calculator.querySelector('[data-impact="co2"]');
    if (dataimpactco2) dataimpactco2.textContent = `${co2.toFixed(5).toLocaleString('pt-BR')} g`;

    const dataimpactwater = calculator.querySelector('[data-impact="water"]');
    if (dataimpactwater) dataimpactwater.textContent = `${water.toFixed(2).toLocaleString('pt-BR')} L`;

    const dataimpactenergy = calculator.querySelector('[data-impact="energy"]');
    if (dataimpactenergy) dataimpactenergy.textContent = `${energy.toFixed(3).toLocaleString('pt-BR')} Wh`;
  };
  calculator.addEventListener('input', updateImpact);
  updateImpact();
}