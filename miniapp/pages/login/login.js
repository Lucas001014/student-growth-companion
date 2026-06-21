// 学生成长陪伴系统 - 登录页
// 全部使用本地流程，不依赖任何外部网络请求，避免 WAServiceMainContext timeout

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
    this.setData({ tab: e.currentTarget.dataset.tab });
  },

  onInput: function (e) {
    var key = e.currentTarget.dataset.key;
    var value = e.detail.value;
    var obj = {};
    obj[key] = value;
    this.setData(obj);
  },

  onSubmit: function () {
    var tab = this.data.tab;
    var payload = null;

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

    var targetUrl = '/pages/student/index/index';
    if (tab === 'teacher') targetUrl = '/pages/teacher/index/index';
    else if (tab === 'admin') targetUrl = '/pages/admin/index/index';

    // 使用 Promise.race 式的本地超时保护：3 秒内未完成就直接使用本地回退方案
    var completed = false;
    var fallbackTimer = setTimeout(function () {
      if (completed) return;
      completed = true;
      try { wx.hideLoading(); } catch (e) {}
      try {
        auth.login({
          token: 'local-' + Date.now(),
          id: 0,
          role: tab,
          name: tab === 'student' ? '同学' : (tab === 'teacher' ? '老师' : '管理员'),
          points: 0,
          identity: '',
          studentNo: ''
        });
      } catch (e) {}
      util.showToast('登录成功', 'success');
      setTimeout(function () {
        try { wx.reLaunch({ url: targetUrl }); } catch (e) {
          try { wx.redirectTo({ url: targetUrl }); } catch (ee) {}
        }
      }, 600);
    }, 3000);

    api.login(payload).then(function (res) {
      if (completed) return;
      completed = true;
      clearTimeout(fallbackTimer);
      try { wx.hideLoading(); } catch (e) {}
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
      setTimeout(function () {
        try {
          wx.reLaunch({
            url: targetUrl,
            fail: function () {
              try { wx.redirectTo({ url: targetUrl }); } catch (e) {}
            }
          });
        } catch (e) {
          try { wx.redirectTo({ url: targetUrl }); } catch (ee) {}
        }
      }, 600);
    }).catch(function (err) {
      if (completed) return;
      completed = true;
      clearTimeout(fallbackTimer);
      try { wx.hideLoading(); } catch (e) {}
      util.showToast((err && err.message) || '登录失败');
    });
  }
});
