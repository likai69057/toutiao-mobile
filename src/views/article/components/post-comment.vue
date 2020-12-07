<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
      <van-button :disabled="!message" @click="onPost">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '../../../api/article'

export default {
  name: 'PostComment',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: null
    }
  },
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '加载中',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(),
        content: this.message,
        art_id: this.articleId ? this.articleId.toString() : null
      })
      // 写完评论让其显示在页面
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('评论成功')
      // 发布成功之后 清空内容
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
.post-comment{
  padding: 14px;
  display: flex;
  align-items: center;
  .van-button{
    width: 70px;
    height: 25px;
    padding: 0px;
  }
}
</style>
