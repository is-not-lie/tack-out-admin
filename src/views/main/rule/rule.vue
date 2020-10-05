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
            <p>注册时间:<a-tag color="green">{{user.signinTime}}</a-tag></p>
            <p>手机号码:<a-tag color="blue">{{user.phone}}</a-tag></p>
            <p>所属角色:<a-tag :color="user.authority | color">{{user.authority | tagText}}</a-tag></p>
          </div>
        </a-card-meta>
      </a-card>
      <a-modal :closable="false" v-model="visible">
        <header slot="title" :style="{ textAlign: 'center', fontSize: '20px' }">
          <a-tag color="red">用户授权</a-tag>
        </header>
        <a-radio-group v-model="authority" :style="{ display: 'flex', justifyContent: 'center' }">
          <a-radio :value="0">
            <a-tag :color="0 | color">{{0 | tagText}}</a-tag>
          </a-radio>
          <a-radio :value="1">
            <a-tag :color="1 | color">{{1 | tagText}}</a-tag>
          </a-radio>
          <a-radio :value="2">
            <a-tag :color="2 | color">{{2 | tagText}}</a-tag>
          </a-radio>
        </a-radio-group>
        <footer slot="footer" :style="{ textAlign: 'center' }">
          <a-button @click="visible = false">取消</a-button>
          <a-button @click="handleOk" type="primary">确定</a-button>
        </footer>
      </a-modal>
    </section>
    <footer>
      <a-pagination
        :default-current="pageNum"
        :total="total"
        :pageSize="pageSize"
        @change="handleChange"
      />
    </footer>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

enum RoleAuth {
  '普通用户',
  '商家用户',
  '管理员'
}

enum RoleColor {
  'blue',
  'yellow',
  'red'
}

@Component({
  filters: {
    tagText: (auth: number) => RoleAuth[auth],
    color: (auth: number) => RoleColor[auth]
  }
})
export default class Rule extends Vue {
  userList = []
  searchLoading = false
  visible = false
  authority = 0
  userId = ''
  pageNum = 1
  total = 0
  pageSize = 8

  initUserList () {
    this.$store.dispatch('getUsers', this.pageNum)
    setTimeout(() => {
      const { list, total, pageSize } = this.$store.state.userList
      this.userList = list
      this.total = total
      this.pageSize = pageSize
    }, 200)
  }

  // 初始化数据
  created () { this.initUserList() }

  // 根据手机号搜索用户
  onSearch (value: string) {
    if (!/^1[34578]\d{9}$/g.test(value)) return this.$message.error('手机号码格式错误')
    else {
      this.searchLoading = true
      this.$store.dispatch('searchUser', value)
      setTimeout(() => {
        this.searchLoading = false
      }, 400)
    }
  }

  // 修改用户权限
  editUser (user: { _id: string; authority: number }) {
    this.userId = user._id
    this.authority = user.authority
    this.visible = true
  }

  handleOk () {
    const { userId, authority } = this
    this.$store.dispatch('editUser', { userId, authority })
    this.visible = false
  }

  handleChange (num: number) {
    this.pageNum = num
    this.initUserList()
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
  footer{
    text-align: center;
    padding: 10px 0;
  }
}
</style>
