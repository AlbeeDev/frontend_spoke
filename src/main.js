import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import vue3GoogleLogin from 'vue3-google-login'

//client secret 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

//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: '166961025808-h8djf56ug5ra1p6bc5k7s0p7sl59rg1t.apps.googleusercontent.com'
})
app.mount('#app')
