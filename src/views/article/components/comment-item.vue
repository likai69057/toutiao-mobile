<template>
  <van-cell
    class="comment-item"
  >
    <van-image
      class="avatar"
      slot="icon"
      round
      fixed
      :src='comment.aut_photo'
    />
    <div slot="title">
      <div class="title-warp">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-warp">
          <van-icon
            class="like-icon"
            :class="{
              liked: comment.is_liking
            }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
            @click="onCommnetLike"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div>
        <span class="pubdate">{{ comment.pubdate | datatime('MM-DD HH:mm') }}</span>
        <van-button class="replay-btn" round size="small" @click="$emit('reply-click', comment)">{{ comment.reply_count }}回复</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentsLike, deleteCommentsLike } from '../../../api/article'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommnetLike () {
      if (this.comment.is_liking) {
        // 已点赞 取消点赞
        await addCommentsLike(this.comment.com_id.toString())
        this.comment.like_count--
      } else {
        await deleteCommentsLike(this.comment.com_id.toString())
        this.comment.like_count++
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
.comment-item{
  .avatar{
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name{
    font-size: 14px;
    color: #406599;
  }
  .content{
    font-size: 16px;
    color: #222222;
  }
  .pubdate{
    font-size: 10px;
    margin-right: 10px;
  }
  .title-warp{
    display: flex;
    justify-content: space-between;
    .like-warp{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.liked{
  color: #0366d6;
}
</style>
