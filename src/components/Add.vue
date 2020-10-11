<script lang='jsx'>

const props = {
  text: String,
  y: Number,
  border: String
}

export default {
  props,

  render () {
    const { text, y, border } = this
    return (
      <div
        class="add-card"
        onClick={() => this.$emit('handleAdd')}
        style={{ height: y ? `${y}px` : '', borderStyle: border }}
      >
        <a-icon type="plus"/>
        <span>{ text }</span>
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.add-card {
  height: 100%;
  padding: 20px;
  @extend .flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-width: 1px;
  border-style: dashed;
  border-color: $border-color;
  color: $color3;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .1);
    border-color: #91d5ff;
    color: #91d5ff;
  }
  .anticon {
    font-size: 30px;
    margin-bottom: 15px;
  }
}
</style>
