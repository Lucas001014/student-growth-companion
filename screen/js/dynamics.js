// 荣誉事件时间线
function addHonorEvent(evt) {
  const container = document.getElementById('honorTimeline');
  if (!container) return;
  const item = document.createElement('div');
  item.className = 'honor-event highlight';
  item.innerHTML = `
    <div class="honor-title"><span class="highlight-text">${evt.studentName}</span> · ${evt.title}</div>
    <div class="honor-desc">${evt.desc || ''}</div>
    <div class="honor-time">${evt.time || ''}</div>
  `;
  container.insertBefore(item, container.firstChild);
  // 限制最多显示 8 条
  while (container.children.length > 8) {
    container.removeChild(container.lastChild);
  }
  // 1秒后移除高亮
  setTimeout(() => item.classList.remove('highlight'), 2000);
}

// 盲盒动态
function addBlindboxEvent(evt) {
  const container = document.getElementById('blindboxList');
  if (!container) return;
  const item = document.createElement('div');
  item.className = 'blindbox-item';
  item.innerHTML = `
    <div class="blindbox-icon">${evt.icon || '🎁'}</div>
    <div class="blindbox-info">
      <div class="name">${evt.name || evt.studentName || '同学'}</div>
      <div class="reward">${evt.reward || '抽中了神秘奖品'}</div>
    </div>
    <div class="blindbox-time">${evt.time || ''}</div>
  `;
  container.insertBefore(item, container.firstChild);
  while (container.children.length > 5) {
    container.removeChild(container.lastChild);
  }
}

// 皮肤墙
function renderSkinWall(skins) {
  const container = document.getElementById('skinWall');
  if (!container) return;
  container.innerHTML = '';
  skins.forEach(s => {
    const imgHtml = s.imageUrl
      ? `<img src="${s.imageUrl}" style="width:100%;height:100%;object-fit:cover;"/>`
      : (s.icon || '🎨');
    const div = document.createElement('div');
    div.className = 'skin-card rarity-' + (s.rarity || 'N');
    div.innerHTML = `
      <div class="skin-image">${imgHtml}</div>
      <div class="skin-name">${s.name}</div>
      <div class="skin-rarity ${s.rarity || 'N'}">${s.rarity || 'N'}</div>
    `;
    container.appendChild(div);
  });
}

// 公告渲染
function renderAnnouncement(data) {
  if (data.title) document.getElementById('annoTitle').textContent = data.title;
  if (data.content) document.getElementById('annoContent').textContent = data.content;
  if (data.author) document.getElementById('annoAuthor').textContent = data.author;
  if (data.time) document.getElementById('annoTime').textContent = data.time;
}
