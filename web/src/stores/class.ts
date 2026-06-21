import { defineStore } from 'pinia';
import { getStudents, createStudent, batchStudents, updateStudent, deleteStudent, setStudentIdentity } from '../api/class';
export const useClassStore = defineStore('class', {
  state: () => ({ currentClassId: null as number | null, students: [] as any[] }),
  actions: {
    async loadStudents(params: any) {
      const res = await getStudents(params);
      this.students = res.data?.list || res.data || [];
      return res;
    },
    async create(body: any) { return createStudent(body); },
    async batch(body: any) { return batchStudents(body); },
    async update(id: number, body: any) { return updateStudent(id, body); },
    async remove(id: number) { return deleteStudent(id); },
    async setIdentity(id: number, badgeIds: number[]) { return setStudentIdentity(id, badgeIds); },
  },
});
