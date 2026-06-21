const api = require('../../../utils/api.js');
Page({
  data: {
    topThree: [
      { rank: '🥇', name: '张三', points: 280, avatar: 'https://via.placeholder.com/80' },
      { rank: '🥈', name: '李四', points: 245, avatar: 'https://via.placeholder.com/80' },
      { rank: '🥉', name: '王五', points: 210, avatar: 'https://via.placeholder.com/80' }
    ],
    rankList: [
      { rank: 1, name: '张三', points: 280, isMe: false },
      { rank: 2, name: '李四', points: 245, isMe: false },
      { rank: 3, name: '王五', points: 210, isMe: false },
      { rank: 4, name: '赵六', points: 190, isMe: false },
      { rank: 5, name: '我自己', points: 120, isMe: true },
      { rank: 6, name: '孙七', points: 100, isMe: false }
    ]
  }
});
