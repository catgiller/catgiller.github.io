/* ---------------- diagrams ---------------- */

const polybiusSVG = `
<svg class="diagram" viewBox="0 0 320 320" role="img" aria-label="Classic Polybius square, five by five grid of letters">
  ${(function(){
    const rows=[['A','B','C','D','E'],['F','G','H','I/J','K'],['L','M','N','O','P'],['Q','R','S','T','U'],['V','W','X','Y','Z']];
    let out='';
    for(let i=0;i<5;i++){
      out+='<text x="'+(68+56*i)+'" y="26" text-anchor="middle" fill="var(--accent)" font-family="JetBrains Mono, monospace" font-size="15">'+(i+1)+'</text>';
      out+='<text x="26" y="'+(68+56*i+5)+'" text-anchor="middle" fill="var(--accent)" font-family="JetBrains Mono, monospace" font-size="15">'+(i+1)+'</text>';
    }
    for(let r=0;r<5;r++){
      for(let c=0;c<5;c++){
        const x=40+56*c, y=40+56*r;
        out+='<rect x="'+x+'" y="'+y+'" width="56" height="56" fill="var(--bg-code)" stroke="var(--border)"/>';
        out+='<text x="'+(x+28)+'" y="'+(y+34)+'" text-anchor="middle" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="16">'+rows[r][c]+'</text>';
      }
    }
    return out;
  })()}
</svg>`;

const stackHeapSVG = `
<svg class="diagram" viewBox="0 0 420 250" role="img" aria-label="Diagram comparing a stack frame to heap allocated memory, connected by a pointer">
  <text x="60" y="26" fill="var(--text-dim)" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="600">Stack</text>
  <rect x="20" y="40" width="180" height="40" rx="4" fill="var(--bg-code)" stroke="var(--border)"/>
  <text x="30" y="65" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="12">main()</text>
  <rect x="20" y="86" width="180" height="40" rx="4" fill="var(--bg-code)" stroke="var(--border)"/>
  <text x="30" y="111" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="12">Creature onStack</text>
  <rect x="20" y="132" width="180" height="40" rx="4" fill="var(--bg-code)" stroke="var(--accent)"/>
  <text x="30" y="157" fill="var(--accent)" font-family="JetBrains Mono, monospace" font-size="12">Creature* onHeap</text>

  <text x="290" y="26" fill="var(--text-dim)" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="600">Heap</text>
  <rect x="250" y="120" width="150" height="46" rx="4" fill="var(--bg-code)" stroke="var(--accent)"/>
  <text x="262" y="148" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="12">Creature("Mochi")</text>

  <path d="M200 152 C 225 152, 225 143, 250 143" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)"/>
    </marker>
  </defs>
  <line x1="210" y1="190" x2="210" y2="210" stroke="var(--border)" stroke-width="1"/>
  <text x="210" y="226" text-anchor="middle" fill="var(--text-faint)" font-family="JetBrains Mono, monospace" font-size="11">stack unwinds automatically — heap needs delete</text>
</svg>`;

/* ---------------- posts ---------------- */

