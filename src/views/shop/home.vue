<script>
import { mapGetters, mapActions } from 'vuex'
import { Map } from '@/components'
// import { loadingState } from '@/data/commonState'

// const xData = ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']

// const randomDomData = () => {
//   const data = []
//   for (let i = 0; i < xData.length; i++) {
//     data.push(Math.floor(Math.random() * 1000))
//   }
//   return data
// }

// const seriesData = [
//   {
//     name: '销量',
//     data: randomDomData()
//   },
//   {
//     name: '库存',
//     data: randomDomData()
//   },
//   {
//     name: '评价',
//     data: randomDomData()
//   }
// ]

const state = {
}

const computed = {
  ...mapGetters(['user', 'currentMerchant', 'goodsList', 'shopList', 'addRoutes']),

  // 欢迎文字
  greetText () {
    const { userName } = this.user
    const hours = new Date().getHours()
    const time = hours < 9
      ? '早上好'
      : hours <= 11
        ? '上午好'
        : hours <= 13
          ? '中午好'
          : hours < 20
            ? '下午好'
            : '晚上好'
    return `${time}，${userName}`
  },

  subText () {
    const { brandName } = this.currentMerchant
    return `美团商家 | ${brandName}`
  }
}

const methods = {
  ...mapActions(['getCurrentMerchant', 'getGoodsList', 'getShopList'])
}

export default {
  data () {
    return {
      ...state
    }
  },

  computed,

  methods,

  created () {
    if (!this.currentMerchant.brandName || !this.shopList.length || !this.goodsList.length) {
      const { merchantId } = this.user
      Promise.all([
        this.getCurrentMerchant(merchantId),
        this.getGoodsList(merchantId),
        this.getShopList(merchantId)
      ])
        .then(() => { })
        .catch(() => { })
    }
  },

  render () {
    const { user, greetText, subText, goodsList, shopList } = this
    return (
      <a-card>

        {/* 头部区域 */}
        <a-row gutter={[0, 30]} slot="title">
          <a-col>工作台</a-col>
          <a-col>
            <a-row type="flex" justify="space-between">
              <a-col class="left">
                <a-row type="flex">
                  <a-col span={6}>
                    <img src={user.avatar} />
                  </a-col>
                  <a-col offset={2}>
                    <h3>{greetText}</h3>
                    <span class="sub-text">{subText}</span>
                  </a-col>
                </a-row>
              </a-col>
              <a-col class="right">
                <a-row type="flex" align="bottom">
                  <a-space>
                    <a-col>
                      <p>店铺数</p>
                      <span>{shopList.length || 0}</span>
                    </a-col>
                    <a-divider type="vertical" />
                    <a-col>
                      <p>商品数</p>
                      <span>{goodsList.length || 0}</span>
                    </a-col>
                    <a-divider type="vertical" />
                    <a-col>
                      <p>营业额</p>
                      <span>1000000</span>
                    </a-col>
                  </a-space>
                </a-row>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        {/* 地图区域 */}
        <a-row>
          <a-col>
            <Map />
          </a-col>
          <a-col span={8}>
            <a-row>
              <a-col>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
    )
  }
}
</script>

<style lang='scss' scoped>
.sub-text {
  font-size: 14px;
  font-family: '楷体';
  color: $color3;
}
.ant-divider,
.ant-divider-vertical {
  height: 3em;
  transform: scaleX(0.5);
}
.right {
  text-align: right;
  p {
    text-align: center;
    color: $color3;
    font-size: 18px;
    font-family: '楷体';
  }
  span {
    font-family: '楷体';
    font-weight: bold;
    font-size: 18px;
    color: $color2;
  }
}
</style>
