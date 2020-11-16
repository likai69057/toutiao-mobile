<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click="getSearch(suggestion)"
    >
      <div slot="title" v-html="hightLight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'searchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {
  },
  watch: {
    // 监视组件的数据的变化 函数名必须为监视数据的属性名
    searchText: {
      // handler处理函数在数据发生变化的时才回调 添加immediate属性可以在监听之后立即触发
      // async handler () {
      //   // 找到数据接口  请求获取数据  模板展示数据
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },

      // 考虑到请求数据时的防抖和节流 在请求时调用用lodash原生js库的debounce函数 类似settimeout
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 100),
      immediate: true
    }
  },
  methods: {
    hightLight (sunggestion) {
      // 使用原生的正则对象构造函数 因为//里面无法直接写变量
      // new RegExp(this.searchText, 'gi') 返回的是正则表达式匹配的值 也就是 /value/gi 的形式
      return sunggestion.replace(new RegExp(this.searchText, 'gi'), `<span style="color: red">${this.searchText}</span>`)
    },
    getSearch (suggetion) {
      this.$emit('changeSearch', suggetion)
    }
  }
}
</script>

<style scoped>

</style>
