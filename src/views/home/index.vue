<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <!-- vant的标签页组件有一个功能  只有你第一次查看标签页的时候才会渲染内容 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel='channel'/>
      </van-tab>
      <!-- 在最后一个会挡到频道 所以频道最后必须多一个空白块 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <!-- 弹出频道编辑 -->
      <div
        slot="nav-right"
        class="wap-nav-wrap"
        @click="isChannelEditShow=true"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 弹出频道编辑的遮罩页面 最好直接写在body页面下 别写在某个dom里面-->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <channel-edit
        :userChannels="channels"
        :active="active"
        @close="isChannelEditShow=false"
        @switch="updateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from '@/views/home/componets/article-list'
import ChannelEdit from '@/views/home/componets/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'homeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0, /* 控制被激活的标签项 */
      channels: [], /* 频道列表 */
      isChannelEditShow: false /* 弹出频道编辑 */
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      // 请求获取频道数据
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
      let channels = []
      if (this.user) {
        // 已登录 获取线上的用户频道
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没用登录 判断是否有本地存储的列表数据
        const loalChannels = getItem('user-channels')
        // 如果有本地存储
        if (loalChannels) {
          channels = loalChannels
        } else {
          // 如果没有本地存储 默认请求推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中供模板使用
      this.channels = channels
    },
    updateActive (index) {
      this.active = index
    }
  }
}
</script>

<style lang="less">
.home-container{
  .van-nav-bar__title{
    max-width: unset;
  }
  .search-btn{
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon{
      font-size: 16px;
      margin-top: 2px;
    }
    .van-button__text{
      font-size: 14px;
    }
  }
  .channel-tabs{
    .van-tab{
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    .van-tabs__line{
      width: 15px;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .wap-nav-placeholder{
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0px;
    width: 33px;
    height: 43px;
    line-height: 44px;
    background-color: #fff;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon{
      font-size: 24px;
    }
  }
}
</style>
