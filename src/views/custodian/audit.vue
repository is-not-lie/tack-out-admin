<script lang='jsx'>
import { mapGetters, mapActions } from 'vuex'
import { MyTag } from '@/components'
import { loadingState, paginationState, formState } from '@/data/commonState'
import { auditStatus, auditStatusColor } from '@/data/enum'

const state = {
  ...loadingState,
  ...paginationState,
  ...formState,
  previewImage: '',
  previewVisible: false,
  visible: false,
  infoVisible: false,
  currentMerchant: {}
}

const computed = { ...mapGetters(['merchantList', 'user']) }

const methods = {
  ...mapActions(['getMerchantList', 'setAudit']),

  paginationChange (pageNum) {
    const { current } = pageNum
    this.pageNum = current
    // this.initMerchantList(current)
  },

  handleInfo (row) {
    this.currentMerchant = row
    this.infoVisible = true
  },

  handleAudit (row) {
    const { merchantId, brandName, status } = row
    this.form.setFieldsValue({ merchantId, brandName, status })
    this.currentMerchant = row
    this.visible = true
  },

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

  handlePreview (previewImage) {
    this.previewImage = previewImage
    this.previewVisible = true
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
    const { wrapperCol, labelCol, previewImage, currentMerchant, confirmLoading, merchantList, columns, tableLoading, total, pageSize, pageNum } = this
    return (
      <a-card title="商家列表">

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
              <MyTag text={currentMerchant.applyTime} color="green"/>
            </a-descriptions-item>
            <a-descriptions-item label="审核时间">
              <MyTag text={currentMerchant.passTime} color="volcano"/>
            </a-descriptions-item>
            <a-descriptions-item label="申请人">
              <MyTag text={currentMerchant.proposer} color="gold"/>
            </a-descriptions-item>
            <a-descriptions-item label="审核人">
              <MyTag text={currentMerchant.auditor} color="purple"/>
            </a-descriptions-item>
            <a-descriptions-item label="联系号码">
              <MyTag text={currentMerchant.phone} color="purple"/>
            </a-descriptions-item>
            <a-descriptions-item label="联系邮箱">
              <MyTag text={currentMerchant.email} color="purple"/>
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