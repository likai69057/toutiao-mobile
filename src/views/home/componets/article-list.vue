<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSucessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], /* 数据列表 */
      loading: false, /* 控制加载的loading状态 */
      finished: false, /* 控制加载结束的状态 */
      timestamp: null, /* 初始化时间戳 */
      isRefreshLoading: false,
      refreshSucessText: ''
    }
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticle({
        channel_id: this.channel.id, /* 频道ID */
        timestamp: null || Date.now(), /* 相当于页码 请求新的数据传当前的时间戳 请求历史数据传指定的时间戳 */
        with_top: 1 /* 是否包含置顶文章 1是要 0是不要 */
      })
      // 2.把数据放到数组中
      const { results } = data.data
      this.articles.push(...results)
      // 3.设置本次加载状态结束 它才可以判断是否需要加载下一次 否则会永远停在这里
      this.loading = false

      // 判断数据是否全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
      // 1.请求数据
      const { data } = await getArticle({
        channel_id: this.channel.id, /* 频道ID */
        timestamp: null || Date.now(), /* 相当于页码 请求新的数据传当前的时间戳 请求历史数据传指定的时间戳 */
        with_top: 1 /* 是否包含置顶文章 1是要 0是不要 */
      })

      // 2.把数据放到数组顶部
      const { results } = data.data
      this.articles.unshift(...results)

      // 3.关闭刷新状态loading
      this.isRefreshLoading = false

      this.refreshSucessText = `更新了${results.length}数据`
    }
  }
}
</script>

<style lang="less">
.article-list{
  position: fixed;
  left: 0px;
  right:0px;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
