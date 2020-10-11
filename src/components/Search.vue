<script lang='jsx'>

const props = {
  place: String,
  max: Number,
  min: Number,
  loading: Boolean,
  md: Number,
  offset: Number
}

export default {
  props,

  data () { return { keyWord: '' } },

  render () {
    const { place, max, min, loading, md, offset } = this
    return (
      <div class="search">
        <a-row>
          <a-col md={md} offset={offset}>
            <a-input-search
              min-length={min}
              max-length={max}
              placeholder={place}
              v-model={this.keyword}
              loading={loading}
              onsearch={() => this.$emit('search', this.keyword)}
              onchange={() => this.$emit('change', this.keyword)}
            >
              <a-button type="primary" icon="search" slot="enterButton">查询</a-button>
            </a-input-search>
          </a-col>
        </a-row>
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.search{
  padding: 20px 0;
}
</style>
