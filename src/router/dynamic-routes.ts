import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/api-info',
    redirect: '/api-info/list',
    name: 'Api',
    meta: {
      title: 'API列表',
      icon: 'DribbbleOutlined',
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: '/api-info/list',
        name: 'ApiList',
        component: () => import('~/pages/api-info/api-list/api-list.vue'),
        meta: {
          title: 'API列表',
        },
      },
      {
        path: '/api-info/info',
        name: 'ApiInfo',
        component: () => import('~/pages/api-info/api-info/api-info.vue'),
        meta: {
          title: 'API详情',
        },
      },
    ],
  },
  {
    path: '/account/center',
    name: 'AccountCenter',
    component: () => import('~/pages/account/center/index.vue'),
    meta: {
      title: '用户中心',
      icon: 'UserOutlined',
      hideChildrenInMenu: true,
    },
  },
  {
    path: '/system',
    redirect: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'SettingOutlined',
    },
    children: [
      {
        path: '/system/user',
        name: 'UserManage',
        component: () => import('~/pages/system/user-manage/user-manage.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: '/system/api-info',
        name: 'ApiManage',
        component: () => import('~/pages/system/api-manage/api-manage.vue'),
        meta: {
          title: '接口管理',
        },
      },
    ],
  },
] as RouteRecordRaw[]
