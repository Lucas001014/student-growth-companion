const api = require('../../../../utils/api.js');
const util = require('../../../../utils/util.js');
Page({
  data: {
    todoList: [
      { id: 1, title: '数学作业', subject: '数学', time: '今天 10:30', imageUrl: 'https://via.placeholder.com/600x400/667eea/ffffff?text=Homework' },
      { id: 2, title: '语文作业', subject: '语文', time: '今天 15:20', imageUrl: 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Homework' }
    ]
  },
  confirm(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认作业',
      content: '确认后将提交给老师审核',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.todoList.filter(item => item.id != id);
          this.setData({ todoList: list });
          util.showToast('已确认', 'success');
        }
      }
    });
  },
  reject(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.todoList.filter(item => item.id != id);
    this.setData({ todoList: list });
    util.showToast('已驳回');
  },
  goUpload() { wx.navigateTo({ url: '/pages/student/parent/upload/upload' }); },
  goHistory() { wx.navigateTo({ url: '/pages/student/parent/history/history' }); }
});
