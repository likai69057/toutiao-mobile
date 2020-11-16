<template>
  <div class="login-container">
      <van-nav-bar
      class="app-nav-bar"
        title="注册 / 登录"
        left-arrow
        @click-left="$router.back()"
      />

      <!-- 登录表单 -->
      <van-form
       @submit="onLogin"
       :show-error="false"
       :show-error-message="false"
       :validate-first="true"
       ref="login-form"
       @failed="onFailed"
       >
        <!-- 基于 vant 的表单验证 -->
        <van-field
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="19"
          center
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          center
          placeholder="请输入验证码"
          name="code"
          :rules="formRules.code"
        >
          <template #button>
            <van-count-down
              v-if="isCountDownShow"
              format="ss s"
              :time="1000 * 60"
              @finish="isCountDownShow = false" />
            <van-button
              v-else
              class="send-btn"
              size="mini"
              round
              :loading="isSendSmsLoading"
              @click.prevent="onSendSms">
              发送验证码
            </van-button>
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button
            class="login-btn"
            type="info"
            block
            >登录
          </van-button>
        </div>
      </van-form>
  </div>
</template>

<script>

import { login, sendSms } from '@/api/user'
/* import { Toast } from 'vant' */

export default {
  name: 'loginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入有效的手机号码' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入有效的验证码' }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  methods: {
    async onLogin () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      // 4.处理响应结果
      try {
        const res = await login(this.user)
        this.$toast.success('登陆成功')

        // 将后端返回的用户登录状态(Token等数据)放到vuex容器中
        this.$store.commit('setUser', res.data.data)

        // 登陆成功 跳转回原来的页面
        this.$router.back()
      } catch (err) {
        this.$toast.fail('登录失败,手机号或验证码错误')
      }
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      try {
        // 校验手机号
        await this.$refs['login-form'].validate('mobile')

        // 验证通过 请求发送验证码

        this.isSendSmsLoading = true/* 展示按钮的loading状态 防止多次点击发送 */

        await sendSms(this.user.mobile)

        // 短信发出去了 隐藏发送按钮 显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 -> 隐藏倒计时  显示发送按钮 通过@finish事件触发 isCountShow变为false
      } catch (err) {
        let message = ' '
        if (err && err.message && err.response.status === 429) {
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }

        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论发送成功与否 最后都要关掉loading状态
      this.isSendSmsLoading = false
      // 校验手机号
      // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
      // 请求发送验证码 -> 隐藏发送按钮 显示倒计时
      // 倒计时结束 -> 隐藏倒计时  显示发送按钮
    }
  }
}
</script>

<style scoped lang="less">
.login-container{
  .send-btn{
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text{
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap{
    padding: 26px 16px;
  }
  .login-btn{
    background-color: #6bd4fb;
    border: none;
  }
  .van-button__text{
    font-size: 15px;
  }
}
</style>
