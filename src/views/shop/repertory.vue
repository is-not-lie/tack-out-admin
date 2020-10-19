<script>
import { mapGetters, mapActions } from 'vuex'
import Echarts from 'echarts'
require('../../utils/charts/theme/dark')
require('../../utils/charts/theme/light')

const option = {
  title: {
    text: '商品库存',
    textStyle: {
      color: '#333',
      fontSize: 30,
      fontStyle: 'italic',
      fontFamily: '楷体',
      textBorderColor: 'yellow',
      textBorderWidth: 1,
      textShadowBlur: 2,
      textShadowColor: 'yellow'
    },
    subtext: '纯属虚构',
    subtextStyle: {
      color: '#eee',
      fontSize: 12,
      fontFamily: '宋体',
      textBorderWidth: 1,
      textBorderColor: '#999',
      textShadowBlur: 1,
      textShadowColor: '#666'
    },
    textAlign: 'center',
    left: '30%',
    top: '2%'
  },
  tooltip: {
    potision: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      restore: { show: true },
      saveAsImage: { show: true }
    },
    top: '3%',
    right: '20%'
  },
  legend: {
    type: 'scroll',
    left: '2%',
    bottom: '2%',
    inactiveColor: '#999',
    textStyle: {
      color: 'auto',
      fontSize: 16,
      fontWidth: 600,
      fontFamily: '楷体',
      fontStyle: 'italic',
      padding: [5, 10]
    },
    padding: 20
  },
  series: [
    {
      name: '商品库存',
      type: 'funnel',
      orient: 'horizontal',
      left: '5%',
      top: '25%',
      width: '80%',
      height: '60%',
      min: 0,
      max: 200,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'top'
      },
      labelLine: {
        length: 20,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20,
          formatter: '{b}: {c}'
        }
      }
    }
  ]
}

const state = {}

const computed = {
  ...mapGetters(['goodsList', 'user']),

  theme () {
    const hours = new Date().getHours
    return hours >= 6 && hours < 19 ? 'theme-light' : 'theme-dark'
  }
}

const methods = {
  ...mapActions(['getGoodsList']),

  // 初始化捞数据,数据回来后创建 Echarts 实例
  initData () {
    const { merchantId } = this.user
    if (this.goodsList.length > 0) {
      this.initChart()
    } else {
      this.getGoodsList(merchantId)
        .then(this.initChart)
        .catch(() => { })
    }
  },

  // 初始化 Echarts 实例
  initChart () {
    const chart = Echarts.init(this.$refs.gauge, this.theme)
    chart.setOption(option)
    window.addEventListener('resize', chart.resize)
    this.chart = chart
    this.mapData()
  },

  // 加工数据
  mapData () {
    const { goodsList } = this
    const data = goodsList.map(goods => ({
      name: goods.goodsName,
      value: goods.count
    }))
    this.setChartData(data)
  },

  // 修改图表数据
  setChartData (data) {
    const { chart } = this
    option.legend.data = data.map(item => item.name)
    option.series.forEach((item) => {
      item.data = data
    })
    chart.setOption(option)
  }
}

export default {
  data () {
    return {
      ...state,
      chart: null
    }
  },

  computed,

  methods,

  mounted () { this.$nextTick(this.initData) },

  render () {
    return (
      <section ref="gauge" class="gauge"></section>
    )
  }
}
</script>

<style lang='scss' scoped>
.gauge {
  width: 100%;
  min-height: 600px;
}
</style>
