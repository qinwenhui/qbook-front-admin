import { asyncRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/system'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(menus, route) {
  if (route.meta) {
    for(let i=0;i<menus.length;i++){
      const menu = menus[i];
      const nameAndPath = menu.url.split(",");
      const name = nameAndPath[0];
      const path = nameAndPath[1];
      if (route.name === name && route.path === path) {
        //设置meta
        route.meta.title=menu.name;
        route.meta.icon=menu.icon;
        return true;
      }
    }
    return false;
  }else{
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise((resolve) => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  getMenus({ commit } ) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_MENUS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
