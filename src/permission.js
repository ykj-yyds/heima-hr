import router, { asyncRoutes } from '@/router'
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
      // 判断是否获取到用户信息
      if (!store.getters.userId) {
        // 在路由跳转前获取用户信息 在这里获取是为了之后权限管理做铺垫
        const menus = await store.dispatch('user/getUserInfo')

        // 返回一个数组
        const filterRoutes = asyncRoutes.filter(route => {
          // 获取到所有路由对象里第一项的name属性
          const routeName = route.children[0].name

          // 判断用户信息中的权限点是否在所有的路由中 返回布尔值 如果为true就添加到新数组中
          return menus.includes(routeName)
        })

        // 解决页面404bug 把404 添加到动态路由最后面
        filterRoutes.push(
          { path: '*', redirect: '/404', hidden: true }
        )

        // 调用路由方法动态添加
        router.addRoutes(filterRoutes)

        // 调用vuex中定义的合并路由方法
        store.commit('permission/setRoutes', filterRoutes)

        // 处理边界问题  获取所有路由对象里的路由路径组成一个数组
        const allpath = store.state.permission.routes.map(item => item.path)
        console.log(allpath)
        // 解决刷新出现的白屏bug
        // 大家可以这样理解：
        // 之前并没有这些路由，通过 addRoutes 添加后才有了路由，
        // 然后必须告诉 vue-router 你要帮我跳转的那个地址去，
        if (to.path === '/employees/detail') {
          next({
            path: to.fullPath // fullPath路由详细信息
          })
        } else {
          next({
            // 判断要访问的路由存在所有路径里面不 如果存在就跳转 如果不存在就跳到主页
            path: allpath.includes(to.path) ? to.path : '/'// 保证路由添加完了再进入页面 (可以理解为重进一次)
          })
        }
      }

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
