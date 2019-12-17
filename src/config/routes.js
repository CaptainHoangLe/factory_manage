import deviceSetting from '../components/DeviceSettings.vue';
import ReportTable from '../components/ReportTable.vue';
import Login from '../components/Authenticate/Login.vue';
import Dashboard from '../components/Dashboard/Dashboard.vue'
import ReportChart from '../components/ReportChart.vue'
import MainPage from '../components/MainPage.vue'

const ifNotAuthenticated = (to, from, next) => {
    //Access control code here
    if (sessionStorage.getItem("username")) {
        next();
        return;
    }
    next("/login");
};
let authPages = {
    path: "/",
    component: Login,
    redirect: "/login",
    name: "Authenticated",
    children: [{
        path: "/login",
        name: "Đăng nhập",
        component: Login
    }]
};
const routes = [{
        path: "/mainpage",
        component: Dashboard,
        redirect: "/mainpage/deviceSetting",
        name: "Quản Lý Nhà Máy",
        children: [{
                path: "deviceSetting",
                component: deviceSetting,
                name: 'Cấu hình thiết bị',
                meta: {
                    title: 'Cấu Hình Thiết Bị'
                },
                beforeEnter: ifNotAuthenticated
            },
            {
                path: "dashboard",
                component: MainPage,
                name: 'Trang Chủ',
                meta: {
                    title: 'Trang Chủ'
                },
                beforeEnter: ifNotAuthenticated
            },
            {
                path: "reporttable",
                component: ReportTable,
                name: 'Báo Cáo',
                meta: {
                    title: 'Báo Cáo'
                },
                beforeEnter: ifNotAuthenticated
            },
            {
                path: "reportchart",
                component: ReportChart,
                name: 'Biểu Đồ',
                meta: {
                    title: 'Biểu Đồ'
                },
                beforeEnter: ifNotAuthenticated
            }
        ]
    },
    authPages,
    {
        path: "*",
        redirect: "/login"
    }
]

export default routes;