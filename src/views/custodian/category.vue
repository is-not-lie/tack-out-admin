<script lang='jsx'>
import { mapActions, mapGetters } from 'vuex'
import { AddCard, MyUpload, MySearch, MyTag } from '@/components'
import { loadingState, formState } from '@/data/commonState'

const state = {
  ...loadingState,
  ...formState,
  visible: false,
  cateInfoVisible: false,
  cardTitle: '',
  cateId: '',
  currentCate: {}
}

const computed = { ...mapGetters(['cateList', 'user']) }

const methods = {
  ...mapActions(['addCate', 'getCates', 'delCate', 'cateSort']),

  // 添加分类回调
  handleAdd () {
    this.visible = true
    this.cardTitle = 'add'
  },

  // 编辑分类回调
  handleEdit (cate) {
    const { icon, cateName, desc, cateId } = cate
    this.cateId = cateId
    this.cardTitle = 'edit'
    const filename = icon.split('/').reverse()[0]
    this.$refs.upload.setFileList([{ filename, url: icon }])
    this.form.setFieldsValue({ cateName, desc })
    this.visible = true
  },

  // 删除分类回调
  handleDel (cate) {
    const { cateId } = cate
    this.cardLoading = true
    this.delCate(cateId)
      .then(() => {
        setTimeout(() => {
          this.cardLoading = false
        }, 400)
      })
      .catch(() => {})
  },

  // form 表单提交回调
  handleOk () {
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.cardLoading = true
        this.confirmLoading = true
        if (this.cateId) { values.cateId = this.cateId }
        values.icon = this.$refs.upload.getFileList()[0]
        values.userName = this.user.userName
        this.addCate(values)
          .then(() => {
            setTimeout(() => {
              this.confirmLoading = false
              this.visible = false
              this.cardLoading = false
              console.log(this.$refs.upload)
            }, 400)
          })
          .catch(err => {
            this.confirmLoading = false
            this.cardLoading = false
            this.$message.error(err.message)
          })
      }
    })
  },

  // 模态框关闭时清空 form 表单数据
  handleCancel () {
    this.form.resetFields()
    this.$refs.upload.setFileList([])
    this.cateId = ''
  },

  // 搜索按钮回调
  handleSearch (keyWord) {
    const cateIndex = this.cateList.findIndex(cate => new RegExp(keyWord).test(cate.cateName))
    if (cateIndex !== -1) {
      this.cateSort(cateIndex)
    }
  },

  // 搜索框change事件
  handleSearchChange (keyWord) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.handleSearch(keyWord)
    }, 300)
  },

  // 显示分类详情
  cateInfo (cate) {
    this.currentCate = cate
    this.cateInfoVisible = true
  }
}

export default {
  data () {
    return {
      ...state,
      form: this.$form.createForm(this)
    }
  },

  computed,

  methods,

  created () {
    this.getCates()
      .then(() => {
        setTimeout(() => {
          this.cardLoading = false
        }, 400)
      })
      .catch(() => {})
  },

  render () {
    const { currentCate, cardTitle, confirmLoading, labelCol, wrapperCol, cateList, cardLoading, searchLoading } = this
    return (
      <a-card title="分类列表" loading={cardLoading}>

        {/* 头部搜索部位 */}
        <MySearch
          place="请输入分类名称" md={8} offset={8} loading={searchLoading}
          onsearch={this.handleSearch} onchange={this.handleSearchChange}
        />

        {/* 展示分类 */}
        <a-row gutter={[20, 20]}>

          {/* 添加分类的小卡片 */}
          <a-col xl={6} lg={8} md={10} sm={12}>
            <AddCard text="新增分类" onhandleAdd={this.handleAdd} y={154}/>
          </a-col>

          {/* 遍历生成展示的分类 */}
          {
            cateList.map(cate => (
              <a-col xl={6} lg={8} md={10} sm={12}>
                <a-card title={cate.cateName} hoverable>
                  <div slot="extra">
                    <a-popconfirm
                      title="确定删除该分类吗?"
                      okText="确定"
                      cancelText="取消"
                      onconfirm={() => this.handleDel(cate)}
                    >
                      <a-tooltip placement="left">
                        <span slot="title">删除此分类</span>
                        <a-button type="danger" icon="delete" style={{ marginRight: '10px' }}/>
                      </a-tooltip>
                    </a-popconfirm>
                    <a-tooltip placement="top">
                      <span slot="title">编辑此分类</span>
                      <a-button type="primary" icon="edit" onClick={() => this.handleEdit(cate)}/>
                    </a-tooltip>
                  </div>
                  <div class="card-centent">
                    <a-avatar src={cate.icon} size="large"/>
                    <a-button type="link" icon="info-circle" onClick={() => this.cateInfo(cate)}>查看详情</a-button>
                  </div>
                </a-card>
              </a-col>
            ))
          }
        </a-row>

        {/* 添加/编辑分类的模态框 */}
        <a-modal
          title={cardTitle === 'add' ? '新增分类' : '编辑分类'}
          style="top: 20px;"
          okText="确定"
          cancelText="取消"
          width={500}
          forceRender
          confirmLoading={confirmLoading}
          v-model={this.visible}
          onok={this.handleOk}
          oncancel={this.handleCancel}
        >
          <a-form form={this.form}>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="展示图片"
              hasFeedback
            >
              <MyUpload count={1} ref="upload"/>
              <span class="tip">上传图片不得超过2M且只允许上传一张</span>
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="分类名称"
              hasFeedback
            >
              <a-input v-decorator={['cateName', { rules: [{ required: true, message: '请输入分类名称' }] }]}/>
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="分类描述"
              hasFeedback
            >
              <a-textarea
                rows={5}
                placeholder="..."
                id="desc"
                v-decorator={['desc']}
              />
            </a-form-item>

          </a-form>
        </a-modal>

        {/* 分类详情的模态框 */}
        <a-modal
          title="分类详情"
          style="top: 20px;"
          width={800}
          footer={null}
          v-model={this.cateInfoVisible}
        >
          <a-descriptions bordered column={{ md: 2, sm: 1, xs: 1 }}>
            <a-row type="flex" align="middle" slot="title">
              <a-col span={4} offset={8}>
                <a-avatar src={currentCate.icon}/>
              </a-col>
              <a-col><MyTag text={currentCate.cateName} color="blue" /></a-col>
            </a-row>
            <a-descriptions-item label="创建时间">
              {currentCate.createTime}
            </a-descriptions-item>
            <a-descriptions-item label="编辑时间">
              {currentCate.editTime}
            </a-descriptions-item>
            <a-descriptions-item label="创建人">
              <MyTag text={currentCate.creator} color="green"/>
            </a-descriptions-item>
            <a-descriptions-item label="编辑人">
              <MyTag text={currentCate.editor} color="purple"/>
            </a-descriptions-item>
            <a-descriptions-item label="分类描述">
              {currentCate.desc}
            </a-descriptions-item>
          </a-descriptions>
        </a-modal>

      </a-card>
    )
  }
}
</script>

<style lang='scss' scoped>
.tip {
  position: absolute;
  width: 300px;
  font-size: 12px;
  color: $color3;
  font-family: 楷体;
  transform: translateY(-30px);
}
.card-centent {
  @extend .flex;
  justify-content: space-between;
  .ant-btn{
    padding-right: 0;
  }
}
</style>
