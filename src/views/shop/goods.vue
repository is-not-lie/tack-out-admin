<script>
import { mapGetters, mapActions } from 'vuex'
import { MySearch, MyUpload } from '@/components'
import { loadingState, formState } from '@/data/commonState'
import { PAGESIZE } from '@/config'

const state = {
  ...loadingState,
  ...formState,
  currentGoods: {},
  showInfoModal: false,
  listLoading: true,
  visible: false,
  cardTitle: 'add',
  filenames: [],
  textTrigger: false,
  pagination: { pageSize: PAGESIZE },
  sortType: 'default'
}

const computed = {
  ...mapGetters(['user', 'goodsList']),

  // 图片上传区提示文字
  hintText () {
    return this.textTrigger
      ? '请上传小尺寸的商品图片,该图片将用于首页展示'
      : '请上传商品图片'
  }
}

const methods = {
  ...mapActions(['goodsAdd', 'getGoodsList', 'goodsEdit', 'removeGoods', 'sortGoods', 'searchGoods']),

  // 添加/编辑商品统一处理
  handleDispath (params) {
    const result = this.cardTitle === 'add'
      ? this.goodsAdd(params)
      : this.goodsEdit(params)
    result
      .then(() => {
        setTimeout(() => {
          this.listLoading = this.confirmLoading = this.visible = false
          this.$message.success(this.cardTitle === 'add' ? '新增商品成功' : '编辑成功')
        }, 400)
      })
      .catch(() => { this.listLoading = this.confirmLoading = false })
  },

  // 添加商品
  handleAdd () {
    this.cardTitle = 'add'
    this.visible = true
  },

  // 删除商品
  handleDel (goods) {
    const { goodsId } = goods
    const { merchantId } = this.user
    this.listLoading = true
    this.removeGoods({ merchantId, goodsId })
      .then(() => {
        this.listLoading = false
        this.$message.success('已成功删除该商品')
      })
      .catch(() => { this.listLoading = false })
  },

  // 编辑商品
  handleEdit (goods) {
    // 更改模态框标题
    this.cardTitle = 'edit'
    // 处理图片回显
    const { imgUrlBig, imgUrlSmall, originalPice, goodsId, goodsName, discount, count, status, activity, desc, specification } = goods
    this.filenames = [imgUrlBig, imgUrlSmall]
    const big = {
      filename: imgUrlBig.split('/').reverse()[0],
      url: imgUrlBig
    }
    const small = {
      filename: imgUrlSmall.split('/').reverse()[0],
      url: imgUrlSmall
    }
    this.$refs.upload.setFileList([big, small])
    // 处理表单数据回显
    this.form.setFieldsValue({ originalPice, goodsId, goodsName, discount, count, status, activity, desc, specification })
    this.visible = true
  },

  // 查看商品详情
  handleInfo (goods) {
    this.currentGoods = goods
    this.showInfoModal = true
  },

  // 搜索回调
  handleSearch (keyWord) {
    this.listLoading = this.searchLoading = true
    this.searchGoods(keyWord)
      .then(() => {
        setTimeout(() => {
          this.listLoading = this.searchLoading = false
        }, 400)
      })
      .catch((err) => {
        this.$message.error(err.message)
        this.listLoading = this.searchLoading = false
      })
  },

  // 排序回调
  handleSelect (value) {
    this.sortType = value
    this.listLoading = true
    const result = value === 'default'
      ? this.getGoodsList(this.user.merchantId)
      : this.sortGoods(value)
    result
      .then(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 400)
      })
      .catch(() => { this.listLoading = false })
  },

  // 表单提交,准备请求参数
  handleOk () {
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const filenames = this.$refs.upload.getFileList()
        if (!filenames.length) return this.$message.error('请上传商品图片')
        this.listLoading = true
        this.confirmLoading = true
        const { merchantId } = this.user
        const goodsImg = filenames[0]
        const goodsImgSmall = filenames[1] || filenames[0]
        const params = { merchantId, goodsImg, goodsImgSmall, ...values }
        this.handleDispath(params)
      }
    })
  },

  // 模态框关闭时清空表单
  handleCancel () {
    this.form.resetFields()
    this.filenames = []
    this.$refs.upload.setFileList([])
  },

  // 图片上传完成回调
  handleDone (filename) {
    this.filenames.push(filename)
    this.textTrigger = !(this.filenames.length > 1)
  },

  // 图片删除完成回调
  handleRemove (filename) {
    this.filenames.splice(this.filenames.findIndex(item => item === filename), 1)
    this.textTrigger = this.filenames.length >= 1
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
    this.getGoodsList(this.user.merchantId)
      .then((tables) => {
        setTimeout(() => {
          this.listLoading = false
          // 注册一下表单项的 id
          const keys = ['goodsId', 'discount', 'status', 'activity', 'specification']
          keys.forEach(key => this.form.getFieldDecorator(key))
        }, 200)
      })
      .catch(() => { })
  },

  render () {
    const { searchLoading, listLoading, textTrigger, hintText, labelCol, wrapperCol, cardTitle, confirmLoading } = this

    return (
      <a-card title="商品列表">

        {/* 头部区域 */}
        <a-row type="flex" justify="space-around" align="middle" gutter={[20, 20]} style={{ paddingBottom: '20px' }}>

          {/* 新增商品按钮 */}
          <a-col>
            <a-button type="primary" icon="plus" onClick={this.handleAdd}>添加商品</a-button>
          </a-col>

          {/* 搜索区 */}
          <a-col span={8}>
            <MySearch place="输入商品名称进行搜索" onsearch={this.handleSearch} loading={searchLoading} />
          </a-col>

          {/* 排序区 */}
          <a-col>
            <a-select defaultValue="default" onselect={this.handleSelect}>
              <a-select-option value="default">默认排序</a-select-option>
              <a-select-option value="monthlySales">销量排序</a-select-option>
              <a-select-option value="count">库存排序</a-select-option>
              <a-select-option value="status">状态排序</a-select-option>
              <a-select-option value="originalPice">价格排序</a-select-option>
            </a-select>
          </a-col>

        </a-row>

        {/* 列表展示区域 */}
        <a-list
          loading={listLoading}
          rowKey="goodsId"
          item-layout="vertical"
          size="large"
          pagination={this.pagination}
          dataSource={this.goodsList}
          renderItem={item => (
            <a-list-item
              key={item.goodsId}
              actions={[

                <a-tooltip placement="top" slot="actions">
                  <span slot="title">编辑商品</span>
                  <a-icon type="edit" onClick={() => this.handleEdit(item)} />
                </a-tooltip>,

                <a-popconfirm
                  slot="actions"
                  title="确定删除该商品吗?"
                  okText="确定"
                  cancelText="取消"
                  onconfirm={() => this.handleDel(item)}
                >
                  <a-tooltip placement="bottom">
                    <span slot="title">删除商品</span>
                    <a-icon type="delete" />
                  </a-tooltip>
                </a-popconfirm>,

                <a-tooltip placement="top" slot="actions">
                  <span slot="title">点赞量</span>
                  <a-space>
                    <a-icon type="like" />
                    {item.like}
                  </a-space>
                </a-tooltip>,

                <a-tooltip>
                  <span slot="title">月销量</span>
                  <a-space>
                    <a-icon type="rise" />
                    {item.monthlySales}
                  </a-space>
                </a-tooltip>,

                <a-tooltip placement="right" slot="actions">
                  <span slot="title">查看详情</span>
                  <a-icon type="ellipsis" onClick={() => this.handleInfo(item)} />
                </a-tooltip>

              ]}
              extra={
                <img
                  style={{ width: '180px' }}
                  alt="商品图片"
                  src={item.imgUrlBig}
                />
              }
            >

              <a-list-item-meta
                avatar={
                  <a-avatar
                    shape="square"
                    size="large"
                    src={item.imgUrlSmall}
                  />
                }
                title={item.goodsName}
                description={item.desc}
              />

              <a-row type="flex" gutter={[20, 20]} align="middle">
                <a-col>
                  <a-space>
                    <a-badge status={item.discount === 10 ? 'success' : 'default'} text="商品价格:" />
                    <a-tag>
                      ¥ {item.discount === 10 ? item.originalPice : <del>{item.originalPice}</del>}
                    </a-tag>
                  </a-space>
                </a-col>

                <a-col>
                  <a-space>
                    <a-badge status={item.discount === 10 ? 'default' : 'success'} text="商品折扣:" />
                    <a-tag>
                      {item.discount === 10 ? '暂无折扣' : `${item.discount}折`}
                    </a-tag>
                  </a-space>
                </a-col>

                <a-col>
                  <a-space>
                    <a-badge status="processing" text="折扣价:" />
                    <a-tag>
                      ¥ {item.discount === 10 ? item.originalPice : Math.ceil((item.originalPice * (item.discount / 10)) * 100) / 100}
                    </a-tag>
                  </a-space>
                </a-col>
              </a-row>

              <a-row type="flex" gutter={[20, 20]} align="middle">
                <a-col>
                  <a-space>
                    <a-badge status={item.count > 80 ? 'success' : 'warning'} text='商品库存:' />
                    <a-tag>{item.count}</a-tag>
                  </a-space>
                </a-col>

                <a-col>
                  <a-space>
                    <a-badge status={item.status === 0 ? 'default' : 'success'} text='商品状态:' />
                    <a-tag>
                      {item.status === 0 ? '停售' : '在售'}
                    </a-tag>
                  </a-space>
                </a-col>

                <a-col>
                  <a-space>
                    <a-badge status="processing" text='商品规格:' />
                    {item.specification.map(spec => <a-tag>{spec}</a-tag>)}
                  </a-space>
                </a-col>
              </a-row>

              <a-row type="flex" gutter={[20, 20]} align="middle">
                <a-col>
                  <a-space>
                    <a-badge status={item.activity.length > 0 ? 'processing' : 'default'} text="商品活动:" />
                    {
                      item.activity.length > 0
                        ? item.activity.map(activity => <a-tag>{activity}</a-tag>)
                        : <a-tag>该商品暂无活动</a-tag>
                    }
                  </a-space>
                </a-col>
              </a-row>

            </a-list-item>
          )}
        />

        {/* form 表单模态框 */}
        <a-modal
          title={cardTitle === 'add' ? '添加商品' : '编辑商品'}
          v-model={this.visible}
          style="top: 20px;"
          okText="确定"
          cancelText="取消"
          forceRender
          confirmLoading={confirmLoading}
          onok={this.handleOk}
          oncancel={this.handleCancel}
        >
          <a-form form={this.form}>

            {/* 图片区 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="商品图片"
              hasFeedback
            >
              {
                this.filenames.length < 2 ? <span class="tip">{hintText}</span> : ''
              }
              <MyUpload count={2} ref="upload" ondone={this.handleDone} onremove={this.handleRemove} />
              {
                textTrigger
                  ? <span class="tip" style={{ color: '#e53838' }}>注意: 若不上传则采用原图片展示</span>
                  : ''
              }
            </a-form-item>

            {/* 商品名称 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="商品名称"
              hasFeedback
            >
              <a-input
                v-decorator={['goodsName', { rules: [{ required: true, message: '请输入商品名称' }] }]}
              />
            </a-form-item>

            {/* 价格 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="商品价格"
              hasFeedback
            >
              <a-input-number
                min={0}
                step={0.1}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                v-decorator={['originalPice', { rules: [{ required: true, message: '请输入商品价格' }] }]}
              />
            </a-form-item>

            {/* 库存 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              hasFeedback
              label="商品库存"
            >
              <a-input-number
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                v-decorator={['count']}
              />
            </a-form-item>

            {/* 规格 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="商品规格"
              hasFeedback
            >
              <a-select
                placeholder="若无合适规格,请自行输入"
                maxTagCount={2}
                maxTagTextLength={10}
                v-decorator={['specification', { rules: [{ required: true, message: '请选择商品规格' }] }]}
                mode="tags" style="width: 100%" token-separators={[',']}>
                <a-select-option value='1个'>1个</a-select-option>
                <a-select-option value='1人份'>1人份</a-select-option>
              </a-select>
            </a-form-item>

            {/* 编辑商品才显示的表单项 */}
            {
              cardTitle === 'add' ? '' : (
                <div>
                  {/* 商品 id 提交表单时用 */}
                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label='唯一标识'
                    hasFeedback
                  >
                    <a-input disabled v-decorator={['goodsId', { rules: [{ required: true }] }]} />
                  </a-form-item>
                  {/* 折扣 */}
                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="商品折扣"
                    hasFeedback
                  >
                    <a-input-number
                      step={0.1}
                      max={10}
                      min={1}
                      v-decorator={['discount', { initialValue: 10 }]}
                    />
                  </a-form-item>
                  {/* 状态: 0为停售 1为在售 */}
                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="商品状态"
                    hasFeedback
                  >
                    <a-select v-decorator={['status', { initialValue: 0 }]}>
                      <a-select-option value={0}>下架</a-select-option>
                      <a-select-option value={1}>上架</a-select-option>
                    </a-select>
                  </a-form-item>
                  {/* 商品活动 */}
                  <a-form-item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label="商品活动"
                    hasFeedback
                  >
                    <a-select
                      v-decorator={['activity']}
                      mode="tags"
                      style="width: 100%"
                      token-separators={[',']}
                    />
                  </a-form-item>
                </div>
              )
            }

            {/* 商品描述 */}
            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="商品描述"
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

        {/* 商品详情区 */}
        <a-modal
          title="商品详情"
          style="top: 20px;"
          width={800}
          footer={null}
          v-model={this.showInfoModal}
        >
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
</style>
