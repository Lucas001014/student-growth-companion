const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    filter: 'all',
    skinList: [
      { id: 1, name: '星空战士', rarity: 'SSR', imageUrl: 'https://via.placeholder.com/300x300/667eea/ffffff?text=SSR', owned: true },
      { id: 2, name: '海洋之心', rarity: 'SR', imageUrl: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=SR', owned: true },
      { id: 3, name: '森林守卫', rarity: 'R', imageUrl: 'https://via.placeholder.com/300x300/22c55e/ffffff?text=R', owned: true },
      { id: 4, name: '火焰骑士', rarity: 'N', imageUrl: 'https://via.placeholder.com/300x300/f56c6c/ffffff?text=N', owned: false },
      { id: 5, name: '冰雪女王', rarity: 'SSR', imageUrl: 'https://via.placeholder.com/300x300/a855f3/ffffff?text=SSR', owned: false },
      { id: 6, name: '雷霆战神', rarity: 'SR', imageUrl: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=SR', owned: false }
    ]
  },
  switchFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.filter });
  },
  showDetail(e) {
    const id = e.currentTarget.dataset.id;
    util.showToast('皮肤详情功能开发中');
  }
});
