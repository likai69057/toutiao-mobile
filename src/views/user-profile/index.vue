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
    <van-cell title="姓名" is-link :value="user.name"></van-cell>
    <van-cell title="性别" is-link value="男"></van-cell>
    <van-cell title="生日" is-link :value="user.birthday"></van-cell>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: {} // 用户数据
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

<style scoped>

</style>
