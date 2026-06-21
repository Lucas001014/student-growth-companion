function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<circle cx="80" cy="80" r="74" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="36" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    keyword: '',
    teachers: [
      { id: 1, name: '张老师', phone: '138****1111', classCount: 2, avatar: ph('38bdf8', '张') },
      { id: 2, name: '李老师', phone: '138****2222', classCount: 3, avatar: ph('fb923c', '李') },
      { id: 3, name: '王老师', phone: '138****3333', classCount: 1, avatar: ph('a855f7', '王') }
    ]
  },
  onSearch: function (e) { this.setData({ keyword: e.detail.value }); },
  addTeacher: function () {
    try { wx.showToast({ title: '新增教师', icon: 'none' }); } catch (e) {}
  },
  editTeacher: function (e) {
    try { wx.showToast({ title: '编辑教师 #' + e.currentTarget.dataset.id, icon: 'none' }); } catch (err) {}
  }
});
