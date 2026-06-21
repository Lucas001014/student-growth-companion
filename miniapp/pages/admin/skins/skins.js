const util = require('../../../utils/util.js');
Page({
  data: {
    tab: 'skins',
    skins: [
      { id: 1, name: '星空战士', rarity: 'ssr', imageUrl: 'https://via.placeholder.com/300x300/667eea/ffffff?text=SSR' },
      { id: 2, name: '海洋之心', rarity: 'sr', imageUrl: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=SR' },
      { id: 3, name: '森林守卫', rarity: 'r', imageUrl: 'https://via.placeholder.com/300x300/22c55e/ffffff?text=R' },
      { id: 4, name: '火焰骑士', rarity: 'n', imageUrl: 'https://via.placeholder.com/300x300/f56c6c/ffffff?text=N' }
    ],
    titles: [
      { id: 1, name: '学习之星', icon: '⭐' },
      { id: 2, name: '进步最快', icon: '🚀' },
      { id: 3, name: '劳动能手', icon: '🔨' },
      { id: 4, name: '体育健将', icon: '🏃' }
    ],
    badges: [
      { id: 1, name: '班长', icon: '👑' },
      { id: 2, name: '学习委员', icon: '📖' },
      { id: 3, name: '文艺委员', icon: '🎨' }
    ]
  },
  switchTab(e) { this.setData({ tab: e.currentTarget.dataset.tab }); },
  edit(e) { util.showToast('编辑 #' + e.currentTarget.dataset.id); },
  addItem() { util.showToast('新增项目'); }
});