const posts = [
  {
    slug:'hyprland-super-key',
    title:'Chasing a Dead Super Key Across Two Keyboards',
    category:'Linux',
    date:'August 24, 2026',
    readTime:'5 min read',
    excerpt:'How a single unresponsive key turned into a two-day detour through keybind configs, layout groups, and a keyboard\u2019s hidden mode switch.',
    content:`
      <p>I recently moved from a Turkish-layout laptop keyboard to an external English (US) one, and for about two days afterward my Super key did absolutely nothing. No app launcher, no window shortcuts, nothing. On Hyprland that key is load-bearing, so this was more than a minor annoyance.</p>

      <h2>Where I started looking</h2>
      <p>My first assumption was a hardware fault, since I'd just swapped keyboards. I ran <code>hyprctl</code> to check whether the compositor was even receiving the keypress, and confirmed it was — the event showed up, but nothing bound to it fired. That ruled out the keyboard being physically dead and pointed me back toward configuration.</p>

      <h2>The actual causes were two, not one</h2>
      <p>It turned out I was debugging two separate problems and kept fixing half of the issue, then getting confused when nothing changed.</p>
      <ol>
        <li>A misconfigured keybind line in my HyprFlux config was quietly consuming <code>SUPER</code> as a modifier before it could reach the binds I actually wanted to trigger.</li>
        <li>The external keyboard itself has a hardware <code>Code</code> key that toggles which physical key sends the Super/Windows scancode at all — completely independent of anything Hyprland or Linux could see.</li>
      </ol>

      <blockquote>Half of debugging a window manager is remembering the bug might not be in the window manager at all.</blockquote>

      <h2>Fixing the keybind layer</h2>
      <p>The relevant file was <code>UserConfigs/UserKeybinds.conf</code>. Once I found the conflicting line and removed it, the standard binds started working again:</p>

      <div class="code-block">
        <div class="code-head"><span class="code-lang">conf — UserKeybinds.conf</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
        <pre><code>${hl(`bind = SUPER, RETURN, exec, kitty
bind = SUPER, Q, killactive
bind = SUPER, SPACE, exec, wofi --show drun`,'conf')}</code></pre>
      </div>

      <h2>Fixing the layout itself</h2>
      <p>Separately, I wanted both US and Turkish layouts available without hunting through settings, so I set up a two-layout group with an Alt+Shift toggle in <code>UserSettings.conf</code>:</p>

      <div class="code-block">
        <div class="code-head"><span class="code-lang">conf — UserSettings.conf</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
        <pre><code>${hl(`input {
  kb_layout = us,tr
  kb_options = grp:alt_shift_toggle
}`,'conf')}</code></pre>
      </div>

      <p>Once both pieces were in place, the difference was obvious:</p>

      <table>
        <tr><th>Layer</th><th>Before</th><th>After</th></tr>
        <tr><td>Hardware toggle</td><td>Super key silently disabled</td><td>Correct key sends the scancode</td></tr>
        <tr><td>Keybind config</td><td>Conflicting bind swallowed SUPER</td><td>Binds fire as expected</td></tr>
        <tr><td>Layout switch</td><td>Manual, buried in settings</td><td>Alt+Shift toggles US/TR instantly</td></tr>
      </table>

      <p>Nothing here was exotic once I saw it clearly — but it's a good reminder that a "dead key" can be dead for reasons stacked on top of each other, and fixing one layer won't always show its effect until the other layer is fixed too.</p>
    `
  },
  {
    slug:'cipher-scavenger-hunt',
    title:'Designing a Cipher Scavenger Hunt for 42 Kocaeli\u2019s First Security Club Event',
    category:'Cybersecurity',
    date:'August 20, 2026',
    readTime:'7 min read',
    excerpt:'Five stations, four cipher families, and one very stubborn Polybius square — notes from building our club\u2019s first event from scratch.',
    content:`
      <p>This year I'm organizing 42 Kocaeli's first cybersecurity club, and I wanted our opening event to be something people did rather than something they sat through. That turned into <strong>Zincirleme Şifre Avı</strong> — a chained cipher hunt with five physical stations, where solving each cipher reveals the location of the next one.</p>

      <h2>The five stations</h2>
      <ol>
        <li>An A1Z26 substitution warm-up, to get everyone thinking in codes.</li>
        <li>Coordinates hidden inside a classic Polybius square.</li>
        <li>A message encoded as raw ASCII decimal values.</li>
        <li>A Caesar-shifted line hiding the final station's location.</li>
        <li>A combined cipher at the last station leading to the prize.</li>
      </ol>

      <h2>Why these four cipher families</h2>
      <p>I wanted a difficulty ramp that worked for first-years with zero cryptography background sitting next to people who'd already done a few CTFs. Every cipher we used is crackable by hand with patience, or in seconds with tools like dcode.fr or CyberChef — and I made that explicitly allowed, since the point was pattern recognition, not memorizing obscure algorithms.</p>

      <table>
        <tr><th>Cipher</th><th>Example</th><th>Cracks easily with</th></tr>
        <tr><td>A1Z26</td><td>19-9-14-9-6</td><td>Pen and paper</td></tr>
        <tr><td>Polybius square</td><td>24-15-34-11-15</td><td>The grid below</td></tr>
        <tr><td>ASCII decimal</td><td>82 79 79 84</td><td>Any ASCII table</td></tr>
        <tr><td>Caesar shift</td><td>Wklv lv wkh zdb</td><td>dcode.fr, CyberChef</td></tr>
      </table>

      <div class="diagram-wrap">
        ${polybiusSVG}
        <p class="diagram-cap">The classic 5×5 Polybius square, with I and J sharing a cell.</p>
      </div>

      <p>The Polybius station ended up being the one people got stuck on longest — not because it's hard, but because half the group had never heard of it and had to work out the grid logic from a single worked example on the card.</p>

      <blockquote>Our club's tagline ended up being <code>$ i wish i meant to be a root</code> — half joke, half mission statement.</blockquote>

      <h2>What I'd change next time</h2>
      <ul>
        <li>Space the stations out more evenly — two of them were solved almost simultaneously by different teams, which caused a bottleneck.</li>
        <li>Print the cipher cards instead of laminating them; lamination made the ASCII station nearly unreadable in direct sunlight.</li>
        <li>Add a soft hint system for teams stuck more than ten minutes, instead of leaving it fully open-ended.</li>
      </ul>

      <p>For a first event, it did exactly what I wanted: it got a room full of strangers leaning over the same piece of paper, arguing about a cipher together. Everything else is a solvable logistics problem.</p>
    `
  },
  {
    slug:'stack-vs-heap',
    title:'Stack vs. Heap: What Finally Made It Click',
    category:'C++',
    date:'August 10, 2026',
    readTime:'6 min read',
    excerpt:'Working through 42\u2019s Zombie exercises with new and delete, until the difference between stack and heap stopped being a rule to memorize and started being a picture in my head.',
    content:`
      <p>I've been working through 42's C++ curriculum, including the Zombie exercise series, and for a while "stack vs. heap" was just a rule I applied without really seeing it: local variables go on the stack, <code>new</code> puts things on the heap, don't forget <code>delete</code>. It worked, mechanically, until I actually needed a mental picture of what was happening.</p>

      <h2>The picture that finally worked</h2>
      <p>The stack is a tidy, fixed-size structure tied to function calls — every variable declared inside a function lives there, and the moment that function returns, all of it is cleaned up automatically, in order. The heap is the opposite: unstructured memory that only gets allocated and freed when you explicitly ask for it, and that survives long after the function that created it has returned.</p>

      <div class="diagram-wrap">
        ${stackHeapSVG}
        <p class="diagram-cap">A stack-allocated object is cleaned up automatically. A heap-allocated one needs an explicit delete.</p>
      </div>

      <p>To make this concrete, I stopped using the exercise's own classes for practice and wrote a small unrelated one instead, since re-using the actual assignment code makes it too easy to pattern-match instead of understand:</p>

      <div class="code-block">
        <div class="code-head"><span class="code-lang">cpp</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
        <pre><code>${hl(`#include <iostream>
#include <string>

class Creature {
public:
    Creature(const std::string& name) : name_(name) {
        std::cout << name_ << " has entered the stack.\\n";
    }
    ~Creature() {
        std::cout << name_ << " has left the stack.\\n";
    }
private:
    std::string name_;
};

int main() {
    Creature onStack("Whiskers");             // lives on the stack
    Creature* onHeap = new Creature("Mochi");  // lives on the heap

    delete onHeap;  // must be freed manually
    return 0;       // onStack is destroyed automatically here
}`,'cpp')}</code></pre>
      </div>

      <p>Watching "Whiskers" get destroyed automatically at the end of <code>main()</code>, while "Mochi" only disappears at the exact line I call <code>delete</code>, made the distinction click in a way that reading the rule never did.</p>

      <h2>Where this bit me</h2>
      <blockquote>The compiler will happily let you forget a delete. It will not remind you, and it will not care.</blockquote>
      <p>A few pointer-syntax habits I had to actively build:</p>
      <ul>
        <li>Every <code>new</code> needs exactly one matching <code>delete</code> — not more, not fewer.</li>
        <li>Arrays allocated with <code>new[]</code> must be freed with <code>delete[]</code>, never plain <code>delete</code>.</li>
        <li>A pointer doesn't become "safe" after <code>delete</code> — it's dangling until you set it to <code>nullptr</code> yourself.</li>
      </ul>

      <table>
        <tr><th>Property</th><th>Stack</th><th>Heap</th></tr>
        <tr><td>Lifetime</td><td>Ends with the scope</td><td>Until you delete it</td></tr>
        <tr><td>Size limit</td><td>Small, fixed</td><td>Large, flexible</td></tr>
        <tr><td>Speed</td><td>Very fast</td><td>Slower, more bookkeeping</td></tr>
        <tr><td>Cleanup</td><td>Automatic</td><td>Manual</td></tr>
      </table>

      <p>None of this is new information to anyone who's used C++ for a while — but it's the kind of thing that has to be rebuilt as intuition, not just memorized as a rule, before constructor design and resource management start making real sense.</p>
    `
  },
  {
    slug:'earthquake-early-warning',
    title:'Sensing the Fault Line: Early Ideas for an Earthquake Hackathon',
    category:'Hackathon',
    date:'September 6, 2026',
    readTime:'5 min read',
    excerpt:'Two rough concepts I\u2019m pitching for the Greece\u2013T\u00fcrkiye 2026 hackathon \u2014 one about listening to fiber-optic cables, one about catching fires before they spread.',
    content:`
      <p>I'm aiming to win the Greece–Türkiye 2026 hackathon, and the direction I keep coming back to is earthquake early-warning: whether physical precursor signals from fault zones — heat, micro-vibrations, strain, electromagnetic changes — can be sensed faster or more directly than current seismology manages. These are early, unrefined ideas, not a finished proposal, but writing them down is how I figure out which ones survive contact with a team.</p>

      <h2>Idea one: listening to cables we already have</h2>
      <p>Distributed Acoustic Sensing turns ordinary fiber-optic cable into a continuous line of vibration sensors, using the fiber that's already buried along roads and coastlines. Paired with fault-line geometry, that could mean picking up micro-fracture activity near a fault without installing any new hardware. The second half of the idea is less glamorous but just as useful: a single fast site that unifies the currently scattered earthquake data sources into one place, instead of five agencies each publishing their own feed.</p>

      <blockquote>The question isn't whether an earthquake can be predicted — it's whether the seconds before it are already visible in data we're not looking at yet.</blockquote>

      <h2>Idea two: catching fire before it spreads</h2>
      <p>The second concept is a different kind of disaster response: a laser-based smoke and fire detector that, on triggering, launches an autonomous drone to fly to the source and suppress it with water before it grows large enough for a truck to be useful. It's a further leap from "detection" to "hardware team," so it's realistically the higher-risk of the two ideas for a hackathon timeline.</p>

      <table>
        <tr><th></th><th>Signal</th><th>Response</th><th>Main risk</th></tr>
        <tr><td>DAS fault monitoring</td><td>Fiber vibration data</td><td>Unified alert dashboard</td><td>Access to real fiber/sensor data</td></tr>
        <tr><td>Fire-drone trigger</td><td>Laser smoke detection</td><td>Autonomous drone response</td><td>Hardware scope in a hackathon window</td></tr>
      </table>

      <h2>Where the team goes next</h2>
      <ol>
        <li>Check what DAS or public seismic data is actually reachable before designing around it.</li>
        <li>Build a small proof-of-concept for the fire-trigger logic, decoupled from the drone hardware.</li>
        <li>Scope down to whichever idea has a demoable MVP by the deadline, and cut the rest.</li>
      </ol>

      <p>Neither idea is proven yet — that's the point of writing this before the hackathon instead of after. If one of them turns out to be naive once the team pressure-tests it, better to find out now.</p>
    `
  }
];
