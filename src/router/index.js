import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import {
  bindGuards
} from "./guard";

const router = createRouter({
  history: createWebHashHistory('/student/'),
  routes: [{
      path: '/',
      name: 'index',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/question',
      name: 'question',
      component: () => import('@/views/question/index.vue')
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/message/index.vue')
    },
    {
      path: '/404',
      name: 'notFound',
      component: () => import('@/views/404/index.vue')
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/404",
    },
  ]
})

bindGuards(router);

export default router