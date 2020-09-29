import { Message } from 'element-ui'
export default (status: number, msg: string): void => {
  switch (status) {
    case 401:
      Message.error('权限不足')
      break
    default:
      break
  }
}
