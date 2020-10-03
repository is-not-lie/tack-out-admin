import Vue from 'vue'
import { message, Form, Button, Layout, Icon, Menu } from 'ant-design-vue'

const component = [
  Form,
  Button,
  Layout,
  Icon,
  Menu
]

Vue.prototype.$message = message

component.forEach(item => Vue.use(item))
