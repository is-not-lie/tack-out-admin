<template>
  <el-menu
    :default-active="$route.path"
    unique-opened
    router
    :collapse-transition="false"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse">
    <el-menu-item :index="home.name" :route="{name: home.name}">
      <i :class="home.icon"></i>
      <span>{{home.title}}</span>
    </el-menu-item>
    <el-submenu v-for="(menu, i) in menus" :key="i" :index="menu.name">
      <template v-slot:title>
        <i :class="menu.icon"></i>
        <span>{{menu.title}}</span>
      </template>
      <el-menu-item v-for="(item, i) in menu.children" :key="i" :index="item.path"
      :route="{name: item.name}">
        <i :class="item.icon"></i>
        <span>{{item.title}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { menuData } from '@/data'

@Component
export default class Menu extends Vue {
  @Prop() isCollapse: boolean

  get home () { return menuData.find(menu => menu.name === 'home') }

  get menus () {
    const { userAuthority } = this.$route.meta
    const { authority } = this.$store.state.user
    return menuData.filter(menu => menu.authId <= authority && menu.name !== 'home')
  }

  handleOpen (key, keyPath) {
    console.log(key, keyPath)
  }

  handleClose (key, keyPath) {
    console.log(key, keyPath)
  }
}
</script>

<style lang="scss" scoped>
.el-menu{
  border: none!important;
}
i{
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  color: #909399;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
