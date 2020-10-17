<script lang="jsx">
const props = {
  menuData: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'inline'
  },
  collapsed: {
    type: Boolean,
    default: false
  }
}

const computed = {
  selectedKeys () {
    const { menuData } = this
    const { path } = this.$route
    const current = menuData.find(item => new RegExp(item.path).test(path))
    return [current.path]
  }
}

const methods = {
  menuMap (menu) {
    if (menu.hidden) return

    return (
      <a-menu-item key={menu.path}>
        <router-link to={{ name: menu.name }}>
          {
            menu.icon
              ? <a-icon type={menu.icon} />
              : ''
          }
          <span>{menu.title}</span>
        </router-link>
      </a-menu-item>
    )
  }
}

export default {
  props,
  computed,
  methods,
  render () {
    const { menuData, mode, collapsed, selectedKeys } = this
    return (
      <a-menu
        mode={mode}
        selectable={false}
        inline-collapsed={collapsed}
        selectedKeys={selectedKeys}
      >
        { menuData.map(menu => this.menuMap(menu)) }
      </a-menu>
    )
  }
}
</script>
