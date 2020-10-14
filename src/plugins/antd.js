import { Badge, Space, List, InputNumber, Breadcrumb, Checkbox, Steps, Result, Descriptions, Tooltip, Upload, Popconfirm, Table, Button, Form, Input, Layout, Menu, Tag, message, Icon, Avatar, Dropdown, Modal, Row, Col, Card, Select } from 'ant-design-vue'

const component = [
  Tag,
  Form,
  Input,
  Button,
  Layout,
  Menu,
  Icon,
  Avatar,
  Dropdown,
  Modal,
  Row,
  Col,
  Card,
  Table,
  Select,
  Popconfirm,
  Upload,
  Tooltip,
  Descriptions,
  Result,
  Steps,
  Checkbox,
  Breadcrumb,
  InputNumber,
  List,
  Space,
  Badge
]

export default Vue => {
  Vue.prototype.$message = message
  Vue.prototype.$confirm = Modal.confirm
  component.forEach(item => Vue.use(item))
}
