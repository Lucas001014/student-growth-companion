// 动画与定时刷新模块
(function () {
  // 每 30 秒自动刷新排行榜（模拟数据变化）
  let tick = 0;
  setInterval(() => {
    tick++;
    // 为演示数据做一些轻微变化
    if (window.__demoRanking) {
      window.__demoRanking.forEach((r, i) => {
        r.points = (r.points || 0) + Math.floor(Math.random() * 15);
      });
      window.__demoRanking.sort((a, b) => b.points - a.points);
      window.__demoRanking.forEach((r, i) => { r.rank = i + 1; });
      renderRanking(window.__demoRanking);
    }
    // 每 5 次 tick 更新积分总数
    if (tick % 5 === 0) {
      const el = document.getElementById('totalPoints');
      if (el) {
        const n = parseInt(el.textContent.replace(/,/g, ''));
        el.textContent = (n + 50).toLocaleString();
      }
    }
  }, 5000);

  // 入场动画
  const entries = document.querySelectorAll('.panel');
  entries.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all .8s cubic-bezier(.4,0,.2,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 150);
  });
})();

// 缓存演示数据供 animation.js 接管入口
if (window.startDemoMode) {
  // 记录初始数据
  window.__demoRanking = null;
  // 保留默认的 startDemoMode 会在 socket.js 中继续执行
}
