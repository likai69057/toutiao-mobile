<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 编辑个人信息 -->
    <van-cell title="头像" is-link center>
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" is-link :value="user.name" @click="isNameShow=true" />
    <van-cell title="性别" is-link :value="user.gender === 1 ? '女' : '男'" />
    <van-cell title="生日" is-link :value="user.birthday" />

    <!-- 昵称弹出层 -->
    <van-popup v-model="isNameShow" position="bottom" :style="{ height: '100%' }">
      <edit-name
        :name="user.name"
        @update-name="user.name=$event"
        @close="isNameShow=false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'
import EditName from './components/edit-name'

export default {
  name: 'UserProfile',
  components: {
    EditName
  },
  data () {
    return {
      user: {}, // 用户数据
      isNameShow: false // 控制修改昵称弹出层
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    }
  }
}
</script>

<style scoped lang="less">
.van-popup{
  background-color: #f5f7f9;
}
</style>
