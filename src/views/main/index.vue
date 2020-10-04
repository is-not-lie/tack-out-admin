<template>
  <a-layout class="layout">
    <a-layout-sider v-model="collapsed" :theme="pm? 'light' : 'dark'" :trigger="null" collapsible>
      <h1 class="logo">
        <img src="~img/logo.png" alt="美团外卖">
      </h1>
      <Menu :menuData="filterMenuData" mode="inline"/>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :class="pm? 'light' : 'dark'">
        <a-icon
          class="trigger"
          :class="pm? 'light' : 'dark'"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content :class="pm? 'light' : 'dark'">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { Hours } from '@/typings/CommonClass'
import { menuData } from '@/data'
import Menu from '@/components/Common/Menu.vue'

@Component({
  components: { Menu }
})
export default class Index extends Hours {
  get filterMenuData () {
    const { user } = this.$store.state
    return menuData.filter(item => item.authId <= user.authority)
  }
}
</script>

<style lang="scss" scoped>
.layout{
  min-width: 1300px;
  max-width: 100vw;
  height: 100%;
  user-select: none;
  .logo{
    height: 50px;
    @extend .flex;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    margin-bottom: 10px;
  }
  .ant-layout-header{
    .trigger{
      font-size: 20px;
      &.dark{
        color: $subtopic;
      }
    }
    &.light{
      background-color: #fff;
    }
    &.dark{
      background-color: $dark;
    }
  }
  .ant-layout-content{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &.dark{
      background-color: #F5F7F9;
    }
  }
}
</style>
