import store from '@/store'

export default {
  // 在指令插入DOM的时候执行该函数
  inserted(el, binding) {
    // 从 vuex 中取出 points
    const points = store.state.user.userinfo.roles.points
    // 判断是否指令绑定的字符串 是否存在在vuex中取出的按钮权限点
    if (!points.includes(binding.value)) {
      // 移除这元素
      el.parentNode.removeChild(el)
    }
  }

}
