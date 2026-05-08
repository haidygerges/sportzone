// ─── Exchange Rates (frankfurter.app – free, no key needed) ───────────────────
const PAIRS = [
  { from: 'USD', elId: 'usdRate' },
  { from: 'SAR', elId: 'sarRate' },
  { from: 'EUR', elId: 'eurRate' },
  { from: 'GBP', elId: 'gbgRate' },
];

async function loadExchangeRates() {
  try {
    // Fetch all 4 in one call: EGP base, get USD/SAR/EUR/GBP
    const res = await fetch('https://api.frankfurter.app/latest?from=EGP&to=USD,EUR,GBP,SAR');
    const data = await res.json();
    if (!data.rates) throw new Error('No rates');

    // frankfurter gives us EGP→X, we need X→EGP
    PAIRS.forEach(({ from, elId }) => {
      const rate = 1 / data.rates[from];
      const el = document.getElementById(elId);
      if (el) el.innerHTML = rate.toFixed(2);
    });

    // Store for converter
    window._egpRates = {
      USD: 1 / data.rates.USD,
      EUR: 1 / data.rates.EUR,
      GBP: 1 / data.rates.GBP,
      SAR: 1 / data.rates.SAR,
    };
  } catch (e) {
    console.warn('Exchange rate fetch failed:', e);
  }
}

loadExchangeRates();

