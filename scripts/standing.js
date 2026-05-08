let apikey = '40c206c0f92ef578789e6370e7e38ad799bcf560c5cf3b79330302c12d7a5e3a';

function fetchStandings(leagueId) {
  let apiUrl = `https://apiv2.allsportsapi.com/football/?met=Standings&leagueId=${leagueId}&APIkey=${apikey}`;
  document.getElementById('standingContainer').innerHTML = `
    <div class="text-center text-[#666] py-16">Loading...</div>`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      let teams = data.result.total;
      let container = document.getElementById('standingContainer');
      container.innerHTML = '';

      teams.forEach(team => {
        let pts = parseInt(team.standing_PTS);
        let ptsColor = pts >= 60 ? 'text-[#F4A01C]' : 'text-[#2ECC52]';
        container.innerHTML += `
          <div class="grid grid-cols-[36px_1fr_36px_32px_32px_32px_36px_36px_36px_52px]
                      sm:grid-cols-[44px_1fr_44px_40px_40px_40px_44px_44px_44px_64px]
                      px-3 md:px-6 py-3 border-b border-[#242424] items-center text-[13px] md:text-[14px]
                      hover:bg-white/[0.015] cursor-pointer transition-colors min-w-[500px]">
            <div class="font-['Oswald'] text-[15px] md:text-[17px] font-semibold text-[#666]">${team.standing_place}</div>
            <div class="flex items-center gap-2 font-bold uppercase tracking-wide text-[11px] md:text-[13px]">
              <img src="${team.team_logo}" class="w-5 h-5 md:w-6 md:h-6 object-contain" onerror="this.style.display='none'">
              <span class="truncate max-w-[100px] md:max-w-none">${team.standing_team}</span>
            </div>
            <div class="text-center text-[#666] text-[12px]">${team.standing_P}</div>
            <div class="text-center text-[#666] text-[12px]">${team.standing_W}</div>
            <div class="text-center text-[#666] text-[12px]">${team.standing_D}</div>
            <div class="text-center text-[#666] text-[12px]">${team.standing_L}</div>
            <div class="text-center text-[#666] text-[12px] col-gf">${team.standing_F}</div>
            <div class="text-center text-[#666] text-[12px] col-ga">${team.standing_A}</div>
            <div class="text-center text-[#666] text-[12px] col-gd">${team.standing_GD}</div>
            <div class="text-center font-['Oswald'] text-[18px] md:text-[20px] ${ptsColor} font-bold">${team.standing_PTS}</div>
          </div>`;
      });
    });
}

function switchTab(el, leagueId) {
  document.querySelectorAll('.tab-btn').forEach(t => {
    t.classList.remove('active-tab', 'bg-[rgba(46,204,82,0.1)]', 'border-[#2ECC52]', 'text-[#2ECC52]');
    t.classList.add('bg-[#161616]', 'border-[#242424]', 'text-[#666]');
  });
  el.classList.add('active-tab', 'bg-[rgba(46,204,82,0.1)]', 'border-[#2ECC52]', 'text-[#2ECC52]');
  el.classList.remove('bg-[#161616]', 'border-[#242424]', 'text-[#666]');
  fetchStandings(leagueId);
}

fetchStandings(233);