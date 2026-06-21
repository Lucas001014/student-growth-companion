function login(user) {
  wx.setStorageSync('token', user && user.token ? user.token : 'mock-token');
  wx.setStorageSync('user', user || { role: 'student', name: '未登录' });
}

function logout() {
  try { wx.clearStorageSync(); } catch (e) {}
}

function getUser() {
  try { return wx.getStorageSync('user') || null; } catch (e) { return null; }
}

function getRole() {
  const u = getUser();
  return u && u.role ? u.role : null;
}

function getToken() {
  try { return wx.getStorageSync('token') || ''; } catch (e) { return ''; }
}

function isLoggedIn() {
  return !!getToken() && !!getUser();
}

module.exports = { login, logout, getUser, getRole, getToken, isLoggedIn };
