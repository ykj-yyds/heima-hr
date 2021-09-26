<template>
  <div>
    <el-image :src="src" class="img-container">
      <div slot="error">
        <img src="@/assets/common/head.jpg" alt="默认图片">
      </div>
    </el-image>
  </div>
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

  img {
    width: 100%;
  }
}
</style>
