import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/admin/loginUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/admin/logout',
    method: 'get'
  })
}

//获取用户列表
export function getUserList(params) {
  return request({
    url: '/admin/admin/userlist',
    method: 'get',
    params
  })
}

//修改用户
export function updateUser(data) {
  return request({
    url: '/admin/admin/updateUser',
    method: 'post',
    data
  })
}