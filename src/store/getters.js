const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userinfo.staffPhoto, // 用户头像
  name: state => state.user.userinfo.username, // 用户用户名
  companyId: state => state.user.userinfo.companyId, // 公司 ID
  userId: state => state.user.userinfo.userId // 用户id

}
export default getters
