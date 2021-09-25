// 导入组件
import PageTools from '@/components/PageTools'

import UploadExcel from './UploadExcel'

import UploadImg from './UploadImg'
const components = [
  PageTools,
  UploadExcel,
  UploadImg
]
// Vue.use 可以接收一个对象或函数 如果是对象里面必须有install方法
// 会自动执行该方法 会传入Vue作为形参进行操作
export default {
  install(Vue) {
    components.forEach(component => {
      // 全局注册组价
      Vue.component(component.name, component)
    })
  }
}
