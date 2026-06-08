/* =========================================================================
   LOGICA DEL SITO  (navigazione, schede, grafici interattivi)
   -------------------------------------------------------------------------
   ⚠️  PARTE AVANZATA — di solito NON serve toccare questo file.
   I testi del sito si modificano in "index.html".
   Qui dentro ci sono solo i meccanismi (cambio pagina, grafici, ecc.)
   e i DATI NUMERICI dei grafici (sezioni "Giving Back" e "Italy"):
   se vuoi aggiornare quei numeri, cerca le tabelle piu' in basso.
   ========================================================================= */

/* =========================================================================
   1) NAVIGAZIONE TRA LE PAGINE
   ========================================================================= */

// Mostra una pagina (es. 'home', 'about', 'research'...) e aggiorna il menu.
let _navigating = false;
function showPage(id) {
  if (!id) id = 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');

  // chiude il menu mobile dopo il click
  document.body.classList.remove('nav-open');

  window.scrollTo({ top: 0, behavior: 'instant' });

  // Aggiorna l'indirizzo nel browser (link condivisibili + tasto "indietro")
  if (!_navigating) {
    const target = (id === 'home') ? location.pathname : '#' + id;
    history.pushState(null, '', target);
  }

  // Rendering specifico di alcune pagine
  if (id === 'giving') setTimeout(() => { renderChart(ATTAINMENT, EU_AVG_ATT, '%'); fetchGivingData(); }, 50);
  if (id === 'italy')  setTimeout(() => { renderGDPChart(); fetchItalyData(); }, 50);
  if (id === 'books') {
    setTimeout(() => {
      if (!document.querySelector('.shelf.active')) {
        const f = document.getElementById('shelf-math-01');
        if (f) f.classList.add('active');
      }
    }, 20);
  }
  return false;
}

