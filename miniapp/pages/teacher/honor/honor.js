const util = require('../../../utils/util.js');
Page({
  data: {
    tab: 'points',
    studentNames: ['张三', '李四', '王五', '赵六'],
    studentIdx: 0,
    points: '',
    reason: '',
    selectedSkin: null,
    selectedTitle: null,
    skins: [
      { id: 1, name: '星空战士', imageUrl: 'https://via.placeholder.com/200x200/667eea/ffffff?text=SSR' },
      { id: 2, name: '海洋之心', imageUrl: 'https://via.placeholder.com/200x200/06b6d4/ffffff?text=SR' },
      { id: 3, name: '森林守卫', imageUrl: 'https://via.placeholder.com/200x200/22c55e/ffffff?text=R' },
      { id: 4, name: '火焰骑士', imageUrl: 'https://via.placeholder.com/200x200/f56c6c/ffffff?text=N' }
    ],
    titles: [
      { id: 1, name: '学习之星', icon: '⭐' },
      { id: 2, name: '进步最快', icon: '🚀' },
      { id: 3, name: '劳动能手', icon: '🔨' },
      { id: 4, name: '体育健将', icon: '🏃' }
    ]
  },
  switchTab(e) { this.setData({ tab: e.currentTarget.dataset.tab }); },
  onStudentChange(e) { this.setData({ studentIdx: e.detail.value }); },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },
  selectSkin(e) { this.setData({ selectedSkin: e.currentTarget.dataset.id }); },
  selectTitle(e) { this.setData({ selectedTitle: e.currentTarget.dataset.id }); },
  submit() {
    if (!this.data.points) return util.showToast('请输入积分');
    util.showToast('积分已发放', 'success');
    this.setData({ points: '', reason: '' });
  },
  grantSkin() {
    if (!this.data.selectedSkin) return util.showToast('请选择皮肤');
    util.showToast('皮肤已发放', 'success');
    this.setData({ selectedSkin: null });
  },
  grantTitle() {
    if (!this.data.selectedTitle) return util.showToast('请选择称号');
    util.showToast('称号已发放', 'success');
    this.setData({ selectedTitle: null });
  }
});
