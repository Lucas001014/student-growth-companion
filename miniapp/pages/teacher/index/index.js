Page({
  data: {
    stats: { students: 42, points: 1580, approvals: 8 },
    activities: [
      { id: 1, title: '张三获得"学习之星"称号', time: '10分钟前' },
      { id: 2, title: '李四提交了新的作业', time: '1小时前' },
      { id: 3, title: '本周班级积分总额 +280', time: '昨天' }
    ]
  },
  goStudents() { wx.navigateTo({ url: '/pages/teacher/students/students' }); },
  goHonor() { wx.navigateTo({ url: '/pages/teacher/honor/honor' }); },
  goApproval() { wx.navigateTo({ url: '/pages/teacher/approval/approval' }); },
  goBlindbox() { wx.navigateTo({ url: '/pages/teacher/blindbox/blindbox' }); }
});
