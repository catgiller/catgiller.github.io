# paw.log

A personal technical blog about Linux, C++, cybersecurity and whatever else breaks along the way. Built by hand — no framework, just HTML, CSS and vanilla JavaScript — and served via GitHub Pages.

## Structure

```
.
├── index.html        # page shell (head, header, footer)
├── css/
│   └── style.css     # all styles
├── js/
│   ├── utils.js      # escaping + syntax highlighting
│   ├── data.js       # posts + SVG diagrams
│   └── app.js        # views, router, event handlers
└── README.md
```

## Adding a post

Posts live in `js/data.js` as objects in the `posts` array:

```js
{
  slug:'my-new-post',
  title:'A Post Title',
  category:'C++',
  date:'September 20, 2026',
  readTime:'5 min read',
  excerpt:'A short summary shown on the card.',
  content:`<p>Your HTML content here…</p>`
}
```

The `content` field is raw HTML. Use `hl(\`code\`, 'cpp')` for syntax-highlighted code blocks and the built-in diagram SVGs (`polybiusSVG`, `stackHeapSVG`) where needed.

## Live site

https://catgiller.github.io
