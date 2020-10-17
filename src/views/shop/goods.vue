<script>
import { mapGetters, mapActions } from 'vuex'
import { MySearch, MyUpload } from '@/components'
import { loadingState, formState } from '@/data/commonState'
import { PAGESIZE } from '@/config'

// 隐藏表单项的 id (用于数据回显时注册)
const hiedFormItemId = ['discount', 'status', 'activity']

const state = {
  ...loadingState,
  ...formState,
  dis: 0,
  price: 0,
  currentGoods: {},
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
  },

  // 计算折扣价
  discountPrice () {
    const { price, dis } = this
    return Math.ceil((price * (dis / 10)) * 100) / 100
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
          this.handleCancel()
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
    // 注册表单项
    hiedFormItemId.forEach(key => this.form.getFieldDecorator(key))
    // 取出需要回显的数据, 多余的不要
    const { imgUrlBig, imgUrlSmall, originalPrice, goodsName, discount, count, status, activity, desc, specification } = goods
    this.currentGoods = goods
    this.price = originalPrice
    this.dis = discount
    // 处理图片回显
    this.filenames = [imgUrlBig, imgUrlSmall]
    const big = {
      filename: imgUrlBig.split('/').reverse()[0],
      url: imgUrlBig
    }
    const small = {
      filename: imgUrlSmall.split('/').reverse()[0],
      url: imgUrlSmall
    }
    // 注册一下表单项的 id
    this.$refs.upload.setFileList([big, small])
    // 处理表单数据回显
    this.form.setFieldsValue({ originalPrice, goodsName, discount, count, status: status === 1, activity, desc, specification })
    this.visible = true
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
        const { goodsId } = this.currentGoods
        values.status = values.status ? 1 : 0
        const params = { goodsId, merchantId, goodsImg, goodsImgSmall, ...values }
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
              <a-select-option value="originalPrice">价格排序</a-select-option>
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
                </a-tooltip>

              ]}
            >

              <a-list-item-meta
                avatar={
                  <img
                    style={{ width: '180px' }}
                    alt="商品图片"
                    src={item.imgUrlBig}
                  />
                }
                title={item.goodsName}
                description={item.desc}
              />

              <a-descriptions bordered column={{ md: 3, sm: 2, xs: 1 }}>
                <a-descriptions-item label="商品价格">
                  <a-badge status={item.discount === 10 ? 'success' : 'default'} />
                  ¥ {item.discount === 10 ? item.originalPrice : <del>{item.originalPrice}</del>}
                </a-descriptions-item>
                <a-descriptions-item label="商品折扣">
                  <a-badge status={item.discount === 10 ? 'default' : 'success'} />
                  {item.discount === 10 ? '暂无折扣' : `${item.discount}折`}
                </a-descriptions-item>
                <a-descriptions-item label="折扣价">
                  <a-badge status="processing" />
                  ¥ {item.discount === 10 ? item.originalPrice : Math.ceil((item.originalPrice * (item.discount / 10)) * 100) / 100}
                </a-descriptions-item>
                <a-descriptions-item label="商品库存">
                  <a-badge status={item.count > 80 ? 'success' : 'warning'} />
                  {item.count}
                </a-descriptions-item>
                <a-descriptions-item label="商品状态">
                  <a-badge status={item.status === 0 ? 'default' : 'success'} />
                  {item.status === 0 ? '停售' : '在售'}
                </a-descriptions-item>
                <a-descriptions-item label="商品规格">
                  <a-badge status="processing" />
                  {item.specification.map(spec => <a-tag>{spec}</a-tag>)}
                </a-descriptions-item>
                <a-descriptions-item label="商品活动">
                  <a-badge status={item.activity.length > 0 ? 'processing' : 'default'} />
                  {
                    item.activity.length > 0
                      ? item.activity.map(activity => <a-tag>{activity}</a-tag>)
                      : <a-tag>该商品暂无活动</a-tag>
                  }
                </a-descriptions-item>
              </a-descriptions>

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

            <a-row type="flex" align="middle">

              {/* 价格 */}
              <a-col>
                <a-form-item
                  labelCol={{ span: 12, offset: 2 }}
                  wrapperCol={{ span: 8 }}
                  label="商品价格"
                  hasFeedback
                >
                  <a-input-number
                    min={0}
                    max={500}
                    step={0.1}
                    onchange={value => { this.price = value }}
                    placeholder='¥ 0'
                    v-decorator={['originalPrice', { rules: [{ required: true, message: '请输入商品价格' }] }]}
                  />
                </a-form-item>
              </a-col>

              {/* 库存 */}
              <a-col>
                <a-form-item
                  labelCol={{ span: 12, offset: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                  label="商品库存"
                >
                  <a-input-number
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    v-decorator={['count', { rules: [{ required: true, message: '请输入商品库存' }] }]}
                  />
                </a-form-item>
              </a-col>

            </a-row>

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
                <a-row>

                  {/* 商品活动 */}
                  <a-col>
                    <a-row type="flex" align="middle">

                      {/* 折扣 */}
                      <a-col>
                        <a-form-item
                          labelCol={{ span: 12, offset: 3 }}
                          wrapperCol={{ span: 8 }}
                          label="商品折扣"
                          hasFeedback
                        >
                          <a-input-number
                            step={0.1}
                            max={10}
                            min={1}
                            onchange={value => { this.dis = value }}
                            v-decorator={['discount', { initialValue: 10 }]}
                          />
                        </a-form-item>
                      </a-col>

                      {/* 折扣价 */}
                      <a-col offset={1}>
                        <a-form-item
                          labelCol={{ span: 12, offset: 4 }}
                          wrapperCol={{ span: 8 }}
                          label="折扣价"
                          hasFeedback
                        >
                          <a-input-number step={0.1} disabled value={`¥ ${this.discountPrice}`} />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-col>

                  {/* 状态: 0为停售 1为在售 */}
                  <a-col>
                    <a-form-item
                      labelCol={labelCol}
                      wrapperCol={wrapperCol}
                      label="商品状态"
                    >
                      <a-switch
                        v-decorator={['status', { valuePropName: 'checked' }]}
                        unCheckedChildren="上架"
                        checkedChildren="下架"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col>
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
                  </a-col>

                </a-row>
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