// ─── Currency Converter ────────────────────────────────────────────────────────
async function convertCurrency() {
  let amount = parseFloat(document.getElementById('convertAmount').value);
  let from   = document.getElementById('convertFrom').value;
  let to     = document.getElementById('convertTo').value;
  let result = document.getElementById('convertResult');

  if (!amount || isNaN(amount)) {
    result.innerHTML = 'Enter a valid amount';
    result.classList.remove('hidden');
    return;
  }
  if (from === to) {
    result.innerHTML = `${amount.toLocaleString()} ${from} = <span class="text-white">${amount.toFixed(2)}</span> ${to}`;
    result.classList.remove('hidden');
    return;
  }

  result.innerHTML = `<span class="text-[#666] text-[14px]">Converting...</span>`;
  result.classList.remove('hidden');

  try {
    let converted;

    if (from === 'EGP') {
      // EGP → something: divide by the stored X→EGP rate
      const egpRates = window._egpRates || {};
      if (!egpRates[to]) {
        const r = await fetch(`https://api.frankfurter.app/latest?from=EGP&to=${to}`);
        const d = await r.json();
        converted = amount * d.rates[to];
      } else {
        converted = amount / egpRates[to];
      }
    } else if (to === 'EGP') {
      // something → EGP
      const egpRates = window._egpRates || {};
      if (!egpRates[from]) {
        const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=EGP`);
        const d = await r.json();
        converted = amount * d.rates.EGP;
      } else {
        converted = amount * egpRates[from];
      }
    } else {
      // cross rate
      const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
      const d = await r.json();
      converted = amount * d.rates[to];
    }

    result.innerHTML = `${amount.toLocaleString()} ${from} = <span class="text-white">${converted.toFixed(2)}</span> ${to}`;
  } catch {
    result.innerHTML = `<span class="text-[#E63946] text-[13px]">Failed to fetch rate</span>`;
  }
}

function swapCurrencies() {
  let from = document.getElementById('convertFrom');
  let to   = document.getElementById('convertTo');
  let temp = from.value;
  from.value = to.value;
  to.value   = temp;
}

// ─── Live Matches (allsportsapi) ───────────────────────────────────────────────
const SPORTS_KEY = '40c206c0f92ef578789e6370e7e38ad799bcf560c5cf3b79330302c12d7a5e3a';

fetch(`https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${SPORTS_KEY}`)
  .then(r => r.json())
  .then(data => {
    let container = document.getElementById('matchesContainer');
    let matches = (data.result || []).slice(0, 3);

    if (matches.length === 0) {
      container.innerHTML = `<div class="text-[12px] text-[#666] text-center py-4">No live matches right now</div>`;
      return;
    }

    matches.forEach(match => {
      let scores = (match.event_final_result || '- -').split(' - ');
      container.innerHTML += `
        <div class="py-2.5 border-b border-[#242424]">
          <div class="flex items-center justify-between text-[12px] font-semibold mb-1">
            <div class="flex items-center gap-2">
              <img src="${match.home_team_logo}" class="w-4 h-4 object-contain" onerror="this.style.display='none'">
              <span>${match.event_home_team}</span>
            </div>
            <span class="font-['Oswald'] text-[14px] text-[#2ECC52]">${scores[0] ?? '-'}</span>
          </div>
          <div class="flex items-center justify-between text-[12px] font-semibold mb-1">
            <div class="flex items-center gap-2">
              <img src="${match.away_team_logo}" class="w-4 h-4 object-contain" onerror="this.style.display='none'">
              <span>${match.event_away_team}</span>
            </div>
            <span class="font-['Oswald'] text-[14px] text-[#2ECC52]">${scores[1] ?? '-'}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-[10px] text-[#666]">${match.league_name}</span>
            <span class="text-[10px] font-bold text-[#E63946]">● LIVE ${match.event_status}</span>
          </div>
        </div>`;
    });
  })
  .catch(() => {
    document.getElementById('matchesContainer').innerHTML =
      `<div class="text-[12px] text-[#666] text-center py-4">No live matches right now</div>`;
  });

// ─── News ──────────────────────────────────────────────────────────────────────
const NEWSDATA_KEY = 'pub_c2c7aa258e4943628f9a3afaea47d458';
const GNEWS_KEY    = 'f577cc3512edde1588bb9ca0f555cc65';

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs  > 0) return `${hrs}h ago`;
  return `${mins}m ago`;
}

function buildNewsCards(articles, accentColor, labelText) {
  const bgGradients = [
    'linear-gradient(160deg,#1a0606,#2e0a0a,#0a0a0a)',
    'linear-gradient(160deg,#1a1a06,#2e2e0a,#0a0a0a)',
    'linear-gradient(160deg,#06101a,#0a1e2e,#0a0a0a)',
  ];
  const emojis = ['📰', '🗞️', '📡'];

  return articles.slice(0, 3).map((article, i) => {
    const title   = (article.title || 'No Title').replace(/\s-\s[^-]+$/, '');
    const desc    = ((article.description || article.content || '')).slice(0, 100) + '...';
    const source  = article.source_id || 'News';
    const timeAgo = article.pubDate ? getTimeAgo(article.pubDate) : '';
    const imgUrl  = article.image_url || '';
    const link    = article.link || '#';

    const thumbHTML = imgUrl
      ? `<img src="${imgUrl}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.style.justifyContent='center';this.remove()">`
      : `<span class="text-[60px] opacity-35">${emojis[i % 3]}</span>`;

    return `
      <a href="${link}" target="_blank" rel="noopener"
         class="bg-[#161616] border border-[#242424] rounded-xl overflow-hidden cursor-pointer
                hover:border-[${accentColor}] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]
                transition-all flex flex-col no-underline text-white">
        <div class="h-[160px] relative flex items-center justify-center overflow-hidden" style="background:${bgGradients[i]}">
          ${thumbHTML}
          <span class="absolute bottom-3 right-3 text-black text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded uppercase"
                style="background:${accentColor}">${labelText}</span>
        </div>
        <div class="p-4 flex-1">
          <div class="font-['Oswald'] text-[15px] font-bold uppercase leading-tight mb-2 line-clamp-2">${title}</div>
          <p class="text-[12px] text-[#888] leading-relaxed line-clamp-3">${desc}</p>
        </div>
        <div class="px-4 py-3 text-[11px] text-[#666] border-t border-[#242424]">${source} · ${timeAgo}</div>
      </a>`;
  }).join('');
}

function showLoading(containerId, emoji) {
  document.getElementById(containerId).innerHTML = `
    <div class="col-span-3 flex items-center justify-center h-[180px] text-[#666]">
      <div class="text-center">
        <div class="text-[28px] mb-2 animate-pulse">${emoji}</div>
        <div class="text-[11px] font-bold tracking-widest uppercase">Loading...</div>
      </div>
    </div>`;
}

function showError(containerId, msg) {
  document.getElementById(containerId).innerHTML =
    `<div class="col-span-3 text-center text-[#E63946] py-10 text-sm">${msg}</div>`;
}

async function loadNewsData(containerId, query, accentColor, labelText, emoji) {
  showLoading(containerId, emoji);
  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(query)}&language=en`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.status !== 'success' || !data.results?.length) throw new Error('No results');
    document.getElementById(containerId).innerHTML = buildNewsCards(data.results, accentColor, labelText);
  } catch {
    showError(containerId, 'Failed to load news.');
  }
}

async function loadGNews(containerId, query, accentColor, labelText, emoji) {
  showLoading(containerId, emoji);
  try {
    const url  = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=3&apikey=${GNEWS_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.articles?.length) throw new Error('No results');

    const mapped = data.articles.map(a => ({
      title:     a.title,
      description: a.description,
      source_id: a.source?.name,
      pubDate:   a.publishedAt,
      image_url: a.image,
      link:      a.url,
    }));
    document.getElementById(containerId).innerHTML = buildNewsCards(mapped, accentColor, labelText);
  } catch {
    showError(containerId, 'Failed to load news.');
  }
}

// ─── Bootstrap news sections ───────────────────────────────────────────────────
loadNewsData('politicsGrid',      'politics government',     '#E63946', 'Politics',      '🏛️');
loadNewsData('economyGrid',       'economy finance markets', '#F4A01C', 'Economy',       '💹');
loadGNews(  'entertainmentGrid', 'entertainment celebrity', '#2ECC52', 'Entertainment', '🎬');
loadGNews(  'sportsGrid',        'football sports',         '#2ECC52', 'Sports',        '⚽');
