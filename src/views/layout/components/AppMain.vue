<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- 如果为路由出口定义一个唯一key值，那麽路由会被强制重新渲染 -->
      <router-view :key="key"/>
      <!-- 如果路由指向同一个页面，路由出口显示的页面组件不会重现被渲染 -->
      <!-- <router-view/> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',

  // 计算属性
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
