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
        :icon="article.is_follow ? '' : 'plus'"
        round
        size="small"
        :type="article.is_follow ? '' : 'info'"
      >
        {{ article.is_follow ? '已关注' : '关注' }}
      </van-button>
    </van-cell>

    <!-- 文章正文内容 -->
    <div class="container markdown-body" v-html="article.content">
    </div>

    <!-- 写评论、收藏、点赞 -->
    <van-tabbar>
      <van-tabbar-item>
        <input type="text" class="">
      </van-tabbar-item>

      <van-tabbar-item>
        <van-icon class="" class-prefix="toutiao" name="dianzan"></van-icon>
      </van-tabbar-item>

      <van-tabbar-item>
        <van-icon class-prefix="toutiao" name="pinglun"></van-icon>
      </van-tabbar-item>

      <van-tabbar-item>
        <van-icon class-prefix="toutiao" name="shoucang"></van-icon>
      </van-tabbar-item>

      <van-tabbar-item>
        <van-icon class-prefix="toutiao" name="fenxiang"></van-icon>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleInfo } from '../../api/article'

export default {
  name: 'index',
  data () {
    return {
      article: {} // 文章数据对象
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
      const { data } = await getArticleInfo(articleId)
      this.article = data.data
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
  padding: 8px;
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
</style>
