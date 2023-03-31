import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import Inventor from '@/components/Inventor-main.vue'

import './assets/main.scss'

const routes = [
  { name: 'inventor', path: '/', component: Inventor },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // short for `routes: routes`
})

console.log("Starting App ("+APP_VERSION+") with base URL" + import.meta.env.BASE_URL);

createApp(App).use(router).mount('#app')
