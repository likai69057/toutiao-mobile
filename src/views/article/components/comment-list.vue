<template>
  <div class="comment-list">
    <van-cell title="全部评论"/>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell v-for="(comment, index) in list" :key="index" :title="comment.content" /> -->
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '../../../api/article'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页的页码
      limit: 10 // 每页大小
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getComments({
        type: 'a', // 评论类型 ‘a’为对文章的评论 ‘c’为对评论的回复
        source: this.source, // 源id  即文章id或者评论id
        offset: this.offset, // 文章偏移量 即页码 值为评论id
        limit: this.limit // 每页大小
      })

      const { results } = data.data
      console.log(results)
      // 将请求的结果添加到列表中
      this.list.push(...results)
      // 请求一页完成后 关闭loading状态
      this.loading = false
      // 判断剩下页码 如果还有下一页 页码赋值为下一页的页码 如果没有 显示没有了
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped>

</style>
