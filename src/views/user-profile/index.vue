<template>
  <div class="user-profile">
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 编辑个人信息 -->
    <input type="file" hidden ref="file" accept="image/jpeg" @change="onFileChange">
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

    <!-- 头像弹出层 -->
    <van-popup class="update-photo" v-model="isPhotoShow" round position="bottom" :style="{ height: '100%' }">
      <update-photo
        v-if="isPhotoShow"
        :file="previewImage"
        @close="isPhotoShow=false"
        @update-photo="user.photo=$event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'
import EditName from './components/edit-name'
import UpdateGander from './components/update-gander'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdatePhoto,
    EditName,
    UpdateGander,
    UpdateBirthday
  },
  data () {
    return {
      user: {}, // 用户数据
      isNameShow: false, // 控制修改昵称弹出层
      isGenderShow: false, // 控制修改性别弹出层
      isBirthdayShow: false, // 控制修改生日弹出层
      isPhotoShow: false, // 控制头像编辑弹出层
      previewImage: null // 上传预览图片对象
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
      // 展示弹出层
      this.isPhotoShow = true
      // 在弹出层里预览图片 用DOM里的方法获取点击的图片的src地址
      const file = this.$refs.file.files[0]
      this.previewImage = file
      // 为了解决相同文件不触发 每次触发之后清空的file的value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.van-popup{
  background-color: #f5f7f9;
}
.update-photo{
  background-color: #000;
}
</style>
