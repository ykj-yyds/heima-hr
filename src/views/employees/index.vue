<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #slot-left>
          <span>共 {{ total }} 条记录</span>
        </template>
        <template #slot-right>
          <el-button type="danger" size="small" @click="$router.push('/excel')">导入excel</el-button>
          <el-button type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像">
            <template slot-scope="scope">
              <!-- <img :src="scope.row.staffPhoto" class="staffPhoto"> -->
              <image-holder :src="scope.row.staffPhoto" class="staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column sortable label="入职时间">
            <template slot-scope="scope">
              <span>{{ scope.row.timeOfEntry | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="转正时间" prop="correctionTime">
            <template slot-scope="scope">
              <span>{{ scope.row.correctionTime | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push('/employees/detail?id=' + scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
        <!-- 新增员工弹框组件 -->
        <el-dialog title="新增员工" :visible.sync="showDialog" @close="dialogClose">
          <emp-dialog ref="addEmp" @close="showDialog = false" @addCancel="addCancelFn" />
        </el-dialog>
        <el-dialog
          title="分配角色"
          :visible.sync="showRoleDialog"
          width="50%"
        >
          <assign-role v-if="showRoleDialog" :user-id="userId" @close="showRoleDialog = false" />
        </el-dialog>

      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 导入需要枚举的数据
import EmployeeEnum from '@/constant/employees'
// 导入子组件
import EmpDialog from './empDialog'
// 导入格式化时间的插件
import dayjs from 'dayjs'

import assignRole from './assignRole.vue'
export default {
  name: 'Employees',

  components: {
    EmpDialog,
    assignRole
  },
  // 过滤器
  filters: {
    // 时间转换
    formatTime(time) {
      return time ? dayjs(time).format('YYYY-MM-DD') : '未设置'
    }
  },

  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false, // 添加员工组件的展示
      showRoleDialog: false, // 分配权限弹窗展示隐藏
      userId: '' // 员工id
    }
  },

  created() {
    // 调用获取员工方法
    this.getEmployeeList()
  },

  methods: {
    // 分配权限按钮
    setEmp(id) {
      this.showRoleDialog = true
      this.userId = id
    },

    // 导出 Excel
    downloadExcel() {
      import('@/vendor/Export2Excel').then(async excel => {
        // 调用接口回去需要处理的数据
        const res = await getEmployeeList(this.query)
        // 调用处理数据方法并传入数据
        const rows = this.transData(res.data.rows)
        // console.log(rows)
        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: rows.header, // 表头 必填
          data: rows.results, // 具体数据 必填
          filename: '员工明细', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },

    // 处理表格需要的数据
    transData(data) {
      // 枚举需要的数据
      const map = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      // 获取第一项里面的所有英文key
      const headerKeys = Object.keys(data[0])

      // 遍历所有英文key使用枚举赋值为中文key并返回一个数组
      const header = headerKeys.map(item => {
        return map[item]
      })
      // 遍历详细数据获获取所有的内容 并返回Object.values可以返回一个数组 而 map也可以返回一个数组 [[]] 就是需要的格式
      const results = data.map(item => {
        return Object.values(item)
      })
      // 把转换过的数据返回到调用处
      return {
        header,
        results
      }
    },

    // 弹窗关闭获取子组件实例调用子组件方法
    dialogClose() {
      this.$refs.addEmp.closeDialog()
    },

    // 子传父发射事件再新增后重新渲染列表
    addCancelFn() {
      // 调用获取员工方法
      this.getEmployeeList()
    },

    // 删除员工
    async  delEmp(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')
      // 调用接口删除
      const res = await delEmployee(id)

      // 判断是不是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 删除成功后提示
      this.$message.success(res.message)
      // 重新获取员工渲染页面
      this.getEmployeeList()
    },

    // 用来格式化内容组件自带属性的回调
    formatter(row, column, cellValue, index) {
      // 枚举方式 先准备一份和数据关系对应的数据
      const obj = EmployeeEnum.hireType.find(item => item.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },

    // 获取员工列表方法
    async getEmployeeList() {
      const res = await getEmployeeList(this.query)
      this.employeesList = res.data.rows
      this.total = res.data.total
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      // 调用获取员工方法
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      // 调用获取员工方法
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
