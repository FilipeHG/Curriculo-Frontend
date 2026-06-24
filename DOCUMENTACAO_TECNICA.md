# Documentacao tecnica - Curriculo-Frontend

Este documento resume a arquitetura deste projeto, para servir como referência na reutilização da mesma abordagem em qualquer outro projeto.

## 1. Frameworks, bibliotecas e versoes

O projeto e uma aplicacao frontend estatica, sem `package.json`, sem build npm obrigatorio e sem bundler. As dependencias sao carregadas por CDN diretamente nos arquivos HTML.

Principais bibliotecas encontradas:

| Biblioteca | Versao/URL usada | Uso |
|---|---:|---|
| Bootstrap CSS/JS | `5.3.0` em paginas base e dinamicas; `5.3.3` nas paginas tecnicas mais novas | Layout responsivo, grid, botoes, cards, dropdowns, navbar |
| Bootstrap Icons | `1.11.1` e `1.11.3` | Icones de navegacao, cards, botoes e menus |
| Font Awesome | `6.4.0` | Icones complementares, principalmente botoes e categorias |
| React | `18`, UMD via CDN | Renderizacao isolada do seletor de idiomas nas paginas tecnicas |
| React DOM | `18`, UMD via CDN | Montagem do componente React no elemento `languageSelectorRoot` |
| i18next | `23.4.0` | Motor de internacionalizacao das paginas tecnicas |
| react-i18next | `13.0.1` | Integracao React + i18next para o componente de idioma |
| Highlight.js | `11.9.0` | Syntax highlighting em paginas tecnicas com blocos de codigo |
| Mermaid | CDN sem versao fixa (`https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`) | Diagramas em documentacoes tecnicas |
| country-flag-icons | `1.5.7` | Bandeiras BR/US no seletor de idioma |

Observacao importante: o `README.md` menciona "Web APP in React", mas a maior parte do projeto e HTML/CSS/JavaScript estatico. O React aparece de forma pontual, principalmente para o seletor de idioma em algumas paginas.

## 2. Linguagens utilizadas

- HTML5: estrutura das paginas estaticas.
- CSS3: estilos embutidos em `<style>` e classes Bootstrap.
- JavaScript ES6: renderizacao dinamica, busca, audio, gravacao, leitura de JSON e troca de idioma.
- JSON: armazenamento dos conteudos de entrevista e documentacao.
- Node.js/CommonJS: scripts geradores com `require('fs')` e `require('path')`.
- Python: scripts utilitarios pontuais para patch, ajustes e manutencao.

## 3. Sistema de leitura e armazenagem de dados

O projeto usa duas estrategias principais.

### 3.1 Dados em JSON externo

As paginas carregam arquivos dentro de `data/` usando `fetch`.

Exemplo real:

```javascript
document.addEventListener("DOMContentLoaded", () => {
    fetch(`data/interview-frontend.json`)
        .then(response => response.json())
        .then(sections => {
            const container = document.getElementById('dynamic-content');
            let html = '';

            sections.forEach((section, index) => {
                html += `
                    <h2 class="section-title"><i class="${section.icon}"></i> ${index + 1}. ${section.title}</h2>
                    <div class="row g-4 mb-4">`;

                section.cards.forEach(card => {
                    html += `
                        <div class="col-md-6">
                            <div class="card question-card h-100">
                                <div class="card-header">${card.topic}</div>
                                <div class="card-body d-flex flex-column">
                                    <div class="question-text">
                                        ❓ “${card.q_en}”
                                        <small class="question-pt">“${card.q_pt}”</small>
                                    </div>
                                    <p class="answer-en mt-3">“${card.a_en}”</p>
                                    <p class="answer-pt mb-4">“${card.a_pt}”</p>
                                </div>
                            </div>
                        </div>`;
                });

                html += `</div>`;
            });

            container.innerHTML = html;
        });
});
```

Exemplo de formato do JSON:

```json
[
    {
        "title": "Angular Deep Dive",
        "icon": "fab fa-angular",
        "cards": [
            {
                "topic": "Components",
                "q_en": "What is a Component in Angular and what are its main parts?",
                "q_pt": "O que e um Component em Angular e quais sao suas partes principais?",
                "a_en": "A Component is the basic building block of the UI...",
                "a_pt": "Um Component e o bloco basico de construcao da UI..."
            }
        ]
    }
]
```

Outro formato:

```json
{
    "title": "Frontend & APIs",
    "iconClass": "bi bi-browser-chrome",
    "sections": [
        {
            "title": "Modern SPA Ecosystem",
            "icon": "bi bi-window-sidebar",
            "cards": [
                {
                    "topic": "React Enterprise",
                    "contentEn": "<ul><li>...</li></ul>",
                    "contentPt": "<ul><li>...</li></ul>"
                }
            ]
        }
    ]
}
```

