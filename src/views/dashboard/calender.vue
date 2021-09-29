<template>
  <el-calendar v-model="currentDate">
    <template slot="dateCell" slot-scope="{ date, data }">
      <div class="date-content">
        <span class="text">{{ getDay(data.day) }}</span>
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    getDay(value) {
      // 把字符串转为数组
      const day = value.split('-')[2]
      // startsWith 是否为某个开头
      // slice 截取
      return day.startsWith('0') ? day.slice(1) : day
    },
    // 判断是否为周末
    isWeek(date) {
      // getDay() 原生方法获取当前日期周几 如果是周日返回0 如果是周六返回6
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep td.next {
  display: none;
}
::v-deep .current ~ td {
  display: revert !important;
}

::v-deep .next ~ td {
  display: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
</style>
