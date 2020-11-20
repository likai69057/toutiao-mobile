<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script>
// import { getComments } from '../../../api/article'

export default {
  name: 'CommentList',
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
      finished: false
    }
  },
  methods: {
    // async onLoad () {
    //   const { data } = await getComments({
    //     type: 'a',  // 评论类型 ‘a’为对文章的评论 ‘c’为对评论的回复
    //     source: this.source, // 源id  即文章id或者评论id
    //     offset: , // 文章偏移量 即页码 值为评论id
    //     limit:
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
