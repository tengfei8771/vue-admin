/**
 *  为了保证3级以下路由可以正常的被缓存,需要设计两套数据结构
 *  1.真实的路由将不需要渲染上级的菜单数据全部当做layout的子页面
 *  2.左侧菜单渲染的路由需要根据真实的数据结构进行递归
 */
import Layout from '@/layout'
import {
  getMenubyRole
} from '@/api/menu'
import { constantRoutes } from '@/router'
const state = {
  menuinfo: null,
  rendermenu: null
}
const mutations = {
  SET_MENUINFO: (state, menuinfo) => {
    state.menuinfo = menuinfo
  },
  SET_RENDERMENUINFO: (state, rendermenu) => {
    state.rendermenu = rendermenu
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
          // 真实的路由
          let renderMenuTree = CreateRealParentMenuRouteNode(res.items)
          let realMenuTree = CreateRealParentMenuRouteNode(res.items)
          commit('SET_MENUINFO', constantRoutes.concat(realMenuTree))
          commit('SET_RENDERMENUINFO', constantRoutes.concat(renderMenuTree))
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
// 构造左侧菜单显示的菜单数据
function CreateRenderMenuParentNode(DataSource) {
  let Menu = []
  // 找父ID为0且使用的菜单数据
  DataSource.filter(t => t.MenuParentID === 0 && t.IsUse === 1).forEach(t => {
    let ParentRouteNode = {
      MenuID: t.ID,
      path: t.MenuRoute,
      name:t.MenuName,
      // path = t.MenuPath,
      // component: Layout,
      hidden: t.IsHidden === 1,
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      children: []
    }
    CreateRenderMenuChildrenNode(DataSource, ParentRouteNode)
    Menu.push(ParentRouteNode)
  })
  return Menu
}

function CreateRenderMenuChildrenNode(DataSource, ParentRouteNode) {
  DataSource.filter(t => t.MenuParentID === ParentRouteNode.MenuID && t.IsUse === 1).forEach(t => {

    let ChildrenRoteNode = {
      MenuID: t.ID,
      hidden: t.IsHidden === 1,
      path: t.MenuRoute,
      name:t.MenuName,
      children: [],
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      }
    }
    CreateChildrenMenuRouteNode(DataSource, ChildrenRoteNode)
    ParentRouteNode.children.push(ChildrenRoteNode)
  })
}

// 构造真实路由父节点
function CreateRealParentMenuRouteNode(DataSource) {
  let Menu = []
  // 找父ID为0且使用的菜单数据
  DataSource.filter(t => t.MenuParentID === 0 && t.IsUse === 1).forEach(t => {
    let ParentRouteNode = {
      MenuID: t.ID,
      path: t.MenuRoute,
      component: Layout,
      name:t.MenuName,
      hidden: t.IsHidden === 1,
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      children: []
    }
    CreateChildrenMenuRouteNode(DataSource, ParentRouteNode)
    Menu.push(ParentRouteNode)
  })
  // 现在处理不渲染上级菜单的路由
  let NotRenderMenu = {
    MenuID: 'YZDesign',
    path: 'YZDesign',
    component: Layout,
    name:'yz',
    hidden: true,
    children: []
  }
  // 非父节点,使用的节点,不渲染上级的节点
  DataSource.filter(t => t.MenuParentID !== 0 && t.IsRender === 0 && t.IsUse === 1).forEach(t => {
    let Node = {
      MenuID: t.ID,
      path: t.MenuRoute,
      component: () => require(`${t.MenuPath}`),
      hidden: t.IsHidden === 1,
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      children: [],
      name:t.MenuName,
    }
    NotRenderMenu.children.push(Node)
  })
  Menu.push(NotRenderMenu)
  return Menu
}

// 递归渲染上级的子节点
function CreateChildrenMenuRouteNode(DataSource, ParentRouteNode) {
  // 子节点正常递归
  DataSource.filter(t => t.MenuParentID === ParentRouteNode.MenuID && t.IsRender === 1 && t.IsUse === 1).forEach(t => {
    let ChildrenRoteNode = {
      MenuID: t.ID,
      hidden: t.IsHidden === 1,
      path: t.MenuRoute,
      children: [],
      meta: {
        title: t.MenuName,
        icon: t.MenuIcon
      },
      name:t.MenuName,
    }
    if (t.IsLayout) {
      t.component = Layout
    } else {
      t.component = () => require(`${t.MenuPath}`)
    }
    CreateChildrenMenuRouteNode(DataSource, ChildrenRoteNode)
    ParentRouteNode.children.push(ChildrenRoteNode)
  })
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
