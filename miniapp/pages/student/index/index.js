var api = require('../../../utils/api.js');
var auth = require('../../../utils/auth.js');
var util = require('../../../utils/util.js');

Page({
  data: {
    user: {
      name: '同学',
      studentNo: '-',
      points: 0,
      identity: '学习委员'
    },
    recentSkins: [
      { id: 1, name: '星空战士', rarity: 'SSR', imageUrl: 'https://via.placeholder.com/200x200/667eea/ffffff?text=SSR' },
      { id: 2, name: '海洋之心', rarity: 'SR', imageUrl: 'https://via.placeholder.com/200x200/06b6d4/ffffff?text=SR' },
      { id: 3, name: '森林守卫', rarity: 'R', imageUrl: 'https://via.placeholder.com/200x200/22c55e/ffffff?text=R' },
      { id: 4, name: '火焰骑士', rarity: 'N', imageUrl: 'https://via.placeholder.com/200x200/f56c6c/ffffff?text=N' }
    ],
    honorEvents: [
      { id: 1, title: '获得积分 +10（课堂表现）', time: '今天 14:30' },
      { id: 2, title: '解锁皮肤：海洋之心', time: '昨天 18:00' },
      { id: 3, title: '获得称号：学习之星', time: '3天前' }
    ]
  },

  onShow: function () {
    var user = auth.getUser();
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
  },

  goSkins: function () {
    wx.navigateTo({ url: '/pages/student/skins/skins' });
  },
  goRanking: function () {
    wx.navigateTo({ url: '/pages/student/ranking/ranking' });
  },
  goBlindbox: function () {
    wx.navigateTo({ url: '/pages/student/blindbox/blindbox' });
  },
  goHomework: function () {
    wx.navigateTo({ url: '/pages/student/homework-show/homework-show' });
  },
  goParent: function () {
    wx.navigateTo({ url: '/pages/student/parent/confirm/confirm' });
  },
  logout: function () {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success: function (res) {
        if (res.confirm) {
          auth.logout();
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
