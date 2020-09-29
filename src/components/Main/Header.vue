<template>
  <header>
    <h1>
      <img src="~img/logo.png" alt="美团商家">
      美团商家
    </h1>
    <div class="title">
      <span>{{time}}</span>
    </div>
    <div class="user">
      <img :src="user.avatar_url" alt="用户头像">
      <span>{{user.userName}}</span>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  user = this.$store.state.user

  get time () {
    const time = new Date().getHours()
    switch (time) {
      case 0 | 1 | 2 | 3 | 4 | 5:
        return '已经很晚了,该睡觉了哦'
      case 12:
        return '中午好'
      case 18:
        return '已经是傍晚了哦'
      default:
        if (time <= 11) return '早上好'
        else if (time <= 17) return '下午好'
        else return '晚上好'
    }
  }
}
</script>

<style lang="scss" scoped>
header{
  min-width: 1200px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid $border-color1;
  h1{
    @extend .flex;
    padding: 0 20px;
    img{
      margin-right: 10px;
    }
  }
  .title{
    @extend .flex;
  }
  .user{
    @extend .flex;
    img{
      margin-right: 20px;
    }
  }
  img{
    width: 40px;
    height: 40px;
  }
}
</style>
