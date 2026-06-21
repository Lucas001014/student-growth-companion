function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<rect width="300" height="300" rx="24" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="42" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    tab: 'skins',
    skins: [
      { id: 1, name: '星空战士', rarity: 'ssr', imageUrl: ph('6366f1', '星空') },
      { id: 2, name: '海洋之心', rarity: 'sr', imageUrl: ph('0ea5e9', '海洋') },
      { id: 3, name: '森林守卫', rarity: 'r', imageUrl: ph('22c55e', '森林') },
      { id: 4, name: '火焰骑士', rarity: 'n', imageUrl: ph('ef4444', '火焰') }
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
  switchTab: function (e) { this.setData({ tab: e.currentTarget.dataset.tab }); },
  edit: function (e) {
    try { wx.showToast({ title: '编辑 #' + e.currentTarget.dataset.id, icon: 'none' }); } catch (err) {}
  },
  addItem: function () {
    try { wx.showToast({ title: '新增项目', icon: 'none' }); } catch (err) {}
  }
});
