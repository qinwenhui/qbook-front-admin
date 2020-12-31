import { asyncRoutes, constantRoutes } from '@/router'
/**
 * 生成菜单
 */
export function generateRoutes (menus) {
    return filterAsyncRoutes(asyncRoutes, menus)
}
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
          route.id = menu.id
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
function filterAsyncRoutes(routes, menus) {
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
