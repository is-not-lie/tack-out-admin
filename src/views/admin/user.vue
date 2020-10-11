<script lang="jsx">
import { mapActions } from 'vuex'
import { MyTag, MySearch } from '@/components'
import { userStatus, roleEnum } from '@/data/enum'
import { loadingState, paginationState, formState } from '@/data/commonState'

const state = {
  ...loadingState,
  ...paginationState,
  ...formState,
  userList: [],
  user: {},
  visible: false,
  userInfoVisible: false
}

const computed = {}

const methods = {
  ...mapActions(['getUserList', 'editUser', 'delUser', 'searchUser']),

  // 初始化用户列表
  initUserList (pageNum = this.pageNum) {
    this.getUserList(pageNum)
      .then((userList, total) => {
        this.tableLoading = false
        this.userList = userList
        if (total) this.total = total
      })
      .catch(() => {})
  },

  // 实时搜索
  handleSearchChange (phone) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.handleSearch(phone), 300)
  },

  // 搜索用户 (根据手机号码)
  handleSearch (phone) {
    this.tableLoading = true
    this.searchLoading = true
    this.searchUser(phone)
      .then(userList => {
        setTimeout(() => {
          this.userList = userList
          this.tableLoading = false
          this.searchLoading = false
        }, 400)
      })
      .catch(() => {})
  },

  // 分页改变回调
  paginationChange (pageNum) {
    const { current } = pageNum
    this.pageNum = current
    this.initUserList(current)
  },

  // 编辑用户
  handleEdit (row) {
    const { userId, rank, status } = row
    this.visible = true
    this.form.setFieldsValue({ userId, rank, status })
  },

  // 显示用户详情
  handleInfo (row) {
    this.user = row
    this.userInfoVisible = true
  },

  // 禁用用户
  handleForbidden (row) {
    let { userId, status } = row
    status = status === 1 ? 2 : 1
    this.tableLoading = true
    this.editUser({ userId, status })
      .then(userList => {
        setTimeout(() => {
          this.tableLoading = false
          this.userList = userList
        }, 400)
      })
      .catch(() => {})
  },

  // 删除用户
  handleDel (row) {
    this.tableLoading = true
    this.delUser(row.userId)
      .then(userList => {
        setTimeout(() => {
          this.tableLoading = false
          this.userList = userList
        }, 400)
      })
      .catch(() => {})
  },

  // 编辑用户确认回调
  handleOk (e) {
    e.preventDefault()

    this.confirmLoading = true
    this.form.validateFields()
      .then(values => {
        this.tableLoading = true
        this.editUser(values)
          .then(userList => {
            setTimeout(() => {
              this.userList = userList
              this.confirmLoading = false
              this.visible = false
              this.form.resetFields()
              this.tableLoading = false
            }, 400)
          })
          .catch(() => {})
      })
      .catch((err) => { console.log(err) })
  }
}

