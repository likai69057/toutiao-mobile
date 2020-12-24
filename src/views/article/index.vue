<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      right-text="按钮"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章全部内容 -->
    <div class="article-wrap">
      <!-- 文章标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- 文章作者 -->
      <van-cell center class="user-info">
        <div slot="title" class="user-name">{{ article.aut_name }}</div>
        <van-image
          class="user-avatar"
          slot="icon"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">{{ article.pubdate | reletiveTime }}</div>
        <van-button
          class="follow-btn"
          :icon="article.is_followed ? '' : 'plus'"
          round
          :loading="isFollowLoading"
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          @click="onFollow"
        >
          {{ article.is_followed ? '已关注' : '关注' }}
        </van-button>
      </van-cell>

      <!-- 文章正文内容 -->
      <div
        class="container
      markdown-body"
        v-html="article.content"
        ref="article-content"
      >
      </div>

      <!-- 评论列表 -->
      <CommentList
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount=$event"
        @reply-click="onReplyClick"
      />
    </div>

    <!-- 写评论、收藏、点赞 -->
    <van-tabbar>
      <van-tabbar-item>
        <!-- 写评论 -->
        <van-button
          round
          text="写评论"
          @click="isPostShow=true"
        >
        </van-button>
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 评论 -->
        <van-icon name="comment-o" :badge="totalCommentCount" />
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 点赞 -->
        <van-icon
          :color="article.attitude === 1 ? 'red' : '#777'"
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        />
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 收藏 -->
        <van-icon
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
          @click="oncollected"
        />
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 分享 -->
        <van-icon name="share " />
      </van-tabbar-item>
    </van-tabbar>

    <!-- 评论弹出层 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment :target="articleId" @post-success="onPostSuccess"/>
    </van-popup>

    <!-- 回复弹出层 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
    >
      <!-- 使用v-if的目的是让每次点击不同的回复层时渲染、销毁 防止组件一直存在 覆盖新的渲染的组件 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow=false"
      />
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleInfo, deleteCollected, addCollected, deleteLike, addLike } from '@/api/article.js'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user.js'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'index',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false, // 关注用户的更新状态
      isCollectLoading: false, // 控制是否收藏
      isPostShow: false, // 控制评论弹出层
      isReplyShow: false, // 控制回复弹出层
      commentList: [], // 评论列表 用于传给子组件
      totalCommentCount: 0, // 评论数量
      replyComment: {} // 存储当前点击回复按钮所对应的评论
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  created () {
    this.loadArticle(this.articleId)
  },
  methods: {
    async loadArticle (articleId) {
      // 获取文章信息
      const { data } = await getArticleInfo(articleId)
      this.article = data.data
      // 获取文章的图片 实现图片预览功能
      // 注意：数据改变  影响  视图更新  不是立即的  必须放到$nexttick方法里面
      this.$nextTick(() => {
        this.previewImgs()
      })
    },
    previewImgs () {
      // 1.获取DOM容器
      const articleContent = this.$refs['article-content']
      // 2. 获取DOM里的所有img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = [] // 搜集图片的所有路径
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    // 控制关注按钮的方法
    async onFollow () {
      this.isFollowLoading = true // 请求期间按钮为加载状态
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    // 控制收藏按钮的方法
    async oncollected () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.is_collected) {
        // 已收藏 取消收藏
        await deleteCollected(this.articleId)
      } else {
        // 没收藏 添加收藏
        await addCollected(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      // 弹出提示框
      this.$toast(`${this.article.is_collected ? '收藏成功' : '取消收藏'}`)
    },
    // 控制点赞按钮的方法
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.attitude === 1) {
        // 已点赞 取消点赞
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 没点赞 添加点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      // 弹出提示框
      this.$toast(`${this.article.attitude === 1 ? '点赞成功' : '取消点赞'}`)
    },
    // 评论完成后将评论内容显示在页面
    onPostSuccess (data) {
      this.commentList.unshift(data)
      this.isPostShow = false

      // 评论完成之后 评论计数要加1
      this.totalCommentCount++
    },
    // 显示评论回复
    onReplyClick  (comment) {
      this.isReplyShow = true
      this.replyComment = comment
    }
  }
}
</script>

<style scoped lang="less">
.article-wrap{
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 50px;
  overflow-y: auto;
}
h1{
  background-color: #ffffff;
  margin: 0px;
}
.title{
  font-size: 20px;
  color: #3a3a3a;
  padding: 24px 20px 18px;
  margin: 0px;
}
.user-info{
  .user-avatar{
    width: 35px;
    height: 35px;
    margin-right: 5px;
  }
  .user-name{
    font-size: 12px;
    color: #333333;
  }
  .pubdate{
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn{
    width: 85px;
    height: 29px;
  }
}
.markdown-body{
  padding: 14px;
  background-color: #ffffff;
}
.van-tabbar{
  .van-button{
    width: 150px;
    height: 26px;
    margin-left: 10px;
  }
  .van-icon{
    font-size: 23px;
  }
}
</style>
