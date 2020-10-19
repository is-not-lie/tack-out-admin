<script>
const echarts = require('echarts')
require('@/utils/charts/theme/dark')
require('@/utils/charts/theme/light')

const textStyle = {
  color: '#666',
  fontSize: 18,
  fontFamily: '楷体',
  textBorderColor: '#f7f494',
  textBorderWidth: 2,
  textShadowColor: '#f7f494',
  textShadowBlur: 10,
  fontStyle: 'italic'
}

const props = {
  title: String,
  seriesData: Array,
  axisData: Array,
  crosswise: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'bar'
  }
}

const computed = {
  theme () {
    const hours = new Date().getHours
    return hours >= 6 && hours < 19 ? 'theme-light' : 'theme-dark'
  }
}

const methods = {
  initOption () {
    const { crosswise, axisData, seriesData, title, type } = this
    const series = seriesData.map(item => {
      item.stack = '总量'
      item.areaStyle = {}
      // item.itemStyle = {
      //   barBorderRadius: [10, 10, 0, 0],
      //   shadowBlur: 5,
      //   shadowColor: 'pink',
      //   borderWidth: 1,
      //   borderColor: '#999'
      // }
      // item.emphasis = {
      //   label: {
      //     show: true,
      //     position: ['100%', '0'],
      //     rotate: 45,
      //     color: 'rgba(0, 0, 0, .8)',
      //     fontSize: 16,
      //     fontFamily: '楷体',
      //     verticalAlign: 'top',
      //     backgroundColor: 'pink',
      //     borderRadius: 20,
      //     padding: [10, 5],
      //     textBorderColor: 'yellow',
      //     textBorderWidth: 1,
      //     textShadowColor: 'yellow',
      //     textShadowBlur: 5
      //   },
      //   itemStyle: {
      //     shadowBlur: 5,
      //     shadowColor: 'yellow'
      //   }
      // }
      item.type = type
      // item.symbol = 'circle'
      // item.label = {
      //   show: true
      // }
      return item
    })
    const option = {
      title: {
        text: title,
        textStyle,
        textAlign: 'left',
        textVerticalAlign: 'top',
        padding: 15
      },
      xAxis: {
        type: crosswise ? 'value' : 'category',
        show: !crosswise,
        boundaryGap: false,
        axisLabel: {
          ...textStyle,
          fontSize: 12,
          textShadowBlur: 1
        }
      },
      yAxis: {
        type: crosswise ? 'category' : 'value',
        show: crosswise || type !== 'bar',
        axisLine: {
          show: crosswise || type !== 'bar'
        },
        axisLabel: {
          ...textStyle,
          fontSize: 12,
          textShadowBlur: 1
        }
      },
      legend: {
        type: 'scroll',
        top: 10,
        textStyle: {
          ...textStyle,
          fontSize: 12,
          shadowBlur: 0,
          textShadowBlur: 1,
          textBorderWidth: 1
        }
      },
      tooltip: {
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        containLabel: true,
        left: '3%',
        right: '5%',
        bottom: '5%'
      },
      series
    }
    if (crosswise) {
      option.yAxis.data = axisData
    } else {
      option.xAxis.data = axisData
    }
    this.setOption(option)
  },

  setOption (option) {
    this.chart.setOption(option)
    this.chart.resize()
  },

  screenAdapter () {
    const titleFontSize = this.$refs.bar.offsetWidth / 100 * 3.6
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: titleFontSize
        }
      },
      tooltip: {
        axisPointer: {
          lineStyle: {
            width: titleFontSize
          }
        }
      }
    }
    if (this.type === 'bar') {
      adapterOption.series = this.seriesData.map(item => {
        item.barWidth = titleFontSize
        item.itemStyle.barBorderRadius = this.crosswise
          ? titleFontSize / 2
          : [titleFontSize / 2, titleFontSize / 2, 0, 0]
        return item
      })
    }
    this.setOption(adapterOption)
  }
}

export default {
  props,

  data () {
    return {}
  },

  computed,

  methods,

  mounted () {
    this.chart = echarts.init(this.$refs.bar, this.theme)
    this.initOption()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.screenAdapter)
  },

  render () {
    return (
      <section ref="bar" class="bar"></section>
    )
  }
}
</script>

<style lang='scss' scoped>
.bar {
  width: 100%;
  min-height: 300px;
}
</style>
