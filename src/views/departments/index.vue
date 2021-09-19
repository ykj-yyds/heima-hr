<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="组织架构" name="first" class="tab-pane">
            <!-- 使用 Layout 布局绘制头部区域 -->
            <el-row type="flex" justify="space-between" align="middle" class="department-header">
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">江苏传智播客教育科技股份有限公司</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <el-col>负责人</el-col>
                  <el-col>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDeptFn('')">添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 主体区域绘制 -->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="true">
              <template slot-scope="{ data }">
                <el-row type="flex" justify="space-between" style="height: 50px; width: 100%;" align="middle">
                  <el-col :span="20">
                    <span>{{ data.name }}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <el-col>{{ data.manager }}</el-col>
                      <el-col>
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right" />
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="addDeptFn(data.id)">添加子部门</el-dropdown-item>
                            <el-dropdown-item @click.native="editDeptFn(data.id)">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="data && !data.children" @click.native="deitDeptFn(data.id)">删除部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        <!-- 添加或编辑弹框 -->
        <el-dialog
          title="添加或编辑"
          :visible.sync="showDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          @close="closeDialogFn"
        >
          <!-- 添加子组件弹层 -->
          <deptDialog
            ref="deptDialog"
            :origin-list="originList"
            :parent-id="parentId"
            :is-edit="isEdit"
            @close="closeFn"
          />

        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartments, delDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
// 导入子组件
import deptDialog from './DeptDialog'
export default {
  name: 'Departments',
  components: {
    deptDialog
  },

  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      treeData: [], // 树形数据

      // 定义结构显示
      defaultProps: {
        label: 'name'
      },
      showDialog: false, // 控制弹出框显示隐藏
      parentId: '', // 父级 ID
      isEdit: false, // 是否是编辑状态
      originList: [] // 格式化后的验证所需数据
    }
  },
  created() {
    // 调用获取组织架构方法
    this.getDepartments()
  },
  methods: {
    // 点击×号清除
    closeDialogFn() {
      // this.$refs.deptDialog 获取组件实例对象  调用子组件里的方法
      this.$refs.deptDialog.resetform()
    },

    // 添加子传父事件
    closeFn() {
      // 关闭弹窗
      this.showDialog = false
      // 调用获取组织架构方法
      this.getDepartments()
    },

    // 编辑
    editDeptFn(id) {
      // 把父部门id赋值
      this.parentId = id
      // 显示弹窗
      this.showDialog = true
      // / isEdit 为 false，说明是添加
      this.isEdit = true
    },

    // 删除部门
    async deitDeptFn(id) {
      // 显示删除确认消息对话框
      const delRes = await this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (delRes === 'cancel') return this.$message('您取消了删除')
      const res = await delDepartment(id)
      // 重新渲染列表
      this.getDepartments()
      // 提示
      this.$message.success(res.message)
    },

    // 添加子部门
    addDeptFn(id) {
      // 把父部门id赋值
      this.parentId = id
      // 显示弹窗
      this.showDialog = true
      // / isEdit 为 false，说明是添加
      this.isEdit = false
    },

    // 获取组织架构数据方法
    async   getDepartments() {
      const res = await getDepartments()
      // 格式化验证所需数据 map数组方法
      this.originList = res.data.depts.map(item => ({
        id: item.id,
        pid: item.pid,
        name: item.name,
        code: item.code
      }))
      // console.log(res)
      // 将数据转换为树形结构
      this.treeData = tranListToTreeData(res.data.depts, '')
    }

  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .departments-tree {
  margin: 12px 0px;
}
}
</style>

