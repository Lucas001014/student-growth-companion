function formatDate(date, fmt) {
  if (!date) return '';
  const d = new Date(date);
  fmt = fmt || 'yyyy-MM-dd HH:mm';
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return fmt
    .replace('yyyy', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('dd', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()));
}

function showToast(title, icon, duration) {
  try {
    wx.showToast({
      title: title || '',
      icon: icon || 'none',
      duration: duration || 2000
    });
  } catch (e) {}
}

function showLoading(title) {
  try {
    wx.showLoading({ title: title || '加载中...', mask: true });
  } catch (e) {}
}

function hideLoading() {
  try { wx.hideLoading(); } catch (e) {}
}

module.exports = { formatDate, showToast, showLoading, hideLoading };
