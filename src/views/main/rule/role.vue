<template>
  <section>
    <header class="role-header">
      <a-button type="primary" icon="arrow-left" @click="$router.back()">返回</a-button>
      <a-button type="primary" icon="user-add" @click="showAdd">新增角色</a-button>
    </header>
    <a-table
      rowKey="roleId"
      bordered
      :columns="columns"
      :loading="isLoading"
      :data-source="data"
    />
    <a-modal
      v-model="visible"
      :title="modalTitle"
      okText="确定"
      cancelText="取消"
      @ok="handleOk">
      <a-input ref="roleNameInput" v-model="roleName"
        :defaultValue="roleName"
        placeholder="请输入角色名称">
        <a-icon slot="prefix" type="user" />
      </a-input>
      <div class="set-auth">
        <h3>
          <a-tag color="red">权限设置</a-tag>
        </h3>
        <a-radio-group v-model="authority">
          <a-radio :value="0">
            <a-tag color="blue">普通用户</a-tag>
          </a-radio>
          <a-radio :value="1">
            <a-tag color="#FFD161">商家用户</a-tag>
          </a-radio>
          <a-radio :value="2">
            <a-tag color="rgb(250, 170, 160)">管理员</a-tag>
          </a-radio>
          <a-radio :value="3">
            <a-tag color="rgb(255, 77, 79)">超级管理员</a-tag>
          </a-radio>
        </a-radio-group>
      </div>
    </a-modal>
  </section>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { RoleColumns } from './role'

@Component
export default class Role extends RoleColumns {
  authority = 0
  isLoading = true
  visible = false
  roleName = ''
  type = 'add'
  data = []
  roleId = ''

  // 模态框标题
  get modalTitle () {
    return this.type === 'add' ? '添加角色' : '编辑角色'
  }

  // 初始化数据显示
  created () {
    this.$store.dispatch('getRoles')
    setTimeout(() => {
      this.data = this.$store.state.roles
      this.isLoading = false
    }, 400)
  }

  // 显示添加角色的模态框
  showAdd () {
    this.type = 'add'
    this.roleName = ''
    this.authority = 0
    this.visible = true
  }

  // 显示编辑角色的模态框
  showEdit (row: any) {
    const { roleName, authority } = row
    this.type = 'edit'
    this.roleId = row.roleId
    this.roleName = roleName
    this.authority = authority
    this.visible = true
  }

  handleOk () {
    this.isLoading = true
    const { user } = this.$store.state
    const { type, roleName, authority, roleId } = this

    if (!roleName) return this.$message.error('请输入角色名称')

    if (type === 'add') {
      this.$store.dispatch('addRole', {
        roleName,
        authority,
        creator: user.userName
      })
    } else {
      this.$store.dispatch('editRole', {
        roleId,
        roleName,
        authority,
        editor: user.userName
      })
    }

    setTimeout(() => {
      this.data = this.$store.state.roles
      this.visible = false
      this.isLoading = false
    }, 400)
  }

  showDel (row: any) {
    const { roleId } = row
    this.$confirm({
      title: '您确定要删除该角色吗?',
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: () => {
        return this.$store.dispatch('delRole', roleId)
          .then((roles) => { this.data = roles })
          .catch((msg) => this.$message.error(msg))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.role-header{
  @extend .flex;
  justify-content: space-between;
  padding: 0 10px 20px;
}
.edit{
  margin-right: 10px;
}
.set-auth{
  h3{
    @extend .flex;
    padding: 20px 0 10px;
  }
  .ant-radio-group{
    @extend .flex;
  }
}
</style>
