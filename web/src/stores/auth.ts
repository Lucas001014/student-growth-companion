import { defineStore } from 'pinia';
import { login as apiLogin, switchMode, changePassword } from '../api/auth';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    mode: (localStorage.getItem('mode') as 'student' | 'parent') || 'student',
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    role: (s) => s.user?.role,
  },
  actions: {
    async login(payload: any) {
      const res = await apiLogin(payload);
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res;
    },
    logout() { this.token = ''; this.user = null; localStorage.clear(); },
    async switchModeTo(payload: any) {
      const res = await switchMode(payload);
      this.mode = res.data.mode;
      localStorage.setItem('mode', res.data.mode);
      return res;
    },
    async changePwd(payload: any) { return changePassword(payload); },
  },
});
