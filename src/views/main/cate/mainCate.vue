<template>
  <section class="cate-container">
    <header>
      <a-button type="primary" icon="plus" @click="cateAdd">添加分类</a-button>
    </header>
    <a-table :loading="isLoading" :columns="columns" :data-source="data" rowKey="_id"/>
    <a-modal :visible="visible" :footer="null" :closable="false">
      <h3 slot="title">
        <a-tag>{{modalTitle}}</a-tag>
      </h3>
      <CateForm @ok="visible = false" @cancel="visible = false"/>
    </a-modal>
  </section>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { CateColumns } from './tableColumns'
import CateForm from '@/components/Cate/CateForm.vue'

@Component({
  components: { CateForm }
})
export default class MainCate extends CateColumns {
  isLoading = true
  visible = false
  modalTitle = ''
  data = []

  created () {
    this.$store.dispatch('getCates')
    setTimeout(() => {
      this.data = this.$store.state.cates
      this.isLoading = false
    }, 400)
  }

  cateAdd () {
    this.modalTitle = '新增分类'
    this.visible = true
  }

  cateEdit (row: any) {
    this.modalTitle = '分类设置'
    this.visible = true
  }

  cateDel (row: any) {
    this.$confirm({
      title: '确定要删除该分类吗?',
      content: '删除主分类会将子分类一并删除哦,确定要删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { subList } = row
        if (subList.length) {
          this.$message.error('请先删除子分类')
          return Promise.resolve()
        } else {
          const { _id } = row
          return this.$store.dispatch('delCate', _id)
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.cate-container{
  header{
    padding: 10px 0 20px 20px;
  }
}
</style>
