const api = require('../../../../utils/api.js');
const util = require('../../../../utils/util.js');
Page({
  data: {
    subject: '',
    title: '',
    imageUrl: '',
    visibility: 'public'
  },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },
  setVisibility(e) {
    this.setData({ visibility: e.currentTarget.dataset.val });
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.setData({ imageUrl: res.tempFiles[0].tempFilePath });
      },
      fail: () => {
        this.setData({ imageUrl: 'https://via.placeholder.com/600x400/667eea/ffffff?text=Image' });
      }
    });
  },
  submit() {
    if (!this.data.subject || !this.data.title) return util.showToast('请填写完整信息');
    if (!this.data.imageUrl) return util.showToast('请选择图片');
    util.showLoading('上传中...');
    setTimeout(() => {
      util.hideLoading();
      util.showToast('上传成功', 'success');
      setTimeout(() => wx.navigateBack(), 800);
    }, 800);
  }
});
