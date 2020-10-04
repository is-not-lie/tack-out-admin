import Vue from 'vue'

export class CateColumns extends Vue {
  columns = [
    {
      title: '分类名称',
      dataIndex: 'cateName',
      align: 'center',
      width: '20%',
      customRender: (text: string, row: any) => {
        const tag = this.$createElement('a-tag', {
          props: { color: 'blue' }
        }, text)
        if (row.icon) {
          const icon = this.$createElement('a-avatar', {
            props: {
              size: 'small',
              src: row.icon
            },
            style: { marginRight: '10px' }
          })
          return this.$createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }, [icon, tag])
        } else return tag
      }
    },
    {
      title: '子分类列表',
      dataIndex: 'subList',
      align: 'center',
      width: '60%',
      ellipsis: true,
      customRender: (text: undefined, row: any) => {
        if (row.subList.length) {
          const VNode = row.subList.map((subCate: any) => this.$createElement('a-tag', subCate.subName))
          return this.$createElement('div', VNode)
        } else {
          return this.$createElement(
            'a-button',
            {
              props: { type: 'link' },
              on: { click: () => this.cateEdit(row) }
            },
            '该分类暂无子分类,添加子分类?'
          )
        }
      }
    },
    {
      title: '编辑',
      dataIndex: 'edit',
      align: 'center',
      width: '15%',
      customRender: (text: undefined, row: any) => {
        const edit = this.$createElement('a-button', {
          props: {
            type: 'primary',
            icon: 'edit'
          },
          style: { marginRight: '10px' },
          on: { click: () => this.cateEdit(row) }
        })
        const del = this.$createElement('a-button', {
          props: {
            type: 'danger',
            icon: 'delete'
          },
          on: { click: () => this.cateDel(row) }
        })
        return this.$createElement('div', [edit, del])
      }
    }
  ]

  cateEdit (row: any) { }

  cateDel (row: any) { }
}
