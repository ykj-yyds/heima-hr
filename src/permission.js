import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css' // 进度条插件 style

import getPageTitle from '@/utils/get-page-title'
// 不需要token的白名单
const whiteList = ['/login', '/404']

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 获取token
  const token = store.state.user.token
  // 开启进度条
  NProgress.start()
  // 判断是否有token
  if (token) {
    // 如果有token去的是登录页跳转到主页
    if (to.path === '/login') {
      next('/')
    } else {
      // 在路由跳转前获取用户信息 在这里获取是为了之后权限管理做铺垫
      await store.dispatch('user/getUserInfo')
      // 如果去的是别的页面直接放行
      next()
    }
  } else {
    // 如果没有token 去的是白名单也直接放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果去的不是白名单就直接跳转的登录页面
      next('/login')
    }
  }
  // 关闭进度条
  NProgress.done()
})
// 路由前置守卫 设置网页标题
router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  next()
})
// 路由后置守卫
router.afterEach((to, from) => {
  // 关闭进度条
  NProgress.done()
})
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
