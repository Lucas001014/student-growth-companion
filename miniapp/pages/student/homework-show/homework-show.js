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
    homeworkList: [
      { id: 1, title: '数学作业 - 分数运算', subject: '数学', studentName: '张三', rarity: 'sr', imageUrl: ph('38bdf8', '数学'), description: '这是我的数学作业，请大家批评指正。', time: '今天 10:30', tags: ['优秀', '精选'] },
      { id: 2, title: '语文作文 - 我的梦想', subject: '语文', studentName: '李四', rarity: 'r', imageUrl: ph('22c55e', '语文'), description: '一篇关于梦想的作文。', time: '昨天 15:20', tags: ['作文'] },
      { id: 3, title: '英语单词背诵', subject: '英语', studentName: '王五', rarity: 'n', imageUrl: ph('fb923c', '英语'), description: '', time: '2天前', tags: [] }
    ]
  },
  switchFilter: function (e) { this.setData({ filter: e.currentTarget.dataset.filter }); },
  previewImage: function (e) {
    try {
      var url = e.currentTarget.dataset.url;
      wx.previewImage({ urls: [url] });
    } catch (err) {}
  }
});
