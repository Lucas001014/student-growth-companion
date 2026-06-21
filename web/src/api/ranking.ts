import request from './index';
export function getClassRanking(params: any) { return request.get('/ranking/class', { params }); }
