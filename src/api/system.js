import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/admin/userMenuList',
    method: 'get'
  })
}