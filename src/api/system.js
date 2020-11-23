import request from '@/utils/request'
import BASE_URL from '@/api/base'

export function getMenu() {
  return request({
    url: BASE_URL + '/admin/userMenuList',
    method: 'get'
  })
}