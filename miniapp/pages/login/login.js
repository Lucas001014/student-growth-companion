var auth = require('../../utils/auth.js');
var util = require('../../utils/util.js');
var api = require('../../utils/api.js');

Page({
  data: {
    tab: 'student',
    studentNo: '',
    classVerifyCode: '',
    phone: '',
    password: ''
  },

  switchTab: function (e) {
    var t = e.currentTarget.dataset.tab;
    this.setData({ tab: t });
  },

  onInput: function (e) {
    var k = e.currentTarget.dataset.key;
    var v = e.detail.value;
    var obj = {};
    obj[k] = v;
    this.setData(obj);
  },

  onSubmit: function () {
    var tab = this.data.tab;
    var payload;

    if (tab === 'student') {
      if (!this.data.studentNo) {
        util.showToast('请输入学号');
        return;
      }
      if (!this.data.classVerifyCode) {
        util.showToast('请输入班级验证码');
        return;
      }
      payload = {
        studentNo: this.data.studentNo,
        classVerifyCode: this.data.classVerifyCode,
        role: 'student'
      };
    } else {
      if (!this.data.phone) {
        util.showToast('请输入手机号');
        return;
      }
      if (!this.data.password) {
        util.showToast('请输入密码');
        return;
      }
      payload = {
        phone: this.data.phone,
        password: this.data.password,
        role: tab
      };
    }

    util.showLoading('登录中...');

    api.login(payload).then(function (res) {
      util.hideLoading();
      if (!res || res.code !== 200 || !res.data || !res.data.user) {
        util.showToast((res && res.message) || '登录失败');
        return;
      }

      var user = res.data.user;
      var token = res.data.token || ('token-' + Date.now());

      auth.login({
        token: token,
        id: user.id,
        role: user.role,
        name: user.name,
        points: user.points,
        identity: user.identity,
        studentNo: user.studentNo
      });

      util.showToast('登录成功', 'success');

      var target = '/pages/student/index/index';
      if (user.role === 'teacher') target = '/pages/teacher/index/index';
      else if (user.role === 'admin') target = '/pages/admin/index/index';

      setTimeout(function () {
        wx.reLaunch({
          url: target,
          fail: function () {
            wx.redirectTo({ url: target });
          }
        });
      }, 600);
    }).catch(function (err) {
      util.hideLoading();
      util.showToast((err && err.message) || '登录失败');
    });
  }
});
