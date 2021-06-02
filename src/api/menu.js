import request from '@/utils/request'
export function getMenubyRole(data) {
  return request({
    url: '/GetMenubyRole',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
