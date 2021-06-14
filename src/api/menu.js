import request from '@/utils/request'
export function getMenubyUser(data) {
  return request({
    url: 'menu/GetMenuByUserId',
    method: 'get',
    params: data
  })
}
export function getMenubyRole(data) {
  return request({
    url: 'menu/GetMenuByRoleId',
    method: 'get',
    params: data
  })
}

export function getMenu(data) {
  return request({
    url: 'menu',
    method: 'get',
    params: data
  })
}
export function getMenuTree() {
  return request({
    url: 'menu/GetMenuTree',
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data: data
  })
}
export function updateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data: data
  })
}
export function deleteMenu(data) {
  return request({
    url: '/menu',
    method: 'delete',
    params: data
  })
}
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
