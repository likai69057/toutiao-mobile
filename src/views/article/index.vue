<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      right-text="按钮"
      left-arrow
      @click-left="$router.back()"
    />
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

    <!-- 写评论、收藏、点赞 -->
    <van-tabbar>
      <van-tabbar-item>
        <input type="text" class="" placeholder="写评论">
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 评论 -->
        <van-icon name="comment-o" badge="123"></van-icon>
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 点赞 -->
        <van-icon name="good-job-o" ></van-icon>
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 收藏 -->
        <van-icon
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
        />
      </van-tabbar-item>

      <van-tabbar-item>
        <!-- 分享 -->
        <van-icon name="share "></van-icon>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleInfo } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user.js'

export default {
  name: 'index',
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false // 关注用户的更新状态
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
    }
  }
}
</script>

<style scoped lang="less">
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
  margin-bottom: 50px;
}
.van-tabbar{
  .van-icon{
    font-size: 23px;
  }
}
</style>