Os JSONs podem ter qualquer formato, considerando a estrutura que ficar melhor para o projeto.

### 3.2 Dados embutidos no HTML

Algumas paginas podem carregar os dados em uma constante `data` dentro do proprio HTML. Ja outras paginas mais completas podem ter conteúdo HTML estático e traduções embutidas no objeto `translationResources`.

### 3.3 Scripts geradores

Os scripts `generate_<...>.js` mantem os objetos fonte e geram HTML/JSON a partir deles.

Exemplo do gerador salvando JSON:

```javascript
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

function generatePage(filename, title, iconClass, sections) {
    const jsonFilename = filename.replace('.html', '.json');
    fs.writeFileSync(path.join('data', jsonFilename), JSON.stringify(sections, null, 4), 'utf8');
}
```

## 4. Estrutura de pastas

Estrutura principal observada:

```text
Curriculo-Frontend/
├── index.html
├── data/
│   ├── curriculo-filipe-v1.json
├── assets/
│   └── images/
│       ├── foto-perfil-01.png
│   └── docs/
│       ├── diploma-bacharel-si-eniac.pdf
├── generate_site_dynamic.js
├── generate_curriculo_objects.js
├── site.webmanifest
├── favicons e imagens PWA
└── scripts utilitarios de correcao/manutencao
```

## 5. Sistema de traducao e fluxo tecnico da troca de idiomas

O fluxo de traducao nas paginas tecnicas usa `i18next` com um componente React pequeno para o seletor.

### 5.1 Estado inicial

A pagina lê o idioma salvo no navegador:

```javascript
const currentLanguage = localStorage.getItem('technicalDocLanguage') || 'pt';
```

Em algumas paginas a base e portugues (`fallbackLng: 'pt'`); em outras, como a pagina Java, a base e ingles (`fallbackLng: 'en'`). A ideia, porem, e a mesma: o HTML original e tratado como texto base, e o outro idioma vem do dicionario `translationResources`.

### 5.2 Dicionário de traduções

As traduções ficam no proprio HTML:

```javascript
const translationResources = {
    en: {
        translation: {
            "Visao Geral": "Overview",
            "Introducao": "Introduction"
        }
    }
};
```

Com `keySeparator: false`, cada texto inteiro vira uma chave literal. Isso permite traduzir frases completas sem criar chaves como `home.title`.

### 5.3 Selecionar elementos traduziveis

O script varre o DOM e seleciona textos que podem ser traduzidos:

```javascript
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function createTranslatableElements() {
    return Array.from(document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, li:not(.breadcrumb-item), td, th, span:not(.badge):not(.bi), a:not(.lang-item):not(.dropdown-item), button:not(#languageToggle), .tag, .callout, .warning, .danger, .badge, .info-box, .warning-box, .success-box'
    )).filter(element => {
        if (element.closest('pre, .code-block, #languageSelectorRoot, .dropdown-menu')) return false;
        if (element.classList.contains('no-translate')) return false;
        const text = normalizeText(element.textContent || '');
        return text.length > 1;
    });
}
```

Pontos importantes:

- Blocos de codigo, `pre`, dropdowns e o seletor de idioma sao ignorados.
- Elementos com `.no-translate` tambem sao ignorados.
- O texto e normalizado para evitar problemas com quebras de linha e espacos extras.

### 5.4 Guardar texto original

Antes de traduzir, o texto original e salvo em `data-original-text`:

```javascript
function storeOriginalText(element) {
    if (!element.dataset.originalText) {
        element.dataset.originalText = normalizeText(element.textContent);
    }
}
```

Isso permite restaurar o idioma original sem depender de uma traducao reversa.

### 5.5 Aplicar traducao

```javascript
function applyTranslations(elements) {
    elements.forEach(el => {
        const originalKey = el.dataset.originalText || normalizeText(el.textContent);
        const translated = i18next.t(originalKey, { defaultValue: originalKey });

        if (translated !== originalKey) {
            const icon = el.querySelector('i.bi');
            if (icon) {
                el.innerHTML = icon.outerHTML + ' ' + translated;
            } else {
                el.textContent = translated;
            }
        }
    });
}
```

Se o elemento tiver icone Bootstrap (`i.bi`), o script preserva o HTML do icone e troca apenas o texto.

### 5.6 Restaurar idioma original

```javascript
function restoreOriginalTexts(elements) {
    elements.forEach(el => {
        if (el.dataset.originalText) {
            const icon = el.querySelector('i.bi');
            if (icon) {
                el.innerHTML = icon.outerHTML + ' ' + el.dataset.originalText;
            } else {
                el.textContent = el.dataset.originalText;
            }
        }
    });
}
```

### 5.7 Troca de idioma

