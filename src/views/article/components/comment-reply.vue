<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')"/>
    </van-nav-bar>

    <!-- 评论项 -->
    <comment-item :comment="comment" />

    <!-- 评论回复项 -->
    <van-cell title="所有回复" />
    <comment-list :source="comment.com_id" type="c" :list="commentList"/>

    <!-- 底部写回复 -->
    <van-tabbar>
      <van-tabbar-item>
        <!-- 写评论 -->
        <van-button
          type="default"
          round
          text="写评论"
          @click="isPostShow=true"
        >
        </van-button>
      </van-tabbar-item>
    </van-tabbar>

    <!-- 写回复的弹出层 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment :target="comment.com_id" :article-id="articleId" @post-success="onPostSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    onPostSuccess (comment) {
      this.commentList.unshift(comment)

      // 评论完成之后 评论计数要加1
      this.comment.reply_count++

      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.van-tabbar{
  .van-button{
    width: 200px;
    height: 30px;
    margin-left: 10px;
  }
}
</style>
