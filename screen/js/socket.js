// 时钟
function updateClock() {
  const now = new Date();
  const pad = n => (n < 10 ? '0' + n : '' + n);
  const txt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('clock').textContent = txt;
}
setInterval(updateClock, 1000);
updateClock();

// 从 URL 参数读取班级信息 / 设备码
const params = new URLSearchParams(window.location.search);
const classId = params.get('classId') || '1';
const deviceCode = params.get('deviceCode') || 'SCREEN-001';
document.getElementById('className').textContent = '三年级二班 · ' + deviceCode;

// Socket.IO 连接配置 - 尝试连接后端
function getSocketUrl() {
  return window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port || '3000');
}

let socket = null;
try {
  if (typeof io !== 'undefined') {
    socket = io(getSocketUrl(), {
      query: { classId, deviceCode },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000
    });
    socket.on('connect', () => {
      document.getElementById('socketStatus').textContent = '实时连接中';
      console.log('[Screen] Socket connected:', socket.id);
    });
    socket.on('disconnect', () => {
      document.getElementById('socketStatus').textContent = '连接已断开，重试中...';
    });
    // 实时事件
    socket.on('honor_event', (evt) => {
      addHonorEvent(evt);
      showToast('🎖️ 荣誉授予', `${evt.studentName} 获得 ${evt.title}`);
    });
    socket.on('blindbox_event', (evt) => {
      addBlindboxEvent(evt);
      showToast('🎁 盲盒开启', `${evt.studentName} 抽中了 ${evt.reward}`);
    });
    socket.on('ranking_update', (data) => {
      renderRanking(data.list || data);
    });
    socket.on('points_update', (data) => {
      if (data.studentName) addHonorEvent({ studentName: data.studentName, title: `积分 +${data.amount}`, desc: data.category || '', time: formatNow() });
    });
    socket.on('announcement', (data) => {
      renderAnnouncement(data);
    });
  } else {
    document.getElementById('socketStatus').textContent = '离线演示模式';
  }
} catch (err) {
  console.warn('[Screen] Socket连接失败，降级演示模式');
  document.getElementById('socketStatus').textContent = '离线演示模式';
}

function formatNow() {
  const now = new Date();
  const pad = n => (n < 10 ? '0' + n : n);
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// 事件展示 - 暴露到全局供其他文件使用
window.screenState = { classId, deviceCode, socket };

// Toast 通知
let toastTimer = null;
function showToast(title, desc) {
  const toast = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastDesc').textContent = desc;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 5000);
}

// 默认演示数据 - 若无后端连接则定时刷新
window.startDemoMode = function() {
  // 基础排行榜数据
  const demoRanking = [
    { rank: 1, name: '李明轩', avatar: '👦', points: 2850, badges: ['班长', '学习之星'] },
    { rank: 2, name: '王思涵', avatar: '👧', points: 2620, badges: ['数学课代表'] },
    { rank: 3, name: '张子豪', avatar: '👦', points: 2480, badges: ['体育委员'] },
    { rank: 4, name: '赵雨桐', avatar: '👧', points: 2320, badges: ['语文课代表'] },
    { rank: 5, name: '陈俊熙', avatar: '👦', points: 2180, badges: [] },
    { rank: 6, name: '刘若曦', avatar: '👧', points: 2050, badges: ['文艺委员'] },
    { rank: 7, name: '杨梓涵', avatar: '👧', points: 1920, badges: [] },
    { rank: 8, name: '周昊阳', avatar: '👦', points: 1810, badges: [] },
    { rank: 9, name: '吴欣怡', avatar: '👧', points: 1720, badges: [] },
    { rank: 10, name: '徐梓豪', avatar: '👦', points: 1650, badges: [] }
  ];
  renderRanking(demoRanking);
  window.__demoRanking = demoRanking;

  // 皮肤墙
  const demoSkins = [
    { name: '星空战士', rarity: 'SSR', icon: '⭐' },
    { name: '海洋之心', rarity: 'SR', icon: '🌊' },
    { name: '森林守卫', rarity: 'SR', icon: '🌲' },
    { name: '火焰骑士', rarity: 'R', icon: '🔥' },
    { name: '冰雪女王', rarity: 'SSR', icon: '❄️' },
    { name: '雷电使者', rarity: 'SR', icon: '⚡' },
    { name: '沙漠行者', rarity: 'R', icon: '🏜️' },
    { name: '忍者小猫', rarity: 'R', icon: '🐱' },
    { name: '宇宙探索', rarity: 'N', icon: '🚀' }
  ];
  renderSkinWall(demoSkins);

  // 荣誉事件
  const demoEvents = [
    { studentName: '李明轩', title: '积分 +10', desc: '课堂表现优秀', time: '09:15' },
    { studentName: '王思涵', title: '授予皮肤：星空战士', desc: '月度积分王', time: '09:02' },
    { studentName: '张子豪', title: '积分 +20', desc: '运动会获奖', time: '昨日' },
    { studentName: '赵雨桐', title: '授予称号：学习之星', desc: '连续三周满分', time: '昨日' }
  ];
  demoEvents.forEach(e => addHonorEvent(e));

  // 盲盒动态
  const demoBox = [
    { icon: '🎁', name: '陈俊熙', reward: '抽中皮肤·海洋之心', time: '09:30' },
    { icon: '🎁', name: '刘若曦', reward: '获得积分 +50', time: '09:18' },
    { icon: '🎁', name: '杨梓涵', reward: '抽中称号·努力少年', time: '09:05' },
    { icon: '🎁', name: '周昊阳', reward: '获得积分 +30', time: '昨日' }
  ];
  demoBox.forEach(b => addBlindboxEvent(b));

  // 底部统计
  document.getElementById('totalStudents').textContent = '45';
  document.getElementById('totalPoints').textContent = '18,520';
  document.getElementById('totalSkins').textContent = '12';
  document.getElementById('totalTitles').textContent = '8';
  document.getElementById('totalDraws').textContent = '156';

  // 定时模拟新事件
  setInterval(() => {
    const names = ['李明轩', '王思涵', '张子豪', '赵雨桐', '陈俊熙', '刘若曦'];
    const titles = ['积分 +10', '积分 +5', '授予皮肤·森林守卫', '授予称号·努力少年'];
    const n = names[Math.floor(Math.random() * names.length)];
    const t = titles[Math.floor(Math.random() * titles.length)];
    const evt = { studentName: n, title: t, desc: '实时奖励', time: formatNow() };
    addHonorEvent(evt);
    showToast('🎖️ 实时荣誉', `${n} ${t}`);
  }, 15000);
};

window.startDemoMode();
