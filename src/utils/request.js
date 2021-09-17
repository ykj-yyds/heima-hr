import axios from 'axios'
// Message是vue原型上的一个方法
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// 创建实例化axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://ihrm-java.itheima.net', // 设置axios请求的基础的基础地址
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取token
    const token = store.state.user.token
    // 判断vuex里是否有token如果有在请求前携带请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(

  response => {
    if (response.data.success) {
      // 数据正常，进行的逻辑功能
      return response.data
    } else {
      Message({
        message: response.data.message,
        type: 'error'
      })
      // 如果返回的 success 是 false，表明业务出错，直接触发 reject
      // 抛出的错误，被 catch 捕获
      return Promise.reject(new Error(response.data.message))
    }
  }, error => {
    // 对响应错误做点什么
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 清楚用户信息和token
      store.dispatch('user/userLogout')
      // 跳转到登录页
      router.push('/login')
      Message({
        message: '请重新登录',
        type: 'error'

      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }

)

export default service
