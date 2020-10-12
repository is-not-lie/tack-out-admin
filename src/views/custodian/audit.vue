<script lang='jsx'>
import { mapGetters, mapActions } from 'vuex'
import { MyTag } from '@/components'
import { loadingState, paginationState, formState } from '@/data/commonState'
import { auditStatus, auditStatusColor } from '@/data/enum'

const plainOptions = ['等待审核', '审核通过', '审核驳回']

const state = {
  ...loadingState,
  ...paginationState,
  ...formState,
  searchType: 0,
  keyword: '',
  previewImage: '',
  previewVisible: false,
  visible: false,
  infoVisible: false,
  checkAll: true,
  checkedList: [],
  indeterminate: true,
  currentMerchant: {}
}

const computed = { ...mapGetters(['merchantList', 'user']) }

const methods = {
  ...mapActions(['getMerchantList', 'setAudit', 'searchMerchantList']),

  // 分页器改变回调
  paginationChange (pageNum) {
    const { current } = pageNum
    this.pageNum = current
    // this.initMerchantList(current)
  },

  // 显示商家详情回调
  handleInfo (row) {
    this.currentMerchant = row
    this.infoVisible = true
  },

  // 编辑审核状态回调
  handleAudit (row) {
    const { merchantId, brandName, status } = row
    this.form.setFieldsValue({ merchantId, brandName, status })
    this.currentMerchant = row
    this.visible = true
  },

  // 审核确认提交回调
  handleOk (e) {
    e.preventDefault()

    this.confirmLoading = true
    this.form.validateFields()
      .then(values => {
        this.tableLoading = true
        values.auditor = this.user.userName
        return this.setAudit(values)
      })
      .then(() => {
        setTimeout(() => {
          this.confirmLoading = false
          this.visible = false
          this.form.resetFields()
          this.tableLoading = false
        }, 400)
      })
      .catch(() => {
        this.confirmLoading = false
        this.tableLoading = false
      })
  },

  // 查看大图片回调
  handlePreview (previewImage) {
    this.previewImage = previewImage
    this.previewVisible = true
  },

  // 搜索框回调
  handleSearch () {},

  // 选项框改变回调
  selectChange (value) {
    this.searchType = value
    this.keyword = ''
  },

  // 多选框改变回调
  onChange (checkedList) {
    console.log(checkedList)
    this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
    this.checkAll = checkedList.length === plainOptions.length
  },

  // 全选改变回调
  onCheckAllChange (e) {
    Object.assign(this, {
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }
}

export default {
  data () {
    return {
      ...state,
      form: this.$form.createForm(this),

      columns: [
        {
          title: '品牌图片',
          align: 'center',
          dataIndex: 'brandImg',
          customRender: text => <a-avatar src={text} size="large" />
        },
        {
          title: '品牌名称',
          align: 'center',
          dataIndex: 'brandName'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '申请人',
          align: 'center',
          dataIndex: 'proposer'
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text) => <MyTag text={auditStatus[text]} color={auditStatusColor[text]}/>
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'applyTime'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          dataIndex: 'action',
          customRender: (text, row) => (
            <div style={{ display: 'flex' }}>
              {
                row.status === 0
                  ? (
                    <a-tooltip placement="top">
                      <span slot="title">确定审核结果</span>
                      <a-button type="link" icon="audit" onClick={() => this.handleAudit(row)}>审核</a-button>
                    </a-tooltip>
                  )
                  : (
                    <a-button type="link" icon="check-circle">已审核</a-button>
                  )
              }
              <a-tooltip placement="top">
                <span slot="title">查看表单详情</span>
                <a-button type="link" icon="info-circle" onClick={() => this.handleInfo(row)}>详情</a-button>
              </a-tooltip>
            </div>
          )
        }
      ]
    }
  },

  computed,

  methods,

  created () {
    this.getMerchantList()
      .then(() => { this.tableLoading = false })
      .catch(() => {})
  },

  render () {
    const { searchType, indeterminate, checkAll, searchLoading, wrapperCol, labelCol, previewImage, currentMerchant, confirmLoading, merchantList, columns, tableLoading, total, pageSize, pageNum } = this
    return (
      <a-card title="商家列表">

        {/* 头部搜索部位 */}
        <a-row type="flex" align="middle" style={{ paddingBottom: '20px' }}>

          <a-col span={16}>
            <a-row type="flex">

              <a-col span={5} offset={3}>
                <a-select default-value={searchType} onchange={this.selectChange}>
                  <a-select-option value={0}>按品牌名称搜索</a-select-option>
                  <a-select-option value={1}>按手机号码搜索</a-select-option>
                </a-select>
              </a-col>

              <a-col span={10}>
                <a-input-search
                  max-length={20}
                  placeholder="请输入"
                  v-model={this.keyword}
                  loading={searchLoading}
                  onsearch={this.handleSearch}
                >
                  <a-button type="primary" icon="search" slot="enterButton">搜索</a-button>
                </a-input-search>
              </a-col>

            </a-row>
          </a-col>

          <a-col span={8}>
            <a-row gutter={[0, 10]}>

              <a-col offset={5}>
                <a-checkbox indeterminate={indeterminate} checked={checkAll} onchange={this.onCheckAllChange}>
                  显示全部
                </a-checkbox>
              </a-col>

              <a-col>
                <a-checkbox-group v-model={this.checkedList} options={plainOptions} onchange={this.onChange} />
              </a-col>

            </a-row>
          </a-col>
        </a-row>

        {/* 展示表格 */}
        <a-table
          row-key="merchantId"
          size="default"
          loading={tableLoading}
          columns={columns}
          dataSource={merchantList}
          pagination={{ total, pageSize }}
          defaultCurrent={pageNum}
          onchange={this.paginationChange}
        />

        {/* 申请表单的详情 */}
        <a-modal
          v-model={this.infoVisible}
          title="表单详情"
          style="top: 20px;"
          width={800}
          forceRender
          footer={false}
        >
          <a-descriptions bordered column={{ md: 2, sm: 1, xs: 1 }}>
            <a-descriptions-item label="品牌图片">
              <a-avatar src={currentMerchant.brandImg} size="large" shape="square" />
              <a-button type="link" icon="search" onClick={() => this.handlePreview(currentMerchant.brandImg)}>查看图片</a-button>
            </a-descriptions-item>
            <a-descriptions-item label="品牌名称">
              <MyTag text={currentMerchant.brandName} color="blue" />
            </a-descriptions-item>
            <a-descriptions-item label="申请时间">
              {currentMerchant.applyTime}
            </a-descriptions-item>
            <a-descriptions-item label="审核时间">
              {currentMerchant.passTime}
            </a-descriptions-item>
            <a-descriptions-item label="申请人">
              {currentMerchant.proposer}
            </a-descriptions-item>
            <a-descriptions-item label="审核人">
              {currentMerchant.auditor}
            </a-descriptions-item>
            <a-descriptions-item label="联系号码">
              {currentMerchant.phone}
            </a-descriptions-item>
            <a-descriptions-item label="联系邮箱">
              {currentMerchant.email}
            </a-descriptions-item>
            <a-descriptions-item label="营业执照">
              <a-avatar src={currentMerchant.license} size="large" shape="square" />
              <a-button type="link" icon="search" onClick={() => this.handlePreview(currentMerchant.license)}>查看图片</a-button>
            </a-descriptions-item>
            <a-descriptions-item label="餐饮许可证">
              <a-avatar src={currentMerchant.licence} size="large" shape="square" />
              <a-button type="link" icon="search" onClick={() => this.handlePreview(currentMerchant.licence)}>查看图片</a-button>
            </a-descriptions-item>
          </a-descriptions>

          {/* 查看大图片的模态框 */}
          <a-modal
            v-model={this.previewVisible}
            footer={null}
            closable={false}
          >
            <img style="width: 100%" src={previewImage} />
          </a-modal>

        </a-modal>

        {/* 审核操作的模态框 */}
        <a-modal
          v-model={this.visible}
          title="审核操作"
          style="top: 20px;"
          okText="确定"
          cancelText="取消"
          width={800}
          forceRender
          confirmLoading={confirmLoading}
          onok={this.handleOk}
        >

          <a-form form={this.form}>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="唯一标识"
              hasFeedback
            >
              <a-input disabled v-decorator={['merchantId']} />
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="品牌名称"
              hasFeedback
            >
              <a-input disabled v-decorator={['brandName']} />
            </a-form-item>

            <a-form-item
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              label="审核结果"
              hasFeedback
            >
              <a-select v-decorator={['status', { initialValue: 0 }]}>
                {
                  auditStatus.map((status, i) => (
                    <a-select-option value={i}>{status}</a-select-option>
                  ))
                }
              </a-select>
            </a-form-item>

          </a-form>

        </a-modal>

      </a-card>
    )
  }
}
</script>

<style lang='scss' scoped>
</style>
