<script lang="jsx">
import { http } from '@/api'
import { BASE_URL } from '@/config'
import { getBase64 } from '@/utils/base64'

const props = {
  count: Number
}

const state = {
  previewVisible: false,
  previewImage: ''
}

const methods = {
  // 关闭显示图片的模态框
  handleCancel () { this.previewVisible = false },

  // 图片预览模态框回调
  async handlePreview (file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    this.previewImage = file.url || file.preview
    this.previewVisible = true
  },

  // 图片上传回调
  async handleChange ({ file, fileList }) {
    if (file.status === 'done') {
      const { url, filename } = file.response.data
      const len = fileList.length
      fileList[len - 1].url = url
      fileList[len - 1].name = filename
      this.$emit('done', filename)
    }
    if (file.status === 'removed') {
      http.reqRemoveImg(file.name)
        .then(() => this.$message.success('图片删除成功'))
        .catch(() => this.$message.error('图片删除失败'))
      this.$emit('remove', file.name)
    }
    this.fileList = fileList
  },

  // 获取上传的图片列表 (给父组件用的)
  getFileList () { return this.fileList.map(file => file.name) },

  // 修改图片列表 (用于数据回显)
  setFileList (fileList) {
    this.fileList = fileList.map((file, i) => ({
      uid: -i,
      name: file.filename,
      url: file.url
    }))
  }
}

export default {
  props,

  data () {
    return {
      fileList: [],
      ...state
    }
  },

  methods,

  render () {
    const { fileList, previewVisible, previewImage, count } = this
    return (
      <div class="clearfix">
        <a-upload
          action={`${BASE_URL}/img/upload`}
          name="image"
          list-type="picture-card"
          file-list={fileList}
          onpreview={this.handlePreview}
          onchange={this.handleChange}
        >
          {
            fileList.length < count
              ? (
                <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    上传图片
                  </div>
                </div>
              )
              : ('')
          }
        </a-upload>
        <a-modal visible={previewVisible} footer={null} oncancel={this.handleCancel}>
          <img style="width: 100%" src={previewImage} />
        </a-modal>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.ant-upload-select-picture-card {
  i {
    font-size: 30px;
    color: $color3;
  }
  .ant-upload-text {
    margin-top: 8px;
    color: $color3;
  }
  &:hover {
    i,
    .ant-upload-text {
      transition: color .3s;
      color: #91d5ff;
    }
  }
}
</style>
