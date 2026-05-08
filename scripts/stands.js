let apiKey      = '40c206c0f92ef578789e6370e7e38ad799bcf560c5cf3b79330302c12d7a5e3a';
let leagueId    = 152;
let currentSort = 'goals';

let allScorers  = [];
let cardsMap    = {};
let fetchesDone = 0;

fetch(`https://apiv2.allsportsapi.com/football/?met=Topscorers&leagueId=${leagueId}&APIkey=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    allScorers = data.result || [];
    tryRender();
  });


let seasonStart = '2025-07-01';
let today       = new Date().toISOString().split('T')[0];

fetch(`https://apiv2.allsportsapi.com/football/?met=Fixtures&leagueId=${leagueId}&APIkey=${apiKey}&from=${seasonStart}&to=${today}`)
  .then(res => res.json())
  .then(data => {
    (data.result || []).forEach(match => {
      (match.cards || []).forEach(card => {
        let isHome     = !!card.home_fault;
        let playerName = card.home_fault || card.away_fault;
        if (!playerName) return;
        let team = isHome ? match.event_home_team : match.event_away_team;
        let logo = isHome ? match.home_team_logo  : match.away_team_logo;
        let key  = playerName + '_' + team;
        if (!cardsMap[key]) cardsMap[key] = { name: playerName, team, logo, yellow: 0, red: 0 };
        if (card.card === 'red card') cardsMap[key].red++;
        else                          cardsMap[key].yellow++;
      });
    });
    tryRender();
  });


function tryRender() {
  fetchesDone++;
  if (fetchesDone >= 2) {
    renderScorers(allScorers);
    renderCards(Object.values(cardsMap).filter(p => p.yellow > 0 || p.red > 0), currentSort);
  }
}


function renderScorers(players) {
  let container = document.getElementById('scorersContainer');
  container.innerHTML = '';
  if (!players.length) {
    container.innerHTML = `<div class="text-center text-[#666] py-8 text-[13px]">No data</div>`;
    return;
  }
  players.slice(0, 10).forEach((p, i) => {
    let rankColor = i === 0 ? 'text-[#F4A01C]' : i === 1 ? 'text-[#C0C0C0]' : i === 2 ? 'text-[#CD7F32]' : 'text-[#555]';
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.player_name)}&background=161616&color=666&size=40`;
    let cardData  = cardsMap[p.player_name + '_' + p.team_name] || { yellow: 0, red: 0 };
    container.innerHTML += `
      <div class="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-[#242424]/80 hover:bg-white/[0.015] transition-colors">
        <div class="font-['Oswald'] text-[15px] font-semibold w-5 shrink-0 text-center ${rankColor}">${i + 1}</div>
        <div class="relative shrink-0">
          <img src="${p.player_image || ''}" class="w-9 h-9 rounded-full object-cover bg-[#222] border border-[#333]" onerror="this.src='${avatarUrl}'">
          <img src="${p.team_logo || ''}" class="absolute -bottom-1 -right-1 w-[14px] h-[14px] rounded-full object-contain bg-[#111] border border-[#2a2a2a]" onerror="this.style.display='none'">
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[12px] sm:text-[13px] font-bold uppercase tracking-wide truncate">${p.player_name}</div>
          <div class="text-[10px] sm:text-[11px] text-[#555]">${p.team_name}</div>
        </div>
        <div class="flex gap-2 shrink-0 text-center">
          <div class="min-w-[30px]">
            <div class="font-['Oswald'] text-[20px] text-[#2ECC52] font-bold leading-none">${p.goals > 0 ? p.goals : '-'}</div>
            <div class="text-[9px] text-[#444] uppercase">G</div>
          </div>
          <div class="min-w-[30px]">
            <div class="font-['Oswald'] text-[20px] text-[#F4A01C] font-bold leading-none">${cardData.yellow > 0 ? cardData.yellow : '-'}</div>
            <div class="text-[9px] text-[#444] uppercase">Y</div>
          </div>
          <div class="min-w-[30px]">
            <div class="font-['Oswald'] text-[20px] text-[#E63946] font-bold leading-none">${cardData.red > 0 ? cardData.red : '-'}</div>
            <div class="text-[9px] text-[#444] uppercase">R</div>
          </div>
        </div>
      </div>`;
  });
}


function renderCards(cards, sortBy) {
  let container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  if (!cards.length) {
    container.innerHTML = `<div class="text-center text-[#666] py-8 text-[13px]">No cards found</div>`;
    return;
  }
  let sorted = [...cards].sort((a, b) =>
    sortBy === 'red'
      ? (b.red - a.red)    || (b.yellow - a.yellow)
      : (b.yellow - a.yellow) || (b.red - a.red)
  );
  sorted.slice(0, 10).forEach((card, i) => {
    let rankColor = i === 0 ? 'text-[#F4A01C]' : i === 1 ? 'text-[#C0C0C0]' : i === 2 ? 'text-[#CD7F32]' : 'text-[#555]';
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=161616&color=666&size=40`;
    container.innerHTML += `
      <div class="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-[#242424]/80 hover:bg-white/[0.015] transition-colors">
        <div class="font-['Oswald'] text-[15px] font-semibold w-5 shrink-0 text-center ${rankColor}">${i + 1}</div>
        <div class="relative shrink-0">
          <img src="" class="w-9 h-9 rounded-full object-cover bg-[#222] border border-[#333]" onerror="this.src='${avatarUrl}'">
          <img src="${card.logo || ''}" class="absolute -bottom-1 -right-1 w-[14px] h-[14px] rounded-full object-contain bg-[#111] border border-[#2a2a2a]" onerror="this.style.display='none'">
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[12px] sm:text-[13px] font-bold uppercase tracking-wide truncate">${card.name}</div>
          <div class="text-[10px] sm:text-[11px] text-[#555]">${card.team}</div>
        </div>
        <div class="flex gap-2 shrink-0 text-center">
          <div class="min-w-[36px]">
            <div class="font-['Oswald'] text-[20px] text-[#F4A01C] font-bold leading-none">${card.yellow > 0 ? card.yellow : '-'}</div>
            <div class="text-[9px] text-[#444] uppercase">Y</div>
          </div>
          <div class="min-w-[36px]">
            <div class="font-['Oswald'] text-[20px] text-[#E63946] font-bold leading-none">${card.red > 0 ? card.red : '-'}</div>
            <div class="text-[9px] text-[#444] uppercase">R</div>
          </div>
        </div>
      </div>`;
  });
}


function setSortMode(mode) {
  currentSort = mode;
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.remove('bg-[rgba(46,204,82,0.1)]', 'border-[#2ECC52]', 'text-[#2ECC52]');
    btn.classList.add('bg-[#161616]', 'border-[#242424]', 'text-[#666]');
  });
  let activeBtn = document.getElementById(mode === 'goals' ? 'sortGoals' : mode === 'yellow' ? 'sortYellow' : 'sortRed');
  activeBtn.classList.remove('bg-[#161616]', 'border-[#242424]', 'text-[#666]');
  activeBtn.classList.add('bg-[rgba(46,204,82,0.1)]', 'border-[#2ECC52]', 'text-[#2ECC52]');
  if (mode === 'goals') {
    renderScorers([...allScorers].sort((a, b) => parseInt(b.goals) - parseInt(a.goals)));
  } else {
    renderCards(Object.values(cardsMap).filter(p => p.yellow > 0 || p.red > 0), mode);
  }
}