```javascript
function changeLanguage(lang) {
    if (lang === i18next.language) return;

    localStorage.setItem('technicalDocLanguage', lang);

    i18next.changeLanguage(lang).then(() => {
        const elements = createTranslatableElements();

        if (lang === 'pt') {
            restoreOriginalTexts(elements);
        } else {
            elements.forEach(storeOriginalText);
            applyTranslations(elements);
        }

        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    });
}
```

Fluxo resumido:

1. Usuario clica no idioma.
2. `changeLanguage('pt')` ou `changeLanguage('en')` e chamado.
3. O idioma e salvo em `localStorage.technicalDocLanguage`.
4. `i18next.changeLanguage` troca o estado interno.
5. O DOM e percorrido novamente.
6. Se voltar ao idioma original, restaura `data-original-text`.
7. Se trocar para outro idioma, aplica `i18next.t`.
8. O atributo `<html lang="">` e atualizado para acessibilidade e SEO.

## 6. Icones do select box de troca de idiomas

O seletor usa imagens SVG externas do pacote `country-flag-icons`:

- Brasil: `https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg`
- Estados Unidos: `https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/US.svg`

### 6.1 HTML base do seletor

No HTML da pagina existe apenas o ponto de montagem:

```html
<div id="languageSelectorRoot"></div>
```

Esse elemento fica no header, junto dos botoes de imprimir, home e menu:

```html
<div class="d-flex align-items-center gap-2">
    <div id="languageSelectorRoot"></div>

    <button onclick="window.print()" class="btn shadow" style="background-color: #0e3167; color: white;" title="Print PDF">
        <i class="fas fa-print"></i>
    </button>

    <a href="index.html" class="btn shadow" style="background-color: #0e3167; color: white;" title="Home">
        <i class="bi bi-house-door-fill"></i>
    </a>
</div>
```

### 6.2 HTML final equivalente renderizado pelo React

O React gera uma estrutura equivalente a esta:

```html
<div class="dropdown" style="position: relative;">
    <button
        type="button"
        class="btn shadow no-translate"
        title="Select Language"
        aria-haspopup="true"
        aria-expanded="false">
        <img
            id="flagIcon"
            src="https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg"
            alt="BR">
    </button>

    <ul class="dropdown-menu dropdown-menu-end shadow">
        <li>
            <button type="button" class="dropdown-item fw-bold no-translate" onclick="changeLanguage('pt')">
                <img src="https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg" alt="BR">
                Portugues
            </button>
        </li>
        <li>
            <button type="button" class="dropdown-item fw-bold no-translate" onclick="changeLanguage('en')">
                <img src="https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/US.svg" alt="US">
                English
            </button>
        </li>
    </ul>
</div>
```

### 6.3 CSS de exemplo

No projeto, boa parte do estilo do seletor esta inline dentro do componente React. Para reaproveitar em outro projeto, este CSS representa o mesmo visual de forma extraida:

```css
#languageSelectorRoot {
    display: inline-flex;
    align-items: center;
}

.language-dropdown {
    position: relative;
}

.language-toggle {
    background-color: #fff;
    color: #000;
    min-width: 45px;
    padding: 6px 10px;
    border: 0;
}

.language-toggle img,
#flagIcon {
    width: 24px;
    height: 18px;
    border-radius: 2px;
    display: block;
}

.language-menu {
    margin-top: 4px;
}

.language-menu.show {
    display: block;
}

.language-option {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
}

.language-option img {
    width: 20px;
    height: 15px;
    border-radius: 2px;
    margin-right: 8px;
}
```

Se quiser manter exatamente a abordagem atual, o seletor pode continuar usando classes Bootstrap:

```html
<button class="btn shadow no-translate">...</button>
<ul class="dropdown-menu dropdown-menu-end shadow">...</ul>
<button class="dropdown-item fw-bold no-translate">...</button>
```

## 7. Scripts utilizados e invocados na troca de idioma

### 7.1 Dependencias no `<head>`

```html
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/i18next@23.4.0/dist/umd/i18next.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/react-i18next@13.0.1/dist/umd/react-i18next.min.js" crossorigin></script>
```

### 7.2 Inicializacao do i18next

```javascript
function initializeLanguageSwitcher() {
    if (typeof i18next === 'undefined' || typeof window.ReactI18next === 'undefined') {
        setTimeout(initializeLanguageSwitcher, 100);
        return;
    }

    i18next
        .use(window.ReactI18next.initReactI18next)
        .init({
            resources: translationResources,
            lng: currentLanguage,
            fallbackLng: 'pt',
            debug: false,
            keySeparator: false,
            interpolation: { escapeValue: false }
        }).then(() => {
            renderLanguageSwitcher();
            document.documentElement.lang = (i18next.language === 'pt' ? 'pt-BR' : 'en');

            if (i18next.language === 'en') {
                const elements = createTranslatableElements();
                elements.forEach(storeOriginalText);
                applyTranslations(elements);
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    initializeLanguageSwitcher();
});
```

