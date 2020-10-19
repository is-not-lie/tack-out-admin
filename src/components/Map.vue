<script>
import { mapGetters } from 'vuex'
import { SCALE } from '@/config'
// import styleJson from '@/data/styleJson'

const state = {}

const computed = {
  ...mapGetters(['user'])
}

const methods = {
  initMap () {
    const { location } = this.user
    // eslint-disable-next-line no-undef
    const map = new BMapGL.Map('map')
    // eslint-disable-next-line no-undef
    const point = new BMapGL.Point(location.lng, location.lat)
    // eslint-disable-next-line no-undef
    map.centerAndZoom(point, SCALE)
    map.enableScrollWheelZoom(true)
    // eslint-disable-next-line no-undef
    map.setMapType(BMAP_EARTH_MAP)
    // eslint-disable-next-line no-undef
    const marker = new BMapGL.Marker(point)
    map.addOverlay(marker)
    map.addEventListener('tilesloaded', () => {
      this.$emit('maploaded')
    })
  }
}

export default {
  data () {
    return {
      ...state
    }
  },

  computed,

  methods,

  created () { this.$emit('mapload') },

  mounted () {
    this.initMap()
  },

  render () {
    return (
      <section ref="map" id="map"></section>
    )
  }
}
</script>

<style lang='scss' scoped>
#map {
  width: 100%;
  min-height: 600px;
}
</style>
