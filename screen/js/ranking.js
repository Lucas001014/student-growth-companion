// 排行榜渲染
function renderRanking(list) {
  const container = document.getElementById('rankingList');
  if (!container || !list || !list.length) return;
  container.innerHTML = '';
  const max = Math.min(list.length, 10);
  let html = '';
  for (let i = 0; i < max; i++) {
    const item = list[i];
    const rank = item.rank || (i + 1);
    const rankClass = rank <= 3 ? 'rank-item rank-' + rank : 'rank-item';
    const badges = (item.badges && item.badges.length
      ? item.badges.map(b => `<span class="rank-badge">${b}</span>`).join('')
      : '<span class="rank-badge">学生</span>');
    html += `
      <div class="${rankClass}">
        <div class="rank-num">${rank}</div>
        <div class="rank-avatar">${item.avatar || '👤'}</div>
        <div class="rank-info">
          <div class="rank-name">${item.name || item.studentName || '同学'}</div>
          <div class="rank-badges">${badges}</div>
        </div>
        <div class="rank-points">${item.points || 0}<small>分</small></div>
      </div>`;
  }
  container.innerHTML = html;
}
