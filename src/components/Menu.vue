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
  openKeys () {
    const { menuData } = this
    const current = menuData.find(item => new RegExp(item.name).test(this.$route.path))
    if (current) return [current.name]
    else return []
  }
}

const methods = {
  menuMap (menu) {
    return menu.children && Array.isArray(menu.children)
      ? (
        <a-sub-menu>
          <span slot="title">
            <a-icon type={menu.icon} />
            <span>{menu.title}</span>
          </span>
          {this.menuMap(menu.children)}
        </a-sub-menu>
      )
      : (
        <a-menu-item key={menu.path}>
          <router-link to={{ name: menu.name }}>
            <a-icon type={menu.icon} />
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
    const { menuData, mode, collapsed } = this
    const { path } = this.$route
    return (
      <a-menu
        mode={mode}
        selectable={false}
        inline-collapsed={collapsed}
        selectedKeys={[path]}
        defaultOpenKeys={this.openKeys}
      >
        { menuData.map(menu => this.menuMap(menu)) }
      </a-menu>
    )
  }
}
</script>
