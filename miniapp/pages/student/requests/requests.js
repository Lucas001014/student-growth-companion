const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    requests: [
      { id: 1, title: '申请优秀称号', type: '称号申请', time: '2025-05-20', status: 'pending', statusText: '审核中' },
      { id: 2, title: '申请积分补发', type: '积分申请', time: '2025-05-18', status: 'approved', statusText: '已通过' },
      { id: 3, title: '申请皮肤兑换', type: '皮肤申请', time: '2025-05-10', status: 'rejected', statusText: '已拒绝' }
    ]
  },
  newRequest() {
    wx.showModal({
      title: '发起申请',
      editable: true,
      placeholderText: '请输入申请内容',
      success: (res) => {
        if (res.confirm) {
          util.showToast('申请已提交', 'success');
        }
      }
    });
  }
});
