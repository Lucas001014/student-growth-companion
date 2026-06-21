// 班级荣誉皮肤系统 - 小程序 API 层（纯演示模式，不依赖后端）
// 如需接入真实后端，请把下面 MOCK_MODE 改为 false 并填写 BASE

var MOCK_MODE = true; // 演示模式开关：true = 纯前端模拟，不发任何网络请求
var BASE = '';        // 示例：'https://your-domain.com/api'

var MOCK_STUDENTS = [
  { id: 1, studentNo: '2024001', name: '张小明', points: 380, identity: '学习委员' },
  { id: 2, studentNo: '2024002', name: '李思思', points: 320, identity: '班长' },
  { id: 3, studentNo: '2024003', name: '王大力', points: 260, identity: '体育健将' },
  { id: 4, studentNo: '2024004', name: '赵小雨', points: 420, identity: '' },
  { id: 5, studentNo: '2024005', name: '钱朵朵', points: 180, identity: '' }
];

var MOCK_SKINS = [
  { id: 1, name: '星空战士', rarity: 'SSR', imageUrl: 'https://picsum.photos/300/300?random=1' },
  { id: 2, name: '海洋之心', rarity: 'SR', imageUrl: 'https://picsum.photos/300/300?random=2' },
  { id: 3, name: '森林守卫', rarity: 'R', imageUrl: 'https://picsum.photos/300/300?random=3' },
  { id: 4, name: '火焰骑士', rarity: 'N', imageUrl: 'https://picsum.photos/300/300?random=4' },
  { id: 5, name: '冰雪女王', rarity: 'SSR', imageUrl: 'https://picsum.photos/300/300?random=5' }
];

var MOCK_TITLES = [
  { id: 1, name: '学习之星', icon: '⭐', category: 'study', desc: '连续 3 次测试排名前 5' },
  { id: 2, name: '进步奖', icon: '📈', category: 'behavior', desc: '近 7 天积分增长超过 100' },
  { id: 3, name: '劳动能手', icon: '🛠️', category: 'behavior', desc: '积极参与班级劳动' },
  { id: 4, name: '荣誉勋章', icon: '🎖️', category: 'special', desc: '最高荣誉' }
];

var MOCK_BOXES = [
  { id: 1, name: '初级盲盒', cost: 100, count: 3, desc: '随机赠送 1 件奖励' },
  { id: 2, name: '高级盲盒', cost: 200, count: 5, desc: 'SSR 稀有度概率提升' },
  { id: 3, name: '至尊盲盒', cost: 500, count: 10, desc: '高概率出 SR+ 皮肤' }
];

var MOCK_RANKING = [
  { rank: 1, name: '赵小雨', points: 420, identity: '学习之星' },
  { rank: 2, name: '张小明', points: 380, identity: '学习委员' },
  { rank: 3, name: '李思思', points: 320, identity: '班长' },
  { rank: 4, name: '王大力', points: 260, identity: '体育健将' },
  { rank: 5, name: '钱朵朵', points: 180, identity: '' }
];

var MOCK_REQUESTS = [
  { id: 1, type: 'skin', status: 'pending', studentName: '张小明', targetName: '星空战士', createAt: '2 分钟前' },
  { id: 2, type: 'title', status: 'pending', studentName: '李思思', targetName: '学习之星', createAt: '15 分钟前' },
  { id: 3, type: 'homework', status: 'pending', studentName: '王大力', targetName: '数学作业', createAt: '1 小时前' }
];

function ok(data) { return { code: 200, message: 'ok', data: data }; }

