import Vue from 'vue'
import { message, Form, Button, Layout, Icon } from 'ant-design-vue'

const component = [
  Form,
  Button,
  Layout,
  Icon
]

Vue.prototype.$message = message

component.forEach(item => Vue.use(item))
