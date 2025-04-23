import {createRouter, createWebHistory} from 'vue-router'

import HomeView from "@/components/HomeView.vue";
import LoginView from "@/components/LoginView.vue";
import FriendView from "@/components/FriendView.vue";
import ChatView from "@/components/ChatView.vue";
import CallView from "@/components/CallView.vue";
import SettingsView from "@/components/SettingsView.vue";

const routes = [
    { path: '/', component: LoginView },
    {
        path: '/home',
        component: HomeView,
        children: [
            { path: 'friends', component: FriendView },
            { path: 'chat/:profileId', component: ChatView },
            { path: 'call/:callerId/:chatId', component: CallView },
            { path: 'settings', component: SettingsView },
        ]
    },
]

const router = createRouter({
    history: createWebHistory("/frontend_spoke/"),
    routes,
})

export default router