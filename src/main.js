import Vue from 'vue'
import App from './App.vue'
import router, { created } from './router'
import store from './store'
import '@/assets/sass/reset.scss'
import Antd from '@/plugins/antd'

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  router,
  store,
  created,
  render: h => h(App)
}).$mount('#app')
