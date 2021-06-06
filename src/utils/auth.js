import Cookies from 'js-cookie'

const RequestKey = 'Admin-RequestToken'
const RefreshKey = 'Admin-RefreshKey'

export function getToken() {
  return Cookies.get(RequestKey)
}

export function setToken(token) {
  return Cookies.set(RequestKey, token)
}

export function removeToken() {
  return Cookies.remove(RequestKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshKey)
}
