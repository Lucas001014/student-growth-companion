const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    box: {
      name: '神秘宝箱',
      cost: 20,
      pool: [
        { id: 1, name: '星空战士', rarity: 'SSR' },
        { id: 2, name: '海洋之心', rarity: 'SR' },
        { id: 3, name: '森林守卫', rarity: 'R' },
        { id: 4, name: '火焰骑士', rarity: 'N' }
      ]
    },
    result: null,
    history: [
      { id: 1, name: '森林守卫', rarity: 'R', time: '2025-05-20 14:30' },
      { id: 2, name: '海洋之心', rarity: 'SR', time: '2025-05-18 10:12' }
    ]
  },
  draw() {
    util.showLoading('开启中...');
    const pool = this.data.box.pool;
    const rand = Math.random();
    let idx;
    if (rand < 0.1) idx = 0;
    else if (rand < 0.35) idx = 1;
    else if (rand < 0.7) idx = 2;
    else idx = 3;
    setTimeout(() => {
      util.hideLoading();
      const item = pool[idx];
      this.setData({ result: item });
      util.showToast('恭喜获得 ' + item.name, 'success');
    }, 800);
  }
});
