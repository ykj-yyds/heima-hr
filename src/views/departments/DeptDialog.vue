<template>
  <div>
    <el-form ref="form" label-width="120px" :rules="rules" :model="form">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
          @change="changeSelectFn"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
        <el-button size="small" @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  name: 'DeptDialog',
  props: {
    parentId: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义编码验证函数
    const validCode = (rule, value, callback) => {
      // 取出数据中所有code返回一个新数组
      let existCodeList = this.originList.map(item => item.code)
      // 先判断是不是编辑状态
      if (this.isEdit) {
        // 先用filter排除自己当前使用的这一项每一项的id和当前父组件传入的id做运算满足这个条件的返回 然后返回一个数组再使用map方法取出code
        existCodeList = this.originList.filter(item => item.id !== this.parentId).map(item => item.code)
      }
      // 查找输入的code是否存在 存在返回false
      existCodeList.includes(value) ? callback(new Error('code重复请重新输入')) : callback()
    }

    // 自定义名称验证函数
    const validName = (rule, value, callback) => {
      // 先用filter找出兄弟部门 然后取出name返回一个数组
      const existNameList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)
      // 判断是否编辑模式
      if (this.isEdit) {
        // 找出来自身
        const dept = this.originList.find(item => item.id === this.parentId)
        // 获取自身的pid
        const pid = dept.pid
        // 找出兄弟部门并且把自己抛出 然后取出兄弟部门的名字
        this.originList.filter(item => item.id === pid && item.id !== this.parentId).map(item => item.name)
      }
      // 查找输入的name是否存在 存在返回false
      existNameList.includes(value) ? callback(new Error('部门名称重复请重新输入')) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      employees: [], // 部门负责人列表
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    // 因为组件没有销毁所以监听id改变的时候重新调用方法
    parentId() {
      // 当前部门数据
      this.getDepartDetailFn()
    }
  },

  created() {
    // 调用获取负责人方法列表
    this.getEmployeeSimpleFn()
    // 当前部门数据
    this.getDepartDetailFn()
  },

  methods: {
    // 获取当前部门数据
    async getDepartDetailFn() {
      if (this.isEdit) {
        const res = await getDepartDetail(this.parentId)
        // 数据回填
        this.form = res.data
      }
    },

    // 获取负责人列表方法
    async  getEmployeeSimpleFn() {
      const res = await getEmployeeSimple()
      // console.log(res)
      this.employees = res.data
    },

    // 添加部门方法
    async  addDepartFn() {
      await addDepartments({ ...this.form, pid: this.parentId })
      // 自定义事件去父组件关闭弹框 重新渲染页面
      this.$emit('close')
    },

    // 编辑部门方法
    async editDepartFn() {
      await updateDepartments(this.form)
      this.$emit('close')
    },

    // 添加编辑确认按钮
    hSubmit() {
      // 获取表单实例对象调用验证方法 参数是个回调函数里面的有个形参 如果全部通过为true
      this.$refs.form.validate((valid) => {
        if (!valid) return

        // 如果为true 执行编辑如果fales
        this.isEdit ? this.editDepartFn() : this.addDepartFn()
        // 调用清空方法
        this.resetform()
      })
    },

    // 下拉框改变触发的方法
    changeSelectFn() {
      // 获取实例对象调用单独验证方法 值可以使字符串和数组 验证规则传入
      this.$refs.form.validateField('manager')
    },

    // 取消方法
    resetform() {
      // 清空表单数据
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 重置表单 这个是获取dom元素调用饿了么中自带的方法
      this.$refs.form.resetFields()
      // 隐藏弹框
      this.$emit('close')
    },

    // 取消编辑确认按钮
    hCancel() {
      // 调用清除方法
      this.resetform()
    }

  }
}
</script>

<style>
</style>
