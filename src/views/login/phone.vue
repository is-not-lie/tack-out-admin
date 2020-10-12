<script>
import { mapActions } from 'vuex'
import { phoneVerify, phoneRegExp, sendCode } from './common'

const state = {
  phone: '',
  code: '',
  isSendCode: false,
  sendTime: 60
}

const computed = {
  disabled () { return !phoneRegExp.test(this.phone) },

  sendBtnText () {
    if (this.isSendCode) return `已发送${this.sendTime}s`
    else return '发送验证码'
  }
}

const methods = {
  ...mapActions(['login', 'getUserRoutes']),

  // 发送验证码回调
  async send () {
    try {
      this.isSendCode = true
      await sendCode(this.phone)
      this.timer = setInterval(() => {
        this.sendTime--
        if (this.sendTime <= 0) {
          this.isSendCode = false
          this.sendTime = 60
          clearInterval(this.timer)
        }
      }, 1000)
    } catch (err) {
      this.$message.error(err.message)
      this.isSendCode = false
      this.sendTime = 60
      clearInterval(this.timer)
    }
  },

  // 登录按钮回调
  async handleSubmit (e) {
    e.preventDefault()
    try {
      await phoneVerify(this.phone)
      const user = await this.login({
        phone: this.phone,
        code: this.code
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
    this.code = ''
  }
}

export default {
  data () { return state },

  computed,

  methods,

  render () {
    const { disabled, isSendCode, sendBtnText } = this
    return (
      <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <div class="phone">
          <a-icon type="phone" />
          <input type="del" v-model={this.phone} placeholder="手机号" maxlength="11" minlength="11"/>
        </div>
        <div>
          <a-icon type="code" />
          <input v-model={this.code} placeholder="验证码" maxlength="6" minlength="6"/>
          <button onClick={this.send} class="send-code" type="button" disabled={disabled || isSendCode}>{sendBtnText}</button>
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

.send-code{
  width: 100px;
  background-color: $theme;
  font-size: 14px;
  font-family: 楷体;
  font-weight: bold;
  cursor: pointer;
  transition: all .3s;
  &:disabled{
    background-color: $border-color;
    color: $color3;
    cursor: not-allowed;
  }
}
</style>
