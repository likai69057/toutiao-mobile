<template>
  <div class="user-chat">
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <van-cell-group class="messageList" ref="message-list">
      <van-cell :title="item.msg" v-for="(item, index) in messages" :key="index"/>
    </van-cell-group>

    <van-cell-group class="sendMessage">
      <van-field v-model="message" placeholder="请输入消息" :border="false"/>
      <van-button type="info" size="small" style="width: 70px" @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '../../utils/storage'

export default {
  name: 'index',
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || []
    }
  },
  watch: {
    messages () {
      // 监视实时更新对话
      setItem('chat-messages', this.messages)
      // 一旦数据变化 聊天列表置底部
      // 数据跟新到视图不是实时的 需要用nextTick()
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  created () {
    const socket = io('http://ttapi.research.itcast.cn')
    this.socket = socket

    socket.on('connect', () => {
      console.log('连接建立成功了')
    })

    socket.on('disconnect', () => {
      console.log('断开连接了')
    })

    // 监听message事件 接收服务端消息
    socket.on('mesage', data => {
      this.messages.push(data)
    })
  },
  methods: {
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      // 把用户发出去的消息存储在数组中
      this.messages.push(data)
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.messageList{
  position: fixed;
  left: 0px;
  right: 0px;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.sendMessage{
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  padding: 0px 5px;
  align-items: center;
  justify-content: center;
}
</style>
