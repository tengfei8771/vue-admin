import request from '@/utils/request'

export function getOrgTree(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/Org/GetOrgTree',
    method: 'get',
    params: data
  })
}
export function getOrgLazyTree(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/Org',
    method: 'get',
    params: data
  })
}
export function CreateOrg(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/Org',
    method: 'post',
    data: data
  })
}
export function updateOrg(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/Org',
    method: 'put',
    data: data
  })
}
export function deleteOrg(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/Org',
    method: 'delete',
    params: data
  })
}
