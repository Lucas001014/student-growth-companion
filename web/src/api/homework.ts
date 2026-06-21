import request from './index';
export function confirmHomework(body: any) { return request.post('/homework/confirm', body); }
export function uploadHomework(formData: FormData) { return request.post('/homework/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); }
export function setVisibility(id: number, body: any) { return request.put(`/homework/upload/${id}/visibility`, body); }
export function getPublicHomework(params: any) { return request.get('/homework/public', { params }); }
export function getMyHomework() { return request.get('/homework/mine'); }
