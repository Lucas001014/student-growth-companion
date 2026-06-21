import request from './index';
export function getStudents(params: any) { return request.get('/class/students', { params }); }
export function createStudent(body: any) { return request.post('/class/students', body); }
export function batchStudents(body: any) { return request.post('/class/students/batch', body); }
export function updateStudent(id: number, body: any) { return request.put(`/class/students/${id}`, body); }
export function deleteStudent(id: number) { return request.delete(`/class/students/${id}`); }
export function setStudentIdentity(id: number, badgeIds: number[]) { return request.put(`/class/students/${id}/identity`, { badgeIds }); }
