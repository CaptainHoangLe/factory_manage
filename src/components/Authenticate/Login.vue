<template>
<div class="pLogin flex-row flex__between">
    <div class="leftSection">
        <div class="intro">
            <div class="flex-row flex__left">
                <img src="../../assets/img/logo_transparent.png" alt="" class="logo-lv1">
                <div class="txt">
                    <div class="pHeader " style="font-weight: 700">
                        Water Network
                        <br />
                        Management System</div>
                    <p class="tt-2">Chào mừng bạn đến với hệ thống quản lý mạng nước</p>
                </div>
            </div>
        </div>
    </div>
    <div class="rightSection">
        <VuePerfectScrollbar class="scroll-pLogin" :settings="perfectScrollbarSetting">
            <img class="logo-lv2" src="../../assets/img/logo_transparent.png" alt="">
            <div class="title txt-center" style="font-weight: 700">
                ĐĂNG NHẬP VÀO HỆ THỐNG
            </div>
            <div class="form width__100">
                <v-text-field v-model="username" append-icon="assignment_ind" label="Tài Khoản" :rules="AccRules">
                </v-text-field>
                <v-text-field v-model="password" v-on:keyup.enter="login()" :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="PassRules" @click:append="isShowPassword = !isShowPassword" :type="isShowPassword ? 'text' : 'password'" label="Mật Khẩu"></v-text-field>
                <!-- <v-checkbox v-model="remember" class="mx-2" label="Nhớ mật khẩu"></v-checkbox> -->
                <v-btn color=#173d6a class="btnSubmit" @click="login">Đăng Nhập
                </v-btn>
            </div>
        </VuePerfectScrollbar>
        <v-card>
            <v-snackbar v-model="snackbar" :color="status" :timeout="2000" :top="true">
                {{ text }}
            </v-snackbar>
        </v-card>
    </div>
</div>
</template>

<script>
import axios from "axios"
export default {
    name: "login",
    components: {
        VuePerfectScrollbar: () => import('vue-perfect-scrollbar')
    },
    data() {
        return {
            show: false,
            text: "",
            status: '',
            snackbar: false,
            username: "",
            password: "",
            message: "",
            perfectScrollbarSetting: {
                maxScrollbarLength: 750
            },
            isShowPassword: false,
            isValidateForm: false,
            AccRules: [v => !!v || "Tên đăng nhập không được để trống"],
            PassRules: [v => !!v || "Mật khẩu không được để trống "],
        };
    },
    methods: {

        login() {
            let that = this
            let data = {
                username: that.$data.username,
                password: that.$data.password
            }
            // console.log(data)
            axios({
                    url: '/record/login',
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: 'POST'
                })
                .then(function (res) {
                    that.$data.message = res.data
                    if (res.data === "Đăng nhập thành công") {
                        that.$data.status = "success"
                        that.$data.text = res.data
                        that.$data.snackbar = true
                        sessionStorage.setItem('username', that.$data.username)
                        that.$router.push('/mainpage/deviceSetting');
                    } else {
                        that.$data.status = 'error'
                        that.$data.text = "Sai tên đăng nhập hoặc mật khẩu"
                        that.$data.snackbar = true
                        sessionStorage.removeItem('username')
                    }
                }).catch(function (err) {
                    alert("Đăng nhập thất bại")
                    return (err)
                })

        }
    }
}
</script>

<style scoped>
.pLogin {
    height: 100vh;
    width: 100%;
    background: #236be1;
}

.pLogin .pHeader {
    font-size: 48px;
    font-weight: 700 !important;
    letter-spacing: -2px;
    line-height: 54px;
    padding-bottom: 24px !important;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    font-family: "Muli", sans-serif
}

.tt-2 {
    font-family: "Muli", sans-serif;
    font-size: 20px;
    opacity: 1;
    margin: 0;
}

.leftSection {
    color: #ffffff;
}

.logo-lv1 {
    width: 160px;
    margin: 0 32px 0 0;
}

.logo-lv2 {
    width: 120px;
    margin-bottom: 24px;
}

.rightSection {
    max-width: 500px;
    width: 40%;
    height: 100%;
    box-shadow: -12px 0 32px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    position: relative;
    overflow: hidden;
    font-family: "Muli", sans-serif
}

.scroll-pLogin {
    width: 100%;
    padding: 0 42px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.intro {
    padding: 0 42px;
}

.title {
    font-size: 20px;
    margin: 24px 0;
    font-family: "Muli", sans-serif
}

.btnSubmit {
    width: 100%;
    border: none;
    text-transform: uppercase;
    font-weight: 700;
    height: 42px;
    margin: 16px 0 0 0;
    font-family: "Muli", sans-serif
}
</style>
