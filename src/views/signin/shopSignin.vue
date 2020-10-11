<script lang='jsx'>
import { mapActions, mapGetters } from 'vuex'
import { formState } from '@/data/commonState'
import { MyUpload } from '@/components'

const state = {
  ...formState,
  current: 0,
  baseInfo: {}
}

const computed = { ...mapGetters(['user']) }

const methods = {
  ...mapActions(['signin']),

  next () {
    if (this.current === 1) {
      const brandImg = this.$refs.brandImg.getFileList()[0]
      const license = this.$refs.license.getFileList()[0]
      const licence = this.$refs.licence.getFileList()[0]
      if (!brandImg) return this.$message.error('请上传品牌形象')
      if (!license) return this.$message.error('请上传营业执照')
      if (!licence) return this.$message.error('请上传餐饮许可证')

      const { userId, userName } = this.user
      const params = {
        ...this.baseInfo,
        brandImg,
        license,
        licence,
        userId,
        userName
      }
      this.signin(params)
        .then(() => this.$router.push({ name: 'signinSuccess' }))
        .catch(() => this.$router.push({ name: 'signinError' }))
    } else {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.baseInfo = values
          this.current++
        }
      })
    }
  },

  prev () {
    if (this.current === 0) return
    Object.keys(this.baseInfo).forEach(key => {
      this.form.getFieldDecorator(key)
    })
    this.form.setFieldsValue({ ...this.baseInfo })
    this.current--
  }
}

export default {
  data () {
    return {
      ...state,
      form: this.$form.createForm(this)
    }
  },

  computed,

  methods,

  render () {
    const { current, labelCol, wrapperCol } = this
    return (
      <section>

        {/* 头部步骤条 */}
        <header>
          <a-steps current={current}>
            <a-step title="填写基本信息">
              <a-icon slot="icon" type="user" />
            </a-step>
            <a-step title="上传执照证件">
              <a-icon slot="icon" type="solution" />
            </a-step>
            <a-step title="提交申请">
              <a-icon slot="icon" type="smile-o" />
            </a-step>
          </a-steps>
        </header>

        {/* 表单区域 */}
        <section>
          {
            // 这里根据步骤显示不同的模块
            current === 0
              ? (

                // 表单模块
                <a-form form={this.form}>

                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="品牌名称"
                    hasFeedback
                  >
                    <a-input
                      placeholder="请输入品牌名称"
                      v-decorator={['brandName', { rules: [{ required: true, message: '请输入品牌名称' }] }]}
                    />
                  </a-form-item>

                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="联系电话"
                    hasFeedback
                  >
                    <a-input
                      placeholder="请输入联系号码"
                      v-decorator={['phone', { rules: [{ required: true, message: '请输入您的联系电话' }] }]}
                    />
                  </a-form-item>

                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="联系邮箱"
                    hasFeedback
                  >
                    <a-input
                      placeholder="请输入联系邮箱"
                      v-decorator={['email']}
                    />
                  </a-form-item>

                </a-form>
              )

              : (

                // 图片上传模块
                <a-row type="flex" justify="center" align="middle">
                  <a-col xl={7}>
                    <span class="tip">请上传品牌形象</span>
                    <MyUpload count={1} ref="brandImg" />
                  </a-col>
                  <a-col xl={7}>
                    <span class="tip">请上传营业执照</span>
                    <MyUpload count={1} ref="license" />
                  </a-col>
                  <a-col>
                    <span class="tip">请上传餐饮许可</span>
                    <MyUpload count={1} ref="licence" />
                  </a-col>
                </a-row>
              )
          }
        </section>

        {/* 底部按钮区 */}
        <footer>
          <a-button onClick={this.prev}>上一步</a-button>
          <a-button type="primary" onClick={this.next}>{ current === 1 ? '提交申请' : '下一步' }</a-button>
        </footer>

      </section>
    )
  }
}
</script>

<style lang='scss' scoped>
header {
  padding: 20px;
}
section {
  .tip {
    font-size: 12px;
    font-family: 楷体;
    font-weight: 300;
    color: $color3;
    padding-left: 10px;
  }
}
footer {
  padding: 20px;
  @extend .flex;
  .ant-btn {
    margin: 0 20px;
  }
}
</style>
