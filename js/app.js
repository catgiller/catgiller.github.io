/* ---------------- ui helpers ---------------- */

function copyCode(btn){
  const block = btn.closest('.code-block');
  const codeEl = block.querySelector('code');
  const text = codeEl.textContent;
  const orig = btn.textContent;
  try{
    navigator.clipboard.writeText(text).then(()=>{
      btn.textContent='Copied';
      setTimeout(()=>{btn.textContent=orig;},1400);
    }).catch(()=>{});
  }catch(e){}
}

/* ---------------- helpers ---------------- */

function findPost(slug){ return posts.find(p => p.slug === slug); }
function catCounts(){
  const c = {};
  posts.forEach(p => c[p.category] = (c[p.category]||0)+1);
  return c;
}

let activeCategory = 'All';

/* ---------------- views ---------------- */

function postCardHTML(p){
  return `
    <a href="#/post/${p.slug}" class="card">
      <span class="pill">${p.category}</span>
      <h3>${p.title}</h3>
      <p class="excerpt">${p.excerpt}</p>
      <div class="card-meta">
        <span class="date">${p.date}</span>
        <span class="readmore">Read more</span>
      </div>
    </a>`;
}

function sidebarHTML(){
  const counts = catCounts();
  const cats = ['All', ...Object.keys(counts)];
  return `
    <aside class="sidebar">
      <div class="side-box">
        <h4>Categories</h4>
        <div class="cat-list">
          ${cats.map(c => `<button data-cat="${c}" class="${activeCategory===c?'active':''}" onclick="setCategory('${c}')"><span>${c}</span><span class="count">${c==='All'?posts.length:counts[c]}</span></button>`).join('')}
        </div>
      </div>
      <div class="side-box">
        <h4>About this log</h4>
        <p>Notes from 42 Kocaeli coursework, the cybersecurity club, and a Linux setup that's never quite finished.</p>
        <span class="mini-motto">$ i wish i meant to be a root</span>
      </div>
    </aside>`;
}

window.setCategory = function(c){
  activeCategory = c;
  renderHome();
  const grid = document.querySelector('.posts-grid');
  if(grid) grid.scrollIntoView({block:'nearest'});
};

function renderHome(){
  const list = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);
  document.getElementById('app').innerHTML = `
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <h1>I break things, fix things, and write about both.</h1>
          <p class="lead">I'm Erva — a student at 42 Kocaeli working through the core curriculum, running the school's first cybersecurity club, and slowly making my Arch Linux setup something I'm not embarrassed to show people. This is where I write it down: the concepts that finally clicked, the ciphers I built for our first club event, and whatever breaks on my machine next.</p>
          <div class="hero-ctas">
            <a href="#/blog" class="btn">Read the blog</a>
            <a href="#/projects" class="btn ghost">View projects</a>
          </div>
        </div>
        <div class="term">
          <div><span class="tprompt">$ </span>whoami</div>
          <div class="tout">erva — 42 Kocaeli, cybersecurity club lead</div>
          <div><span class="tprompt">$ </span>uname -a</div>
          <div class="tout">Arch Linux, Hyprland</div>
          <div><span class="tprompt">$ </span>cat interests.txt</div>
          <div class="tout">cats, ciphers, segfaults</div>
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="divider-paw"><svg class="paw-icon"><use href="#paw"></use></svg></div>
    </div>

    <section class="wrap">
      <div class="section-head">
        <h2>Latest posts</h2>
        <span class="sub">${posts.length} posts so far</span>
      </div>
      <div class="posts-layout">
        <div>
          <div class="tagbar">
            ${['All', ...Object.keys(catCounts())].map(c => `<button class="${activeCategory===c?'active':''}" onclick="setCategory('${c}')">${c}</button>`).join('')}
          </div>
          <div class="posts-grid">
            ${list.map(postCardHTML).join('')}
          </div>
        </div>
        ${sidebarHTML()}
      </div>
    </section>
  `;
}

