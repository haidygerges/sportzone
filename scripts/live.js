let apikey = '40c206c0f92ef578789e6370e7e38ad799bcf560c5cf3b79330302c12d7a5e3a';

function getStatusBadge(status) {
  if (status === 'inprogress') {
    return `<div class="inline-block text-[10px] font-extrabold tracking-wide px-3 py-1 rounded-full
                bg-[#E63946] text-white mb-1.5 pulse-red">● LIVE</div>`;
  } else if (status === 'Finished') {
    return `<div class="inline-block text-[10px] font-extrabold tracking-wide px-3 py-1 rounded-full
                bg-white/[0.05] text-[#666] border border-[#242424] mb-1.5">FT</div>`;
  } else {
    return `<div class="inline-block text-[10px] font-extrabold tracking-wide px-3 py-1 rounded-full
                bg-[rgba(46,204,82,0.1)] text-[#2ECC52] border border-[rgba(46,204,82,0.3)] mb-1.5">
                ${status || 'NS'}
            </div>`;
  }
}

function getScoreDisplay(match) {
  const status = match.event_status;
  const score  = match.event_final_result || '0 - 0';
  const time   = match.event_time || '';

  if (status === 'inprogress') {
    return `<div class="font-['Bebas_Neue'] text-[36px] md:text-[48px] tracking-[4px] text-[#2ECC52] leading-none">
              ${score}
            </div>
            <div class="text-[11px] text-[#2ECC52] mt-1">● Live</div>`;
  } else if (status === 'Finished') {
    return `<div class="font-['Bebas_Neue'] text-[36px] md:text-[48px] tracking-[4px] text-[#666] leading-none">
              ${score}
            </div>
            <div class="text-[11px] text-[#666] mt-1">Full Time</div>`;
  } else {
    return `<div class="font-['Bebas_Neue'] text-[20px] tracking-[2px] text-[#666] leading-none">VS</div>
            <div class="text-[11px] text-[#666] mt-1">${time}</div>`;
  }
}

function getOpacity(status) {
  return status === 'Finished' ? 'opacity-40' : '';
}


function toArray(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  
  return Object.values(result);
}

function renderMatches(matches) {
  let container = document.getElementById('matchesContainer');
  container.innerHTML = '';

  if (!matches || matches.length === 0) {
    container.innerHTML = `<div class="text-center text-[#666] py-16 text-[14px]">No matches found for this date</div>`;
    return;
  }

  matches.forEach(match => {
    
    const homeName  = match.event_home_team  || match.home_team_name  || 'Home Team';
    const awayName  = match.event_away_team  || match.away_team_name  || 'Away Team';
    const homeLogo  = match.home_team_logo   || match.home_logo       || '';
    const awayLogo  = match.away_team_logo   || match.away_logo       || '';
    const league    = match.league_name      || match.event_league    || '';
    const stadium   = match.event_stadium    || '';
    const status    = match.event_status     || 'NS';

    container.innerHTML += `
      <div class="${getOpacity(status)} bg-[#161616] border border-[#242424] rounded-[14px] px-4 md:px-7 py-4 md:py-5
                  cursor-pointer hover:border-[#2ECC52] hover:shadow-[0_0_0_1px_#2ECC52,0_8px_32px_rgba(46,204,82,0.08)]
                  transition-all duration-200">

        <!-- Mobile: status + league -->
        <div class="flex items-center justify-between mb-3 md:hidden">
          ${getStatusBadge(status)}
          <span class="text-[10px] text-[#666]">${league}</span>
        </div>

        <!-- Desktop layout -->
        <div class="hidden md:grid grid-cols-[140px_1fr_auto_1fr_140px] items-center gap-4">
          <div class="text-center">
            ${getStatusBadge(status)}
            <div class="text-[11px] text-[#666]">${league}</div>
          </div>
          <div class="text-center">
            <img src="${homeLogo}" class="w-12 h-12 mx-auto mb-1.5 object-contain" onerror="this.style.display='none'">
            <div class="text-[14px] font-bold uppercase tracking-wide">${homeName}</div>
          </div>
          <div class="text-center min-w-[110px]">${getScoreDisplay(match)}</div>
          <div class="text-center">
            <img src="${awayLogo}" class="w-12 h-12 mx-auto mb-1.5 object-contain" onerror="this.style.display='none'">
            <div class="text-[14px] font-bold uppercase tracking-wide">${awayName}</div>
          </div>
          <div class="text-center text-[12px] text-[#666]">
            <div>${stadium}</div>
            <span class="text-[#2ECC52] font-bold text-[13px] mt-1.5 block">Follow →</span>
          </div>
        </div>

        <!-- Mobile layout -->
        <div class="flex md:hidden items-center gap-3">
          <div class="flex-1 flex flex-col items-center gap-1">
            <img src="${homeLogo}" class="w-10 h-10 object-contain" onerror="this.style.display='none'">
            <div class="text-[11px] font-bold uppercase tracking-wide text-center leading-tight">${homeName}</div>
          </div>
          <div class="flex flex-col items-center min-w-[80px]">
            ${getScoreDisplay(match)}
          </div>
          <div class="flex-1 flex flex-col items-center gap-1">
            <img src="${awayLogo}" class="w-10 h-10 object-contain" onerror="this.style.display='none'">
            <div class="text-[11px] font-bold uppercase tracking-wide text-center leading-tight">${awayName}</div>
          </div>
        </div>

      </div>`;
  });
}

function fetchMatches() {
  let from     = document.getElementById('fromDate').value;
  let to       = document.getElementById('toDate').value;
  let leagueId = document.getElementById('leagueSelect').value;
  let apiUrl   = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${apikey}&from=${from}&to=${to}&leagueId=${leagueId}`;

  document.getElementById('matchesContainer').innerHTML = `
    <div class="text-center text-[#666] py-16 text-[14px]">Loading...</div>`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      
      console.log('API raw response:', data);

      let matches = toArray(data.result);

      if (matches.length === 0) {
        document.getElementById('matchesContainer').innerHTML =
          `<div class="text-center text-[#666] py-16">No matches found for this date</div>`;
        return;
      }

      let teamQuery = document.getElementById('teamFilter').value.trim().toLowerCase();
      let filtered  = teamQuery
        ? matches.filter(m =>
            (m.event_home_team || '').toLowerCase().includes(teamQuery) ||
            (m.event_away_team || '').toLowerCase().includes(teamQuery))
        : matches;

      let sorted = [...filtered].sort((a, b) => {
        let order = { inprogress: 0, NS: 1, Finished: 2 };
        return (order[a.event_status] ?? 1) - (order[b.event_status] ?? 1);
      });

      renderMatches(sorted);
    })
    .catch(err => {
      console.error('Fetch error:', err);
      document.getElementById('matchesContainer').innerHTML =
        `<div class="text-center text-[#E63946] py-16 text-[13px]">Failed to load matches. Check your connection.</div>`;
    });
}

document.getElementById('searchBtn').addEventListener('click', fetchMatches);


const today = new Date().toISOString().split('T')[0];
const fromEl = document.getElementById('fromDate');
const toEl   = document.getElementById('toDate');
if (fromEl) fromEl.value = today;
if (toEl)   toEl.value   = today;

fetchMatches();