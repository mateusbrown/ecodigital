const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = [
  { name: 'index', title: 'EcoDigital | Reciclar hoje, preservar o amanhã', description: 'Um guia demonstrativo sobre reciclagem e sustentabilidade na cidade.' },
  { name: 'papel', title: 'Papel | EcoDigital', description: 'Conheça o guia demonstrativo de reciclagem de papel do EcoDigital.' },
  { name: 'vidro', title: 'Vidro | EcoDigital', description: 'Conheça o guia demonstrativo de reciclagem de vidro do EcoDigital.' },
  { name: 'metal', title: 'Metal | EcoDigital', description: 'Conheça o guia demonstrativo de reciclagem de metal do EcoDigital.' },
  { name: 'plastico', title: 'Plástico | EcoDigital', description: 'Conheça o guia demonstrativo de reciclagem de plástico do EcoDigital.' },
  { name: 'dados', title: 'Dados | EcoDigital', description: 'Explore indicadores de reciclagem no dashboard EcoDigital.' },
  { name: 'descarte', title: 'Descarte | EcoDigital', description: 'Conheça o passo de descarte do clico de reciclagem.' },
  { name: 'triagem', title: 'Triagem | EcoDigital', description: 'Conheça o passo da triagem do clico de reciclagem.' },
  { name: 'novoproduto', title: 'Novo Produto | EcoDigital', description: 'Conheça o resultado do clico de reciclagem.' }
];

module.exports = {
  entry: {
    app: './src/assets/js/main.js',
    dashboard: './src/assets/js/dashboard.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].[contenthash:8].js',
    clean: true,
    publicPath: ''
  },
  plugins: pages.map(({ name, title, description }) => new HtmlWebpackPlugin({
    template: `./src/${name}.html`,
    filename: `${name}.html`,
    title,
    description,
    chunks: name === 'dados' ? ['app', 'dashboard'] : ['app'],
    scriptLoading: 'defer',
    inject: 'body',
    templateParameters: { title, description }
  })),
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};