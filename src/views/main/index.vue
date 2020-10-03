<template>
  <a-layout class="layout">
    <a-layout-sider v-model="collapsed" theme="light" :trigger="null" collapsible>
      <div class="logo"></div>
      <Menu :menuData="filterMenuData" :collapsed="collapsed"/>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-button type="primary" @click="collapsed = !collapsed">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          />
        </a-button>
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { menuData } from '@/data'
import Menu from '@/components/Common/Menu.vue'

@Component({
  components: { Menu }
})
export default class Index extends Vue {
  collapsed = false

  get filterMenuData () {
    const { user } = this.$store.state
    return menuData.filter(item => item.authId <= user.authority)
  }
}
</script>

<style lang="scss" scoped>
.layout{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
