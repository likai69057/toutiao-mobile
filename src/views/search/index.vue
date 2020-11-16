<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow=false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @changeSearch="onSearch"
    />

    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '../../utils/storage'
import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data () {
    return {
      searchText: '', // 搜索输入框的内容
      isResultShow: false, // 控制搜索内容列表的显示
      searchHistories: getItem('search-histories') || [] // 将搜索结果存储在历史记录里面
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // 直接在这里监视this.searchHistories的变化 实时的改变search-histories本地历史的数据
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  methods: {
    onSearch (suggestion) {
      // 将点击的联想建议赋值给输入框
      this.searchText = suggestion

      // 展示搜索结果
      this.isResultShow = true

      // 记录搜索历史
      // 判断此次搜的searchText是否已经存在于searchHistories
      const index = this.searchHistories.indexOf(this.searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(this.searchText)

      // 数据持久化处理
      // 如果用户已登录 则把搜索记录存储到线上
      // 后端接口已经处理 只要调用获取搜索结果的接口 后端会自动的存储用户的搜索记录
    },
    async loadSearchHistories () {
      // 由于后端帮我们存储的用户搜索历史记录太少了
      // 所以让后端返回的历史记录和本地存储的历史记录合并到一起
      // 1.获取本地存储搜索历史
      const localHistories = getItem('search-histories') || []
      if (this.user) {
        // 2.如果用户已登录 获取线上搜索历史
        const { data } = await getSearchHistories()
        // 3.通过ES6的set方法实现2个数组的合并去重 在通过...展开语法  转换成数组展开
        this.searchHistories = [...new Set([...localHistories, ...data.data.keywords])]
      }
    }
  }
}
</script>

<style scoped>

</style>
