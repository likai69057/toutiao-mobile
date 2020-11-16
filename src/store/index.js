import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 为了防止存.取数据时name写错
const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY) // 当前用户的登录状态(Token等数据)
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 通过mutation更改的数据不是持久化的 页面刷新 数据会变回原始状态
      // 所以还是需要用到本地存储 仅仅为了持久化数据
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
