<template>
  <section class="form-container">
    <header class="tab-btn">
      <h1><img src="~img/logo.png" alt="美团外卖">美团外卖</h1>
      <div>
        <button :class="{active: isCodeLogin}" type="button" @click="codeBtnClick">短信登录</button>
        <button :class="{active: !isCodeLogin}" type="button" @click="pwdBtnClick">密码登录</button>
      </div>
    </header>
    <form @submit.prevent="handleSubmit" @reset="handleReset">
      <section class="code-login" v-show="isCodeLogin">
        <div>
          <i class="iconfont icon-phone"></i>
          <input type="del" placeholder="手机号" maxlength="11" v-model="phone">
        </div>
        <div>
          <i class="iconfont icon-code"></i>
          <input type="text" maxlength="6" placeholder="验证码" v-model="code">
          <button class="send-code" :disabled="isDisabled || isSendCode" @click="handleSend">{{btnText}}</button>
        </div>
      </section>
      <section class="pwd-login" v-show="!isCodeLogin">
        <div>
          <i class="iconfont icon-phone"></i>
          <input type="del" placeholder="手机号" maxlength="11" v-model="phone">
        </div>
        <div>
          <i class="el-icon-lock"></i>
          <input type="password" placeholder="密码" minlength="6" v-model="password">
        </div>
        <div>
          <i class="iconfont icon-captcha"></i>
          <input type="text" maxlength="4" placeholder="验证码" v-model="captcha">
          <span class="svg" v-html="svgCaptcha" @click="setCaptcha"></span>
        </div>
      </section>
      <section class="btns">
        <button type="submit">登录</button>
        <button type="reset">重置</button>
      </section>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { sendCode, getCaptcha, loginVerify } from '@/utils/login'

@Component
export default class Form extends Vue {
  // 保存定时器与延时器标识
  timer: number | null
  intTimer: number | null
  // 发送验证码后倒计时的初始值
  sendingTime = 60
  // 是否已发送验证码
  isSendCode = false
  // 是否为手机验证码登录
  isCodeLogin = true
  // svg验证码
  svgCaptcha = ''
  // 双向绑定用户输入
  phone = ''
  password = ''
  code = ''
  captcha = ''
  // 是否禁用发送验证码按钮
  get isDisabled (): boolean {
    return !/^1[34578]\d{9}$/.test(this.phone)
  }

  // 发送验证码按钮文本
  get btnText (): string {
    return this.isSendCode ? `已发送${this.sendingTime}秒` : '发送验证码'
  }

  // 组件创建后先请求一次svg验证码
  created () { this.setCaptcha() }

  // 请求svg验证码回调
  setCaptcha () {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      this.svgCaptcha = await getCaptcha()
      this.timer = null
    }, 300)
  }

  // 发送手机验证码回调
  async handleSend () {
    this.isSendCode = true

    this.intTimer = setInterval(() => {
      if (this.sendingTime === 0) {
        this.sendingTime = 60
        this.isSendCode = false
        this.$message.error('发送超时了...')
        clearInterval(this.intTimer)
      } else this.sendingTime--
    }, 1000)

    const result = sendCode(this.phone)
    if (result) {
      this.$message.success('验证码已发送,请稍等片刻...')
    } else {
      this.$message.error('验证码发送失败,请重新尝试...')
      this.sendingTime = 60
      this.isSendCode = false
      clearInterval(this.intTimer)
    }
  }

  // 验证码 / 密码登录切换按钮回调
  codeBtnClick () {
    if (this.isCodeLogin) return
    this.phone = ''
    this.isCodeLogin = true
  }

  pwdBtnClick () {
    if (!this.isCodeLogin) return
    this.phone = ''
    this.isCodeLogin = false
  }

  // 登录验证成功跳转首页回调
  callback () { this.$nextTick(() => { this.$router.replace({ name: 'home' }) }) }

  // 登录验证回调
  async handleSubmit () {
    const { phone, code, captcha, password, callback } = this
    try {
      if (this.isCodeLogin) {
        await loginVerify({ phone, code })
        this.$store.dispatch('login', { phone, callback })
      } else {
        await loginVerify({ phone, captcha, password })
        this.$store.dispatch('login', { phone, password, callback })
      }
    } catch (msg) {
      this.$message.error(msg)
      this.setCaptcha()
    }
  }

  // 重置按钮回调
  handleReset () {
    this.phone = ''
    this.code = ''
    this.password = ''
    this.captcha = ''
    this.setCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.form-container{
  position: fixed;
  width: 350px;
  height: 450px;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  background-color: $login-bg-color;
  border-radius: 10px;
  box-shadow: 2px 2px 20px rgba($color: #000000, $alpha: .2);
  display: flex;
  flex-direction: column;
  .tab-btn{
    padding: 20px 0;
    h1{
      @extend .flex;
      margin-bottom: 20px;
      img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
    }
    div{
      @extend .flex;
      button{
        width: 120px;
        height: 35px;
        border-radius: 5px;
        text-align: center;
        line-height: 35px;
        margin-left: 15px;
        cursor: pointer;
        background-color: #fff;
        box-shadow: 3px 3px 4px rgba($color: #000000, $alpha: .2);
        &:hover{
          color: $theme;
        }
        &:focus,
        &.active{
          color: $subtopic;
          box-shadow: inset -3px -3px 4px rgba($color: #fff, $alpha: 1.0),
            inset 3px 3px 4px rgba($color: #000000, $alpha: .2);
        }
      }
    }
  }
  form{
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    section{
      flex: 1;
      display: flex;
      flex-direction: column;
      div{
        display: flex;
        height: 40px;
        margin: 15px 0;
        input{
          flex: 1;
          padding-left: 10px;
          background: none;
          border-bottom: 1px solid $theme;
        }
        i{
          text-align: center;
          line-height: 40px;
          color: #999;
        }
        .send-code{
          width: 100px;
          background-color: $theme;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          transition: all .3s;
          &:disabled{
            background-color: #eee;
            color: #999;
            cursor: not-allowed;
          }
        }
      }
      &.btns{
        flex: none;
        justify-content: center;
        padding: 20px 0;
        flex-direction: row;
        button{
          width: 120px;
          height: 35px;
          border-radius: 5px;
          text-align: center;
          line-height: 35px;
          margin-left: 15px;
          cursor: pointer;
          border: 1px solid #eee;
          &[type="submit"]{
            background-color: $theme;
            color: #333;
            border-color: $theme;
          }
        }
      }
    }
  }
}
</style>
