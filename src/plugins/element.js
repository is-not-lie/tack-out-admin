import Vue from 'vue'
import { Button, Container, Form, Message, Aside, Main, Header, Menu, Submenu, MenuItem, Table, TableColumn, Popover, Tag, Input, Dialog, FormItem } from 'element-ui'

const compoent = [
  Button,
  Form,
  FormItem,
  Input,
  Dialog,
  Container,
  Aside,
  Main,
  Header,
  Menu,
  MenuItem,
  Submenu,
  Table,
  TableColumn,
  Popover,
  Tag
]

Vue.prototype.$message = Message

compoent.forEach(item => Vue.use(item))
