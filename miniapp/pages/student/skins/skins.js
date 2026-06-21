function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="240" rx="20" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="40" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    filter: 'all',
    skinList: [
      { id: 1, name: '星空战士', rarity: 'SSR', imageUrl: ph('6366f1', '星空'), owned: true },
      { id: 2, name: '海洋之心', rarity: 'SR', imageUrl: ph('0ea5e9', '海洋'), owned: true },
      { id: 3, name: '森林守卫', rarity: 'R', imageUrl: ph('22c55e', '森林'), owned: true },
      { id: 4, name: '火焰骑士', rarity: 'N', imageUrl: ph('ef4444', '火焰'), owned: false },
      { id: 5, name: '冰雪女王', rarity: 'SSR', imageUrl: ph('a855f7', '冰雪'), owned: false },
      { id: 6, name: '雷霆战神', rarity: 'SR', imageUrl: ph('f59e0b', '雷霆'), owned: false }
    ]
  },
  switchFilter: function (e) { this.setData({ filter: e.currentTarget.dataset.filter }); },
  showDetail: function (e) {
    try { wx.showToast({ title: '皮肤详情功能开发中', icon: 'none' }); } catch (err) {}
  }
});
