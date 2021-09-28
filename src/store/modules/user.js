// 引入已经封装好的操作token的方法
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 导入重置路由方法
import { resetRouter } from '@/router'
const state = {
  // 调用获取token的方法
  token: getToken() || null,
  userinfo: {} // 用户信息
}

const mutations = {
  // 设置token
  setToken(state, newtoken) {
    // 保存到vuex
    state.token = newtoken
    // 保存到本地
    setToken(newtoken)
  },
  // 移出token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userinfo) {
    state.userinfo = userinfo
  },
  // 移出用户信息
  removeUserInfo(state) {
    state.userinfo = {}
  }
}

const actions = {
  // 用户登录获取token
  async userLogin(context, obj) {
    const res = await login(obj)
    console.log(res)
    // 掉用mutations方法
    context.commit('setToken', res.data)
  },
  // 获取用户信息
  async  getUserInfo(context) {
    const res = await getUserInfo()
    // console.log(res)
    const resp = await getUserDetailById(res.data.userId)
    // console.log(resp)
    context.commit('setUserInfo', { ...res.data, ...resp.data })
    return res.data.roles.menus
  },
  // 退出功能
  userLogout(context) {
    // 移除 token
    context.commit('removeToken')

    // 移除 userInfo
    context.commit('removeUserInfo')

    // 调用重置路由方法
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

