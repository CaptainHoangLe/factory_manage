<template>
<v-app>
    <v-app-bar app color="#173D6A" height="56px">
        <v-app-bar-nav-icon id="navbarText" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="col-md-4" id="navbarText">{{navbartitle}}</v-toolbar-title>
        <h4 class="subheading white--text">CÔNG TY CỔ PHẦN AQUASOFT</h4>
        <v-spacer></v-spacer>
        <v-menu bottom left>
            <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item>
                    <v-list-item-avatar>
                        <img src="../../assets/img/favico.png" alt="">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{username}}</v-list-item-title>
                        <v-list-item-subtitle>AQUASOFT</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-divider vertical></v-divider>

                    <v-list-item-action>
                        <v-btn type="rounded" :x-small="true" @click="logout()">
                            <v-icon :x-small="true">remove_circle</v-icon>
                            Đăng xuất
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-menu>

    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" fixed color="#173D6A" width="280px">
        <v-img id="sidebarLogo" src="../../assets/img/logo-sidebar.png" contain></v-img>

        <v-divider></v-divider>

        <!-- Hard-coded list, should be fixed later -->
        <v-list dark>
            <v-list-item to="/mainpage/dashboard">
                <v-list-item-icon>
                    <v-icon>account_balance</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Trang Chủ</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item to="/mainpage/reporttable">
                <v-list-item-icon>
                    <v-icon>signal_cellular_alt</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Báo Cáo</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item to="/mainpage/reportchart">
                <v-list-item-icon>
                    <v-icon>timeline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Biểu Đồ</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item to="/mainpage/deviceSetting">
                <v-list-item-icon>
                    <v-icon>build</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Cấu hình thiết bị</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

        </v-list>
        <v-img id="sidebarWave" src="../../assets/img/wave-sidebar.svg" contain></v-img>
    </v-navigation-drawer>
    <v-content>
        <router-view></router-view>
    </v-content>
</v-app>
</template>

<script>
export default {
    name: "Dashboard",
    components: {},
    mounted() {
        this.$data.navbartitle = this.$router.history.current.meta.title;
        this.$data.username = sessionStorage.getItem('username')
    },
    watch: {
        $route(to) {
            this.$data.navbartitle = to.meta.title || "Quản lý nhà máy";
        },

    },

    data() {
        return {
            show: false,
            drawer: null,
            navbartitle: "",
            username: ''
        };
    },
    methods: {
        logout() {
            this.$router.push('/')
            sessionStorage.clear()
            localStorage.clear()
        },
        openInNewTab(url) { //Not reliable, depends a lot on browser's settings
            var win = window.open(url, "_blank");
            win.focus();
        }
    }
};
</script>

<style scoped>
#sidebarLogo {
    margin: 15px;
}

#navbarText {
    color: white;
    font-weight: bold;
}

#sidebarWave {
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0.2;
}

.subheading {
    font-family: "Muli", sans-serif;
    font-size: 30;

}
</style>
