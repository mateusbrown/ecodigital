# EcoDigital

Hotsite demonstrativo sobre reciclagem, feito com HTML5, CSS3 e JavaScript vanilla. Todo o texto e todos os números são fictícios e servem apenas para apresentar a estrutura.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e build

```bash
npm install
npm run build
```

O webpack gera as seis páginas e seus arquivos locais em `dist/`. Para testar a versão de desenvolvimento, use `npm run build:dev`. Não há servidor obrigatório: abra `dist/index.html` no navegador. Os dados JSON são importados no bundle do dashboard para evitar bloqueios de `fetch` ao usar `file://`.

## Estrutura

```text
src/
  index.html, papel.html, vidro.html, metal.html, plastico.html, dados.html
  assets/
    css/style.css
    js/main.js, dashboard.js
    data/reciclacao.json
```

Chart.js é a única dependência de runtime. Webpack, webpack-cli e HtmlWebpackPlugin geram as páginas estáticas.