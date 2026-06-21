import request from './index';
export function submitRequest(body: any) { return request.post('/request/submit', body); }
export function listRequests(params: any) { return request.get('/request/list', { params }); }
export function approveRequest(id: number, body: any) { return request.post(`/request/${id}/approve`, body); }
