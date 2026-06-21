import request from './index';
export function login(body: any) { return request.post('/auth/login', body); }
export function switchMode(body: any) { return request.post('/auth/mode/switch', body); }
export function changePassword(body: any) { return request.post('/auth/change-password', body); }
