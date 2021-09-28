import power from './power'

export default {

  // 这个回调函数是必须的  Vue是自带传入的
  install(Vue) {
    // 创建按钮级权限控制的自定义指令
    Vue.directive('power', power)
  }
}
