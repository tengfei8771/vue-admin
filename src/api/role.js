import request from '@/utils/request'

export function getRoutes() {
  // return request({
  //   url: '/vue-element-admin/routes',
  //   method: 'get'
  // })
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles(data) {
  return request({
    url: '/Role',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/Role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/Role`,
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/Role`,
    method: 'delete',
    params: data
  })
}
export function roleForMenu(data) {
  return request({
    url: '/Role/RoleForMenu',
    method: 'post',
    data
  })
}
export function roleForUser(data) {
  return request({
    url: '/Role/RoleForUser',
    method: 'post',
    data
  })
}

export function cancelRoleForUser(data) {
  return request({
    url: '/Role/CancelRoleForUser',
    method: 'post',
    data
  })
}
