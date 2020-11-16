<template>
  <div class="search-history">
    <!-- 搜索历史标题 -->
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="deleteAllHistories">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow=true"/>
    </van-cell>

    <!-- 搜索历史内容 -->
    <van-cell
      :title="history"
      icon="search"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="deleteHistory(index, history)"
    >
      <van-icon v-show="isDeleteShow" name="close"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  computed: {
  },
  methods: {
    deleteHistory (index, history) {
      // 删除状态下 点击为删除
      if (this.isDeleteShow) {
        return this.searchHistories.splice(index, 1)
      }
      // 删除完成后要进行数据持久化处理
      // 由于后端接口没有删除单个历史的  只有删除全部历史   所以只能删除本地历史了

      // 非删除状态下 点击为搜索 调用onSearch方法
      this.$emit('search', history)
    },
    deleteAllHistories () {
      // props的数据如果是引用类型array、obj等 只能通过obj.name = xxx、 array.push()的形式修改
      // 不能直接重新赋值 array1 = array2、obj1 = obj2
      this.$emit('update-histories', [])
    }
  }
}
</script>

<style scoped lang="less">
</style>
