/**
 * Gera os 5 backgrounds de batalha de Hisui como arquivos WebP
 * usando SVG art renderizado pelo sharp.
 * Uso: node scripts/create-hisui-backgrounds.cjs
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'public');
const W = 800, H = 450;

const backgrounds = [
  {
    file: 'battle_bg_hisui_fieldlands.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="35%" stop-color="#5b21b6"/>
      <stop offset="65%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#65a30d"/>
      <stop offset="100%" stop-color="#166534"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <!-- Céu gradiente -->
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- Sol antigo -->
  <circle cx="660" cy="75" r="52" fill="url(#sun)" opacity="0.85"/>
  <circle cx="660" cy="75" r="70" fill="#fbbf24" opacity="0.15"/>
  <!-- Mt. Coronet distante -->
  <polygon points="220,300 330,110 440,300" fill="#1e1b4b" opacity="0.75"/>
  <polygon points="300,300 410,150 520,300" fill="#312e81" opacity="0.55"/>
  <polygon points="370,300 460,180 550,300" fill="#3730a3" opacity="0.40"/>
  <!-- Névoa de montanha -->
  <ellipse cx="380" cy="290" rx="220" ry="25" fill="#c4b5fd" opacity="0.20"/>
  <!-- Chão / colinas -->
  <rect y="295" width="${W}" height="${H - 295}" fill="url(#ground)"/>
  <ellipse cx="130" cy="310" rx="220" ry="55" fill="#4d7c0f" opacity="0.85"/>
  <ellipse cx="650" cy="318" rx="240" ry="48" fill="#3f6212" opacity="0.80"/>
  <ellipse cx="400" cy="330" rx="320" ry="40" fill="#365314" opacity="0.70"/>
  <!-- Árvores primitivas -->
  <rect x="60" y="235" width="14" height="62" fill="#5c4033"/>
  <ellipse cx="67" cy="224" rx="28" ry="22" fill="#15803d"/>
  <rect x="110" y="248" width="10" height="50" fill="#5c4033"/>
  <ellipse cx="115" cy="238" rx="20" ry="16" fill="#166534"/>
  <rect x="720" y="240" width="13" height="57" fill="#5c4033"/>
  <ellipse cx="726" cy="228" rx="25" ry="20" fill="#15803d"/>
  <!-- Grama detalhe -->
  <rect y="300" width="${W}" height="8" fill="#86efac" opacity="0.30"/>
  <!-- Partículas de luz -->
  <circle cx="180" cy="160" r="3" fill="#fde68a" opacity="0.6"/>
  <circle cx="520" cy="130" r="2" fill="#fde68a" opacity="0.5"/>
  <circle cx="320" cy="200" r="2" fill="#fde68a" opacity="0.4"/>
</svg>`,
  },
  {
    file: 'battle_bg_hisui_mirelands.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#450a0a"/>
      <stop offset="40%" stop-color="#7f1d1d"/>
      <stop offset="70%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <linearGradient id="mud" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#431407"/>
    </linearGradient>
    <radialGradient id="fog" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stop-color="#fca5a5" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Céu dramático -->
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- Névoa vermelha -->
  <rect width="${W}" height="${H}" fill="url(#fog)"/>
  <!-- Nuvens pesadas -->
  <ellipse cx="200" cy="80" rx="160" ry="45" fill="#991b1b" opacity="0.5"/>
  <ellipse cx="450" cy="60" rx="200" ry="50" fill="#7f1d1d" opacity="0.6"/>
  <ellipse cx="680" cy="90" rx="150" ry="40" fill="#991b1b" opacity="0.45"/>
  <!-- Silhuetas de árvores mortas -->
  <line x1="80" y1="310" x2="80" y2="180" stroke="#431407" stroke-width="10"/>
  <line x1="80" y1="210" x2="50" y2="180" stroke="#431407" stroke-width="5"/>
  <line x1="80" y1="230" x2="110" y2="205" stroke="#431407" stroke-width="4"/>
  <line x1="700" y1="310" x2="700" y2="190" stroke="#431407" stroke-width="12"/>
  <line x1="700" y1="220" x2="670" y2="195" stroke="#431407" stroke-width="5"/>
  <line x1="700" y1="240" x2="730" y2="210" stroke="#431407" stroke-width="4"/>
  <!-- Pântano -->
  <rect y="310" width="${W}" height="${H - 310}" fill="url(#mud)"/>
  <ellipse cx="400" cy="320" rx="350" ry="25" fill="#92400e" opacity="0.7"/>
  <!-- Água enlameada -->
  <ellipse cx="250" cy="350" rx="180" ry="22" fill="#431407" opacity="0.8"/>
  <ellipse cx="600" cy="360" rx="150" ry="18" fill="#431407" opacity="0.7"/>
  <!-- Reflexo vermelho na água -->
  <ellipse cx="250" cy="350" rx="160" ry="14" fill="#dc2626" opacity="0.15"/>
  <ellipse cx="600" cy="360" rx="130" ry="11" fill="#dc2626" opacity="0.12"/>
  <!-- Névoa baixa -->
  <rect y="290" width="${W}" height="50" fill="#fca5a5" opacity="0.08"/>
  <!-- Plantas vermelhas -->
  <ellipse cx="360" cy="305" rx="60" ry="18" fill="#b91c1c" opacity="0.6"/>
  <ellipse cx="510" cy="298" rx="45" ry="14" fill="#991b1b" opacity="0.7"/>
</svg>`,
  },
  {
    file: 'battle_bg_hisui_coastlands.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c4a6e"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
    <linearGradient id="cliff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78716c"/>
      <stop offset="100%" stop-color="#44403c"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.5"/>
    </radialGradient>
  </defs>
  <!-- Céu azul profundo -->
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- Sol refletido -->
  <circle cx="140" cy="80" r="45" fill="url(#sun)" opacity="0.9"/>
  <circle cx="140" cy="80" r="65" fill="#bae6fd" opacity="0.20"/>
  <!-- Nuvens -->
  <ellipse cx="500" cy="70" rx="180" ry="35" fill="#bae6fd" opacity="0.30"/>
  <ellipse cx="300" cy="55" rx="130" ry="28" fill="#e0f2fe" opacity="0.25"/>
  <ellipse cx="700" cy="85" rx="110" ry="25" fill="#bae6fd" opacity="0.20"/>
  <!-- Falésias rochosas esquerda -->
  <polygon points="0,${H} 0,200 120,280 180,${H}" fill="url(#cliff)"/>
  <polygon points="0,200 120,280 90,200" fill="#57534e" opacity="0.6"/>
  <!-- Falésias rochosas direita -->
  <polygon points="${W},${H} ${W},180 680,260 620,${H}" fill="url(#cliff)"/>
  <!-- Oceano -->
  <rect y="300" width="${W}" height="${H - 300}" fill="url(#ocean)"/>
  <!-- Ondas -->
  <path d="M0,320 Q100,305 200,320 Q300,335 400,320 Q500,305 600,320 Q700,335 800,320 L800,${H} L0,${H} Z" fill="#075985" opacity="0.5"/>
  <path d="M0,340 Q80,328 160,340 Q240,352 320,340 Q400,328 480,340 Q560,352 640,340 Q720,328 800,340 L800,${H} L0,${H} Z" fill="#0c4a6e" opacity="0.4"/>
  <!-- Espuma das ondas -->
  <path d="M0,318 Q200,308 400,318 Q600,328 800,318" stroke="#e0f2fe" stroke-width="2" fill="none" opacity="0.4"/>
  <path d="M0,338 Q160,330 320,338 Q480,346 640,338 Q720,334 800,338" stroke="#e0f2fe" stroke-width="1.5" fill="none" opacity="0.3"/>
  <!-- Ilha vulcânica distante -->
  <polygon points="480,270 530,230 580,270" fill="#44403c" opacity="0.6"/>
  <polygon points="490,270 530,235 570,270" fill="#78716c" opacity="0.4"/>
</svg>`,
  },
  {
    file: 'battle_bg_hisui_highlands.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f0f1a"/>
      <stop offset="30%" stop-color="#1e1b4b"/>
      <stop offset="60%" stop-color="#4c1d95"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="30%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <!-- Céu noturno tempestuoso -->
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- Estrelas -->
  <circle cx="80" cy="40" r="1.5" fill="#e2e8f0" opacity="0.8"/>
  <circle cx="200" cy="25" r="1" fill="#e2e8f0" opacity="0.7"/>
  <circle cx="350" cy="50" r="1.5" fill="#e2e8f0" opacity="0.9"/>
  <circle cx="550" cy="30" r="1" fill="#e2e8f0" opacity="0.6"/>
  <circle cx="720" cy="45" r="1.5" fill="#e2e8f0" opacity="0.8"/>
  <circle cx="640" cy="20" r="1" fill="#e2e8f0" opacity="0.7"/>
  <circle cx="460" cy="60" r="1" fill="#e2e8f0" opacity="0.5"/>
  <!-- Picos nevados de Mt. Coronet -->
  <polygon points="50,${H} 200,60 350,${H}" fill="url(#mountain)"/>
  <polygon points="200,${H} 350,40 500,${H}" fill="url(#mountain)"/>
  <polygon points="350,${H} 480,90 610,${H}" fill="#94a3b8" opacity="0.9"/>
  <polygon points="500,${H} 620,110 750,${H}" fill="#64748b" opacity="0.75"/>
  <!-- Neve nos picos -->
  <ellipse cx="200" cy="75" rx="50" ry="22" fill="#f8fafc" opacity="0.9"/>
  <ellipse cx="350" cy="55" rx="60" ry="25" fill="#f8fafc" opacity="0.95"/>
  <ellipse cx="480" cy="100" rx="40" ry="18" fill="#f1f5f9" opacity="0.8"/>
  <!-- Relâmpago -->
  <polyline points="580,10 565,80 580,80 555,160" stroke="#c4b5fd" stroke-width="2.5" fill="none" opacity="0.7"/>
  <polyline points="620,25 608,90 622,90 598,170" stroke="#a78bfa" stroke-width="1.5" fill="none" opacity="0.5"/>
  <!-- Chão rochoso -->
  <rect y="350" width="${W}" height="${H - 350}" fill="url(#ground)"/>
  <ellipse cx="150" cy="360" rx="200" ry="30" fill="#475569" opacity="0.7"/>
  <ellipse cx="650" cy="365" rx="220" ry="28" fill="#334155" opacity="0.7"/>
  <!-- Névoa de montanha -->
  <rect y="320" width="${W}" height="40" fill="#c4b5fd" opacity="0.06"/>
</svg>`,
  },
  {
    file: 'battle_bg_hisui_icelands.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="25%" stop-color="#1e3a5f"/>
      <stop offset="55%" stop-color="#164e63"/>
      <stop offset="100%" stop-color="#083344"/>
    </linearGradient>
    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
    <linearGradient id="aurora1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0"/>
      <stop offset="50%" stop-color="#4ade80" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aurora2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0"/>
      <stop offset="50%" stop-color="#a78bfa" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="aurora3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="50%" stop-color="#22d3ee" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Céu noturno gélido -->
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <!-- Estrelas -->
  <circle cx="60" cy="30" r="1.5" fill="#e0f2fe" opacity="0.9"/>
  <circle cx="150" cy="20" r="1" fill="#bae6fd" opacity="0.8"/>
  <circle cx="280" cy="45" r="2" fill="#f0f9ff" opacity="0.9"/>
  <circle cx="420" cy="18" r="1.5" fill="#e0f2fe" opacity="0.7"/>
  <circle cx="560" cy="38" r="1" fill="#bae6fd" opacity="0.8"/>
  <circle cx="680" cy="22" r="1.5" fill="#f0f9ff" opacity="0.9"/>
  <circle cx="750" cy="50" r="1" fill="#e0f2fe" opacity="0.7"/>
  <circle cx="340" cy="65" r="1" fill="#bae6fd" opacity="0.6"/>
  <circle cx="490" cy="55" r="1.5" fill="#f0f9ff" opacity="0.8"/>
  <!-- Aurora Boreal -->
  <path d="M-50,180 Q200,80 450,150 Q650,200 850,100" stroke="url(#aurora1)" stroke-width="60" fill="none" opacity="0.7"/>
  <path d="M-50,220 Q180,130 400,190 Q600,240 850,140" stroke="url(#aurora2)" stroke-width="45" fill="none" opacity="0.6"/>
  <path d="M-50,250 Q250,160 500,220 Q700,270 850,170" stroke="url(#aurora3)" stroke-width="35" fill="none" opacity="0.55"/>
  <!-- Montanhas nevadas ao fundo -->
  <polygon points="0,${H} 100,220 200,${H}" fill="#0f172a" opacity="0.7"/>
  <polygon points="150,${H} 280,190 410,${H}" fill="#1e3a5f" opacity="0.6"/>
  <polygon points="580,${H} 680,210 780,${H}" fill="#0f172a" opacity="0.65"/>
  <polygon points="680,${H} 770,230 ${W},${H}" fill="#1e293b" opacity="0.55"/>
  <!-- Neve nas montanhas -->
  <ellipse cx="100" cy="228" rx="40" ry="16" fill="#f0f9ff" opacity="0.85"/>
  <ellipse cx="280" cy="198" rx="50" ry="20" fill="#f0f9ff" opacity="0.90"/>
  <ellipse cx="680" cy="218" rx="42" ry="17" fill="#f0f9ff" opacity="0.85"/>
  <!-- Campo de neve -->
  <rect y="330" width="${W}" height="${H - 330}" fill="url(#snow)"/>
  <!-- Cristais de gelo -->
  <polygon points="120,330 130,310 140,330" fill="#bae6fd" opacity="0.7"/>
  <polygon points="250,330 260,312 270,330" fill="#e0f2fe" opacity="0.8"/>
  <polygon points="550,330 558,315 566,330" fill="#bae6fd" opacity="0.75"/>
  <polygon points="680,330 690,308 700,330" fill="#e0f2fe" opacity="0.7"/>
  <!-- Reflexo da aurora na neve -->
  <ellipse cx="400" cy="360" rx="350" ry="30" fill="#4ade80" opacity="0.06"/>
  <ellipse cx="400" cy="380" rx="300" ry="25" fill="#818cf8" opacity="0.05"/>
  <!-- Neve caindo (pontos) -->
  <circle cx="100" cy="150" r="2" fill="#f0f9ff" opacity="0.6"/>
  <circle cx="240" cy="200" r="1.5" fill="#f0f9ff" opacity="0.5"/>
  <circle cx="380" cy="140" r="2" fill="#f0f9ff" opacity="0.55"/>
  <circle cx="520" cy="190" r="1.5" fill="#f0f9ff" opacity="0.6"/>
  <circle cx="650" cy="160" r="2" fill="#f0f9ff" opacity="0.5"/>
  <circle cx="740" cy="210" r="1.5" fill="#f0f9ff" opacity="0.55"/>
</svg>`,
  },
];

async function main() {
  console.log('🏔️  Gerando backgrounds de Hisui...\n');

  for (const bg of backgrounds) {
    const outPath = path.join(OUT, bg.file);
    try {
      await sharp(Buffer.from(bg.svg))
        .resize(W, H)
        .webp({ quality: 85 })
        .toFile(outPath);
      const size = fs.statSync(outPath).size;
      console.log(`✅  ${bg.file} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌  ${bg.file}: ${err.message}`);
    }
  }

  console.log('\n🎉 Backgrounds de Hisui gerados com sucesso!');
}

main();
