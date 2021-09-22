<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染  绑定渲染数据:data="rolesList" -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column label="角色名" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 新增弹框 -->
        <el-dialog
          title="新增角色"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="showDialog"
          @close="cancleRoles"
        >
          <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>

          <!-- 底部 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" @click="cancleRoles">取消</el-button>
              <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoles,
  getCompanyInfo,
  addRole,
  getRoleId,
  updateRole,
  deleteRole
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData: {}, // 公司信息
      showDialog: false, // 弹窗显示隐藏
      roleForm: { // 表单数据
        name: '',
        description: ''
      },
      // 添加角色验证
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false // 是否是编辑
    }
  },

  computed: {
    // 映射gettsers方法获取公司id
    ...mapGetters(['companyId'])
  },

  created() {
    // 调用获取角色用户信息方法
    this.getRoles()
    // 调用回去公司信息方法
    this.getCompanyInfo()
  },

  methods: {
    // 点击新增角色按钮
    addRoleBtn() {
      // 显示弹窗
      this.showDialog = true
      // 控制变量
      this.isEdit = false
    },

    // 弹窗取消方法
    cancleRoles() {
      // 关闭弹窗
      this.showDialog = false
      // 获取表单调用重置表单方法
      this.$refs.roleForm.resetFields()
    },

    // 弹窗确认方法
    roleSubmit() {
      // 获取表单调用兜底验证方法
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        if (!this.isEdit) {
          const res = await addRole(this.roleForm)
          // 根据状态码判断请求成功与否
          if (!res.success) return this.$message.error(res.message)
          // 添加成功，给用户进行提示
          this.$message.success(res.message)
        } else {
          // 调用更新信息接口
          const res = await updateRole(this.roleForm)
          // 根据状态码判断请求成功与否
          if (!res.success) return this.$message.error(res.message)
          // 添加成功，给用户进行提示
          this.$message.success(res.message)
        }

        // 重新获取权限列表数据
        this.getRoles()
        // 隐藏弹框
        this.showDialog = false
      })
    },

    // 获取公司信息方法
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      console.log(res)
      this.formData = res.data
    },

    // 获取所有角色信息方法
    async getRoles() {
      const res = await getRoles(this.query)
      console.log(res)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(NewPagesize) {
      // 当页面改变拿新的值赋值
      this.query.pagesize = NewPagesize
      // 重新发起请求
      this.getRoles()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(NewPage) {
      this.query.page = NewPage
      // 重新发起请求
      this.getRoles()
    },

    // 设置角色
    setRoles() {},

    // 编辑角色
    async  editRoles(id) {
      this.isEdit = true
      // 弹框显示
      this.showDialog = true
      // 调用API
      const res = await getRoleId(id)
      // console.log(res)
      // 数据回填
      this.roleForm = res.data
    },

    // 删除角色
    async  delRoles(id) {
      const delRes = await this.$confirm('您确定要删除该角色吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')
      // 调用接口传入id删除
      const res = await deleteRole(id)
      // 判断是否是当前也的最后一条数据
      if (this.rolesList.length === 1) {
        // 如果是最后一条删除后页码还回上一页
        this.query.page--
        // 判断是不是第一页的最后一条数据
        if (this.query.page <= 0) {
          // 如果是让页码为1
          this.query.page = 1
        }
      }
      // 删除成功后给提示
      this.$message.success(res.message)
      // 重新获取数据
      this.getRoles()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
