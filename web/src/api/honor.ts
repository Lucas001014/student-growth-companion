import request from './index';
export function grantPoints(body: any) { return request.post('/honor/points', body); }
export function grantSkin(body: any) { return request.post('/honor/skin/grant', body); }
export function grantTitle(body: any) { return request.post('/honor/title/grant', body); }
export function getStudentHonor(id: number) { return request.get(`/honor/student/${id}`); }
