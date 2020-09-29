<template>
  <section class="login">
    <ul>
      <transition v-for="(img, i) in loginImgs" :key="i" name="img">
        <li v-show="currentIndex === i">
          <img :src="img" />
        </li>
      </transition>
    </ul>
    <Form />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Form from '@/components/Login/Form.vue'

@Component({
  components: { Form }
})
export default class Login extends Vue {
  timer: number | null
  loginImgs: Array<string> = this.$store.state.globalImgs?.loginPageImgs
  currentIndex = 0

  mounted () {
    this.timer = setInterval(() => {
      this.currentIndex++
      if (this.currentIndex >= this.loginImgs.length) {
        this.currentIndex = 0
      }
    }, 4000)
  }

  beforeDestroy () { clearInterval(this.timer) }
}
</script>

<style lang="scss" scoped>
.img-enter-active,
.img-leave-active{
  transition: opacity 2s;
}

.img-enter,
.img-leave-to{
  opacity: 0;
}

.img-enter-to,
.img-leave{
  opacity: 1;
}

.login{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  ul{
    height: 100%;
    position: relative;
    li{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
