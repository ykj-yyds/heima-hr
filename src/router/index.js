import Vue from 'vue'
import Router from 'vue-router'
// 引入多个动态路由模块
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// 动态路由表之后根据权限判断是否可以访问
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter, // 本期不实现功能
  attendancesRouter, // 本期不实现功能
  salarysRouter, // 本期不实现功能
  socialRouter // 本期不实现功能
]
// 静态路由表 代表着所有用户都可以访问的路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: 'excel',
    component: Layout,
    children: [{
      path: '',
      name: 'Excel',
      component: () => import('@/views/excel'),
      hidden: true
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 动态路由和静态路由合并
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由方法 是这个框架自带的
export function resetRouter() {
  // 重新实例化
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
