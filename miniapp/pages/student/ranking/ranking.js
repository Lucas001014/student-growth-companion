function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<rect width="200" height="200" rx="24" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="32" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    topThree: [
      { rank: '🥇', name: '张三', points: 280, avatar: ph('f59e0b', '1') },
      { rank: '🥈', name: '李四', points: 245, avatar: ph('94a3b8', '2') },
      { rank: '🥉', name: '王五', points: 210, avatar: ph('a16207', '3') }
    ],
    rankList: [
      { rank: 1, name: '张三', points: 280, isMe: false },
      { rank: 2, name: '李四', points: 245, isMe: false },
      { rank: 3, name: '王五', points: 210, isMe: false },
      { rank: 4, name: '赵六', points: 190, isMe: false },
      { rank: 5, name: '我自己', points: 120, isMe: true },
      { rank: 6, name: '孙七', points: 100, isMe: false }
    ]
  }
});
