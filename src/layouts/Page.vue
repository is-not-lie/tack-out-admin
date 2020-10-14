<script>
import { mapGetters } from 'vuex'
import { MyMenu, GlobalHeader } from '@/components'

const state = {
  collapsed: false,
  menus: [],
  routes: []
}

const computed = { ...mapGetters(['addRoutes']) }

// const methods = {
//   itemRender ({ route, params, routes, paths }) {
//     const last = routes.indexOf(route) === routes.length - 1
//     return last ? (
//       <span>{route.name}</span>
//     ) : (
//       <router-link to={paths.join('/')}>{route.name}</router-link>
//     )
//   }
// }

export default {
  components: { MyMenu, GlobalHeader },

  data () { return state },

  computed,

  // methods,

  // watch: {
  //   $route (val) {
  //     const index = this.routes.findIndex(route => route.name === val.name)
  //     if (index === -1) {
  //       this.routes.push(val)
  //     } else {
  //       this.routes.splice(index, 1)
  //       this.routes.push(val)
  //     }
  //   }
  // },

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
          <MyMenu menuData={menus} collapsed={collapsed} />
        </a-layout-sider>
        <a-layout>
          <GlobalHeader collapsed={collapsed} ontrigger={() => { this.collapsed = !collapsed }} />

          {/*

            <a-breadcrumb separator="">
            {
              this.routes.map(route => (
                <a-breadcrumb-item>
                  <router-link to={{ name: route.name }}>
                    <a-tag>{route.meta.title}</a-tag>
                  </router-link>
                </a-breadcrumb-item>
              ))
            }
          </a-breadcrumb>

          */}

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
.page-layout {
  min-width: 1300px;
  max-width: 100vw;
  height: 100vh;
  .logo {
    height: 60px;
    background-image: url('~img/logo.png');
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center center;
    margin-bottom: 0;
  }
  .ant-layout-content {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &.dark {
      background-color: #f5f7f9;
    }
  }
  // .ant-breadcrumb {
  //   display: flex;
  // }
}
</style>
