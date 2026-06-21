function ph(color, label) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#' + color + '" stop-opacity="0.95"/>' +
        '<stop offset="100%" stop-color="#' + color + '" stop-opacity="0.7"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="240" rx="20" fill="url(#g)"/>' +
      '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="40" fill="#ffffff" font-weight="bold">' +
        label + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

Page({
  data: {
    subject: '',
    title: '',
    imageUrl: '',
    visibility: 'public'
  },
  onInput: function (e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var obj = {};
    obj[key] = value;
    this.setData(obj);
  },
  setVisibility: function (e) { this.setData({ visibility: e.currentTarget.dataset.val }); },
  chooseImage: function () {
    var that = this;
    try {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: function (res) {
          that.setData({ imageUrl: res.tempFiles[0].tempFilePath });
        },
        fail: function () {
          that.setData({ imageUrl: ph('6366f1', '示例') });
        }
      });
    } catch (err) {
      this.setData({ imageUrl: ph('6366f1', '示例') });
    }
  },
  submit: function () {
    if (!this.data.subject || !this.data.title) {
      try { wx.showToast({ title: '请填写完整信息', icon: 'none' }); } catch (e) {}
      return;
    }
    if (!this.data.imageUrl) {
      try { wx.showToast({ title: '请选择图片', icon: 'none' }); } catch (e) {}
      return;
    }
    try { wx.showLoading({ title: '上传中...', mask: true }); } catch (e) {}
    setTimeout(function () {
      try { wx.hideLoading(); } catch (e) {}
      try { wx.showToast({ title: '上传成功', icon: 'success' }); } catch (e) {}
      setTimeout(function () { try { wx.navigateBack(); } catch (e) {} }, 800);
    }, 800);
  }
});
