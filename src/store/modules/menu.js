import Layout from '@/layout'
import {
  getMenubyRole
} from '@/api/menu'
const state = {
  menuinfo: null
}
const mutations = {
  SET_MENUINFO: (state, menuinfo) => {
    state.menuinfo = menuinfo
  }
}
const actions = {
  getMenu({
    commit
  }, userId) {
    return new Promise((resolve, reject) => {
      getMenubyRole({
        userId: userId
      }).then(res => {
        if (res.code === 2000) {
          let menuTree = CreateParentMenuNode(res.items)
          console.log(menuTree)
          commit('SET_MENUINFO', menuTree)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

function CreateParentMenuNode(sorceData) {
  let Menu = []
  sorceData.filter(t => t.MenuParentID === 0).forEach(t => {
    let parentRoute = {
      menuID: t.ID,
      path: t.MenuRoute,
      component: Layout,
      name: t.MenuName,
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      children: []
    }
    if (t.MenuObject !== null || t.MenuObject !== '') {
      parentRoute.component = () => require(`${t.MenuPath}`)
    }
    CreateChildrenNode(parentRoute, sorceData)
    Menu.push(parentRoute)
  })
  return Menu
}

function CreateChildrenNode(parentRoute, sorceData) {
  sorceData.filter(t => t.MenuParentID === parentRoute.menuID).forEach(t => {
    let childrenRoute = {
      menuID: t.ID,
      path: t.MenuRoute,
      component: () => require(`${t.MenuPath}`),
      name: t.MenuName,
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      children: []
    }
    if (t.MenuObject !== null || t.MenuObject !== '') {
      childrenRoute.component = () => require(`${t.MenuPath}`)
    } else {
      childrenRoute.component = Layout
    }
    CreateChildrenNode(childrenRoute, sorceData)
    parentRoute.children.push(childrenRoute)
  })
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
