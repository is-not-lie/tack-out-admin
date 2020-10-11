<script lang="jsx">
import { roleEnum, colorEnum } from '@/data/enum'

const props = {
  text: [String, Number],
  color: String
}

export default {
  props,
  render () {
    const { text, color } = this
    return typeof text === 'number'
      ? <a-tag color={ colorEnum[text] }>{ roleEnum[text] }</a-tag>
      : <a-tag color={color || ''}>{ text }</a-tag>
  }
}
</script>
