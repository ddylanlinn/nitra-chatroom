const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/chat',
    children: [
      { path: 'chat', component: () => import('pages/ChatPage.vue') },
      { path: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'colors', component: () => import('pages/ColorsPage.vue') },
      {
        path: 'typography',
        component: () => import('pages/TypographyPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
