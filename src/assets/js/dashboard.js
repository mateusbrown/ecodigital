import { ArcElement, BarElement, BarController, CategoryScale, Chart, Legend, LinearScale, Tooltip, DoughnutController } from 'chart.js';

import recyclingData from '../data/recicla.json';

Chart.register(ArcElement, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController);

const data = [...recyclingData];

const dsUltimoAno = data.sort((a,b) => a.ano - b.ano).reverse()[0];

const materialLabels = { papel: 'Papel', vidro: 'Vidro', metal: 'Metal', plastico: 'Plástico' };
const materialColors = ['#76a8c6', '#4b9471', '#a8afb0', '#df785e'];
const materialValues = Object.keys(materialLabels).map((key) => {
  if (key == "metal") return dsUltimoAno.metal + dsUltimoAno.aluminio
  else return dsUltimoAno[key]
});

//console.log('materialValues',materialValues);

const numberFormat = new Intl.NumberFormat('pt-BR');

const dashYear = document.querySelector('[data-dashboard-year]');
if (dashYear) dashYear.textContent = dsUltimoAno.ano;

const dashTotal = document.querySelector('[data-total]');
if (dashTotal) dashTotal.textContent = numberFormat.format(dsUltimoAno.total);

Object.entries(materialLabels).forEach(([key]) => {
  let vValor = dsUltimoAno[key];
  if (key == "metal") vValor = vValor + dsUltimoAno.aluminio;
  let elemt = document.querySelector(`[data-material="${key}"]`);
  if (elemt) elemt.textContent = numberFormat.format(vValor);
});

const rankedMaterials = Object.entries(materialLabels)
  .map(([key, label]) => ({ 
    label: label,
    value: (key == "metal" ? (dsUltimoAno.metal + dsUltimoAno.aluminio) : dsUltimoAno[key])
  }))
  .sort((first, second) => second.value - first.value);

const [leading, ...rest] = rankedMaterials;
const trailing = rest.at(-1);

const dataLeading = document.querySelector('[data-leading]');
if (dataLeading) dataLeading.textContent = leading.label;

const dataLeadingValue = document.querySelector('[data-leading-value]');
if (dataLeadingValue) dataLeadingValue.textContent = `${numberFormat.format(leading.value)} toneladas`;

const dataTrailing = document.querySelector('[data-trailing]');
if (dataTrailing) dataTrailing.textContent = trailing.label;

const dataTrailingValue = document.querySelector('[data-trailing-value]');
if (dataTrailingValue) dataTrailingValue.textContent = `${numberFormat.format(trailing.value)} toneladas`;

const dataShare = document.querySelector('[data-share]');
if (dataShare) dataShare.textContent = `${Math.round((leading.value / dsUltimoAno.total) * 100)}%`;

const distribuitionChart = document.querySelector('#distribution-chart');
if (distribuitionChart)
{
  new Chart(distribuitionChart, {
    type: 'doughnut',
    data: {
      labels: Object.values(materialLabels),
      datasets: [{ data: materialValues, backgroundColor: materialColors, borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18, color: '#35433d' } } }
    }
  });
}

const historyChart = document.querySelector('#history-chart');
if (historyChart)
{
  new Chart(historyChart, {
    type: 'bar',
    data: {
      labels: data.map((item) => item.ano),
      datasets: [{ label: 'Toneladas demonstrativas', data: data.map((item) => item.total), backgroundColor: '#4b9471', borderRadius: 3, maxBarThickness: 42 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#65736c' } },
        y: { beginAtZero: true, grid: { color: '#e5e9e5' }, ticks: { color: '#65736c' } }
      }
    }
  });
}
