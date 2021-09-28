<template>
  <div>
    <div>
      <el-tree
        ref="tree"
        :data="permissionList"
        :props="{ label:'name' }"
        show-checkbox
        default-expand-all
        check-strictly
        node-key="id"
      />
    </div>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/Permission'
import { tranListToTreeData } from '@/utils/index'
import { getRoleId, assignPerm } from '@/api/setting'
export default {
  name: 'AssignPermission',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      permissionList: [] // 树形权限列表数据
    }
  },
  created() {
    // 调用获取权限列表方法
    this.getPermissionList()
    // 调用获取用户详情方法
    this.getRoleId()
  },
  methods: {
    // 获取用户详情信息
    async  getRoleId() {
      const res = await getRoleId(this.roleId)
      // 使用组件自带方法进行回填
      this.$refs.tree.setCheckedKeys(res.data.permIds)
    },

    // 获取权限列表方法
    async  getPermissionList() {
      const res = await getPermissionList()
      this.permissionList = tranListToTreeData(res.data, '0')
    },

    // 取消按钮
    cancelButton() {
      this.$emit('close')
    },

    // 确认按钮
    async  setRolesBtn() {
      // 获取选中项的 ID
      const permIds = this.$refs.tree.getCheckedKeys()
      const res = await assignPerm({ id: this.roleId, permIds })
      this.$message.success(res.message)

      // 关闭弹框
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
