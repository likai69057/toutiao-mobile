<template>
  <div class="search-result">
    <van-list
      class="search-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(result, index) in list" :key="index" :title="result.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      per_page: 10 // 每页数量
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getSearchResults({
        page: this.page, // 页码
        per_page: this.per_page, // 每页大小
        q: this.searchText // 搜索的字符
      })

      // 2. 将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)

      // 3. 关闭本次loading
      this.loading = false

      // 4. 判断数据是否全部加载
      if (results.length) {
        // 如果还有数据 则更新获取下一页数据
        this.page++
      } else {
        // 如果没有数据 则关闭加载更多
        this.finished = true
      }
    }
  }
}
</script>

<style scoped>
.search-result{
  position: fixed;
  top: 54px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow-y: auto;
}
</style>
