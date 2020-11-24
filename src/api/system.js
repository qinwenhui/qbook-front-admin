import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/admin/admin/userMenuList',
    method: 'get'
  })
}

//查询所有菜单
export function getAllMenu() {
  return request({
    url: '/admin/admin/allMenuList',
    method: 'get'
  })
}

//查询角色
export function getRoles(params) {
  return request({
    url: '/admin/system/rolelist',
    method: 'get',
    params
  })
}
//添加角色
export function addRole(data) {
  console.log(data)
  return request({
    url: '/admin/system/addrole',
    method: 'post',
    data
  })
}
//删除角色
export function deleteRole(id) {
  return request({
    url: '/admin/system/deleterole',
    method: 'get',
    params: { id }
  })
}
//更新角色
export function updateRole(data) {
  return request({
    url: '/admin/system/editrole',
    method: 'post',
    data
  })
}
