import request from './index';
export function getDashboard() { return request.get('/admin/dashboard'); }
export function createTeacher(body: any) { return request.post('/admin/teachers', body); }
export function listTeachers() { return request.get('/admin/teachers'); }
export function listClasses() { return request.get('/admin/classes'); }
export function listSkins() { return request.get('/admin/skins'); }
export function createSkin(body: any) { return request.post('/admin/skins', body); }
export function deleteSkin(id: number) { return request.delete(`/admin/skins/${id}`); }
export function listTitles() { return request.get('/admin/titles'); }
export function createTitle(body: any) { return request.post('/admin/titles', body); }
export function listBadges() { return request.get('/admin/identity-badges'); }
export function createBadge(body: any) { return request.post('/admin/identity-badges', body); }
export function getConfig() { return request.get('/admin/config'); }
export function updateConfig(body: any) { return request.put('/admin/config', body); }
export function exportData(params: any) { return request.get('/admin/export', { params, responseType: 'blob' }); }
