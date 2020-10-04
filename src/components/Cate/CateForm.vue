<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item label="分类图片">
      <a-upload
        list-type="picture"
        action="/api/img/upload"
        name="image"
        v-decorator="[
          'icon',
          {
            valuePropName: 'images'
          },
        ]"
      >
        <a-button
          type="primary"
          icon="upload"
          ghost
        >上传图片</a-button>
      </a-upload>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">确认</a-button>
      <a-button html-type="reset" @click="handleReset">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Upload from '@/components/Common/Upload.vue'
import axios from '@/api/http'

@Component({
  components: { Upload }
})
export default class  extends Vue {
  form = this.$form.createForm(this, { name: 'cateForm' })

  handleSubmit (e: Event) {
    e.preventDefault()
    this.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.$emit('ok')
      }
    })
  }

  handleReset () {
    this.$emit('cancel')
  }
}
</script>

<style scoped>

</style>
