<template>
  <section class="container">
    <Header />
    <el-container>
      <el-aside>
        <Menu :isCollapse="isCollapse"/>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Menu from '@/components/Main/menu.vue'
import Header from '@/components/Main/Header.vue'
@Component({
  components: { Menu, Header }
})
export default class Main extends Vue {
  isCollapse = false
}
</script>

<style lang="scss" scoped>
.container{
  min-width: 1200px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .el-container{
    height: 100%;
    .el-aside{
      position: relative;
      width: auto!important;
      max-width: 230px;
      border-right: 1px solid $border-color1;
    }
  }
}
</style>
