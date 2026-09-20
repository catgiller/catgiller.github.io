# paw.log

A personal technical blog about Linux, C++, cybersecurity and whatever else breaks along the way. Built by hand — no framework, just HTML, CSS and vanilla JavaScript — and served via GitHub Pages.

## Structure

```
.
├── index.html          # page shell (head, header, footer)
├── css/
│   └── style.css       # all styles
├── js/
│   ├── utils.js        # escaping + syntax highlighting
│   ├── diagrams.js     # SVG diagrams used in posts
│   ├── data.js         # GENERATED — do not edit by hand
│   └── app.js          # views, router, event handlers
├── posts/              # your posts, one Markdown file each
│   ├── _template.md    # copy this to start a new post
│   └── ...
├── scripts/
│   ├── build.js        # markdown -> js/data.js
│   └── new.js          # scaffold a new post
├── package.json
└── README.md
```

## Writing a post

Posts are plain Markdown files in `posts/`. Create one with:

```bash
npm run new my-post-slug
```

or copy `posts/_template.md`. Each file starts with a metadata block:

```md
---
slug: my-post-slug
title: A Post Title
category: Linux
date: September 20, 2026
readTime: 5 min read
excerpt: A short summary shown on the card.
---

Write the body in Markdown:

## A section

Paragraph with `inline code` and **bold**.

- a bullet
- another bullet

> A blockquote.

| Col A | Col B |
| ----- | ----- |
| x     | y     |
```

### Code blocks

Fenced code blocks get syntax highlighting. The first word is the language (`cpp`, `bash`, `conf`); anything after it becomes the file label:

````md
```cpp
int main() { return 0; }
```

```conf — UserKeybinds.conf
bind = SUPER, RETURN, exec, kitty
```
````

### Diagrams

Use the `:::diagram` directive to drop in one of the SVGs defined in `js/diagrams.js`:

```md
:::diagram stackHeapSVG
A caption describing the diagram.
:::
```

## Building

After editing a post, regenerate `js/data.js`:

```bash
npm run build
```

`js/data.js` is committed to the repo, so GitHub Pages needs no build step — just commit and push.

## Live site

https://catgiller.github.io
