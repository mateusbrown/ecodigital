import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
import recyclingData from '../data/reciclacao.json';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const materialLabels = { papel: 'Papel', vidro: 'Vidro', metal: 'Metal', plastico: 'Plástico' };
const materialColors = ['#76a8c6', '#4b9471', '#a8afb0', '#df785e'];
const materialValues = Object.keys(materialLabels).map((key) => recyclingData[key]);
const numberFormat = new Intl.NumberFormat('pt-BR');

document.querySelector('[data-dashboard-year]').textContent = recyclingData.ano;
document.querySelector('[data-total]').textContent = numberFormat.format(recyclingData.total_reciclado);
Object.entries(materialLabels).forEach(([key, label]) => {
  document.querySelector(`[data-material="${key}"]`).textContent = numberFormat.format(recyclingData[key]);
});

const rankedMaterials = Object.entries(materialLabels)
  .map(([key, label]) => ({ label, value: recyclingData[key] }))
  .sort((first, second) => second.value - first.value);
const [leading, ...rest] = rankedMaterials;
const trailing = rest.at(-1);
document.querySelector('[data-leading]').textContent = leading.label;
document.querySelector('[data-leading-value]').textContent = `${numberFormat.format(leading.value)} toneladas`;
document.querySelector('[data-trailing]').textContent = trailing.label;
document.querySelector('[data-trailing-value]').textContent = `${numberFormat.format(trailing.value)} toneladas`;
document.querySelector('[data-share]').textContent = `${Math.round((leading.value / recyclingData.total_reciclado) * 100)}%`;

new Chart(document.querySelector('#distribution-chart'), {
  type: 'doughnut',
  data: {
    labels: Object.values(materialLabels),
    datasets: [{ data: materialValues, backgroundColor: materialColors, borderWidth: 0, hoverOffset: 6 }]
  },
  options: {
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18, color: '#35433d' } } }
  }
});

new Chart(document.querySelector('#history-chart'), {
  type: 'bar',
  data: {
    labels: recyclingData.evolucao.map((item) => item.ano),
    datasets: [{ label: 'Toneladas demonstrativas', data: recyclingData.evolucao.map((item) => item.total), backgroundColor: '#4b9471', borderRadius: 3, maxBarThickness: 42 }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#65736c' } },
      y: { beginAtZero: true, grid: { color: '#e5e9e5' }, ticks: { color: '#65736c' } }
    }
  }
});