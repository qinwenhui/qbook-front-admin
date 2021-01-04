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

//查询某个角色的菜单
export function getMenuByRole(roleId) {
  return request({
    url: '/admin/admin/userMenuListByRole',
    method: 'get',
    params: { roleId }
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
//添加角色和对应权限
export function addRoleAndMenu(data) {
  console.log(data)
  return request({
    url: '/admin/system/addroleandmenu',
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
//删除角色以及对应菜单权限
export function deleteRoleAndMenu(id) {
  return request({
    url: '/admin/system/deleteroleandmenu',
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
//更新角色以及对应菜单权限
export function updateRoleAndMenu(data) {
  return request({
    url: '/admin/system/editroleandmenu',
    method: 'post',
    data
  })
}
//查询权限列表
export function getPermission(params) {
  return request({
    url: '/admin/system/permissionlist',
    method: 'get',
    params
  })
}
//添加权限
export function addPermission(data) {
  return request({
    url: '/admin/system/addpermission',
    method: 'post',
    data
  })
}
//编辑权限
export function updatePermission(data) {
  return request({
    url: '/admin/system/editpermission',
    method: 'post',
    data
  })
}
//删除权限
export function deletePermission(id) {
  return request({
    url: '/admin/system/deletepermission',
    method: 'get',
    params: { id }
  })
}
//修改角色的接口权限
export function updateRoleAndPermission(params){
  return request({
    url: '/admin/system/addrolepermissionall',
    method: 'get',
    params
  })
}