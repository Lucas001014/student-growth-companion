import { defineStore } from 'pinia';
import { getStudentHonor } from '../api/honor';
export const useStudentStore = defineStore('student', {
  state: () => ({ honor: null as any }),
  actions: {
    async loadHonor(id: number) {
      const res = await getStudentHonor(id);
      this.honor = res.data;
      return res;
    },
  },
});
