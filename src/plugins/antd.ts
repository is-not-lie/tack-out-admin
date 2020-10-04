import Vue from 'vue'
import { message, Form, Button, Layout, Icon, Menu, Table, ConfigProvider, Tag, Modal, Input, Radio, Card, Avatar, Tooltip, Pagination, Upload } from 'ant-design-vue'

const component = [
  Form,
  Button,
  Layout,
  Icon,
  Menu,
  Table,
  ConfigProvider,
  Tag,
  Modal,
  Input,
  Radio,
  Card,
  Avatar,
  Tooltip,
  Pagination,
  Upload
]

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm

component.forEach(item => Vue.use(item))
