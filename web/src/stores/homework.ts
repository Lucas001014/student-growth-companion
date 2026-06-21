import { defineStore } from 'pinia';
import { getPublicHomework, getMyHomework, confirmHomework, uploadHomework } from '../api/homework';
export const useHomeworkStore = defineStore('homework', {
  state: () => ({ publicList: [] as any[], mine: [] as any[] }),
  actions: {
    async loadPublic(params: any) {
      const res = await getPublicHomework(params);
      this.publicList = res.data?.list || res.data || [];
      return res;
    },
    async loadMine() {
      const res = await getMyHomework();
      this.mine = res.data?.list || res.data || [];
      return res;
    },
    async confirm(body: any) { return confirmHomework(body); },
    async upload(form: FormData) { return uploadHomework(form); },
  },
});
