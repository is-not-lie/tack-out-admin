<script lang='jsx'>

const props = {
  title: String,
  icon: String,
  menus: Array
}

export default {
  props,
  render () {
    const { menus, title, icon } = this
    return (
      <a-dropdown>
        <a-button type="link">
          {title}
          {icon ? <a-icon type="down"/> : ''}
        </a-button>
        <a-menu slot="overlay">
          {
            menus.map(menu => (
              <a-menu-item>
                {
                  menu.confirmTitle
                    ? (
                      <a-popconfirm
                        title={menu.confirmTitle}
                        ok-text="确定"
                        cancel-text="取消"
                        onconfirm={() => this.$emit(menu.emit)}
                      >
                        <a-button type="link" icon={menu.icon}>{menu.title}</a-button>
                      </a-popconfirm>
                    )
                    : <a-button type="link" icon={menu.icon} onClick={() => this.$emit(menu.emit)}>{menu.title}</a-button>
                }
              </a-menu-item>
            ))
          }
        </a-menu>
      </a-dropdown>
    )
  }
}
</script>

<style lang='scss' scoped>

</style>
