<template>
  <div>
    <!-- 渲染角色列表 -->
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox
        v-for="item in roleList"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}</el-checkbox>

    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="addRole">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [], // 保存当前选中的权限列表
      roleList: [] // 角色列表数据
    }
  },

  created() {
    // 调用获取角色列表方法
    this.getRoles()
    // 调用获取用户基本信息
    this.getUserDetail()
  },

  methods: {
    // 获取用户信息方法 做权限回填使用
    async  getUserDetail() {
      const res = await getUserDetailById(this.userId)
      this.roleIds = res.data.roleIds
    },

    // 获取角色列表
    async  getRoles() {
      // 调用获取角色列表接口
      const res = await getRoles()
      this.roleList = res.data.rows
    },

    // 点击确认员工角色分配
    async addRole() {
    // 调用 API，传入参数
      const res = await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 员工分配成功，给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.$emit('close')
      // 重新获取当前当前列表数据
      this.getRoles()
    },

    // 取消弹框
    cancleDialog() {
      // 发射事件关闭弹窗
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