function renderPost(slug){
  const p = findPost(slug);
  if(!p){ location.hash = '#/'; return; }
  const idx = posts.indexOf(p);
  const prev = posts[idx-1];
  const next = posts[idx+1];
  document.getElementById('app').innerHTML = `
    <article class="article-wrap">
      <a href="#/blog" class="back-link">&lsaquo; Back to blog</a>
      <h1>${p.title}</h1>
      <div class="article-meta-bottom">
        <span class="pill">${p.category}</span>
        <span>${p.date}</span>
        <span>${p.readTime}</span>
      </div>
      <div class="prose">${p.content}</div>
      <div class="prevnext">
        ${prev ? `<a href="#/post/${prev.slug}"><div class="dir">&lsaquo; Previous</div><div class="ptitle">${prev.title}</div></a>` : '<div></div>'}
        ${next ? `<a href="#/post/${next.slug}" class="next-cell"><div class="dir">Next &rsaquo;</div><div class="ptitle">${next.title}</div></a>` : '<div></div>'}
      </div>
    </article>
  `;
}

function renderAbout(){
  document.getElementById('app').innerHTML = `
    <section class="page">
      <h1>About</h1>
      <p>I'm Erva, a student at 42 Kocaeli — a peer-to-peer, project-based school with no lectures and no teachers, just exercises, peer evaluations, and a lot of staring at compiler errors. I'm currently working through the core curriculum, most recently the C++ modules.</p>
      <p>This year I'm organizing 42 Kocaeli's inaugural cybersecurity club, which kicked off with a five-station cipher scavenger hunt. Our unofficial motto ended up being <span class="motto-line">$ i wish i meant to be a root</span>, which is either a joke or a mission statement depending on the day.</p>
      <p>My daily driver is Arch Linux running Hyprland, tuned through the HyprFlux dotfiles — the kind of setup that's never really "done," just done enough to stop tinkering for a while.</p>
      <p>Currently:</p>
      <ul>
        <li>Preparing an idea for the Greece–Türkiye 2026 hackathon</li>
        <li>Working through 42's C++ exercise sets</li>
        <li>Planning the cybersecurity club's next event</li>
      </ul>
      <p>This blog is mostly for me — a place to write down the debugging sessions, the concepts that finally clicked, and the small wins, before I forget how I got there.</p>
    </section>
  `;
}

function renderProjects(){
  document.getElementById('app').innerHTML = `
    <section class="proj-grid">
      <h1 style="font-family:var(--font-display);font-weight:600;font-size:clamp(1.9rem,3vw + 1rem,2.6rem);margin-bottom:8px;letter-spacing:-0.01em;">Projects</h1>
      <p style="color:var(--text-dim);margin-bottom:12px;">A few things I'm building or running outside of coursework.</p>

      <div class="proj-card">
        <span class="pill">Cybersecurity</span>
        <h3>42 Kocaeli Cybersecurity Club</h3>
        <p>Founded and organized the school's first cybersecurity club, including a five-station cipher scavenger hunt as our opening event, built around ciphers people could crack by hand or with tools like CyberChef.</p>
      </div>

      <div class="proj-card">
        <span class="pill">Hackathon</span>
        <h3>Earthquake Early-Warning Concept</h3>
        <p>Exploring whether physical precursor signals from fault zones can be sensed faster than current seismology, using fiber-optic cable as a sensor network. In progress for the Greece–Türkiye 2026 hackathon.</p>
        <a href="#/post/earthquake-early-warning" class="readmore">Read the post</a>
      </div>

      <div class="proj-card">
        <span class="pill">C++</span>
        <h3>42 Core Curriculum</h3>
        <p>Working through 42's C++ modules, including the Zombie exercise series — memory management, pointer syntax, and constructor design, rebuilt as intuition rather than memorized rules.</p>
        <a href="#/post/stack-vs-heap" class="readmore">Read the post</a>
      </div>
    </section>
  `;
}

/* ---------------- router ---------------- */

function updateActiveNav(path){
  document.querySelectorAll('#siteNav a').forEach(a => {
    const r = a.getAttribute('data-route');
    const isBlog = (path === '/blog' || path.startsWith('/post/')) && r === '/blog';
    a.classList.toggle('active', r === path || isBlog);
  });
}

function router(){
  const hash = location.hash.replace(/^#/,'') || '/';
  window.scrollTo(0,0);
  if(hash === '/'){ renderHome(); updateActiveNav('/'); }
  else if(hash === '/blog'){ renderHome(); updateActiveNav('/blog'); }
  else if(hash.startsWith('/post/')){ renderPost(hash.slice(6)); updateActiveNav('/blog'); }
  else if(hash === '/about'){ renderAbout(); updateActiveNav('/about'); }
  else if(hash === '/projects'){ renderProjects(); updateActiveNav('/projects'); }
  else { location.hash = '#/'; }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
router();
