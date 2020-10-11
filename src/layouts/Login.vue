<script lang="jsx">

const imgs = [
  'login_bg1.jpg',
  'login_bg2.jpg',
  'login_bg3.jpg',
  'login_bg4.jpg'
]

const icons = [
  'wechat',
  'qq',
  'weibo-circle',
  'alipay-circle',
  'taobao-circle'
]

const state = {
  currentIndex: 0
}

export default {
  data () { return state },

  mounted () {
    this.timer = setInterval(() => {
      this.currentIndex++
      if (this.currentIndex >= imgs.length) {
        this.currentIndex = 0
      }
    }, 4000)
  },

  beforeDestroy () { clearInterval(this.timer) },

  render () {
    const { currentIndex } = this
    return (
      <section class="login">
        <ul>
          {
            imgs.map((img, i) => (
              <transition name="img">
                <li v-show={currentIndex === i}>
                  <img src={require(`@/assets/images/${img}`)} />
                </li>
              </transition>
            ))
          }
        </ul>
        <section class="form-container">
          <header>
            <h1 class="logo">
              <img src={require('@/assets/images/logo.png')} alt="美团" />
            </h1>
            <div class="btns">
              <router-link to={{ name: 'phoneLogin' }}>短信登录</router-link>
              <router-link to={{ name: 'passwordLogin' }}>密码登录</router-link>
            </div>
          </header>
          <router-view />
          <footer>
            <a-tag color="blue">第三方合作平台登录</a-tag>
            <div class="icons">
              {icons.map(icon => <a-icon type={icon}/>)}
            </div>
          </footer>
        </section>
      </section>
    )
  }
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
    user-select: none;
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
  .form-container{
    width: 400px;
    background-color: rgba($color: $bg-color, $alpha: .4);
    padding: 20px;
    backdrop-filter: blur(3px) brightness(100%);
    border-radius: 10px;
    box-shadow: 0 0 20px rgba($color: $bg-color, $alpha: .5);
    @extend .center;
    header {
      @extend .flex;
      flex-direction: column;
      h1 {
        width: 100px;
      }
      .btns {
        width: 100%;
        padding: 20px 0;
        @extend .flex;
        justify-content: space-evenly;
        a {
          padding: 5px 20px;
          color: $color2;
          background-color: $bg-color;
          border-radius: 4px;
          font-size: 16px;
          font-family: 楷体;
          font-weight: bold;
          &.router-link-active {
            box-shadow: inset -3px -3px 4px rgba($color: $bg-color, $alpha: 1.0),
                        inset 3px 3px 4px rgba($color: #000000, $alpha: .2);
            color: $theme;
          }
        }
      }
    }
  }
  footer {
    @extend .flex;
    flex-direction: column;
    .icons {
      width: 100%;
      margin-top: 20px;
      @extend .flex;
      justify-content: space-evenly;
      .anticon{
        font-size: 30px;
        cursor: pointer;
        &.anticon-wechat{
          color: #71B812;
        }
        &.anticon-qq{
          color: #2DADEC;
        }
        &.anticon-weibo-circle{
          color: #272636;
        }
        &.anticon-alipay-circle{
          color: #00AFF0;
        }
        &.anticon-taobao-circle{
          color: #FF9F00;
        }
      }
    }
  }
}
</style>