// Schede generiche (Research: Topics / Conferences / Publications)
function showTab(id, btn) {
  btn.closest('.inner').querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

// Schede della pagina Libri (Academic / Beyond academia)
function showBookTab(id, btn) {
  document.querySelectorAll('.booktab').forEach(t => t.classList.remove('active'));
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('booktab-' + id).classList.add('active');
  btn.classList.add('active');
}

// Scaffali della libreria accademica
function showShelf(id, link) {
  document.querySelectorAll('.shelf').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.lib-nav-item').forEach(a => a.classList.remove('active'));
  const shelf = document.getElementById('shelf-' + id);
  if (shelf) shelf.classList.add('active');
  if (link) { link.classList.add('active'); link.blur(); }
  return false;
}

/* =========================================================================
   2) INTERATTIVITA' (menu mobile, torna-su, barra di lettura, link diretti)
   ========================================================================= */

// Menu "hamburger" su telefono
function toggleMenu() {
  document.body.classList.toggle('nav-open');
}

// Interruttore tema chiaro/scuro. Salva la scelta nel browser (localStorage)
// così resta impostata anche alla visita successiva.
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Tasto "indietro / avanti" del browser e link diretti (es. ...#research)
window.addEventListener('popstate', () => {
  _navigating = true;
  showPage((location.hash || '').replace('#', '') || 'home');
  _navigating = false;
});

document.addEventListener('DOMContentLoaded', () => {
  // Apre la pagina corretta se l'indirizzo contiene un'ancora (es. #books)
  _navigating = true;
  showPage((location.hash || '').replace('#', '') || 'home');
  _navigating = false;

  // Impedisce che i link dell'indice libri cambino l'hash dell'URL
  // (href="#" svuoterebbe l'hash e il router tornerebbe alla home)
  document.querySelectorAll('.lib-nav-item').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
  });

  // Barra di avanzamento + bottone "torna su"
  const bar = document.getElementById('scroll-progress');
  const toTop = document.getElementById('to-top');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('visible', scrolled > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================================================================
   3) DATI — "GIVING BACK"
   Attainment: aggiornato live da Eurostat API (edat_lfse_03).
   STEM: statico (richiederebbe cross-dataset population normalisation).
   Se l'API non risponde, i grafici usano i dati statici di fallback.
   ========================================================================= */

// Attainment — let: viene sovrascritto dal fetch live
let ATTAINMENT = [
  {name:"Ireland",v:65.2},{name:"Luxembourg",v:63.8},{name:"Cyprus",v:60.1},
  {name:"Lithuania",v:56.2},{name:"Netherlands",v:54.8},{name:"Denmark",v:52.3},
  {name:"Sweden",v:51.8},{name:"Belgium",v:50.9},{name:"Spain",v:50.2},
  {name:"France",v:49.6},{name:"Poland",v:48.1},{name:"Estonia",v:45.3},
  {name:"Greece",v:44.4},{name:"Latvia",v:44.3},{name:"Austria",v:43.5},
  {name:"Finland",v:43.2},{name:"Slovenia",v:43.2},{name:"Portugal",v:41.9},
  {name:"Germany",v:39.8},{name:"Malta",v:38.5},{name:"Bulgaria",v:37.6},
  {name:"Croatia",v:36.8},{name:"Slovakia",v:36.4},{name:"Czechia",v:35.0},
  {name:"Hungary",v:34.1},{name:"Italy",v:31.6,highlight:true},{name:"Romania",v:23.2,last:true}
].sort((a,b)=>b.v-a.v);

// STEM — const: rimane statico
const STEM = [
  {name:"Finland",v:28.5},{name:"Ireland",v:28.2},{name:"Germany",v:25.6},
  {name:"Sweden",v:24.8},{name:"Denmark",v:24.1},{name:"Portugal",v:23.1},
  {name:"Czechia",v:22.7},{name:"Austria",v:22.3},{name:"Greece",v:21.8},
  {name:"Spain",v:21.4},{name:"Poland",v:20.9},{name:"Netherlands",v:20.7},
  {name:"Slovakia",v:20.2},{name:"France",v:20.1},{name:"Belgium",v:19.5},
  {name:"Bulgaria",v:18.8},{name:"Croatia",v:18.4},{name:"Estonia",v:18.1},
  {name:"Hungary",v:17.8},{name:"Latvia",v:17.5},{name:"Lithuania",v:17.2},
  {name:"Slovenia",v:17.0},{name:"Malta",v:16.9},{name:"Luxembourg",v:16.4},
  {name:"Cyprus",v:15.8},{name:"Italy",v:19.0,highlight:true},{name:"Romania",v:14.3,last:true}
].sort((a,b)=>b.v-a.v);

let EU_AVG_ATT  = 44.2;
const EU_AVG_STEM = 22.4;
let _attYear = '2024'; // aggiornato dal fetch
let _givingFetched = false;

// EU-27 codici Eurostat e nomi display
const _EU27 = ['AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES',
               'FI','FR','HR','HU','IE','IT','LT','LU','LV','MT',
               'NL','PL','PT','RO','SE','SI','SK'];
const _CNAMES = {
  AT:'Austria', BE:'Belgium', BG:'Bulgaria', CY:'Cyprus', CZ:'Czechia',
  DE:'Germany', DK:'Denmark', EE:'Estonia', EL:'Greece', ES:'Spain',
  FI:'Finland', FR:'France', HR:'Croatia', HU:'Hungary', IE:'Ireland',
  IT:'Italy', LT:'Lithuania', LU:'Luxembourg', LV:'Latvia', MT:'Malta',
  NL:'Netherlands', PL:'Poland', PT:'Portugal', RO:'Romania', SE:'Sweden',
  SI:'Slovenia', SK:'Slovakia'
};

// Carica dati attainment live da Eurostat (chiamata una sola volta per page load)
async function fetchGivingData() {
  if (_givingFetched) return;
  const url = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data'
            + '/edat_lfse_03?format=JSON&lang=EN&age=Y25-34&sex=T&isced11=ED5-8&unit=PC';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();

    // Parsing JSON-stat: prende il valore più recente disponibile per ogni paese EU-27
    const dims   = json.id, sizes = json.size;
    const stride = dims.map((_, i) => sizes.slice(i + 1).reduce((a, b) => a * b, 1));
    const geoCat = json.dimension.geo.category;
    const timCat = json.dimension.time.category;
    const years  = Object.keys(timCat.index).sort().reverse(); // più recente prima
    let bestYear = null;
    const raw = {};
    Object.entries(geoCat.index).forEach(([geo, gi]) => {
      if (!_EU27.includes(geo)) return;
      for (const yr of years) {
        const ti = timCat.index[yr];
        let flat = 0;
        dims.forEach((d, di) => { flat += (d === 'geo' ? gi : d === 'time' ? ti : 0) * stride[di]; });
        const v = json.value[String(flat)];
        if (v != null) {
          raw[geo] = { v, yr };
          if (!bestYear || yr > bestYear) bestYear = yr;
          break;
        }
      }
    });

    // Costruisce array ordinato con i flag highlight/last
    const newArr = Object.entries(raw)
      .map(([geo, { v }]) => ({ name: _CNAMES[geo], v: +v.toFixed(1), highlight: geo === 'IT', last: false }))
      .filter(d => d.name)
      .sort((a, b) => b.v - a.v);
    if (newArr.length) {
      const lo = newArr[newArr.length - 1];
      if (!lo.highlight) lo.last = true;
    }
    const newAvg = +(newArr.reduce((s, d) => s + d.v, 0) / newArr.length).toFixed(1);

    // Aggiorna variabili globali
    ATTAINMENT = newArr;
    EU_AVG_ATT = newAvg;
    _attYear   = bestYear || _attYear;
    _givingFetched = true;

    // Aggiorna KPI cards
    const it   = newArr.find(d => d.highlight);
    const rank = newArr.findIndex(d => d.highlight) + 1;
    const $    = id => document.getElementById(id);
    if ($('giving-stat-it'))      $('giving-stat-it').textContent      = it ? it.v + '%' : '—';
    if ($('giving-stat-eu'))      $('giving-stat-eu').textContent      = newAvg + '%';
    if ($('giving-stat-rank'))    $('giving-stat-rank').textContent    = rank + ' / ' + newArr.length;
    if ($('giving-stat-it-note')) $('giving-stat-it-note').textContent = '25–34 year-olds with a degree (' + _attYear + ')';
    if ($('giving-stat-eu-note')) $('giving-stat-eu-note').textContent =
      (newAvg - (it ? it.v : 0)).toFixed(1) + ' points above Italy';

    // Aggiorna source note
    if ($('giving-source-note')) $('giving-source-note').innerHTML =
      'Source: Eurostat ' +
      '(<a href="https://ec.europa.eu/eurostat/databrowser/view/edat_lfse_03" target="_blank" rel="noopener">edat_lfse_03</a>; educ_uoe_grad04). ' +
      'Attainment: <strong>' + _attYear + '</strong> (live). ' +
      'STEM: per 1,000 young people (20–34), 2022/23 (static).';

    // Ri-renderizza solo se il grafico attainment è quello visibile
    const btnAtt = $('btn-attainment');
    if (btnAtt && btnAtt.classList.contains('active')) {
      renderChart(ATTAINMENT, EU_AVG_ATT, '%');
    }
  } catch (err) {
    console.warn('[giving] Eurostat fetch failed – using static fallback data.', err);
    // I dati statici sono già in ATTAINMENT, nessuna azione necessaria
  }
}

function switchChart(type) {
  document.getElementById('btn-attainment').classList.toggle('active', type === 'attainment');
  document.getElementById('btn-stem').classList.toggle('active', type === 'stem');
  document.getElementById('chart-subtitle').textContent = type === 'attainment'
    ? 'Share of 25–34 year-olds with a tertiary degree, EU countries, ' + _attYear
    : 'STEM tertiary graduates per 1,000 young people (20–34), EU countries, 2022/23';
  renderChart(type === 'attainment' ? ATTAINMENT : STEM, type === 'attainment' ? EU_AVG_ATT : EU_AVG_STEM, type === 'attainment' ? '%' : '');
}

function renderChart(data, avg, unit) {
  const area = document.getElementById('chart-area'); if (!area) return;
  const W = area.clientWidth || 640;
  const BAR_H = 18, GAP = 5, LABEL_W = 80, PLOT_W = W - LABEL_W - 44;
  const maxVal = data[0].v * 1.05;
  const H = data.length * (BAR_H + GAP) + 32;
  const toX = v => (v / maxVal) * PLOT_W;
  let bars = '';
  data.forEach((d, i) => {
    const y = i * (BAR_H + GAP);
    const bw = Math.max(toX(d.v), 0);
    const fill = d.highlight ? '#2c4a6e' : d.last ? '#a0b8c8' : '#c8d8e4';
    const tc = d.highlight ? '#1a1814' : d.last ? '#7a8a94' : '#5a554e';
    const fw = (d.highlight || d.last) ? '500' : '400';
    bars += `<g transform="translate(0,${y})">
      <text x="${LABEL_W-6}" y="${BAR_H/2+1}" dominant-baseline="middle" text-anchor="end"
        font-size="9.5" fill="${tc}" font-weight="${fw}" font-family="DM Mono,monospace" letter-spacing="0.02em">${d.name}</text>
      <rect x="${LABEL_W}" y="0" width="${bw}" height="${BAR_H}" fill="${fill}" rx="1"/>
      <text x="${LABEL_W+bw+5}" y="${BAR_H/2+1}" dominant-baseline="middle"
        font-size="9" fill="${tc}" font-weight="${fw}" font-family="DM Mono,monospace">${d.v}${unit}</text>
    </g>`;
  });
  const avgX = LABEL_W + toX(avg);
  const avgLine = `<line x1="${avgX}" y1="0" x2="${avgX}" y2="${H-26}" stroke="#9a9590" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="${avgX+4}" y="${H-13}" font-size="8.5" fill="#9a9590" font-family="DM Mono,monospace" letter-spacing="0.03em">EU avg ${avg}${unit}</text>`;
  area.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">${avgLine}${bars}</svg>`;
}

/* =========================================================================
   4) DATI — "ITALY" (confronto economico fra 7 paesi)
   Tabelle numeriche e grafici interattivi. Parte avanzata.
   ========================================================================= */

const COUNTRIES = ['IT','ES','FR','DE','SE','AT','RO'];
const C_META = {
  IT: {label:'Italy',   color:'#2c4a6e'},
  ES: {label:'Spain',   color:'#c17a2a'},
  FR: {label:'France',  color:'#7a4a8a'},
  DE: {label:'Germany', color:'#3a7a5a'},
  SE: {label:'Sweden',  color:'#a04040'},
  AT: {label:'Austria', color:'#607090'},
  RO: {label:'Romania', color:'#8a8430'},
};

// GDP per capita EUR current prices (Eurostat nama_10_pc), 2000-2024
let GDP_DATA=[
  {year:2000,IT:19000,ES:14900,FR:24100,DE:25300,SE:32200,AT:27000,RO:2100},
  {year:2001,IT:19800,ES:15900,FR:25100,DE:26100,SE:33200,AT:27900,RO:2400},
  {year:2002,IT:20500,ES:16900,FR:25900,DE:25900,SE:30800,AT:28600,RO:2500},
  {year:2003,IT:21100,ES:18000,FR:26700,DE:26500,SE:33200,AT:29600,RO:2900},
  {year:2004,IT:22000,ES:19200,FR:27600,DE:27500,SE:35700,AT:30900,RO:3500},
  {year:2005,IT:22700,ES:20600,FR:28600,DE:28400,SE:38400,AT:32300,RO:4400},
  {year:2006,IT:23800,ES:22300,FR:29700,DE:30200,SE:41700,AT:34300,RO:5600},
  {year:2007,IT:25000,ES:23800,FR:30600,DE:31800,SE:44500,AT:36600,RO:7300},
  {year:2008,IT:25400,ES:24200,FR:31000,DE:32300,SE:40600,AT:37600,RO:9100},
  {year:2009,IT:23700,ES:23000,FR:29600,DE:30800,SE:34800,AT:35500,RO:8000},
  {year:2010,IT:24300,ES:23000,FR:29900,DE:32300,SE:41400,AT:37200,RO:8200},
  {year:2011,IT:25200,ES:23400,FR:30500,DE:34000,SE:45300,AT:38900,RO:9100},
  {year:2012,IT:24600,ES:22700,FR:29700,DE:34800,SE:46400,AT:38700,RO:9100},
  {year:2013,IT:24100,ES:22500,FR:29300,DE:35500,SE:46600,AT:38700,RO:9100},
  {year:2014,IT:24400,ES:22900,FR:29600,DE:36700,SE:47300,AT:39100,RO:9700},
  {year:2015,IT:25100,ES:23600,FR:30200,DE:37800,SE:49000,AT:40100,RO:10200},
  {year:2016,IT:25700,ES:24400,FR:30700,DE:38700,SE:48000,AT:40700,RO:11000},
  {year:2017,IT:26500,ES:25400,FR:31700,DE:40100,SE:51200,AT:42300,RO:12100},
  {year:2018,IT:27200,ES:26400,FR:32600,DE:41800,SE:53600,AT:43900,RO:12700},
  {year:2019,IT:27700,ES:26900,FR:33200,DE:43100,SE:52700,AT:45100,RO:13300},
  {year:2020,IT:24900,ES:23700,FR:29900,DE:40700,SE:50700,AT:41800,RO:12500},
  {year:2021,IT:27400,ES:25000,FR:31200,DE:44100,SE:55900,AT:44600,RO:15000},
  {year:2022,IT:31100,ES:28200,FR:35100,DE:49000,SE:53400,AT:48700,RO:17400},
  {year:2023,IT:33800,ES:30900,FR:37100,DE:51200,SE:55700,AT:51400,RO:17700},
  {year:2024,IT:35200,ES:32700,FR:39000,DE:52800,SE:59200,AT:53700,RO:19000},
];

// Real labour productivity per hour worked, index 2000=100
let PROD_RAW=[
  {year:2000,IT:87.2,ES:88.6,FR:86.4,DE:83.5,SE:85.2,AT:85.8,RO:52.0},
  {year:2001,IT:87.8,ES:89.1,FR:87.0,DE:84.1,SE:86.8,AT:86.5,RO:55.1},
  {year:2002,IT:88.1,ES:89.8,FR:87.6,DE:85.3,SE:88.4,AT:87.4,RO:57.8},
  {year:2003,IT:87.9,ES:90.4,FR:88.1,DE:86.9,SE:89.7,AT:88.3,RO:60.2},
  {year:2004,IT:88.4,ES:91.2,FR:89.3,DE:89.2,SE:92.1,AT:90.0,RO:64.3},
  {year:2005,IT:88.2,ES:91.0,FR:90.0,DE:91.4,SE:93.5,AT:91.2,RO:67.5},
  {year:2006,IT:88.7,ES:91.6,FR:91.2,DE:94.3,SE:95.8,AT:93.1,RO:72.8},
  {year:2007,IT:89.1,ES:92.3,FR:92.0,DE:96.4,SE:97.3,AT:94.8,RO:79.4},
  {year:2008,IT:88.3,ES:93.8,FR:91.5,DE:95.3,SE:93.7,AT:94.0,RO:82.1},
  {year:2009,IT:87.0,ES:96.2,FR:90.2,DE:90.6,SE:90.2,AT:91.1,RO:78.9},
  {year:2010,IT:88.5,ES:99.1,FR:92.1,DE:95.5,SE:96.4,AT:95.2,RO:82.3},
  {year:2011,IT:89.2,ES:99.8,FR:93.0,DE:98.1,SE:97.2,AT:97.4,RO:86.5},
  {year:2012,IT:89.6,ES:101.4,FR:93.5,DE:98.6,SE:97.0,AT:97.8,RO:89.3},
  {year:2013,IT:89.9,ES:102.3,FR:93.8,DE:98.8,SE:97.5,AT:97.5,RO:93.7},
  {year:2014,IT:90.1,ES:102.8,FR:94.3,DE:99.3,SE:98.4,AT:98.2,RO:97.6},
  {year:2015,IT:100.0,ES:100.0,FR:100.0,DE:100.0,SE:100.0,AT:100.0,RO:100.0},
  {year:2016,IT:100.4,ES:100.3,FR:100.5,DE:100.2,SE:101.5,AT:100.8,RO:104.2},
  {year:2017,IT:100.9,ES:101.1,FR:101.2,DE:101.0,SE:103.0,AT:101.7,RO:108.8},
  {year:2018,IT:100.8,ES:101.8,FR:101.5,DE:100.8,SE:102.4,AT:102.1,RO:114.2},
  {year:2019,IT:101.2,ES:102.4,FR:102.0,DE:100.4,SE:103.1,AT:102.5,RO:118.7},
  {year:2020,IT:104.1,ES:106.2,FR:103.8,DE:101.3,SE:107.5,AT:103.1,RO:122.4},
  {year:2021,IT:103.8,ES:104.9,FR:104.2,DE:100.9,SE:106.8,AT:104.0,RO:126.1},
  {year:2022,IT:101.5,ES:102.7,FR:103.0,DE:97.8,SE:105.2,AT:101.5,RO:129.8},
  {year:2023,IT:100.6,ES:103.1,FR:103.4,DE:96.5,SE:105.8,AT:100.2,RO:132.7},
];
let PROD_BASE={};
COUNTRIES.forEach(k=>PROD_BASE[k]=PROD_RAW[0][k]);
let PROD_DATA=PROD_RAW.map(d=>{
  const o={year:d.year};
  COUNTRIES.forEach(k=>o[k]=+(d[k]/PROD_BASE[k]*100).toFixed(2));
  return o;
});

// Average annual hours worked per worker (OECD ANHRS), 2000-2023
const HOURS_DATA=[
  {year:2000,IT:1861,ES:1764,FR:1535,DE:1471,SE:1642,AT:1675,RO:1894},
  {year:2001,IT:1848,ES:1751,FR:1524,DE:1458,SE:1635,AT:1665,RO:1882},
  {year:2002,IT:1839,ES:1742,FR:1513,DE:1446,SE:1628,AT:1655,RO:1870},
  {year:2003,IT:1824,ES:1731,FR:1503,DE:1434,SE:1621,AT:1644,RO:1858},
  {year:2004,IT:1819,ES:1726,FR:1548,DE:1443,SE:1618,AT:1640,RO:1850},
  {year:2005,IT:1819,ES:1720,FR:1535,DE:1432,SE:1614,AT:1632,RO:1843},
  {year:2006,IT:1816,ES:1714,FR:1524,DE:1424,SE:1621,AT:1625,RO:1835},
  {year:2007,IT:1806,ES:1707,FR:1514,DE:1416,SE:1626,AT:1620,RO:1828},
  {year:2008,IT:1802,ES:1706,FR:1511,DE:1410,SE:1620,AT:1618,RO:1820},
  {year:2009,IT:1773,ES:1695,FR:1500,DE:1383,SE:1609,AT:1601,RO:1810},
  {year:2010,IT:1778,ES:1688,FR:1495,DE:1390,SE:1624,AT:1603,RO:1803},
  {year:2011,IT:1774,ES:1694,FR:1490,DE:1388,SE:1632,AT:1600,RO:1797},
  {year:2012,IT:1752,ES:1686,FR:1482,DE:1374,SE:1621,AT:1591,RO:1792},
  {year:2013,IT:1752,ES:1665,FR:1476,DE:1365,SE:1613,AT:1584,RO:1788},
  {year:2014,IT:1734,ES:1665,FR:1470,DE:1359,SE:1609,AT:1578,RO:1796},
  {year:2015,IT:1725,ES:1662,FR:1472,DE:1361,SE:1608,AT:1572,RO:1801},
  {year:2016,IT:1730,ES:1659,FR:1468,DE:1363,SE:1612,AT:1573,RO:1806},
  {year:2017,IT:1723,ES:1654,FR:1463,DE:1356,SE:1611,AT:1571,RO:1800},
  {year:2018,IT:1718,ES:1650,FR:1456,DE:1349,SE:1607,AT:1565,RO:1795},
  {year:2019,IT:1726,ES:1644,FR:1449,DE:1345,SE:1606,AT:1563,RO:1792},
  {year:2020,IT:1620,ES:1532,FR:1391,DE:1332,SE:1547,AT:1400,RO:1718},
  {year:2021,IT:1669,ES:1615,FR:1469,DE:1349,SE:1570,AT:1490,RO:1780},
  {year:2022,IT:1694,ES:1641,FR:1500,DE:1368,SE:1600,AT:1558,RO:1790},
  {year:2023,IT:1718,ES:1686,FR:1505,DE:1386,SE:1605,AT:1611,RO:1792},
];

// Employment rate 15-64 (Eurostat lfsi_emp_a)
let EMPL_DATA=[
  {year:2000,IT:53.7,ES:57.4,FR:62.1,DE:65.6,SE:74.2,AT:68.5,RO:63.0},
  {year:2001,IT:54.6,ES:58.9,FR:62.8,DE:65.8,SE:74.0,AT:68.8,RO:63.3},
  {year:2002,IT:55.5,ES:59.5,FR:63.0,DE:65.4,SE:72.9,AT:68.7,RO:57.6},
  {year:2003,IT:56.1,ES:60.7,FR:63.3,DE:64.9,SE:72.9,AT:68.9,RO:57.6},
  {year:2004,IT:57.3,ES:62.0,FR:63.7,DE:65.0,SE:72.1,AT:67.8,RO:57.7},
  {year:2005,IT:57.6,ES:63.3,FR:63.8,DE:66.0,SE:72.5,AT:68.6,RO:57.6},
  {year:2006,IT:58.5,ES:64.8,FR:64.4,DE:67.5,SE:73.5,AT:70.2,RO:58.8},
  {year:2007,IT:58.7,ES:65.6,FR:64.6,DE:69.4,SE:74.2,AT:71.4,RO:58.8},
  {year:2008,IT:58.7,ES:64.5,FR:65.0,DE:70.7,SE:74.3,AT:72.1,RO:59.0},
  {year:2009,IT:57.5,ES:59.8,FR:64.1,DE:70.9,SE:72.2,AT:71.6,RO:58.6},
  {year:2010,IT:56.9,ES:58.5,FR:64.0,DE:71.1,SE:72.1,AT:71.7,RO:59.3},
  {year:2011,IT:56.9,ES:57.7,FR:64.1,DE:72.7,SE:73.6,AT:72.1,RO:59.1},
  {year:2012,IT:56.8,ES:55.4,FR:64.0,DE:72.8,SE:73.8,AT:72.5,RO:59.5},
  {year:2013,IT:55.6,ES:54.0,FR:64.1,DE:73.5,SE:74.4,AT:72.3,RO:59.6},
  {year:2014,IT:55.7,ES:56.0,FR:64.3,DE:73.8,SE:74.9,AT:72.4,RO:61.0},
  {year:2015,IT:56.3,ES:57.8,FR:64.3,DE:74.0,SE:75.5,AT:72.3,RO:61.4},
  {year:2016,IT:57.2,ES:59.5,FR:64.2,DE:74.7,SE:76.2,AT:72.0,RO:61.6},
  {year:2017,IT:58.0,ES:61.1,FR:65.0,DE:75.2,SE:76.9,AT:73.1,RO:62.2},
  {year:2018,IT:58.5,ES:62.4,FR:65.7,DE:75.9,SE:77.4,AT:74.2,RO:63.0},
  {year:2019,IT:59.0,ES:63.3,FR:66.0,DE:76.7,SE:77.5,AT:74.9,RO:64.3},
  {year:2020,IT:58.1,ES:62.1,FR:65.0,DE:76.0,SE:75.5,AT:72.2,RO:63.3},
  {year:2021,IT:58.2,ES:62.8,FR:65.4,DE:76.1,SE:76.2,AT:72.7,RO:63.0},
  {year:2022,IT:60.1,ES:64.6,FR:67.0,DE:76.7,SE:77.2,AT:75.1,RO:63.6},
  {year:2023,IT:61.5,ES:65.5,FR:67.9,DE:76.5,SE:77.5,AT:76.0,RO:63.8},
];

// ── Fetch live Italy data from Eurostat ──
let _italyFetched = false;

// Parser generico Eurostat JSON-stat → [{year, IT, ES, ...}]
// Funziona con qualsiasi dataset dove le dimensioni non-geo/non-time
// sono filtrate a un singolo valore (contribuiscono 0 all'indice piatto).
function _parseEurostatTS(json, keys) {
  const dims   = json.id;
  const sizes  = json.size;
  const stride = dims.map((_, i) => sizes.slice(i + 1).reduce((a,b) => a * b, 1));
  const geoCat  = json.dimension.geo.category;
  const timeCat = json.dimension.time.category;
  const geoPos  = dims.indexOf('geo');
  const timPos  = dims.indexOf('time');
  const years   = Object.keys(timeCat.index).sort();
  const result  = [];
  years.forEach(yr => {
    const y = parseInt(yr);
    if (y < 2000) return;
    const row = { year: y };
    const ti  = timeCat.index[yr];
    let hasAny = false;
    keys.forEach(geo => {
      const gi = geoCat.index[geo];
      if (gi == null) return;
      const flat = gi * stride[geoPos] + ti * stride[timPos];
      const v = json.value[String(flat)];
      if (v != null) { row[geo] = v; hasAny = true; }
    });
    if (hasAny) result.push(row);
  });
  return result;
}

async function fetchItalyData() {
  if (_italyFetched) return;
  _italyFetched = true; // impedisce chiamate parallele / ri-fetch su stessa sessione
  const GEO  = 'AT,DE,ES,FR,IT,RO,SE';
  const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
  const keys = COUNTRIES;

  const [gdpRes, prodRes, emplRes] = await Promise.allSettled([
    fetch(`${BASE}/nama_10_pc?format=JSON&lang=EN&unit=CP_EUR_HAB&na_item=B1GQ&geo=${GEO}`).then(r => r.json()),
    fetch(`${BASE}/tipsna70?format=JSON&lang=EN&geo=${GEO}`).then(r => r.json()),
    fetch(`${BASE}/lfsi_emp_a?format=JSON&lang=EN&unit=PC_POP&sex=T&age=Y15-64&indic_em=EMP_LFS&geo=${GEO}`).then(r => r.json()),
  ]);

  let anyOk = false;

  // ── GDP ──
  if (gdpRes.status === 'fulfilled') {
    try {
      const rows = _parseEurostatTS(gdpRes.value, keys);
      if (rows.length > 0) {
        GDP_DATA = rows.map(r => {
          const o = { year: r.year };
          keys.forEach(k => { if (r[k] != null) o[k] = Math.round(r[k]); });
          return o;
        });
        anyOk = true;
        // Aggiorna KPI cards
        const latest = GDP_DATA[GDP_DATA.length - 1];
        const first  = GDP_DATA.find(d => d.year === 2000) || GDP_DATA[0];
        const $  = id => document.getElementById(id);
        const it = latest.IT, de = latest.DE, it0 = first ? first.IT : null;
        if ($('italy-kpi-it-gdp') && it)   $('italy-kpi-it-gdp').textContent = '\u20ac' + (it/1000).toFixed(1) + 'k';
        if ($('italy-kpi-it-note'))         $('italy-kpi-it-note').textContent  = 'Current prices, ' + latest.year;
        if ($('italy-kpi-de-gdp') && de)   $('italy-kpi-de-gdp').textContent = '\u20ac' + (de/1000).toFixed(1) + 'k';
        if ($('italy-kpi-de-note') && it && de)
          $('italy-kpi-de-note').textContent = '+' + Math.round((de/it - 1)*100) + '% vs Italy';
        if (it && it0) {
          const g = Math.round((it/it0 - 1)*100);
          if ($('italy-kpi-growth'))      $('italy-kpi-growth').textContent = '+' + g + '%';
          if ($('italy-kpi-growth-note')) $('italy-kpi-growth-note').textContent =
            '\u20ac' + (it0/1000).toFixed(0) + 'k \u2192 \u20ac' + (it/1000).toFixed(0) + 'k (nominal, ' + latest.year + ')';
        }
      }
    } catch(e) { console.warn('[italy] GDP parse error', e); }
  }

  // ── Productivity (tipsna70, index 2015=100 → rebased 2000=100) ──
  if (prodRes.status === 'fulfilled') {
    try {
      const rows = _parseEurostatTS(prodRes.value, keys);
      if (rows.length > 0) {
        const base2000 = rows.find(r => r.year === 2000);
        if (base2000) {
          const pb = {};
          keys.forEach(k => { pb[k] = base2000[k] || 100; });
          PROD_DATA = rows.map(r => {
            const o = { year: r.year };
            keys.forEach(k => { if (r[k] != null) o[k] = +(r[k] / pb[k] * 100).toFixed(2); });
            return o;
          });
          anyOk = true;
        }
      }
    } catch(e) { console.warn('[italy] Productivity parse error', e); }
  }

  // ── Employment ──
  if (emplRes.status === 'fulfilled') {
    try {
      const rows = _parseEurostatTS(emplRes.value, keys);
      if (rows.length > 0) {
        EMPL_DATA = rows.map(r => {
          const o = { year: r.year };
          keys.forEach(k => { if (r[k] != null) o[k] = +r[k].toFixed(1); });
          return o;
        });
        anyOk = true;
      }
    } catch(e) { console.warn('[italy] Employment parse error', e); }
  }

  if (!anyOk) {
    console.warn('[italy] All Eurostat fetches failed \u2013 using static fallback data.');
    return;
  }

  // Ri-renderizza il tab Italy attivo
  if (document.getElementById('italy-tab-gdp')?.classList.contains('active'))
    renderGDPChart();
  else if (document.getElementById('italy-tab-prod')?.classList.contains('active'))
    renderProdCharts();
}

// Tiene traccia delle serie nascoste per svgId (sopravvive al re-render del grafico)
const _hiddenKeys = {};

// ── Helper: build legend ──
// Se svgId è passato, i pallini diventano cliccabili per mostrare/nascondere la linea
function buildLegend(containerId, svgId) {
  const el = document.getElementById(containerId);
  if (!el || el.children.length > 0) return;
  COUNTRIES.forEach(k => {
    const m = C_META[k];
    const item = document.createElement('span');
    item.className = 'italy-legend-item';
    item.dataset.key = k;
    item.innerHTML = `<span class="italy-legend-dot" style="background:${m.color}"></span>${m.label}`;
    if (svgId) {
      item.style.cursor = 'pointer';
      item.title = 'Clicca per mostrare / nascondere';
      item.addEventListener('click', () => {
        const dimmed = item.classList.toggle('legend-dimmed');
        if (!_hiddenKeys[svgId]) _hiddenKeys[svgId] = new Set();
        if (dimmed) _hiddenKeys[svgId].add(k); else _hiddenKeys[svgId].delete(k);
        const svgEl = document.getElementById(svgId);
        if (!svgEl) return;
        svgEl.querySelectorAll(`[data-key="${k}"]`).forEach(n => {
          n.style.opacity = dimmed ? '0.07' : '';
        });
      });
    }
    el.appendChild(item);
  });
}

// ── Multi-line chart ──
function buildMultiLineChart(cid, svgId, data, keys, yMin, yMax, yStep, yFmt) {
  const area = document.getElementById(cid);
  if (!area) return;
  const W = area.clientWidth || 680;
  const PAD = {top:20, right:55, bottom:38, left:60}, H = 260;
  const pW = W - PAD.left - PAD.right, pH = H - PAD.top - PAD.bottom;
  const xS = i => PAD.left + (i / (data.length - 1)) * pW;
  const yS = v => PAD.top + pH - ((v - yMin) / (yMax - yMin)) * pH;

  let ticks = '';
  for (let v = yMin; v <= yMax; v += yStep) {
    const y = yS(v);
    ticks += `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${PAD.left+pW}" y2="${y.toFixed(1)}" stroke="#c8c2b6" stroke-width="0.5" stroke-dasharray="3,3"/>`;
    ticks += `<text x="${(PAD.left-6).toFixed(1)}" y="${y.toFixed(1)}" text-anchor="end" dominant-baseline="middle" font-size="8.5" fill="#9a9590" font-family="DM Mono,monospace">${yFmt(v)}</text>`;
  }

  let xlbls = '';
  data.forEach((d, i) => {
    if (d.year % 4 !== 0 && d.year !== data[data.length-1].year) return;
    xlbls += `<text x="${xS(i).toFixed(1)}" y="${(PAD.top+pH+14).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#9a9590" font-family="DM Mono,monospace">${d.year}</text>`;
  });

  let lines = '';
  const finalVals = keys.map(k => ({k, v: data[data.length-1][k]})).sort((a,b) => b.v - a.v);
  finalVals.forEach(({k}) => {
    const col = C_META[k].color;
    const pts = data.map((d,i) => `${i===0?'M':'L'}${xS(i).toFixed(1)},${yS(d[k]).toFixed(1)}`).join(' ');
    lines += `<path data-key="${k}" d="${pts}" fill="none" stroke="${col}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>`;
    const ex = xS(data.length-1), ey = yS(data[data.length-1][k]);
    lines += `<circle data-key="${k}" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3" fill="${col}"/>`;
  });

  let tooltipBars = '';
  data.forEach((d, i) => {
    const x = xS(i);
    const tipContent = keys.map(k => `${C_META[k].label}: ${yFmt(d[k])}`).join('|');
    tooltipBars += `<rect x="${(x-6).toFixed(1)}" y="${PAD.top}" width="12" height="${pH}" fill="transparent" data-year="${d.year}" data-vals="${tipContent}" onmouseenter="showTip7(event,this)" onmouseleave="hideTip()"/>`;
  });

  area.innerHTML = `<svg id="${svgId}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">
    ${ticks}
    ${lines}
    ${tooltipBars}
    ${xlbls}
    <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+pH}" stroke="#c8c2b6" stroke-width="1"/>
    <line x1="${PAD.left}" y1="${PAD.top+pH}" x2="${PAD.left+pW}" y2="${PAD.top+pH}" stroke="#c8c2b6" stroke-width="1"/>
  </svg>`;
  // Ripristina le serie nascoste se il grafico viene ri-renderizzato (es. cambio tab)
  if (_hiddenKeys[svgId]) {
    _hiddenKeys[svgId].forEach(k => {
      area.querySelectorAll(`[data-key="${k}"]`).forEach(n => { n.style.opacity = '0.07'; });
    });
  }
}

function showTip7(e, el) {
  const t = document.getElementById('italy-tooltip');
  if (!t) return;
  const year = el.dataset.year;
  const vals = el.dataset.vals.split('|');
  let html = `<span style="font-weight:500;color:var(--ink)">${year}</span><br>`;
  vals.forEach((v,i) => {
    const k = COUNTRIES[i];
    html += `<span style="color:${C_META[k].color}">■</span> ${v}<br>`;
  });
  t.innerHTML = html;
  t.style.display = 'block';
  t.style.left = (e.clientX + 14) + 'px';
  t.style.top  = (e.clientY - 10) + 'px';
}
function hideTip() {
  const t = document.getElementById('italy-tooltip');
  if (t) t.style.display = 'none';
}
function showDecompTip(e, text) {
  const t = document.getElementById('italy-tooltip');
  if (!t) return;
  t.innerHTML = text;
  t.style.display = 'block';
  t.style.left = (e.clientX + 14) + 'px';
  t.style.top  = (e.clientY - 10) + 'px';
}

// ── Decomposition bar chart (6 countries vs Italy) ──
function logChg(arr, k) { return Math.log(arr[arr.length-1][k]) - Math.log(arr[0][k]); }

// Stato toggle scala decomposizione
let _decompClip = false;
const DECOMP_CLIP_LIMIT = 0.55; // ±55 log-punti

function buildDecompChart() {
  const area = document.getElementById('decomp-chart-area');
  if (!area) return;
  const W = area.clientWidth || 680;

  const comps = ['ES','FR','DE','SE','AT','RO'];
  const compLabels = {ES:'Spain',FR:'France',DE:'Germany',SE:'Sweden',AT:'Austria',RO:'Romania'};

  const gdpSub = GDP_DATA.slice(0, 24); // 2000-2023
  const itProd = logChg(PROD_DATA, 'IT');
  const itHrs  = logChg(HOURS_DATA, 'IT');
  const itEmpl = logChg(EMPL_DATA, 'IT');

  const groups = comps.map(k => {
    const dProd = logChg(PROD_DATA, k) - itProd;
    const dHrs  = logChg(HOURS_DATA, k) - itHrs;
    const dEmpl = logChg(EMPL_DATA, k) - itEmpl;
    return { k, label: compLabels[k], dProd, dHrs, dEmpl };
  });

  const allVals = groups.flatMap(g => [g.dProd, g.dHrs, g.dEmpl]);
  const fullMax = Math.max(...allVals.map(v => Math.abs(v)));
  const absMax  = (_decompClip ? Math.min(fullMax, DECOMP_CLIP_LIMIT) : fullMax) * 1.12;

  const BAR_H    = 16;
  const SPACING  = 9;   // tra le barre dello stesso gruppo
  const GRP_GAP  = 20;  // spazio extra tra gruppi-paese
  const GROUP_H  = 3 * (BAR_H + SPACING) - SPACING + GRP_GAP;
  const LEG_H    = 32;
  const PAD = {top: LEG_H + 26, right: 10, bottom: 38, left: 90};
  const H = PAD.top + comps.length * GROUP_H + PAD.bottom;
  const pW = W - PAD.left - PAD.right;
  const pH = H - PAD.top - PAD.bottom;

  const zero = PAD.left + pW * 0.5;  // lo zero è sempre al centro
  const xS = v => PAD.left + (v + absMax) / (2 * absMax) * pW;

  const compColors = { dProd: '#4a6e9e', dHrs: '#9e7a3a', dEmpl: '#5a9e7a' };
  const compNames  = { dProd: 'Productivity', dHrs: 'Hours', dEmpl: 'Employment' };

  let svg = '';

  // Legenda in cima
  const lcols = Object.keys(compColors);
  const legStep = Math.min(150, pW / lcols.length);
  lcols.forEach((comp, ci) => {
    const lx = PAD.left + ci * legStep;
    svg += `<rect x="${lx}" y="8" width="12" height="12" fill="${compColors[comp]}" rx="2"/>`;
    svg += `<text x="${(lx+17).toFixed(1)}" y="19" font-size="10.5" font-family="DM Mono,monospace" fill="var(--ink-muted)">${compNames[comp]}</text>`;
  });

  // Frecce direzione
  svg += `<text x="${PAD.left}" y="${(PAD.top-8).toFixed(1)}" font-size="8.5" fill="#2c4a6e" font-family="DM Mono,monospace">← Italy gained</text>`;
  svg += `<text x="${(PAD.left+pW).toFixed(1)}" y="${(PAD.top-8).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#c17a2a" font-family="DM Mono,monospace">Country gained →</text>`;

  // Griglia verticale + etichette asse X
  const tickStep = absMax <= 0.3 ? 0.1 : absMax <= 0.65 ? 0.1 : 0.2;
  const tMin = Math.ceil((-absMax) / tickStep) * tickStep;
  const tMax = Math.floor(absMax / tickStep) * tickStep;
  for (let v = tMin; v <= tMax + 1e-9; v += tickStep) {
    const rv = Math.round(v * 1000) / 1000;
    const x = xS(rv);
    svg += `<line x1="${x.toFixed(1)}" y1="${PAD.top}" x2="${x.toFixed(1)}" y2="${(PAD.top+pH).toFixed(1)}" stroke="#c8c2b6" stroke-width="0.5" stroke-dasharray="3,3"/>`;
    svg += `<text x="${x.toFixed(1)}" y="${(PAD.top+pH+14).toFixed(1)}" text-anchor="middle" font-size="8" fill="#9a9590" font-family="DM Mono,monospace">${rv===0?'0':(rv>0?'+':'')+Math.round(rv*100)+'%'}</text>`;
  }

  // Gruppi paese
  groups.forEach((g, gi) => {
    const gTop = PAD.top + gi * GROUP_H;
    const barsH = 3 * (BAR_H + SPACING) - SPACING;
    svg += `<text x="${(PAD.left-8).toFixed(1)}" y="${(gTop+barsH/2).toFixed(1)}" text-anchor="end" dominant-baseline="middle" font-size="10.5" font-family="DM Mono,monospace" fill="var(--ink-muted)" font-weight="500">${g.label}</text>`;

    ['dProd','dHrs','dEmpl'].forEach((comp, ci) => {
      const rawVal = g[comp];
      const clipped = _decompClip && Math.abs(rawVal) > DECOMP_CLIP_LIMIT;
      const dispVal = clipped ? Math.sign(rawVal) * DECOMP_CLIP_LIMIT : rawVal;
      const bTop = gTop + ci * (BAR_H + SPACING);
      const x0  = Math.min(zero, xS(dispVal));
      const bw  = Math.max(Math.abs(xS(dispVal) - zero), 1);
      const col = compColors[comp];
      const pct = (rawVal * 100).toFixed(1);
      const sign = rawVal >= 0 ? '+' : '';
      const tip = `<strong>${g.label}</strong> · ${compNames[comp]}: <strong>${sign}${pct}%</strong>${clipped ? ' (scala tagliata)' : ''}`;

      // Barra
      svg += `<rect x="${x0.toFixed(1)}" y="${bTop.toFixed(1)}" width="${bw.toFixed(1)}" height="${BAR_H}" fill="${col}" rx="2" opacity="${rawVal >= 0 ? '0.85' : '0.45'}" onmouseenter="showDecompTip(event,\`${tip}\`)" onmouseleave="hideTip()" style="cursor:default"/>`;

      // Indicatore clip (freccia bianca sul bordo destro/sinistro)
      if (clipped) {
        const ax = rawVal > 0 ? xS(dispVal) - 1 : xS(dispVal) + 1;
        const pts = rawVal > 0
          ? `${ax},${bTop+1} ${(ax+7).toFixed(1)},${(bTop+BAR_H/2).toFixed(1)} ${ax},${bTop+BAR_H-1}`
          : `${ax},${bTop+1} ${(ax-7).toFixed(1)},${(bTop+BAR_H/2).toFixed(1)} ${ax},${bTop+BAR_H-1}`;
        svg += `<polygon points="${pts}" fill="white" opacity="0.75" style="pointer-events:none"/>`;
      }

      // Etichetta valore
      const vx = rawVal >= 0 ? xS(dispVal) + 5 : xS(dispVal) - 5;
      const anchor = rawVal >= 0 ? 'start' : 'end';
      svg += `<text x="${vx.toFixed(1)}" y="${(bTop+BAR_H/2+0.5).toFixed(1)}" dominant-baseline="middle" text-anchor="${anchor}" font-size="9" font-family="DM Mono,monospace" fill="var(--ink-faint)">${sign}${pct}%</text>`;
    });

    if (gi < groups.length - 1) {
      const sepY = PAD.top + (gi+1)*GROUP_H - GRP_GAP/2;
      svg += `<line x1="${(PAD.left-78).toFixed(1)}" y1="${sepY.toFixed(1)}" x2="${(PAD.left+pW).toFixed(1)}" y2="${sepY.toFixed(1)}" stroke="#ede9e0" stroke-width="1"/>`;
    }
  });

  // Linea zero e asse inferiore
  svg += `<line x1="${zero.toFixed(1)}" y1="${PAD.top}" x2="${zero.toFixed(1)}" y2="${(PAD.top+pH).toFixed(1)}" stroke="#9a9590" stroke-width="1.5"/>`;
  svg += `<line x1="${PAD.left}" y1="${(PAD.top+pH).toFixed(1)}" x2="${(PAD.left+pW).toFixed(1)}" y2="${(PAD.top+pH).toFixed(1)}" stroke="#c8c2b6" stroke-width="1"/>`;

  // Rendering finale
  area.innerHTML = `<svg id="decomp-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">${svg}</svg>`;

  // Bottone toggle scala
  const btn = document.createElement('button');
  btn.className = 'italy-dl-btn';
  btn.style.cssText = 'margin-top:0.6rem;';
  btn.textContent = _decompClip
    ? 'Show full scale (include Romania)'
    : 'Compress scale ±55% (more readable, exclude Romania)';
  btn.onclick = () => { _decompClip = !_decompClip; buildDecompChart(); };
  area.appendChild(btn);
}

// ── Render functions ──
function renderGDPChart() {
  buildLegend('italy-legend-gdp', 'gdp-svg');
  buildMultiLineChart('gdp-chart-area','gdp-svg', GDP_DATA, COUNTRIES, 0, 65000, 10000, v => '€'+(v/1000).toFixed(0)+'k');
}
function renderProdCharts() {
  buildLegend('italy-legend-prod', 'prod-svg');
  buildMultiLineChart('prod-chart-area','prod-svg', PROD_DATA, COUNTRIES, 85, 145, 10, v => v.toFixed(0));
  buildLegend('italy-legend-hours', 'hours-svg');
  buildMultiLineChart('hours-chart-area','hours-svg', HOURS_DATA, COUNTRIES, 1300, 1950, 100, v => v.toFixed(0)+'h');
  buildDecompChart();
}

function showItalyTab(id, btn) {
  document.querySelectorAll('.italy-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.italy-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('italy-tab-'+id).classList.add('active');
  btn.classList.add('active');
  if (id === 'gdp')  setTimeout(renderGDPChart, 30);
  if (id === 'prod') setTimeout(renderProdCharts, 30);
}

// ── Download Excel (richiede la libreria SheetJS caricata in index.html) ──
function downloadExcel7() {
  if (typeof XLSX === 'undefined') { alert('SheetJS not loaded yet.'); return; }
  const wb = XLSX.utils.book_new();

  const hdr1 = ['Year',...COUNTRIES.map(k=>C_META[k].label+' GDP/cap (EUR)')];
  const s1 = [hdr1, ...GDP_DATA.map(d=>[d.year,...COUNTRIES.map(k=>d[k])])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s1), 'GDP per capita');

  const hdr2 = ['Year',...COUNTRIES.map(k=>C_META[k].label+' prod. (2000=100)')];
  const s2 = [hdr2, ...PROD_DATA.map(d=>[d.year,...COUNTRIES.map(k=>d[k])])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s2), 'Productivity index');

  const hdr3 = ['Year',...COUNTRIES.map(k=>C_META[k].label+' hours/worker')];
  const s3 = [hdr3, ...HOURS_DATA.map(d=>[d.year,...COUNTRIES.map(k=>d[k])])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s3), 'Hours worked');

  const hdr4 = ['Year',...COUNTRIES.map(k=>C_META[k].label+' empl. rate %')];
  const s4 = [hdr4, ...EMPL_DATA.map(d=>[d.year,...COUNTRIES.map(k=>d[k])])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s4), 'Employment rates');

  const s5 = [['Dataset','Source','Unit','Period'],
    ['GDP per capita','Eurostat (nama_10_pc)','EUR current prices','2000-2024'],
    ['Labour productivity','Eurostat (tipsna70)','Index 2015=100, chain-linked, rebased 2000=100','2000-2023'],
    ['Hours worked','OECD (ANHRS)','Hours per worker per year','2000-2023'],
    ['Employment rate','Eurostat (lfsi_emp_a)','% 15-64 employed','2000-2023'],
    ['Countries','IT=Italy, ES=Spain, FR=France, DE=Germany, SE=Sweden, AT=Austria, RO=Romania','','']];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s5), 'Metadata');

  XLSX.writeFile(wb, 'italy_comparators_economic_data.xlsx');
}

function downloadPNG(svgId, filename) {
  const svg = document.getElementById(svgId);
  if (!svg) { alert('Render that chart first by switching to its tab.'); return; }
  const scale = 2;
  const w = svg.viewBox.baseVal.width * scale;
  const h = svg.viewBox.baseVal.height * scale;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f7f4ee';
  ctx.fillRect(0, 0, w, h);
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], {type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = url;
}
