<template>
  <section>
    <el-table
      v-if="tableData.length"
      :data="tableData">
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.creator }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑人">
        <template slot-scope="scope" v-if="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.editor }}</p>
            <p>编辑时间: {{ scope.row.editTime }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.editor }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section v-else class="error-container">
      <img :src="error" alt="404">
      <p>找不到角色存在呢,要不要添加一个?</p>
      <el-button @click="showAddModal('add')">添加角色</el-button>
    </section>
    <el-dialog :title="operationType" :visible.sync="showModal" center>
      <el-form :model="form" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ERROR_IMG_SRC } from '@/config'
@Component
export default class RuleRole extends Vue {
  error = ERROR_IMG_SRC
  showModal = false
  operationType = ''
  tableData: any[] = this.$store.state.roles
  form = { name: '' }
  rules = { name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] }

  created () {
    this.$store.dispatch('getRoles', (roles) => { this.tableData = roles })
  }

  showAddModal (type: string) {
    switch (type) {
      case 'add':
        this.operationType = '添加新角色'
        break
      case 'edit':
        this.operationType = '编辑角色'
        break
      default:
        this.operationType = '确定要删除该角色吗?'
        break
    }
    this.showModal = true
  }

  handleOk () {
    const { form } = this
    if (form.name.trim() === '') this.$message.error('请输入角色名称')
    else {
      const { user } = this.$store.state
      this.$store.dispatch('addRole', {
        roleName: form.name,
        creator: user.userName,
        callback: (roles) => this.tableData = roles
      })
    }
  }

  handleEdit (index, row) {
    console.log(index, row)
  }

  handleDelete (index, row) {
    console.log(index, row)
  }
}
</script>

<style lang="scss" scoped>
.error-container{
  @extend .flex;
  justify-content: flex-start;
  padding-top: 50px;
  flex-direction: column;
  img{
    width: 20%;
    object-fit: cover;
  }
  p{
    margin: 15px;
  }
}
</style>
