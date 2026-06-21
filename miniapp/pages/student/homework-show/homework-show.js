const api = require('../../../utils/api.js');
Page({
  data: {
    filter: 'all',
    homeworkList: [
      { id: 1, title: '数学作业 - 分数运算', subject: '数学', studentName: '张三', rarity: 'sr', imageUrl: 'https://via.placeholder.com/600x400/667eea/ffffff?text=Homework', description: '这是我的数学作业，请大家批评指正。', time: '今天 10:30', tags: ['优秀', '精选'] },
      { id: 2, title: '语文作文 - 我的梦想', subject: '语文', studentName: '李四', rarity: 'r', imageUrl: 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Homework', description: '一篇关于梦想的作文。', time: '昨天 15:20', tags: ['作文'] },
      { id: 3, title: '英语单词背诵', subject: '英语', studentName: '王五', rarity: 'n', imageUrl: 'https://via.placeholder.com/600x400/22c55e/ffffff?text=Homework', description: '', time: '2天前', tags: [] }
    ]
  },
  switchFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.filter });
  },
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ urls: [url] });
  }
});
