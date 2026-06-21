const util = require('../../../utils/util.js');
Page({
  data: {
    stats: {
      classes: 8,
      teachers: 15,
      students: 320,
      skins: 24,
      monthlyPoints: 2580,
      grantedSkins: 156,
      grantedTitles: 88,
      boxDraws: 420
    }
  },
  goTeachers() { wx.navigateTo({ url: '/pages/admin/teachers/teachers' }); },
  goSkins() { wx.navigateTo({ url: '/pages/admin/skins/skins' }); },
  goConfig() { wx.navigateTo({ url: '/pages/admin/config/config' }); },
  goClasses() { util.showToast('班级管理功能'); }
});
