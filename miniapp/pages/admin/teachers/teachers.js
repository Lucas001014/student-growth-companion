const util = require('../../../utils/util.js');
Page({
  data: {
    keyword: '',
    teachers: [
      { id: 1, name: '张老师', phone: '138****1111', classCount: 2, avatar: 'https://via.placeholder.com/80' },
      { id: 2, name: '李老师', phone: '138****2222', classCount: 3, avatar: 'https://via.placeholder.com/80' },
      { id: 3, name: '王老师', phone: '138****3333', classCount: 1, avatar: 'https://via.placeholder.com/80' }
    ]
  },
  onSearch(e) { this.setData({ keyword: e.detail.value }); },
  addTeacher() { util.showToast('新增教师'); },
  editTeacher(e) { util.showToast('编辑教师 #' + e.currentTarget.dataset.id); }
});
