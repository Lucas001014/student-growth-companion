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
    students: [
      { id: 1, name: '张三', studentNo: '202501', points: 280, avatar: ph('38bdf8', '张') },
      { id: 2, name: '李四', studentNo: '202502', points: 245, avatar: ph('22c55e', '李') },
      { id: 3, name: '王五', studentNo: '202503', points: 210, avatar: ph('fb923c', '王') },
      { id: 4, name: '赵六', studentNo: '202504', points: 190, avatar: ph('a855f7', '赵') }
    ]
  }
});
