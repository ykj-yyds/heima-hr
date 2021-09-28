<template>
  <el-image :src="src" class="img-container">
    <template slot="error">
      <img src="@/assets/common/head.jpg" alt="默认图片">
    </template>
  </el-image>
</template>

<script>
export default {
  name: 'ImageHolder',
  props: {
    src: {
      type: String,
      default: '@/assets/common/head.jpg'
    }
  }
}
</script>

<style scoped lang="scss">
.img-container {
  border-radius: 50%;
  // width: 100px;
  // height: 100px;

  img {
    width: 100%;
  }
}
</style>
