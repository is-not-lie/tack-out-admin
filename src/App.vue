<template>
  <a-config-provider>
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

@Component
export default class App extends Vue {
  // locale = zhCN
}
</script>

<style lang="scss" scoped>
#app{
  height: 100vh;
  overflow: hidden;
}
</style>
