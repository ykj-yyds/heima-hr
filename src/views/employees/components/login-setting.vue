<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      label-width="120px"
      :rules="rules"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateUser">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    // 调用获取用户基本资料方法
    this.getUserDetail()
  },
  methods: {
    // 更新用户信息
    updateUser() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return
        const res = await saveUserDetailById(this.userInfo)
        // 给用户提示
        this.$message.success(res.message)
        // 重新渲染
        this.getUserDetail()
      })
    },

    // 获取用户基本资料方法
    async getUserDetail() {
      const res = await getUserDetailById(this.$route.query.id)
      // 进行赋值  数据回填
      this.userInfo = res.data
    }
  }
}
</script>

<style lang="scss" scoped></style>
