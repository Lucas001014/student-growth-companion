App({
  onLaunch: function () {
    try {
      var token = wx.getStorageSync('token');
      var user = wx.getStorageSync('user');
      if (token) this.globalData.token = token;
      if (user) this.globalData.user = user;
    } catch (e) {
      // 忽略 storage 错误，不影响启动
    }
  },
  onError: function (msg) {
    try { console.log('[App Error] ' + msg); } catch (e) {}
  },
  globalData: {
    token: '',
    user: null,
    mode: 'student'
  }
});
