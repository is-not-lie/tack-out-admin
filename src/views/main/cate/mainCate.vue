<template>
  <section class="cate-container">
    <header>
      <a-button type="primary" icon="plus" @click="cateAdd">添加分类</a-button>
      <a-input-search placeholder="输入分类名称搜索分类"/>
    </header>
    <section class="cate-warpper">
      <a-card hoverable v-for="cate in cates" :key="cate._id" size="small">
        <a-card-meta>
          <div slot="description" class="content">
            <a-avatar :src="cate.icon"/>
            <a-tag color="blue">{{cate.cateName}}</a-tag>
          </div>
        </a-card-meta>
        <footer slot="actions">
          <a-tag color="blue" @click="cateEdit(cate)"><a-icon type="edit" /></a-tag>
          <a-tag @click="cateEdit(cate)"><a-icon type="ellipsis" /></a-tag>
        </footer>
      </a-card>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MainCate extends Vue {
  isLoading = true
  visible = false
  modalTitle = ''
  cates = []

  created () {
    this.$store.dispatch('getCates')
    setTimeout(() => {
      this.cates = this.$store.state.cates
      this.isLoading = false
    }, 400)
  }

  cateAdd () {
    this.modalTitle = '新增分类'
    this.visible = true
  }

  cateEdit () {
    this.modalTitle = '分类设置'
    this.visible = true
  }

  // cateDel (row: any) {
  //   this.$confirm({
  //     title: '确定要删除该分类吗?',
  //     content: '删除主分类会将子分类一并删除哦,确定要删除吗?',
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk: () => {
  //       const { subList } = row
  //       if (subList.length) {
  //         this.$message.error('请先删除子分类')
  //         return Promise.resolve()
  //       } else {
  //         const { _id } = row
  //         return this.$store.dispatch('delCate', _id)
  //       }
  //     }
  //   })
  // }
}
</script>

<style lang="scss" scoped>
.cate-container{
  header{
    padding: 10px 30px 20px;
    @extend .flex;
    justify-content: space-between;
    .ant-input-search{
      width: 30%;
    }
  }
  .cate-warpper{
    display: flex;
    flex-wrap: wrap;
    .ant-card{
      width: 10%;
      margin: 10px 6px;
      .ant-tag{
        margin: 0;
      }
      .ant-avatar{
        margin-bottom: 10px;
      }
      .content{
        @extend .flex;
        flex-direction: column;
      }
      footer{
        min-width: 80px;
        @extend .flex;
        justify-content: space-evenly;
        padding: 0 10px;
        .ant-tag{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
