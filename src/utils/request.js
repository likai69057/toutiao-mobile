// 请求模块

import axios from 'axios'
import store from '@/store/index'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '../router'

// 创建一个请求refresh_token的实例
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', /* 基础路径 */
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state

  /* 如果用户已登录，统一给接口设置token信息 */
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(function (response) {
  // 响应成功进入这里
  return response
}, async function (error) {
  // 响应失败进入这里
  const status = error.response.status
  if (status === 400) {
    // 客户端参数错误 无效语法
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token无效
    // 如果store里没有请求的user信息或者user.token， 直接跳转登录
    const { user } = store.state
    if (!user || !user.token) {
      return redirectLogin()
    }
    // 如果有refresh_token，则请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorizations: `Bearer ${user.refresh_token}`
        }
      })
      // refresh_token更新完新的token之后 放到store中
      user.token = data.data.token
      store.commit('setUser', user)
      // 新的token拿到之后 重新请求
      return request(error.config)
    } catch (err) {
      // 刷新新的token都失败了 直接跳转登录页
      redirectLogin()
    }
    // 拿到新的token之后 更新到store中
    // 把失败的请求重新发出去
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务器异常，请稍后重试')
  }
  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递查询参数
    query: {
      // router.currentRoute和this.$route是一样的
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
