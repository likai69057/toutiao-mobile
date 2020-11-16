<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >
        我的频道
      </div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit=!isEdit"
      >{{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid :gutter ="10">
      <van-grid-item
        class="grid-item"
        :class="{active: index === active}"
        :icon="(isEdit && index !==0) ? 'close' : ''"
        v-for="(userChannel, index) in userChannels"
        :key="index"
        :text="userChannel.name"
        @click="onUserChannelClick(userChannel ,index)"
      />
    </van-grid>
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >
        频道推荐
      </div>
    </van-cell>
    <van-grid :gutter ="10">
      <van-grid-item
        class="grid-item"
        v-for="(recommendChannel, index) in recommendChannels"
        :key="index"
        :text="recommendChannel.name"
        @click="onAdd(recommendChannel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false // 控制编辑的显示
    }
  },
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    // *********计算属性会观测内部依赖的数据变化而变化
    // 推荐频道
    recommendChannels () {
      // 所有频道-我的频道=推荐频道
      // filter方法： 过滤数组 根据方法返回的布尔值true来收集返回的数组
      return this.allChannels.filter(channel => {
        // find方法返回的是符合条件的单个元素
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (recommendChannel) {
      this.userChannels.push(recommendChannel)
      // 在编辑用户频道 要进行数据持久化处理
      if (this.user) {
        // 登录了 数据存储到线上
        await addUserChannels({
          channels: [
            { id: recommendChannel.id, seq: this.userChannels.length }
          ]
        })
      } else {
        // 没有登录 数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        this.deleteChannel(channel, index)
      } else {
        this.switchChannel(index)
      }
    },
    // 编辑状态下点击userChannel删除
    // ***删除激活频道之前的频道 激活的频道索引会发生改变
    async deleteChannel (channel, index) {
      if (index <= this.active) {
      // 删除激活频道之前的索引 需更新索引 将active-1 即修改父组件的active
        this.$emit('switch', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) {
        // 登录了 数据存储到线上
        await deleteUserChannels(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    // 不编辑状态下 点击userChannel关闭弹出层并且跳转对应的userChannel界面
    switchChannel (index) {
      // 修改父属性中控制弹出层的属性isChannelEditShow 关闭弹出层 子传父$emit触发父组件的自定义事件close
      this.$emit('close')
      // 切换频道 修改父组件的acitive属性
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit{
  padding-top: 54px;

  .channel-title{
    color: #333333;
    font-size: 16px;
  }

  .grid-item{
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text{
        font-size: 14px;
        color: #222;
        margin-top: 0px;
      }
    }
    /deep/.van-grid-item__icon{
      position: absolute;
      right: -7px;
      top: -5px;
      font-size: 18px;
    }
  }
  /deep/.active{
    .van-grid-item__text{
      color: red !important;
    }
  }
}
</style>
