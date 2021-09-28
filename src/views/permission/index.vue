<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <!-- addPermission 第一个参数 区分权限不同 type 为1 是菜单权限 为2 是按钮权限 -->
          <!-- addPermission 第二个参数  如果是页面的按钮 pid 需要为父级的id -->
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.type === 1" type="text" @click="addPermission(2, scope.row.id)">添加</el-button>
              <el-button type="text" @click="editPerHander(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置一个弹层 用来编辑新增节点 -->
        <el-dialog :title="isEdit ? '编辑权限点' : '新增权限点'" :visible="showDialog" @close="btnCancel">
          <!-- 表单 -->
          <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="formData.name" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限标识" prop="code">
              <el-input v-model="formData.code" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限描述">
              <el-input v-model="formData.description" style="width:90%" />
            </el-form-item>
            <el-form-item label="开启">
              <el-switch
                v-model="formData.enVisible"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-form>
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" type="primary" @click="addPermissionSubmit">确定</el-button>
              <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, getPermissionDetail, updatePermission, delPermission } from '@/api/Permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    // 校验权限名称：同级不能出现同名的 权限名称
    const validName = (rule, value, callback) => {
      // 根据pid 找到兄弟节点
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)
      // 判断编辑状态
      if (this.isEdit) {
        // 找出兄弟节点并排除自身
        existNameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }
      existNameList.map(item => item.name).includes(value) ? callback(new Error(value + '已经占用'))
        : callback()
    }

    // 校验权限标识：项目中的 权限标识 是唯一的
    const validCode = (rule, value, callback) => {
      let existNameList = this.originList
      // 如果是编辑排除自身
      if (this.isEdit) {
        existNameList = this.originList.filter(item => item.id !== this.formData.id)
      }
      existNameList.map(item => item.code).includes(value) ? callback(new Error(value + '已经占用'))
        : callback()
    }

    return {
      permissionList: [], // 权限管理列表数据
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      },
      isEdit: false, // 是否是编辑状态
      originList: [] // 验证所需要的数据
    }
  },

  created() {
    // 调用获取权限列表方法
    this.getPermissionList()
  },

  methods: {
    async  delPermission(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')
      // 调用删除接口
      const res = await delPermission(id)
      // 给用户提示
      this.$message.success(res.message)
      // 重新获取列表
      this.getPermissionList()
    },

    // 添加\编辑权限
    addPermissionSubmit() {
      // 兜底验证
      this.$refs.perForm.validate(async valid => {
        if (!valid) return
        // 判断
        this.isEdit ? this.editPermission() : this.addPerHandler()
      })
    },

    // 添加权限点
    async   addPerHandler() {
      // 调用接口
      const res = await addPermission(this.formData)
      // 给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.showDialog = false
      // 重新获取列表数据
      this.getPermissionList()
    },

    // 编辑权限点
    async  editPermission() {
      const res = await updatePermission(this.formData)
      // 给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.showDialog = false
      // 重新获取列表数据
      this.getPermissionList()
    },

    // 点击编辑按钮
    async  editPerHander(id) {
      // 调用接口根据id获取信息
      const res = await getPermissionDetail(id)
      // 进行数据回填
      this.formData = res.data
      // 显示编辑弹框
      this.showDialog = true
      // 设为编辑状态
      this.isEdit = true
    },

    // 两个添加按钮的方法 字段不同添加的权限也不同
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      // 开启弹框
      this.showDialog = true
      // 更改为添加状态
      this.isEdit = false
    },

    // 获取 权限列表方法
    async  getPermissionList() {
      // 调用接口
      const res = await getPermissionList()
      // 精简数据
      this.originList = res.data.map(({ id, pid, name, code }) => ({ id, pid, name: name.trim(), code }))
      // 赋值数据
      this.permissionList = tranListToTreeData(res.data, '0')
    },

    // 关闭弹框
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    }

  }
}
</script>

<style lang="scss" scoped></style>
