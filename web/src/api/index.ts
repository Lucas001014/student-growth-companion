import axios from 'axios';

// ============================================================
// API 层：请求 → MOCK 演示模式
// 如果后端不可用（404/网络错误/超时），自动返回内置模拟数据
// ============================================================

const MOCK: Record<string, (d: any) => any> = {
  '/auth/login': (d: any) => {
    const role = d?.role || 'student';
    const base = { code: 200, message: 'ok', data: { token: '', user: null } };
    if (role === 'student') {
      base.data = { token: 'mock-student', user: { id: 1, role: 'student', name: '张小明', studentNo: '2024001', studentId: '2024001', identity: '学习委员', points: 380, className: '三年级(1)班', skinCount: 5, titleCount: 3, weekPoints: 42, rank: 1 } };
    } else if (role === 'teacher') {
      base.data = { token: 'mock-teacher', user: { id: 99, role: 'teacher', name: '李老师', phone: '13800000000' } };
    } else {
      base.data = { token: 'mock-admin', user: { id: 100, role: 'admin', name: '系统管理员', phone: '13900000000' } };
    }
    return base;
  },
  '/auth/mode/switch': () => ({ code: 200, message: 'ok', data: { mode: 'parent' } }),
  '/class/students': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, studentNo: '2024001', name: '张小明', points: 380, identity: '学习委员' },
      { id: 2, studentNo: '2024002', name: '李思思', points: 320, identity: '班长' },
      { id: 3, studentNo: '2024003', name: '王大力', points: 260, identity: '体育健将' },
      { id: 4, studentNo: '2024004', name: '赵小雨', points: 420, identity: '' },
      { id: 5, studentNo: '2024005', name: '钱朵朵', points: 180, identity: '' }
    ]
  }),
  '/honor/student': () => ({
    code: 200, message: 'ok',
    data: {
      points: 380,
      currentTitle: '学习之星',
      skins: [
        { id: 1, name: '森林守护者', rarity: 'SSR', cover: '', description: '神秘森林传说' },
        { id: 2, name: '星空探险家', rarity: 'SR', cover: '', description: '探索浩瀚宇宙' },
        { id: 3, name: '海洋之心', rarity: 'R', cover: '', description: '深海蓝色战士' },
        { id: 4, name: '学习达人', rarity: 'N', cover: '', description: '勤奋学习的奖励' }
      ],
      activities: [
        { time: '今天 09:30', text: '获得 +10 积分', detail: '课堂表现优秀', type: 'success' },
        { time: '昨天 15:20', text: '获得「学习之星」称号', detail: '新称号解锁', type: 'warning' },
        { time: '3 天前', text: '抽取了一次盲盒', detail: '获得 SSR 皮肤', type: 'danger' },
        { time: '5 天前', text: '获得 +5 积分', detail: '作业完成及时', type: 'primary' }
      ]
    }
  }),
  '/honor/points': () => ({ code: 200, message: 'ok', data: { success: true } }),
  '/honor/skin/grant': () => ({ code: 200, message: 'ok', data: { success: true } }),
  '/honor/title/grant': () => ({ code: 200, message: 'ok', data: { success: true } }),
  '/request/submit': () => ({ code: 200, message: 'ok', data: { success: true } }),
  '/request/list': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, type: 'skin', status: 'pending', studentName: '张小明', targetName: '星空战士', createAt: '2 分钟前' },
      { id: 2, type: 'title', status: 'pending', studentName: '李思思', targetName: '学习之星', createAt: '15 分钟前' },
      { id: 3, type: 'homework', status: 'pending', studentName: '王大力', targetName: '数学作业', createAt: '1 小时前' }
    ]
  }),
  '/homework/public': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, title: '数学作业 - 分数运算', subject: '数学', studentName: '张小明', cover: '', description: '认真完成，步骤清晰', time: '今天 10:30' },
      { id: 2, title: '语文作文 - 我的梦想', subject: '语文', studentName: '李思思', cover: '', description: '一篇关于梦想的作文', time: '昨天 15:20' }
    ]
  }),
  '/blindbox/list': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, name: '初级盲盒', cost: 100, count: 3, desc: '随机赠送 1 件奖励' },
      { id: 2, name: '高级盲盒', cost: 200, count: 5, desc: 'SSR 稀有度概率提升' },
      { id: 3, name: '至尊盲盒', cost: 500, count: 10, desc: '高概率出 SR+ 皮肤' }
    ]
  }),
  '/blindbox/draw': () => ({
    code: 200, message: 'ok',
    data: { reward: { id: 1, name: '星空战士', rarity: 'SSR', cover: '' }, type: 'skin' }
  }),
  '/ranking/class': () => ({
    code: 200, message: 'ok',
    data: [
      { rank: 1, name: '赵小雨', points: 420, identity: '学习之星' },
      { rank: 2, name: '张小明', points: 380, identity: '学习委员' },
      { rank: 3, name: '李思思', points: 320, identity: '班长' },
      { rank: 4, name: '王大力', points: 260, identity: '体育健将' },
      { rank: 5, name: '钱朵朵', points: 180, identity: '' }
    ]
  }),
  '/admin/dashboard': () => ({ code: 200, message: 'ok', data: { students: 320, teachers: 15, classes: 8, boxes: 1200 } }),
  '/admin/skins': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, name: '星空战士', rarity: 'SSR', cover: '' },
      { id: 2, name: '海洋之心', rarity: 'SR', cover: '' },
      { id: 3, name: '森林守卫', rarity: 'R', cover: '' },
      { id: 4, name: '火焰骑士', rarity: 'N', cover: '' },
      { id: 5, name: '冰雪女王', rarity: 'SSR', cover: '' }
    ]
  }),
  '/admin/titles': () => ({
    code: 200, message: 'ok',
    data: [
      { id: 1, name: '学习之星', icon: '⭐', category: 'study', desc: '连续 3 次测试排名前 5' },
      { id: 2, name: '进步奖', icon: '📈', category: 'behavior', desc: '近 7 天积分增长超过 100' },
      { id: 3, name: '劳动能手', icon: '🛠️', category: 'behavior', desc: '积极参与班级劳动' }
    ]
  }),
  '/admin/identity-badges': () => ({
    code: 200, message: 'ok',
    data: [{ id: 1, name: '班长', icon: '👑' }, { id: 2, name: '学习委员', icon: '📖' }, { id: 3, name: '劳动委员', icon: '🔨' }]
  }),
  '/admin/config': () => ({ code: 200, message: 'ok', data: { points: 100, blindboxCost: 50, weeklyLimit: 500 } }),
  '/admin/teachers': () => ({
    code: 200, message: 'ok',
    data: [{ id: 1, name: '李老师', phone: '138****0001' }, { id: 2, name: '王老师', phone: '138****0002' }]
  }),
  '/admin/classes': () => ({ code: 200, message: 'ok', data: [{ id: 1, name: '三年级(1)班', students: 45 }, { id: 2, name: '三年级(2)班', students: 42 }] }),
  '/class/classes': () => ({ code: 200, message: 'ok', data: [{ id: 1, name: '三年级(1)班', students: 45 }, { id: 2, name: '三年级(2)班', students: 42 }] })
};

const instance = axios.create({ baseURL: '/api', timeout: 8000 });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  return config;
});

instance.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === 'object' && 'code' in res.data) {
      if (res.data.code !== 200) return Promise.reject(new Error(res.data.message || '请求失败'));
      return res.data;
    }
    return res.data;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      if (typeof window !== 'undefined' && window.location) window.location.hash = '#/login';
      return Promise.reject(err);
    }
    const rawUrl: string = (err.config?.url || '').replace(/^\/api/, '') || '';
    let body: any = {};
    try {
      if (err.config?.data && typeof err.config.data === 'string') body = JSON.parse(err.config.data);
      else if (err.config?.data) body = err.config.data;
    } catch (e) { body = {}; }
    for (const k of Object.keys(MOCK)) {
      if (rawUrl.indexOf(k) >= 0) {
        return Promise.resolve(MOCK[k](body));
      }
    }
    return Promise.resolve({ code: 200, message: 'mock-fallback', data: {} });
  }
);

export default instance;
