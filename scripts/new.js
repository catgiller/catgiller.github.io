/* new.js — scaffold a new post
 * Usage: npm run new my-post-slug
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function today(){
  const d = new Date();
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

const slug = (process.argv[2] || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

if(!slug){
  console.log('Usage: npm run new my-post-slug');
  process.exit(1);
}

const file = path.join(POSTS_DIR, slug + '.md');
if(fs.existsSync(file)){
  console.log('Already exists: posts/' + slug + '.md');
  process.exit(1);
}

const content = '---\n'
  + 'slug: ' + slug + '\n'
  + 'title: A Post Title\n'
  + 'category: Linux\n'
  + 'date: ' + today() + '\n'
  + 'readTime: 5 min read\n'
  + 'excerpt: A short summary shown on the card.\n'
  + '---\n\n'
  + 'Write your post here in Markdown.\n';

fs.writeFileSync(file, content);
console.log('Created posts/' + slug + '.md');
console.log('Next: edit it, then run `npm run build`.');
