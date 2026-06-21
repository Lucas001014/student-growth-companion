import request from './index';
export function createBlindBox(body: any) { return request.post('/blindbox/create', body); }
export function listBlindBoxes(params: any) { return request.get('/blindbox/list', { params }); }
export function drawBlindBox(body: any) { return request.post('/blindbox/draw', body); }
export function updateBlindBox(id: number, body: any) { return request.put(`/blindbox/${id}`, body); }
