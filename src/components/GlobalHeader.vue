<script lang='jsx'>
import { mapGetters, mapActions } from 'vuex'

const menuTitle = [
  {
    title: '个人中心',
    icon: 'user',
    path: ''
  },
  {
    title: '个人设置',
    icon: 'setting',
    path: ''
  },
  {
    title: '退出登录',
    icon: 'logout'
  }
]

const props = {
  collapsed: {
    type: Boolean,
    default: false
  }
}

const computed = { ...mapGetters(['user']) }

const methods = {
  ...mapActions(['logout']),
  menuMap (menu, i) {
    return i === menuTitle.length - 1
      ? (
        <a-menu-item style={{ borderTop: '1px solid #eee', marginTop: '5px' }}>
          <a onClick={this.out}>
            <a-icon type={menu.icon} style={{ marginRight: '10px' }}/>
            <span>{menu.title}</span>
          </a>
        </a-menu-item>
      )
      : (
        <a-menu-item>
          <router-link to={menu.path}>
            <a-icon type={menu.icon} style={{ marginRight: '10px' }} />
            <span>{menu.title}</span>
          </router-link>
        </a-menu-item>
      )
  },
  out () {
    this.$confirm({
      title: '您确定要退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return this.logout()
          .then(() => { this.$router.replace({ name: 'login' }) })
          .catch(() => { })
      }
    })
  }
}

export default {
  props,
  computed,
  methods,
  render () {
    const { collapsed, user } = this
    return (
      <header>
        <a-icon
          class="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={() => this.$emit('trigger')}
        />
        <a-dropdown class="user">
          <a>
            <a-avatar src={user.avatar} />
            <a-tag color="blue">{ user.userName }</a-tag>
          </a>
          <a-menu slot="overlay">
            { menuTitle.map(this.menuMap) }
          </a-menu>
        </a-dropdown>
      </header >
    )
  }
}
</script>

<style lang="scss" scoped>
header{
  height: 64px;
  @extend .flex;
  justify-content: space-between;
  background-color: $bg-color;
  .user {
    height: 100%;
    padding: 0 20px;
    @extend .flex;
    .ant-avatar {
      margin-right: 10px;
    }
  }
  .trigger{
    width: 60px;
    height: 100%;
    font-size: 20px;
    @extend .flex;
    &:hover {
      color: skyblue;
    }
  }
}
</style>
