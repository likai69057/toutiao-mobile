<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 编辑个人信息 -->
    <input type="file" hidden ref="file" accept="image/png" @change="onFileChange">
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" is-link :value="user.name" @click="isNameShow=true" />
    <van-cell title="性别" is-link :value="user.gender === 1 ? '女' : '男'" @click="isGenderShow=true" />
    <van-cell title="生日" is-link :value="user.birthday" @click="isBirthdayShow=true" />

    <!-- 昵称弹出层 -->
    <van-popup v-model="isNameShow" position="bottom" :style="{ height: '100%' }">
      <edit-name
        v-if="isNameShow"
        :name="user.name"
        @update-name="user.name=$event"
        @close="isNameShow=false"
      />
    </van-popup>

    <!-- 性别弹出层 -->
    <van-popup v-model="isGenderShow" round position="bottom">
      <update-gander
        v-if="isGenderShow"
        v-model="user.gender"
        @update-gender="user.gender=$event"
        @close="isGenderShow = false"
      />
    </van-popup>

    <!-- 生日弹出层 -->
    <van-popup v-model="isBirthdayShow" round position="bottom">
      <update-birthday
        v-if="isBirthdayShow"
        v-model="user.birthday"
        @close="isBirthdayShow=false"
        @update-birthday="user.birthday=$event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'
import EditName from './components/edit-name'
import UpdateGander from './components/update-gander'
import UpdateBirthday from './components/update-birthday'

export default {
  name: 'UserProfile',
  components: {
    EditName,
    UpdateGander,
    UpdateBirthday
  },
  data () {
    return {
      user: {}, // 用户数据
      isNameShow: false, // 控制修改昵称弹出层
      isGenderShow: false, // 控制修改性别弹出层
      isBirthdayShow: false // 控制修改生日弹出层
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    // 头像选择
    onFileChange () {
      // 为了解决相同文件不触发 每次触发之前清空之前的file的value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.van-popup{
  background-color: #f5f7f9;
}
</style>
