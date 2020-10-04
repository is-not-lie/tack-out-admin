<template>
  <div class="clearfix">
    <a-upload
      :list-type="type"
      action="/api/img/upload"
      method="post"
      name="image"
      @change="handleChange"
    >
      <a-icon type="plus" v-if="fileList.length < imgCount"/>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import axios from '@/api/http'

@Component
export default class Upload extends Vue {
  @Prop(Number) imgCount!: number
  @Prop(String) type!: string

  fileList = []

  async handleChange ({ file, fileList }: any) {
    if (file.status === 'done') {
      const url = file.response.data.url
      fileList[fileList.length - 1].url = url
      fileList[fileList.length - 1].name = file.name
      this.fileList = fileList
    }
    if (file.status === 'removed') {
      const { data, status } = file.response
      if (status === 200) {
        const result = await axios.post('/img/del', { filename: data.filename })
        if (result) this.$message.success('图片删除成功')
      }
    }
  }
}
</script>

<style scoped>

</style>
