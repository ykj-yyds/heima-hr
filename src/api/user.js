import request from '@/utils/request'

/**
 * @description: 登录
 * @param {*} data {modile, password} 手机号 密码
 * @return {*}
 */
export function login(data) {
  return request({
    url: 'sys/login',
    method: 'post',
    data
  })
}
/**
 * @description: 获取用户信息
 * @return {*}
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'

  })
}
/**
 * @description: 获取用户基本信息
 * @return { Number } id 用户id
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}
