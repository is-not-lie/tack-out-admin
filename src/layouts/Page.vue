<script lang="jsx">
import { mapGetters } from 'vuex'
import { MyMenu, GlobalHeader } from '@/components'

const state = {
  collapsed: false,
  menus: []
}

const computed = { ...mapGetters(['addRoutes']) }

export default {
  components: { MyMenu, GlobalHeader },

  data () { return state },

  computed,

  created () {
    const userRouter = this.addRoutes.find(item => item.path === '/')
    this.menus = userRouter.children.map(item => ({
      path: item.path,
      name: item.name,
      icon: item.meta.icon,
      title: item.meta.title
    }))
  },

  render () {
    const { collapsed, menus } = this
    return (
      <a-layout class="page-layout">
        <a-layout-sider v-model={collapsed} theme="light" trigger={null} collapsible>
          <h1 class="logo"></h1>
          <MyMenu menuData={menus} collapsed={collapsed}/>
        </a-layout-sider>
        <a-layout>
          <GlobalHeader collapsed={collapsed} ontrigger={() => { this.collapsed = !collapsed }}/>
          <a-layout-content>
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    )
  }
}
</script>

<style lang="scss" scoped>
.page-layout{
  min-width: 1300px;
  max-width: 100vw;
  height: 100vh;
  .logo{
    height: 60px;
    background-image: url('~img/logo.png');
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center center;
    margin-bottom: 0;
  }
  .ant-layout-content{
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &.dark{
      background-color: #F5F7F9;
    }
  }
}
</style>
