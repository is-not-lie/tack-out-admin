import Vue, { VNodeChildren } from 'vue'

enum RoleAuth {
  '普通用户',
  '商家用户',
  '管理员',
  '超级管理员'
}
enum RoleColor {
  'blue',
  '#FFD161',
  'rgb(250, 170, 160)',
  'rgb(255, 77, 79)'
}

export class RoleColumns extends Vue {
  columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
      customRender: (text: VNodeChildren) => {
        return this.$createElement('a-tag', {
          props: {
            color: 'blue'
          }
        }, text)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      align: 'center',
      customRender: (text: VNodeChildren) => {
        return this.$createElement('a-tag', text)
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      align: 'center',
      customRender: (text: VNodeChildren) => {
        return this.$createElement('a-tag', {
          props: {
            color: 'orange'
          }
        }, text)
      }
    },
    {
      title: '编辑人',
      dataIndex: 'editor',
      align: 'center',
      customRender: (text: VNodeChildren) => {
        return this.$createElement('a-tag', {
          props: {
            color: 'red'
          }
        }, text)
      }
    },
    {
      title: '编辑时间',
      dataIndex: 'editTime',
      align: 'center',
      customRender: (text: VNodeChildren) => {
        return this.$createElement('a-tag', text)
      }
    },
    {
      title: '角色权限',
      dataIndex: 'authority',
      align: 'center',
      customRender: (text: number) => {
        return this.$createElement('a-tag', {
          props: {
            color: RoleColor[text]
          }
        }, RoleAuth[text])
      }
    },
    {
      title: '编辑',
      dataIndex: 'edit',
      align: 'center',
      customRender: (text: undefined, row: any) => {
        const edit = this.$createElement('a-button', {
          props: {
            icon: 'edit',
            type: 'primary'
          },
          style: {
            marginRight: '10px'
          },
          on: {
            click: () => this.showEdit(row)
          }
        })
        const del = this.$createElement('a-button', {
          props: {
            icon: 'delete',
            type: 'danger'
          },
          on: {
            click: () => this.showDel(row)
          }
        })
        return this.$createElement('div', [edit, del])
      }
    }
  ]

  showEdit (row: any) {}

  showDel (row: any) {}
}
