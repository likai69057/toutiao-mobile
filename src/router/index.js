import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index')
  },
  {
    // 有子路由的情况下  path的路径写/
    path: '/',
    component: () => import('@/views/layout/index'),
    children: [
      {
        path: '', /* 默认子路由 */
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的props中，无论访问还是维护性都很高
    props: true
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
