/* ---------------- diagrams ---------------- */

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

const nfsFlowSVG = `
<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="NFS client server flow over the network">
  <text x="140" y="26" fill="var(--text-dim)" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="600">İstemci</text>
  <rect x="30" y="42" width="220" height="150" rx="6" fill="var(--bg-code)" stroke="var(--border)"/>
  <text x="140" y="80" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="12">cat /mnt/nfs/hello.txt</text>
  <text x="140" y="108" fill="var(--text-dim)" font-family="JetBrains Mono, monospace" font-size="12">VFS → NFS client</text>
  <text x="140" y="136" fill="var(--text-dim)" font-family="JetBrains Mono, monospace" font-size="12">mount point: /mnt/nfs</text>

  <text x="420" y="26" fill="var(--text-dim)" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="600">Sunucu</text>
  <rect x="310" y="42" width="220" height="150" rx="6" fill="var(--bg-code)" stroke="var(--border)"/>
  <text x="420" y="80" fill="var(--text)" font-family="JetBrains Mono, monospace" font-size="12">nfsd → VFS</text>
  <text x="420" y="108" fill="var(--text-dim)" font-family="JetBrains Mono, monospace" font-size="12">export: /home/erva/share</text>
  <text x="420" y="136" fill="var(--text-dim)" font-family="JetBrains Mono, monospace" font-size="12">gerçek dosya + disk</text>

  <path d="M250 117 H310" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="308,113 308,121 316,117" fill="var(--accent)"/>
  <path d="M310 90 H250" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="252,86 252,94 244,90" fill="var(--accent)"/>
  <text x="280" y="78" text-anchor="middle" fill="var(--accent)" font-family="JetBrains Mono, monospace" font-size="11">NFS</text>
  <text x="280" y="150" text-anchor="middle" fill="var(--text-faint)" font-family="JetBrains Mono, monospace" font-size="11">RPC over TCP/UDP</text>
</svg>`;
