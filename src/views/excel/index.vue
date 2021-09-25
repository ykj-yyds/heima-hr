<template>
  <div class="app-container">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!-- 其他代码略 -->
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils'
import { importEmployee } from '@/api/employees'
export default {
  name: 'Excel',

  data() {
    return {}
  },
  methods: {
    // 上传之前的函数
    beforeUpload(file) {
      // 如判断文件的大小是否大于 1 兆
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      // 若小于 1 兆则停止解析并提示错误信息。
      return false
    },
    // 成功调用之后的函数，它会返回表格的表头和内容。
    async  handleSuccess({ results, header }) {
      // 调用方法转换数据
      this.transExcel(results)
      const arr = this.transExcel(results)
      // 调用接口实现批量添加
      const res = await importEmployee(arr)
      // 成功后给用户提示
      this.$message.success(res.message)
      // 返回到上一页
      this.$router.back()
      // this.tableData = results
      // this.tableHeader = header
    },

    // 将表格中的数据进行格式化
    transExcel(results) {
      // 定义需要枚举的数据
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName',
        聘用形式: 'formOfEmployment'
      }
      // 变量内容取出所有key返回到一个数组
      return results.map((item) => {
        // 定义一个最后返回需要的对象
        const obj = {}
        // console.log(item)
        // 获取所有中文key保存
        const contentKeys = Object.keys(item)

        // 对中文key进行遍历找到对应的英文名
        contentKeys.forEach((key) => {
          const transKey = userRelations[key]

          // 判断是否是入职或转正时间
          if (transKey === 'timeOfEntry' || transKey === 'correctionTime') {
            // 对时间进行格式化后重新赋值
            obj[transKey] = new Date(formatExcelDate(item[key]))
          } else {
            // obj[transKey] 是每一个英文key
            // item[key] 是每次遍历里面相对应的值
            // console.log(item[key])
            obj[transKey] = item[key]
          }
        })
        return obj
      })
    }
  }
}
</script>
