// 班级荣誉皮肤系统 - 学生成长陪伴小程序
// 增加全局错误兜底，避免 WAServiceMainContext timeout 无提示崩溃
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
    // 全局错误兜底：任何未捕获异常都会走这里，避免空 timeout
    try {
      if (typeof wx.onError === 'function') {
        wx.onError(function (msg) {
          try { console.log('[App onError] ' + msg); } catch (e) {}
        });
      }
    } catch (e) {}
  },
  onError: function (msg) {
    try { console.log('[App Error] ' + msg); } catch (e) {}
    // 立即关闭残留的 loading / toast，避免界面卡住
    try { wx.hideLoading(); } catch (e) {}
    try { wx.hideToast(); } catch (e) {}
  },
  globalData: {
    token: '',
    user: null,
    mode: 'student'
  }
});