### 7.3 Componente React do seletor

```javascript
function renderLanguageSwitcher() {
    if (!window.React || !window.ReactDOM || !window.i18next || !window.ReactI18next) return;

    const { useTranslation, I18nextProvider } = window.ReactI18next;

    function LanguageSwitcher() {
        const { i18n } = useTranslation();
        const [open, setOpen] = React.useState(false);

        React.useEffect(() => {
            function handleDocumentClick(event) {
                const root = document.getElementById('languageSelectorRoot');
                if (root && !root.contains(event.target)) {
                    setOpen(false);
                }
            }
            document.addEventListener('click', handleDocumentClick);
            return () => document.removeEventListener('click', handleDocumentClick);
        }, []);

        const lang = i18n.language || 'pt';
        const flagSrc = lang === 'pt'
            ? 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg'
            : 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/US.svg';
        const flagAlt = lang === 'pt' ? 'BR' : 'US';

        return React.createElement('div', {
            className: `dropdown${open ? ' show' : ''}`,
            style: { position: 'relative' }
        },
            React.createElement('button', {
                type: 'button',
                className: 'btn shadow no-translate',
                onClick: () => setOpen(prev => !prev),
                style: { backgroundColor: '#fff', color: '#000', minWidth: '45px', padding: '6px 10px' },
                title: 'Select Language',
                'aria-haspopup': 'true',
                'aria-expanded': open
            },
                React.createElement('img', {
                    id: 'flagIcon',
                    src: flagSrc,
                    alt: flagAlt,
                    style: { width: '24px', height: '18px', borderRadius: '2px' }
                })
            ),
            React.createElement('ul', {
                className: `dropdown-menu dropdown-menu-end shadow${open ? ' show' : ''}`,
                style: { display: open ? 'block' : 'none', marginTop: '4px' }
            },
                React.createElement('li', null,
                    React.createElement('button', {
                        type: 'button',
                        className: 'dropdown-item fw-bold no-translate',
                        style: { width: '100%', textAlign: 'left', background: 'none', border: 'none' },
                        onClick: () => { changeLanguage('pt'); setOpen(false); }
                    },
                        React.createElement('img', {
                            src: 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/BR.svg',
                            alt: 'BR',
                            style: { width: '20px', height: '15px', borderRadius: '2px', marginRight: '8px' }
                        }),
                        'Portugues'
                    )
                ),
                React.createElement('li', null,
                    React.createElement('button', {
                        type: 'button',
                        className: 'dropdown-item fw-bold no-translate',
                        style: { width: '100%', textAlign: 'left', background: 'none', border: 'none' },
                        onClick: () => { changeLanguage('en'); setOpen(false); }
                    },
                        React.createElement('img', {
                            src: 'https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.7/3x2/US.svg',
                            alt: 'US',
                            style: { width: '20px', height: '15px', borderRadius: '2px', marginRight: '8px' }
                        }),
                        'English'
                    )
                )
            )
        );
    }

    const rootElement = document.getElementById('languageSelectorRoot');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            React.createElement(I18nextProvider, { i18n: i18next }, React.createElement(LanguageSwitcher))
        );
    }
}
```

### 7.4 Função de troca chamada pelo select

```javascript
function changeLanguage(lang) {
    if (lang === i18next.language) return;

    localStorage.setItem('technicalDocLanguage', lang);

    i18next.changeLanguage(lang).then(() => {
        const elements = createTranslatableElements();

        if (lang === 'pt') {
            restoreOriginalTexts(elements);
        } else {
            elements.forEach(storeOriginalText);
            applyTranslations(elements);
        }

        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    });
}
```

## Recomendação para reutilizar em qualquer projeto

Para reaplicar a mesma arquitetura:

1. Mantenha conteudo editavel em JSON quando forem paginas repetitivas, como entrevistas, cards e documentacoes por topico.
2. Use geradores Node.js para transformar objetos fonte em HTML/JSON quando o conteudo crescer.
3. Para paginas longas e editoriais, mantenha o HTML estatico e use `translationResources` com i18next.
4. Salve o idioma em `localStorage` para manter a preferencia do usuario entre paginas.
5. Preserve o texto original em `data-original-text` antes de traduzir.
6. Ignore blocos tecnicos (`pre`, `code`, dropdowns, seletor de idioma) na traducao automatica do DOM.
7. Use `.no-translate` para qualquer elemento que nunca deve ser processado pelo tradutor.
8. Padronize o fallback por pagina: se o HTML base for portugues, use `fallbackLng: 'pt'`; se o HTML base for ingles, use `fallbackLng: 'en'`.
