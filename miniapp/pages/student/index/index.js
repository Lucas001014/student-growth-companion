// 班级荣誉皮肤系统 - 学生成长陪伴（学生端首页）
// 重要：所有图片采用本地 SVG 色块占位，避免请求外部网络导致的 WAServiceMainContext timeout

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
    user: {
      name: '同学',
      studentNo: '-',
      points: 0,
      identity: '学习委员'
    },
    recentSkins: [
      { id: 1, name: '星空战士', rarity: 'SSR', imageUrl: ph('6366f1', '星空') },
      { id: 2, name: '海洋之心', rarity: 'SR', imageUrl: ph('0ea5e9', '海洋') },
      { id: 3, name: '森林守卫', rarity: 'R', imageUrl: ph('22c55e', '森林') },
      { id: 4, name: '火焰骑士', rarity: 'N', imageUrl: ph('ef4444', '火焰') }
    ],
    honorEvents: [
      { id: 1, title: '获得积分 +10（课堂表现）', time: '今天 14:30' },
      { id: 2, title: '解锁皮肤：海洋之心', time: '昨天 18:00' },
      { id: 3, title: '获得称号：学习之星', time: '3天前' }
    ]
  },

  onShow: function () {
    try {
      var user = wx.getStorageSync('user');
      if (user && user.name) {
        this.setData({
          user: {
            name: user.name || '同学',
            studentNo: user.studentNo || '-',
            points: user.points || 0,
            identity: user.identity || '学习委员'
          }
        });
      }
    } catch (e) {}
  },

  goSkins: function () {
    try { wx.navigateTo({ url: '/pages/student/skins/skins' }); } catch (e) {}
  },
  goRanking: function () {
    try { wx.navigateTo({ url: '/pages/student/ranking/ranking' }); } catch (e) {}
  },
  goBlindbox: function () {
    try { wx.navigateTo({ url: '/pages/student/blindbox/blindbox' }); } catch (e) {}
  },
  goHomework: function () {
    try { wx.navigateTo({ url: '/pages/student/homework-show/homework-show' }); } catch (e) {}
  },
  goParent: function () {
    try { wx.navigateTo({ url: '/pages/student/parent/confirm/confirm' }); } catch (e) {}
  },
  logout: function () {
    var that = this;
    try {
      wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success: function (res) {
        if (res.confirm) {
          try { wx.clearStorageSync(); } catch (e) {}
          try { wx.reLaunch({ url: '/pages/login/login' }); } catch (e) {}
        }
      }
    });
    } catch (e) {}
  }
});
