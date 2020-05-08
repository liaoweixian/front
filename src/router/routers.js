import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/assetImport',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'assetUpload',
        component: () => import('@/views/poc/assetImport/assetUpload'),
        name: '客户资产导入',
        meta: { title: '客户资产导入' }
      }
    ]
  },
  {
    path: '/taskDetail',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'shipmentsUpload',
        component: () => import('@/views/hw/taskDetail/shipmentsUpload'),
        name: '发运资产导入',
        meta: { title: '发运资产导入' }
      }
    ]
  },
  {
    path: '/taskImport',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'taskUpload',
        component: () => import('@/views/poc/taskImport/taskUpload'),
        name: '任务导入',
        meta: { title: '任务导入' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
