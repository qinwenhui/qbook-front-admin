import { asyncRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/system'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  const menus = roles;
  if (route.meta) {
    for(let i=0;i<menus.length;i++){
      const menu = menus[i];
      const nameAndPath = menu.url.split(",");
      const name = nameAndPath[0];
      const path = nameAndPath[1];
      if (route.name == name && route.path == path) {
        //设置meta
        route.meta.title=menu.name;
        route.meta.icon=menu.icon;
        return true;
      }
    }
  }else{
    return true;
  }

  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
  //   return true
  // }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * 逐个判断菜单权限
 */
// export function filterRoutes(routes, menus) {
//   for(let i=0;i<routes.length;i++){
//     const route = routes[i];
//     if (route.name == name && route.path == path) {
//       if (route.children) {
//         filterRoutes(route.children, url)
//       }
//       return route;
//     }
//   }
//   return false;
// }

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      //暂时用自己的获取菜单方式
      getMenu().then(response => {
        console.log('----------获取菜单-------------')
        const { data } = response
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, data);
        console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })

      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
