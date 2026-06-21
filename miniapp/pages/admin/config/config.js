const util = require('../../../utils/util.js');
Page({
  data: {
    basicRules: [
      { id: 1, title: '优秀作业', description: '完成优秀作业', points: 5 },
      { id: 2, title: '课堂表现', description: '积极参与课堂活动', points: 3 },
      { id: 3, title: '测验满分', description: '测验全部正确', points: 10 },
      { id: 4, title: '帮助他人', description: '同学间互助', points: 5 }
    ],
    rarityConfig: [
      { id: 1, name: 'SSR（超稀有）', weight: 5, tag: 'ssr' },
      { id: 2, name: 'SR（稀有）', weight: 15, tag: 'sr' },
      { id: 3, name: 'R（普通）', weight: 40, tag: 'r' },
      { id: 4, name: 'N（常见）', weight: 40, tag: 'n' }
    ],
    boxCost: 20,
    weeklyLimit: 100,
    parentPassword: ''
  },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [key]: e.detail.value });
  },
  editRule(e) { util.showToast('编辑规则 #' + e.currentTarget.dataset.id); },
  save() { util.showToast('配置已保存', 'success'); }
});
