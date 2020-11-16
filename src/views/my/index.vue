<template>
  <div class="my-container">
    <!-- 登录状态下的my页面 -->
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        class="base-info"
        center
        :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{currentUser.name}}</div>
        <van-button
          class="updata-btn"
          size="small"
          round
        >编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div class="count">{{currentUser.art_count}}</div>
          <div class="text">头条</div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="count">{{currentUser.follow_count}}</div>
          <div class="text">关注</div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="count">{{currentUser.fans_count}}</div>
          <div class="text">粉丝</div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="count">{{currentUser.like_count}}</div>
          <div class="text">获赞</div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录状态时 my页面 -->
    <div v-else class="not-login">
      <div class="mobile" @click="$router.push('/login')">
        <van-icon class="login-mobile" class-prefix="toutiao" name="shouji" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'myIndex',
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    },
    onLogout () {
      // 提示用户是否退出登录
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // 确认执行这里
          // 清除用户登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 退出执行这里
        })
      // 确认 -> 处理退出
    }
  }
}
</script>

<style lang="less">
.my-container{
  .my-info{
    background-color: #3296fa;
    .base-info{
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar{
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid white;
        margin-right: 11px;
      }
      .name{
        color: white;
        font-size: 15px;
      }
      .updata-btn{
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        .count{
          font-size: 18px;
        }
        .text{
          font-size: 11px;
        }
      }
    }
    .van-grid-item__content{
      background-color: unset;
    }
  }
  .not-login{
    height: 180px;
    background-color: #3296fa;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background-color: #fff;
      text-align: center;
      .login-mobile{
        font-size: 43px;
        color: #3296fa;
        line-height: 66px;
      }
    }
    .text{
      color: #fff;
      font-size: 14px;
    }
  }
  .nav-grid{
    .nav-grid-item{
      height: 70px;
      .toutiao{
        font-size: 25px;
      }
      .van-grid-item__text{
        margin-top: 5px;
        font-size: 14px;
        color: #333333;
      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
        font-size: 22px
      }
    }
  }
  .logout-cell{
    text-align: center;
    color:#db6262
  }
  .mb-4{
    margin-bottom: 4px;
  }
}
</style>
