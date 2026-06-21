const api = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');
Page({
  data: {
    stats: { totalPoints: 120, skinCount: 3, titleCount: 2, rank: 5 },
    titles: [
      { id: 1, name: '学习之星', icon: '⭐', time: '2025-05-20', rarity: 'SR' },
      { id: 2, name: '进步最快', icon: '🚀', time: '2025-05-15', rarity: 'R' }
    ],
    pointsLog: [
      { id: 1, reason: '课堂表现优秀', time: '今天 14:30', change: 10 },
      { id: 2, reason: '作业全对', time: '昨天 18:00', change: 5 },
      { id: 3, reason: '测验扣分', time: '2天前', change: -3 }
    ],
    badges: [
      { id: 1, name: '学习委员', icon: '📖', unlocked: true },
      { id: 2, name: '体育健将', icon: '🏃', unlocked: true },
      { id: 3, name: '艺术天才', icon: '🎨', unlocked: false },
      { id: 4, name: '劳动能手', icon: '🔨', unlocked: false }
    ]
  },
  onShow() {
    const user = auth.getUser() || {};
    this.setData({ user });
  }
});
