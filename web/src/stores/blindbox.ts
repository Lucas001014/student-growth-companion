import { defineStore } from 'pinia';
import { listBlindBoxes, drawBlindBox } from '../api/blindbox';
export const useBlindBoxStore = defineStore('blindbox', {
  state: () => ({ list: [] as any[], lastDraw: null as any }),
  actions: {
    async load(params?: any) {
      const res = await listBlindBoxes(params || {});
      this.list = res.data?.list || res.data || [];
      return res;
    },
    async draw(body: any) {
      const res = await drawBlindBox(body);
      this.lastDraw = res.data;
      return res;
    },
  },
});
