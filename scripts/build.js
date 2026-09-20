/* build.js — converts posts/*.md into js/data.js
 * Run with: npm run build
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const OUT = path.join(ROOT, 'js', 'data.js');

function escapeHtml(s){
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* inline formatting: `code`, **bold** */
function inline(s){
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, (_, c) => '<code>' + c + '</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, (_, c) => '<strong>' + c + '</strong>');
  return out;
}

/* turn raw code into the `${hl(...)}` expression used by the runtime */
function embedCode(code, lang){
  const escaped = code
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  return '${hl(`' + escaped + '`,\'' + lang + '\')}';
}

function renderCodeBlock(code, info){
  const lang = info.trim().split(/\s+/)[0] || '';
  const label = info.trim() || lang;
  return [
    '<div class="code-block">',
    '  <div class="code-head"><span class="code-lang">' + escapeHtml(label) + '</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>',
    '  <pre><code>' + embedCode(code, lang) + '</code></pre>',
    '</div>'
  ].join('\n');
}

function renderDiagram(name, caption){
  return [
    '<div class="diagram-wrap">',
    '  ${' + name + '}',
    '  <p class="diagram-cap">' + caption.map(c => inline(c)).join(' ') + '</p>',
    '</div>'
  ].join('\n');
}

function splitRow(line){
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(c => c.trim());
}

function renderTable(headerLine, rowLines){
  const head = '<tr>' + splitRow(headerLine).map(c => '<th>' + inline(c) + '</th>').join('') + '</tr>';
  const rows = rowLines.map(r => '<tr>' + splitRow(r).map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('');
  return '<table>\n' + head + '\n' + rows + '\n</table>';
}

function isTableDelimiter(line){
  const t = line.replace(/[\s|:]/g, '');
  return t.length > 0 && /^-+$/.test(t);
}

function isBlockStart(line){
  return /^```/.test(line)
    || /^:::\s*diagram\s+/.test(line)
    || /^#{1,6}\s+/.test(line)
    || /^\s*[-*+]\s+/.test(line)
    || /^\s*\d+\.\s+/.test(line)
    || /^>\s?/.test(line);
}

function renderBody(md){
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while(i < lines.length){
    const line = lines[i];

    if(!line.trim()){ i++; continue; }

    /* fenced code block */
    if(/^```/.test(line)){
      const info = line.slice(3);
      const code = [];
      i++;
      while(i < lines.length && !/^```/.test(lines[i])){
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(renderCodeBlock(code.join('\n'), info));
      continue;
    }

    /* diagram directive */
    if(/^:::\s*diagram\s+/.test(line)){
      const name = line.replace(/^:::\s*diagram\s+/, '').trim();
      const cap = [];
      i++;
      while(i < lines.length && !/^:::$/.test(lines[i].trim())){
        cap.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(renderDiagram(name, cap));
      continue;
    }

    /* heading */
    if(/^#{1,6}\s+/.test(line)){
      const level = line.match(/^(#+)/)[1].length;
      const text = line.replace(/^#+\s+/, '');
      blocks.push('<h' + level + '>' + inline(text) + '</h' + level + '>');
      i++;
      continue;
    }

    /* table */
    if(line.includes('|') && i + 1 < lines.length && isTableDelimiter(lines[i + 1])){
      const headerLine = line;
      const rows = [];
      i += 2;
      while(i < lines.length && lines[i].includes('|') && lines[i].trim() !== ''){
        rows.push(lines[i]);
        i++;
      }
      blocks.push(renderTable(headerLine, rows));
      continue;
    }

    /* list */
    if(/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)){
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while(i < lines.length){
        const l = lines[i];
        if(ordered){
          if(!/^\s*\d+\.\s+/.test(l)) break;
          items.push(l.replace(/^\s*\d+\.\s+/, ''));
        } else {
          if(!/^\s*[-*+]\s+/.test(l)) break;
          items.push(l.replace(/^\s*[-*+]\s+/, ''));
        }
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      blocks.push('<' + tag + '>\n' + items.map(it => '  <li>' + inline(it) + '</li>').join('\n') + '\n</' + tag + '>');
      continue;
    }

    /* blockquote */
    if(/^>\s?/.test(line)){
      const items = [];
      while(i < lines.length && /^>\s?/.test(lines[i])){
        items.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push('<blockquote>' + items.map(it => inline(it)).join(' ') + '</blockquote>');
      continue;
    }

    /* paragraph */
    const para = [];
    while(i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])){
      para.push(lines[i].trim());
      i++;
    }
    blocks.push('<p>' + inline(para.join(' ')) + '</p>');
  }

  return blocks.join('\n\n');
}

function parsePost(md){
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if(!m) throw new Error('missing front matter (--- block)');
  const meta = {};
  for(const line of m[1].split('\n')){
    const idx = line.indexOf(':');
    if(idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: m[2].trim() };
}

function build(){
  if(!fs.existsSync(POSTS_DIR)){
    throw new Error('posts/ directory not found');
  }

  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('.'))
    .sort();

  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const { meta, body } = parsePost(raw);
    return { ...meta, content: renderBody(body) };
  });

  posts.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));

  const lines = [];
  lines.push('/* Generated by scripts/build.js — edit posts/*.md instead. */');
  lines.push('');
  lines.push('const posts = [');
  posts.forEach((p, idx) => {
    lines.push('  {');
    lines.push('    slug:' + JSON.stringify(p.slug) + ',');
    lines.push('    title:' + JSON.stringify(p.title) + ',');
    lines.push('    category:' + JSON.stringify(p.category) + ',');
    lines.push('    date:' + JSON.stringify(p.date) + ',');
    lines.push('    readTime:' + JSON.stringify(p.readTime) + ',');
    lines.push('    excerpt:' + JSON.stringify(p.excerpt) + ',');
    lines.push('    content:`');
    lines.push(p.content);
    lines.push('    `');
    lines.push('  }' + (idx < posts.length - 1 ? ',' : ''));
  });
  lines.push('];');
  lines.push('');

  fs.writeFileSync(OUT, lines.join('\n'));
  console.log('Built ' + posts.length + ' post(s) -> js/data.js');
}

build();
