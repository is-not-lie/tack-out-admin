<script>
import { mapActions } from 'vuex'
import { phoneVerify, pwdVerify, getSvg } from './common'

const state = {
  phone: '',
  password: '',
  captcha: '',
  svg: ''
}

const methods = {
  ...mapActions(['login', 'getUserRoutes']),

  // 初始化 svg 验证码
  initCaptcha () {
    getSvg()
      .then(svg => { this.svg = svg })
      .catch(() => {})
  },

  // 登录按钮回调
  async handleSubmit (e) {
    e.preventDefault()

    try {
      await phoneVerify(this.phone)
      await pwdVerify(this.password)
      const user = await this.login({
        phone: this.phone,
        password: this.password,
        captcha: this.captcha
      })
      const userRouter = await this.getUserRoutes()
      this.$router.addRoutes(userRouter)
      if (user.rank > 0) this.$router.replace('/home')
      else this.$router.replace('/notshop')
    } catch (err) {
      this.$message.error(err.message)
    }
  },

  // 重置按钮回调
  handleReset () {
    this.phone = ''
    this.password = ''
    this.captcha = ''
    this.initCaptcha()
  },

  // 更新 svg 验证码
  updateCaptcha () {
    clearTimeout(this.timer)
    this.timer = setTimeout(this.initCaptcha, 400)
  }
}

export default {
  data () { return state },

  methods,

  beforeMount () { this.initCaptcha() },

  render () {
    const { svg } = this
    return (
      <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <div>
          <a-icon type="phone" />
          <input type="del" v-model={this.phone} placeholder="手机号" maxlength="11" minlength="11"/>
        </div>
        <div>
          <a-icon type="lock" />
          <input type="password" v-model={this.password} placeholder="密码" minlength="6" maxlength="20"/>
        </div>
        <div>
          <a-icon type="code" />
          <input v-model={this.captcha} placeholder="验证码" maxlength="4" minlength="4"/>
          <span onClick={this.updateCaptcha} domPropsInnerHTML={svg}/>
        </div>
        <div class="btns">
          <button type="submit">登录</button>
          <button type="reset">重置</button>
        </div>
      </form>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
