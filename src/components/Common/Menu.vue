<template>
  <a-menu
    :theme="pm ? 'light': 'dark'"
    :mode="mode"
    :selectable="false"
    :inline-collapsed="collapsed"
    :selectedKeys="[$route.path]"
    :defaultOpenKeys="openKeys">
    <template v-for="item in menuData">
      <a-menu-item :key="item.path" v-if="!item.children" @click="$router.push({ name: item.name })">
        <a-icon :type="item.type" />
        <span>{{item.title}}</span>
      </a-menu-item>
      <a-sub-menu :key="item.name" v-else>
        <span slot="title">
          <a-icon :type="item.type" :theme="item.theme"/>
          <span>{{item.title}}</span>
        </span>
        <Menu :menuData="item.children" :mode="mode"/>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Hours } from '@/typings/CommonClass'

@Component
export default class Menu extends Hours {
  @Prop({ required: true }) menuData!: {
    title: string;
    name: string;
    path?: string;
    type?: string;
    theme?: string;
    children?: object[];
    authId?: number;
  }[]

  @Prop() mode!: string

  get openKeys () {
    const { path } = this.$route
    const current = this.menuData.find(item => new RegExp(item.name).test(path))
    if (current) return [current.name]
    else return []
  }
}
</script>

<style lang="scss" scoped>

</style>
