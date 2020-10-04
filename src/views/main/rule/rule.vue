<template>
  <section class="rule-container">
    <header>
      <a-input-search
        placeholder="用户手机号码"
        enter-button
        :loading="searchLoading"
        :maxLength="11"
        @search="onSearch"
      >
        <a-icon slot="prefix" type="phone"/>
      </a-input-search>
    </header>
    <section class="users">
      <a-card hoverable v-for="user in userList" :key="user._id">
        <h3 slot="title" class="user">
          <a-avatar :src="user.avatar_url"/>
          <span>{{user.userName}}</span>
          <a-tag color="blue" @click="editUser(user)"><a-icon type="edit" /></a-tag>
        </h3>
        <a-card-meta>
          <div slot="description">
            <p>手机号码:<a-tag color="blue">{{user.phone}}</a-tag></p>
            <p>所属角色:<a-tag :color="user.authority | color">{{user.authority | tagText}}</a-tag></p>
          </div>
        </a-card-meta>
      </a-card>
      <a-modal
      v-model="visible"
      okText="确定"
      cancelText="取消"
      @ok="handleOk">
      <div class="set-auth">
        <h3>
          <a-tag color="red">角色授权</a-tag>
        </h3>
        <a-radio-group v-model="roleId">
          <a-radio :value="role.roleId" v-for="role in roles" :key="role.roleId">
            <a-tag :color="role.authority | color">{{ role.roleName }}</a-tag>
          </a-radio>
        </a-radio-group>
      </div>
    </a-modal>
    </section>
    <footer>
      <a-pagination
        show-size-changer
        :default-current="3"
        :total="500"
        @showSizeChange="onShowSizeChange"
      />
    </footer>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RoleAuth, RoleColor } from './role'

@Component({
  filters: {
    tagText: (auth: number) => RoleAuth[auth],
    color: (auth: number) => RoleColor[auth]
  }
})
export default class Rule extends Vue {
  userList = []
  roles = []
  searchLoading = false
  visible = false
  roleId = ''
  editUserId = ''

  // 初始化数据
  created () {
    this.$store.dispatch('getUsers')
    this.$store.dispatch('getRoles')
    setTimeout(() => {
      this.userList = this.$store.state.userList
      this.roles = this.$store.state.roles
    }, 200)
  }

  // 根据手机号搜索用户
  onSearch (value: string) {
    if (!/^1[34578]\d{9}$/g.test(value)) return this.$message.error('手机号码格式错误')
    else {
      this.searchLoading = true
      this.$store.dispatch('searchUser', value)
      setTimeout(() => {
        this.userList = this.$store.state.userList
        this.searchLoading = false
      }, 400)
    }
  }

  // 修改用户权限
  editUser (user: any) {
    this.editUserId = user._id
    this.visible = true
  }

  handleOk () {
    const { editUserId, roleId } = this
    this.$store.dispatch('editUser', { userId: editUserId, roleId })
    setTimeout(() => {
      this.visible = false
    }, 400)
  }

  onShowSizeChange (current: number, pageSize: number) {
    console.log(current, pageSize)
  }
}
</script>

<style lang="scss" scoped>
.rule-container{
  header{
    text-align: center;
    padding: 10px 0;
    .ant-input-search{
      width: 30%;
    }
  }
  footer{
    text-align: center;
    padding: 10px 0;
  }
}
.users{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .user{
    display: flex;
    align-items: center;
    position: relative;
    .ant-tag{
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      cursor: pointer;
    }
    span{
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .ant-card{
    margin: 10px;
    width: 23%;
    .ant-card-meta{
      p{
        display: flex;
        align-items: center;
        .ant-tag{
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
