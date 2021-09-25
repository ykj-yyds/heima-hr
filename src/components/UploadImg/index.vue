<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="showProgress" type="circle" :percentage="percent" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 导入 cos 模块
const COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY 秘钥配置
const cos = new COS({
  SecretId: 'AKIDBBvPcbJlvoQmqd9PN4UdV6QUIp69wTji',
  SecretKey: 'jCOJxKRHqADySfcHfmdDVWHlyNVNyIL8'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      percent: 0, // 图片的上传进度
      showProgress: false // 是够显示上传进度
    }
  },
  methods: {
    // 自定义上传方法 形参file 是选中上传的文件详情
    upload(res) {
      if (res.file) {
        // 展示进度条
        this.showProgress = true
        cos.putObject({
          Bucket: 'ykj-1307602623', // 存储桶的名称，必须
          Region: 'ap-nanjing', // 存储桶所在地域，必须字段
          Key: res.file.name, // 文件名，必须
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          // 上传进度条
          onProgress: (progressData) => {
            // 设置进度条进度 * 100 是因为参数里的值是小数
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          // 判断返回的是否有图片地址 然后保存给变量
          if (err === null && data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
          }
          // 关闭进度条
          this.showProgress = false
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
