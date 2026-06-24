# Curriculo-Frontend

Projeto estático para exibição e exportação em PDF do currículo de Filipe Henrique Gonçalves.

## Estrutura

```text
Curriculo-Frontend/
├── index.html
├── data/
│   └── curriculo-filipe-v1.json
├── assets/
│   ├── docs/
│   │   └── diploma-bacharel-si-eniac.pdf
│   ├── images/
│   │   └── foto-perfil-01.png
│   └── js/
│       └── curriculo.js
└── DOCUMENTACAO_TECNICA.md
```

## Como executar

Por usar `fetch` para carregar o JSON, abra o projeto por um servidor local:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Dados e tradução

Todo o conteúdo editável fica em `data/curriculo-filipe-v1.json`.

O arquivo possui:

- Dados fixos de perfil, imagem, links e ícones.
- Conteúdo em português em `translations.pt`.
- Conteúdo em inglês em `translations.en`.
- Textos do botão, contato, idiomas, resumo, habilidades, experiências, formação, certificações e cursos.

Para alterar o currículo, edite apenas o JSON sempre que possível. O `index.html` concentra a estrutura visual, CSS e ponto de montagem, enquanto `assets/js/curriculo.js` renderiza os dados mantendo as classes usadas pelo layout e pela impressão em PDF.

## Exportação PDF

O botão **Exportar PDF** chama `window.print()`. As regras de impressão estão no bloco `@media print` do `index.html`.

O seletor de idioma fica ao lado esquerdo do botão de exportação e salva a preferência no `localStorage` com a chave `curriculoLanguage`.
