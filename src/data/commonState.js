import { PAGESIZE } from '@/config'

// 刷新加载动画初始状态
export const loadingState = {
  confirmLoading: false,
  tableLoading: true,
  searchLoading: false,
  cardLoading: true
}

// 分页器初始数据
export const paginationState = {
  total: 0,
  pageNum: 1,
  pageSize: PAGESIZE
}

// 表单布局数据
export const formState = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}
