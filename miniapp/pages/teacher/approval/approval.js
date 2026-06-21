const util = require('../../../utils/util.js');
Page({
  data: {
    tab: 'pending',
    pendingCount: 3,
    list: [],
    pendingList: [
      { id: 1, title: '申请优秀称号', type: '称号申请', student: '张三', time: '2025-05-20', description: '申请学习之星称号，本周表现优异。', status: 'pending', statusText: '待审批' },
      { id: 2, title: '申请积分补发', type: '积分申请', student: '李四', time: '2025-05-20', description: '上周测验未记入积分，请补发。', status: 'pending', statusText: '待审批' },
      { id: 3, title: '作业审核 - 语文作文', type: '作业审核', student: '王五', time: '2025-05-20', description: '家长已确认，待老师审核。', status: 'pending', statusText: '待审批' }
    ],
    doneList: [
      { id: 10, title: '申请皮肤兑换', type: '皮肤申请', student: '赵六', time: '2025-05-18', description: '申请海洋之心皮肤。', status: 'approved', statusText: '已通过' },
      { id: 11, title: '申请积分补发', type: '积分申请', student: '孙七', time: '2025-05-15', description: '申请补发积分 10 分。', status: 'rejected', statusText: '已拒绝' }
    ]
  },
  onShow() {
    this.refreshList();
  },
  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
    this.refreshList();
  },
  refreshList() {
    const list = this.data.tab === 'pending' ? this.data.pendingList : this.data.doneList;
    this.setData({ list, pendingCount: this.data.pendingList.length });
  },
  approve(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认通过',
      success: (res) => {
        if (res.confirm) {
          const pList = this.data.pendingList.filter(i => i.id != id);
          const dItem = this.data.pendingList.find(i => i.id == id);
          if (dItem) dItem.status = 'approved', dItem.statusText = '已通过';
          const dList = dItem ? [dItem, ...this.data.doneList] : this.data.doneList;
          this.setData({ pendingList: pList, doneList: dList });
          this.refreshList();
          util.showToast('已通过', 'success');
        }
      }
    });
  },
  reject(e) {
    const id = e.currentTarget.dataset.id;
    const pList = this.data.pendingList.filter(i => i.id != id);
    const dItem = this.data.pendingList.find(i => i.id == id);
    if (dItem) dItem.status = 'rejected', dItem.statusText = '已拒绝';
    const dList = dItem ? [dItem, ...this.data.doneList] : this.data.doneList;
    this.setData({ pendingList: pList, doneList: dList });
    this.refreshList();
    util.showToast('已拒绝');
  }
});
