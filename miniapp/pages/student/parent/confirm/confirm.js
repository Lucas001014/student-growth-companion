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
    todoList: [
      { id: 1, title: '数学作业', subject: '数学', time: '今天 10:30', imageUrl: ph('38bdf8', '数学') },
      { id: 2, title: '语文作业', subject: '语文', time: '今天 15:20', imageUrl: ph('22c55e', '语文') }
    ]
  },
  confirm: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    try {
      wx.showModal({
        title: '确认作业',
        content: '确认后将提交给老师审核',
        success: function (res) {
          if (res.confirm) {
            var list = that.data.todoList.filter(function (item) { return item.id != id; });
            that.setData({ todoList: list });
            wx.showToast({ title: '已确认', icon: 'success' });
          }
        }
      });
    } catch (err) {}
  },
  reject: function (e) {
    var id = e.currentTarget.dataset.id;
    var list = this.data.todoList.filter(function (item) { return item.id != id; });
    this.setData({ todoList: list });
    try { wx.showToast({ title: '已驳回', icon: 'none' }); } catch (err) {}
  },
  goUpload: function () { try { wx.navigateTo({ url: '/pages/student/parent/upload/upload' }); } catch (e) {} },
  goHistory: function () { try { wx.navigateTo({ url: '/pages/student/parent/history/history' }); } catch (e) {} }
});
