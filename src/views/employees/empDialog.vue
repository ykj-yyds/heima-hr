<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:90%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:90%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:90%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:90%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:90%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:90%" placeholder="请选择部门" @focus="departmentNameFocus" />
      <div v-if="showtree" class="tree-box">
        <el-tree :data="treeData" default-expand-all :props="{ label: 'name' }" @node-click="handleNodeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:90%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import EmployeeEnum from '@/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'EmpDialog',
  data() {
    return {
    // 添加表单字段
    // 字段和后端接口要求的字段要一致
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: EmployeeEnum.hireType, // 聘用形式数据绑定
      treeData: [], // 树形结构数据
      showtree: false // 树形结构数据显示或隐藏
    }
  },

  created() {

  },

  methods: {

    // 当选择框聚焦时触发
    departmentNameFocus() {
      // 调用获取组织架构方法
      this.getDepartments()
    },

    // 获取组织架构数据的方法
    async getDepartments() {
      // 获取组织架构数据
      const res = await getDepartments()
      // 让树形数据显示
      this.showtree = true
      // 将数据里面封装的方法转为树形结构
      this.treeData = tranListToTreeData(res.data.depts, '')
    },

    // 点击取消按钮
    addCancel() {
      // 关闭弹窗
      this.closeDialog()
    },

    // 点击确定按钮
    addSubmit() {
      // 兜底验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 调用添加接口
        const res = await addEmployee(this.formData)
        // 成功后给用户提示
        this.$message.success(res.message)
        // 关闭弹窗
        this.closeDialog()
        // 发射事件重新渲染页面
        this.$emit('addCancel')
      })
    },

    // 关闭弹窗重置表单方法
    closeDialog() {
      // 发射事件 关闭弹框
      this.$emit('close')
      // 重置表单
      this.$refs.addForm.resetFields()
    },

    // 树形组件事件回调
    handleNodeClick(data) {
      // 需求 如果点击的节点存在子节点不能被选中
      if (data && data.children) return
      // 赋值给formData 显示到输入框中
      this.formData.departmentName = data.name
      // 隐藏树形数据
      this.showtree = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
