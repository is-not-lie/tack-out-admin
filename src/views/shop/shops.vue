<script>
import { mapGetters } from 'vuex'
import { MySearch } from '@/components'

const state = {}

const computed = {
  ...mapGetters(['shopList'])
}

const methods = {}

export default {
  data () {
    return {
      ...state
    }
  },

  computed,

  methods,

  render () {
    return (
      <a-card title="我的店铺">
        <a-row type="flex" align="middle" style={{ paddingBottom: '20px' }}>
          <a-col>
            <a-button type="primary" icon="plus">新增店铺</a-button>
          </a-col>
          <a-col offset={5} span={8}>
            <MySearch place="输入店铺名称进行搜索" />
          </a-col>
        </a-row>
        {
          this.shopList.length > 0
            ? (
              <a-row></a-row>
            )
            : (
              <a-empty
                // image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                // image-style={{
                //   height: '60px'
                // }}
              >
                <a-row slot="description">
                  <a-col>抱歉...未找到您的店铺</a-col>
                  <a-col>请确认您拥有此店铺或输入是否有误</a-col>
                </a-row>
                <a-button type="primary">
                  <router-link to={{ name: 'addShop' }}>
                    去开店
                  </router-link>
                </a-button>
              </a-empty>
            )
        }
      </a-card>
    )
  }
}
</script>

<style lang='scss' scoped>
</style>
