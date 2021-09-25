<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img ref="imageUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import EmployeeEnum from '@/constant/employees'
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: {},
      EmployeeEnum
    }
  },
  created() {
    // 调用获取用户基本信息方法
    this.getUserDetail()
  },
  methods: {
    // 保存更新用户信息
    async saveUser() {
      // 获取到子组件的图片地址
      const newimageUrl = this.$refs.imageUrl.imageUrl
      // 保存到要传给后台的请求体中
      this.userInfo.staffPhoto = newimageUrl
      // 调用更改用户信息接口
      const res = await saveUserDetailById(this.userInfo)
      // 重新渲染
      this.getUserDetail()
      // 给用户提示
      this.$message.success(res.message)
    },

    // 获取用户基本信息方法
    async  getUserDetail() {
      const res = await getUserDetailById(this.$route.query.id)
      this.userInfo = res.data
      // 将接口返回的图片地址赋值给子组件的变量展示
      this.$refs.imageUrl.imageUrl = res.data.staffPhoto
    }
  }
}
</script>

<style lang="scss" scoped></style>
