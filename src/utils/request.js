import axios from 'axios'
import { Message } from 'element-ui'

// 创建实例化axios
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://ihrm-java.itheima.net', // 设置axios请求的基础的基础地址
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
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
      // 如果返回的 success 是 false，表明业务出错，直接触发 reject
      // 抛出的错误，被 catch 捕获
      return Promise.reject(new Error(response.data.message))
    }
  }, error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
