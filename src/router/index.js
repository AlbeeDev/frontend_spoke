import {createRouter, createWebHistory} from 'vue-router'

import HomeView from "@/components/HomeView.vue";
import LoginView from "@/components/LoginView.vue";
import FriendView from "@/components/FriendView.vue";
import ChatView from "@/components/ChatView.vue";

const routes = [
    { path: '/', component: LoginView },
    {
        path: '/home',
        component: HomeView,
        children: [
            { path: 'friends', component: FriendView },
            { path: 'chat/:profileId', component: ChatView },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router