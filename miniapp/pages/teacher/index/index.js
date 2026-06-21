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
    stats: { students: 42, points: 1580, approvals: 8 },
    activities: [
      { id: 1, title: '张三获得"学习之星"称号', time: '10分钟前' },
      { id: 2, title: '李四提交了新的作业', time: '1小时前' },
      { id: 3, title: '本周班级积分总额 +280', time: '昨天' }
    ]
  },
  goStudents: function () { try { wx.navigateTo({ url: '/pages/teacher/students/students' }); } catch (e) {} },
  goHonor: function () { try { wx.navigateTo({ url: '/pages/teacher/honor/honor' }); } catch (e) {} },
  goApproval: function () { try { wx.navigateTo({ url: '/pages/teacher/approval/approval' }); } catch (e) {} },
  goBlindbox: function () { try { wx.navigateTo({ url: '/pages/teacher/blindbox/blindbox' }); } catch (e) {} }
});