export default {
  data () {
    return {
      ...state,
      form: this.$form.createForm(this),

      // 表格字段展示
      columns: [
        {
          title: '用户名称',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '所属角色',
          align: 'center',
          dataIndex: 'rank',
          customRender: (text) => <MyTag text={text} />
        },
        {
          title: '当前状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text) => <MyTag text={userStatus[text - 1].title} color={userStatus[text - 1].color} />
        },
        {
          title: '注册时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          dataIndex: 'action',
          customRender: (text, row) => (
            <div style={{ display: 'flex' }}>
              <a-button type="link" onClick={() => this.handleEdit(row)}>编辑</a-button>
              <a-dropdown>
                <a-button type="link">更多<a-icon type="down"/></a-button>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-button
                      type="link"
                      icon="info-circle"
                      onClick={() => this.handleInfo(row)}
                    >详情</a-button>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm
                      title="确定禁用此用户吗"
                      ok-text="确定"
                      cancel-text="取消"
                      onconfirm={() => this.handleForbidden(row)}
                    >
                      <a-button
                        type="link"
                        icon={ row.status === 2 ? 'check-circle' : 'stop'}
                        style={{ color: row.status === 2 ? '#52c41a' : '#faad14' }}
                      >{ row.status === 2 ? '启用' : '禁用' }</a-button>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm
                      title="确定删除该用户吗"
                      ok-text="确定"
                      cancel-text="取消"
                      onconfirm={() => this.handleDel(row)}
                    >
                      <a-button
                        type="link"
                        icon="delete"
                        style={{ color: '#f50' }}
                      >删除</a-button>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          )
        }
      ]
    }
  },

  computed,

  methods,

  created () { this.initUserList() },

  render () {
    const { pageSize, pageNum, total, searchLoading, columns, userList, form, labelCol, wrapperCol, confirmLoading, user, tableLoading } = this
    return (
      <a-card bordered={false} title="用户列表">

        {/* 头部搜索部位 */}
        <MySearch
          place="请输入手机号码" max={11} md={8} offset={8} loading={searchLoading}
          onsearch={this.handleSearch} onchange={this.handleSearchChange}
        />

        {/* 表格部位 */}
        <a-table
          row-key="userId"
          size="default"
          loading={tableLoading}
          columns={columns}
          dataSource={userList}
          pagination={{ total, pageSize }}
          defaultCurrent={pageNum}
          onchange={this.paginationChange}
        />

        {/* 编辑用户的 form 表单 */}
        <a-modal
          title="操作"
          style="top: 20px;"
          okText="确定"
          cancelText="取消"
          width={800}
          forceRender
          confirmLoading={confirmLoading}
          v-model={this.visible}
          onok={this.handleOk}
        >
          <a-form class="permission-form" form={form}>
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="唯一标识"
              hasFeedback
              validateStatus="success"
            >
              <a-input disabled v-decorator={['userId']} />
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="用户权限"
              hasFeedback
              validateStatus="warning"
            >
              <a-select v-decorator={['rank', { initialValue: 1 }]}>
                {
                  roleEnum.map((role, i) => (
                    <a-select-option value={i}>{role}</a-select-option>
                  ))
                }
              </a-select>
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="用户状态"
              hasFeedback
              validateStatus="warning"
            >
              <a-select v-decorator={['status', { initialValue: 1 }]}>
                {
                  userStatus.map((status, i) => (
                    <a-select-option value={i + 1}>{status.title}</a-select-option>
                  ))
                }
              </a-select>
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="编辑描述"
              hasFeedback
            >
              <a-textarea
                rows={5}
                placeholder="..."
                id="describe"
                v-decorator={['describe']}
              />
            </a-form-item>
          </a-form>
        </a-modal>

        {/* 显示用户详情的模态框 */}
        <a-modal
          title="用户详情"
          style="top: 20px;"
          footer={null}
          width={300}
          v-model={this.userInfoVisible}
        >
          <a-row type="flex" align="middle">
            <a-col span={7}><a-avatar size="large" src={user.avatar}/></a-col>
            <a-col>{user.userName}</a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>联系号码:</a-col>
            <a-col><MyTag text={user.phone} color="blue"/></a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>电子邮箱:</a-col>
            <a-col><MyTag text={user.email || '该用户暂未绑定电子邮箱'} color="orange"/></a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>用户权限:</a-col>
            <a-col><MyTag text={user.rank} /></a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>当前状态:</a-col>
            <a-col>
              <MyTag
                text={userStatus[user.status - 1]?.title}
                color={userStatus[user.status - 1]?.color}
              />
            </a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>注册时间:</a-col>
            <a-col><MyTag text={user.createTime} color="green"/></a-col>
          </a-row>
          <a-row type="flex" align="middle" style={{ margin: '20px 0' }}>
            <a-col span={7}>编辑时间:</a-col>
            <a-col><MyTag text={user.editTime} color="purple"/></a-col>
          </a-row>
        </a-modal>
      </a-card>
    )
  }
}
</script>
