function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<rect width="300" height="300" rx="24" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="40" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    tab: 'points',
    studentNames: ['张三', '李四', '王五', '赵六'],
    studentIdx: 0,
    points: '',
    reason: '',
    selectedSkin: null,
    selectedTitle: null,
    skins: [
      { id: 1, name: '星空战士', imageUrl: ph('6366f1', '星空') },
      { id: 2, name: '海洋之心', imageUrl: ph('0ea5e9', '海洋') },
      { id: 3, name: '森林守卫', imageUrl: ph('22c55e', '森林') },
      { id: 4, name: '火焰骑士', imageUrl: ph('ef4444', '火焰') }
    ],
    titles: [
      { id: 1, name: '学习之星', icon: '⭐' },
      { id: 2, name: '进步最快', icon: '🚀' },
      { id: 3, name: '劳动能手', icon: '🔨' },
      { id: 4, name: '体育健将', icon: '🏃' }
    ]
  },
  switchTab: function (e) { this.setData({ tab: e.currentTarget.dataset.tab }); },
  onStudentChange: function (e) { this.setData({ studentIdx: e.detail.value }); },
  onInput: function (e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var obj = {};
    obj[key] = value;
    this.setData(obj);
  },
  selectSkin: function (e) { this.setData({ selectedSkin: e.currentTarget.dataset.id }); },
  selectTitle: function (e) { this.setData({ selectedTitle: e.currentTarget.dataset.id }); },
  submit: function () {
    if (!this.data.points) {
      try { wx.showToast({ title: '请输入积分', icon: 'none' }); } catch (e) {}
      return;
    }
    try { wx.showToast({ title: '积分已发放', icon: 'success' }); } catch (e) {}
    this.setData({ points: '', reason: '' });
  },
  grantSkin: function () {
    if (!this.data.selectedSkin) {
      try { wx.showToast({ title: '请选择皮肤', icon: 'none' }); } catch (e) {}
      return;
    }
    try { wx.showToast({ title: '皮肤已发放', icon: 'success' }); } catch (e) {}
    this.setData({ selectedSkin: null });
  },
  grantTitle: function () {
    if (!this.data.selectedTitle) {
      try { wx.showToast({ title: '请选择称号', icon: 'none' }); } catch (e) {}
      return;
    }
    try { wx.showToast({ title: '称号已发放', icon: 'success' }); } catch (e) {}
    this.setData({ selectedTitle: null });
  }
});
