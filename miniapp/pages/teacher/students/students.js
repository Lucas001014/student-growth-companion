const util = require('../../../utils/util.js');
Page({
  data: {
    keyword: '',
    students: [
      { id: 1, name: '张三', studentNo: '202501', points: 280, avatar: 'https://via.placeholder.com/80' },
      { id: 2, name: '李四', studentNo: '202502', points: 245, avatar: 'https://via.placeholder.com/80' },
      { id: 3, name: '王五', studentNo: '202503', points: 210, avatar: 'https://via.placeholder.com/80' },
      { id: 4, name: '赵六', studentNo: '202504', points: 190, avatar: 'https://via.placeholder.com/80' }
    ]
  },
  onSearch(e) {
    this.setData({ keyword: e.detail.value });
  },
  addStudent() {
    wx.showModal({
      title: '新增学生',
      editable: true,
      placeholderText: '请输入学生姓名',
      success: (res) => {
        if (res.confirm) util.showToast('已添加', 'success');
      }
    });
  },
  goDetail(e) {
    util.showToast('学生详情');
  },
  grantPoints(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '发放积分',
      editable: true,
      placeholderText: '请输入积分数',
      success: (res) => {
        if (res.confirm) {
          const pts = parseInt(res.content);
          if (!pts) return util.showToast('请输入有效数字');
          const students = this.data.students.map(s => s.id == id ? Object.assign({}, s, { points: s.points + pts }) : s);
          this.setData({ students });
          util.showToast('已发放 +' + pts, 'success');
        }
      }
    });
  }
});
