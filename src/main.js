import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import vuetify from './plugins/vuetify';


import '@/assets/css/common.css';
import axios from 'axios'
import VueAxios from 'vue-axios';

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import routes from "./config/routes";

Vue.use(VueAxios, axios)
axios.defaults.baseURL = "http://nnt.aquasoft.vn:7000/api/"

Vue.use(VueRouter);
Vue.config.productionTip = false
const router = new VueRouter({
    routes, // short for routes: routes
});

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')