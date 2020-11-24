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
