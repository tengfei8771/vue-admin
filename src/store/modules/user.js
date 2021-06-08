import { login, getInfo } from '@/api/user'
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  removeAllToken
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userinfo: null
}

export function getUserinfo() {
  if (state.userinfo == null) {
    let UserBase64Str = getToken().split('.')[1] // 获取用户信息部分
    let commonContent = UserBase64Str.replace(/\s/g, '+')
    commonContent = Buffer.from(commonContent, 'base64').toString()
    mutations.SET_USERINFO(state, JSON.parse(commonContent))
  }

  // return state.userinfo
}
const mutations = {
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        // username: username.trim(),
        // password: password
        Account: username.trim(),
        pwd: password
      })
        .then(response => {
          const data = response.data
          if (data.code === 50000) {
            let tokenArr = data.items
            let requestToken = tokenArr.RequestToken
            let refreshToken = tokenArr.RefreshToken
            commit('SET_TOKEN', requestToken)
            // 放置请求token
            setToken(requestToken)
            // 放置refreshtoken
            setRefreshToken(refreshToken)
            let UserBase64Str = requestToken.split('.')[1] // 获取用户信息部分
            let commonContent = UserBase64Str.replace(/\s/g, '+')
            commonContent = Buffer.from(commonContent, 'base64').toString()
            mutations.SET_USERINFO(state, JSON.parse(commonContent))
            console.log(state.userinfo)
          }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name, avatar, introduction } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      dispatch('menu/setMenu', null, { root: true })
      dispatch('menu/setRenderMenu', null, { root: true })
      removeAllToken()
      resetRouter()
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', null)
      commit('SET_ROLES', [])
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
