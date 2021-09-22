import request from '@/utils/request'

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeeList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}
