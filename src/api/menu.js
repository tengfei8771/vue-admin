import request from '@/utils/request'
export function getMenubyRole(data) {
  return request({
    url: 'menu/GetMenubyRole',
    method: 'get',
    params: data
  })
}

export function GetMenu(data) {
  return request({
    url: 'menu',
    method: 'get',
    params: data
  })
}

export function CreateMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data: data
  })
}
export function UpdateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data: data
  })
}
export function DeleteMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    params: data
  })
}
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
