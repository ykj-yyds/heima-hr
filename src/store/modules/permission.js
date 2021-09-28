// 合并动态路由和静态路由
import { constantRoutes } from '@/router'

export default {
  namespaced: true, // 开启命名空间

  state: () => ({
    routes: constantRoutes // 默认静态路由
  }),

  mutations: {
    // 设置动态路由方法
    setRoutes(state, asyncRoutes) {
      // 将动态路由和静态路由组合起来
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
