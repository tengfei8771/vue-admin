import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/user/login',
    method: 'get',
    params: data
  })
}
export function refreshToken(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/user/RefreshToken',
    method: 'post',
    data: data
  })
}
export function getUserInfo(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}
export function createUserInfo(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}
export function updateUserInfo(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}
export function deleteUserInfo(data) {
  return request({
    url: '/user',
    method: 'delete',
    params: data
  })
}
export function getRoleAuthorized(data) {
  return request({
    url: '/user/GetRoleAuthorized',
    method: 'get',
    params: data
  })
}
export function getRoleNotAuthorized(data) {
  return request({
    url: '/user/GetRoleNotAuthorized',
    method: 'get',
    params: data
  })
}
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
