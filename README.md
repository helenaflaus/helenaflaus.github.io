# helenaflaus.github.io

Portfolio pessoal de Helena Flausino — Analytics Engineer @ Itaú Unibanco.

🌐 **[helenaflaus.github.io](https://helenaflaus.github.io)**

---

## stack

Sem framework. HTML/CSS/JS puro, publicado via GitHub Pages.

| camada | tecnologia |
|--------|-----------|
| markup | HTML5 semântico |
| estilo | CSS custom properties + Google Fonts via fontsource (jsdelivr) |
| script | ES modules — i18n, animações, IntersectionObserver |
| deploy | GitHub Pages (branch `main`) |
| fontes | Plus Jakarta Sans Variable + JetBrains Mono |

---

## estrutura

```
helenaflaus.github.io/
├── index.html              ← página única com todas as seções
├── assets/
│   ├── css/
│   │   ├── tokens.css      ← design tokens (cores, tipografia, espaçamento)
│   │   └── main.css        ← todos os estilos
│   ├── js/
│   │   ├── main.js         ← entry point (ES module)
│   │   ├── i18n.js         ← toggle PT/EN sem dependências
│   │   └── animations.js   ← scroll reveals + gerador de barras do hero
│   └── img/
│       ├── helena.webp     ← foto (adicionar)
│       └── og-image.jpg    ← preview do LinkedIn (1200×630, adicionar)
├── data/
│   ├── pt.json             ← todo o conteúdo em português
│   └── en.json             ← todo o conteúdo em inglês
├── cv/
│   ├── helena-flausino-pt.pdf  ← currículo PT (adicionar)
│   └── helena-flausino-en.pdf  ← résumé EN (adicionar)
└── README.md
```

---

## decisões de design

**paleta:** cobalto `#2850E8` · creme `#F4F1E8` · preto `#0E1117` · branco `#FFFFFF`

**tipografia:** Plus Jakarta Sans 800 (display) + JetBrains Mono (labels/mono)

**hero:** padrão de barras horizontais geradas por JS — inspiração em data-art;
o `feTurbulence` SVG aplica grain de papel sobre as barras e sobre o fundo.

**i18n:** conteúdo em JSON separado do markup — editar texto sem tocar em HTML.

---

## como rodar localmente

```bash
# python (qualquer versão recente)
python -m http.server 8000

# node
npx serve .

# depois abrir http://localhost:8000
```

> **Não abrir `index.html` diretamente** — o `fetch('/data/pt.json')` precisa de um servidor HTTP.

---

## checklist de lançamento

- [ ] substituir `helena.webp` pela foto real
- [ ] criar `og-image.jpg` (1200×630px) para preview no LinkedIn
- [ ] atualizar `href` do email no footer e nos JSONs
- [ ] adicionar CVs na pasta `/cv/`
- [ ] testar com [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] rodar Lighthouse — meta: ≥ 90 em Performance, Acessibilidade e SEO
- [ ] configurar domínio customizado (opcional — via `CNAME`)

---

## roadmap pós-lançamento

- [ ] página de detalhe por projeto (`/projects/badge-study.html`)
- [ ] seção de IA expandida com exemplos interativos
- [ ] dark mode (CSS `prefers-color-scheme`)
- [ ] analytics (plausible.io — privacy-first, sem cookies)