function buildMock(url, data) {
  if (url.indexOf('/auth/login') >= 0) {
    var role = (data && data.role) || 'student';
    if (role === 'student') {
      return ok({ token: 'mock-student', user: { id: 1, role: 'student', name: '张小明', studentNo: '2024001', identity: '学习委员', points: 380 } });
    }
    if (role === 'teacher') {
      return ok({ token: 'mock-teacher', user: { id: 99, role: 'teacher', name: '李老师', phone: '13800000000' } });
    }
    return ok({ token: 'mock-admin', user: { id: 100, role: 'admin', name: '系统管理员', phone: '13900000000' } });
  }
  if (url.indexOf('/auth/mode/switch') >= 0) return ok({ mode: 'parent' });
  if (url.indexOf('/class/students') >= 0) return ok(MOCK_STUDENTS);
  if (url.indexOf('/honor') >= 0) return ok({ success: true });
  if (url.indexOf('/request') >= 0) return ok(MOCK_REQUESTS);
  if (url.indexOf('/homework') >= 0) return ok([]);
  if (url.indexOf('/blindbox/list') >= 0) return ok(MOCK_BOXES);
  if (url.indexOf('/blindbox/draw') >= 0) {
    var r = Math.floor(Math.random() * MOCK_SKINS.length);
    return ok({ reward: MOCK_SKINS[r], type: 'skin' });
  }
  if (url.indexOf('/ranking') >= 0) return ok(MOCK_RANKING);
  if (url.indexOf('/admin/dashboard') >= 0) return ok({ students: 320, teachers: 15, classes: 8, boxes: 1200 });
  if (url.indexOf('/admin/skins') >= 0) return ok(MOCK_SKINS);
  if (url.indexOf('/admin/titles') >= 0) return ok(MOCK_TITLES);
  if (url.indexOf('/admin/identity') >= 0) return ok([{ id: 1, name: '班长', icon: '👑' }, { id: 2, name: '学习委员', icon: '📖' }, { id: 3, name: '劳动委员', icon: '🔨' }]);
  if (url.indexOf('/admin/config') >= 0) return ok({ points: 100, blindboxCost: 50, weeklyLimit: 500 });
  if (url.indexOf('/admin/teachers') >= 0) return ok([{ id: 1, name: '李老师', phone: '138****0001' }, { id: 2, name: '王老师', phone: '138****0002' }]);
  if (url.indexOf('/admin/classes') >= 0) return ok([{ id: 1, name: '三年级(1)班', students: 45 }, { id: 2, name: '三年级(2)班', students: 42 }]);
  if (url.indexOf('/class/classes') >= 0) return ok([{ id: 1, name: '三年级(1)班', students: 45 }, { id: 2, name: '三年级(2)班', students: 42 }]);
  return ok({});
}

function request(url, method, data) {
  if (MOCK_MODE) {
    // 纯演示模式：直接返回 Promise，不触任何 wx API
    return Promise.resolve(buildMock(url, data || {}));
  }
  // 真实后端模式
  return new Promise(function (resolve, reject) {
    try {
      var token = '';
      try { token = wx.getStorageSync('token') || ''; } catch (e) { /* ignore */ }
      wx.request({
        url: BASE + url,
        method: method || 'GET',
        data: data || {},
        header: { 'content-type': 'application/json', Authorization: token ? 'Bearer ' + token : '' },
        timeout: 8000,
        success: function (res) {
          if (res.statusCode === 401) { try { wx.clearStorageSync(); } catch (e) {} wx.reLaunch({ url: '/pages/login/login' }); return; }
          if (res.data && res.data.code === 200) resolve(res.data);
          else reject(res.data || { message: '请求失败' });
        },
        fail: function () { reject({ message: '网络连接失败' }); }
      });
    } catch (e) { reject({ message: '运行异常' }); }
  });
}

module.exports = {
  MOCK_MODE: MOCK_MODE,
  request: request,
  login: function (data) { return request('/auth/login', 'POST', data); },
  switchMode: function (data) { return request('/auth/mode/switch', 'POST', data); },
  getStudents: function (params) { return request('/class/students', 'GET', params); },
  createStudent: function (data) { return request('/class/students', 'POST', data); },
  grantPoints: function (data) { return request('/honor/points', 'POST', data); },
  grantSkin: function (data) { return request('/honor/skin/grant', 'POST', data); },
  grantTitle: function (data) { return request('/honor/title/grant', 'POST', data); },
  submitRequest: function (data) { return request('/request/submit', 'POST', data); },
  listRequests: function (params) { return request('/request/list', 'GET', params); },
  approveRequest: function (id, data) { return request('/request/' + id + '/approve', 'POST', data); },
  confirmHomework: function (data) { return request('/homework/confirm', 'POST', data); },
  uploadHomework: function (data) { return request('/homework/upload', 'POST', data); },
  setVisibility: function (id, data) { return request('/homework/upload/' + id + '/visibility', 'PUT', data); },
  getPublicHomework: function (params) { return request('/homework/public', 'GET', params); },
  listBlindBoxes: function (params) { return request('/blindbox/list', 'GET', params); },
  createBlindBox: function (data) { return request('/blindbox/create', 'POST', data); },
  drawBlindBox: function (data) { return request('/blindbox/draw', 'POST', data); },
  getRanking: function (params) { return request('/ranking/class', 'GET', params); },
  getDashboard: function () { return request('/admin/dashboard', 'GET'); },
  createTeacher: function (data) { return request('/admin/teachers', 'POST', data); },
  listTeachers: function () { return request('/admin/teachers', 'GET'); },
  listClasses: function () { return request('/admin/classes', 'GET'); },
  listSkins: function () { return request('/admin/skins', 'GET'); },
  listTitles: function () { return request('/admin/titles', 'GET'); },
  listBadges: function () { return request('/admin/identity-badges', 'GET'); },
  getConfig: function () { return request('/admin/config', 'GET'); },
  updateConfig: function (data) { return request('/admin/config', 'PUT', data); }
};
