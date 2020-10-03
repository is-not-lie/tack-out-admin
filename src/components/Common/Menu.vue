<template>
<!-- light -->
  <a-menu
    theme="light"
    mode="inline"
    :inline-collapsed="collapsed"
    :defaultOpenKeys="openKes"
    :defaultSelectedKeys="$route.path">
    <template v-for="item in menuData">
      <a-menu-item :key="item.path" v-if="!item.children">
        <router-link :to="{ name: item.name }">
          <a-icon :type="item.type" />
          <span>{{item.title}}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu :key="item.name" v-else>
        <span slot="title">
          <a-icon :type="item.type" :theme="item.theme"/>
          <span>{{item.title}}</span>
        </span>
        <Menu :menuData="item.children"/>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Menu extends Vue {
  @Prop({ required: true }) menuData!: object[]

  @Prop({ default: false }) collapsed!: boolean

  get openKes () {
    const { path } = this.$route
    const openMenu = this.menuData.find(item => item.name.indexOf(path) !== -1)
    return openMenu.name
  }
}
</script>

<style lang="scss" scoped>

</style>
