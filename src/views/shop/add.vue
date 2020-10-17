<script>
import { mapGetters, mapActions } from 'vuex'
import { loadingState, formState } from '@/data/commonState'

const state = {
  ...loadingState,
  ...formState
}

const computed = {
  ...mapGetters(['user', 'currentMerchant', 'goodsList'])
}

const methods = {
  ...mapActions(['getGoodsList', 'getCurrentMerchant'])
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

  created () {
    const { merchantId } = this.user
    Promise.all([this.getCurrentMerchant(merchantId), this.getGoodsList(merchantId)])
      .then(() => {
        this.cardLoading = false
      })
      .catch(() => { })
  },

  render () {
    const { currentMerchant, cardLoading, labelCol, wrapperCol } = this
    return (
      <a-card
        loading={cardLoading}
      >

        <a-button slot="title" type="primary" icon="arrow-left" onClick={() => this.$router.back()}>返回</a-button>

        <a-row style={{ paddingBottom: '20px' }}>
          <a-col span={4} offset={8}>
            <img src={currentMerchant.brandImg} />
          </a-col>
        </a-row>

        <a-form form={this.form}>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="店铺名称"
            hasFeedback
          >
            <a-input
              v-decorator={['shopName', {
                rules: [{ required: true, message: '请输入店铺名称' }],
                initialValue: currentMerchant.brandName
              }]} />
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="详细地址"
            hasFeedback
          >
            <a-input v-decorator={['address', {
              rules: [{ required: true, message: '请输入店铺详细地址' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="营业时间"
            hasFeedback
          >
            <a-input v-decorator={['openingHours', {
              rules: [{ required: true, message: '请输入店铺营业时间' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="配送时段"
            hasFeedback
          >
            <a-input v-decorator={['serTime', {
              rules: [{ required: true, message: '请输入店铺配送时间段' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="起送价"
            hasFeedback
          >
            <a-input-number v-decorator={['minFee', {
              rules: [{ required: true, message: '请设置最低起送价' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="配送价"
            hasFeedback
          >
            <a-input-number v-decorator={['disPic']}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="联系号码"
            hasFeedback
          >
            <a-input v-decorator={['phone', {
              rules: [{ required: true, message: '请输入店铺联系号码' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="所属分类"
            hasFeedback
          >
            <a-input v-decorator={['shopCate', {
              rules: [{ required: true, message: '请选择店铺经营类型' }]
            }]}/>
          </a-form-item>

          <a-form-item
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="店铺商品"
            hasFeedback
          >
            <a-input v-decorator={['goodsList', {
              rules: [{ required: true, message: '请选择店铺经验商品' }]
            }]}/>
          </a-form-item>

        </a-form>
      </a-card>
    )
  }
}
</script>

<style lang='scss' scoped>
</style>
