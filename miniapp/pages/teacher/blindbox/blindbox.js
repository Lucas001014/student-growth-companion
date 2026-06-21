const util = require('../../../utils/util.js');
Page({
  data: {
    boxes: [
      { id: 1, name: '神秘宝箱', cost: 20, participants: 42, status: 'active' },
      { id: 2, name: '学生限定盒', cost: 50, participants: 18, status: 'inactive' }
    ],
    records: [
      { id: 1, student: '张三', skin: '星空战士', rarity: 'ssr', time: '10分钟前' },
      { id: 2, student: '李四', skin: '海洋之心', rarity: 'sr', time: '1小时前' },
      { id: 3, student: '王五', skin: '森林守卫', rarity: 'r', time: '2小时前' }
    ]
  },
  create() { util.showToast('新建盲盒'); },
  edit(e) { util.showToast('编辑盲盒 #' + e.currentTarget.dataset.id); },
  toggle(e) {
    const id = e.currentTarget.dataset.id;
    const boxes = this.data.boxes.map(b => b.id == id ? Object.assign({}, b, { status: b.status === 'active' ? 'inactive' : 'active' }) : b);
    this.setData({ boxes });
    util.showToast('状态已更新', 'success');
  }
});
