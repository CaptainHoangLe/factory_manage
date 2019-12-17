<template>
<div>

    <!-- <v-alert v-model="alert" border="left" :type="status" transition="slide-x-transition" :dismissible="true">
        {{message}}
    </v-alert> -->
    <v-snackbar v-model="snackbar" :color="status" :timeout="3000" :top="true">
        {{ message }}
        <v-icon size="30">{{iconname}}</v-icon>
    </v-snackbar>
    <v-data-table :headers="headers" height="75vh" :items="itemConfig" loading="true" class="elevation-3" disable-sort>
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title class="title">Bảng Chi Tiết Cấu Hình</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="60vw" :no-click-animation="true">
                    <template v-slot:activator="{ on }">
                        <v-btn class="primary" color="blue darken-1" @click="sendData()">
                            Áp Dụng<v-icon>send</v-icon>
                        </v-btn>

                        <v-btn class="primary" color="blue darken-1" v-on="on">
                            <v-icon>add_circle_outline</v-icon>
                            Thêm Cấu Hình
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-form ref="form" lazy-validation>

                                    <v-row>
                                        <v-col cols="12" md="2">
                                            <v-select :items="index" v-model="editedItem.index" label="Chỉ Mục" required :rules="nameRules"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field v-model="editedItem.name" label="Tên Giá Trị" required :rules="nameRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-select :items="type" v-model="editedItem.type" required label="Loại Giá Trị" @change="changeinput()" :rules="nameRules"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="2">
                                            <v-select :items="item" v-model="editedItem.input" label="Đầu vào" required :rules="nameRules"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="2">
                                            <v-text-field v-model="editedItem.unit" label="Đơn Vị" required :rules="nameRules"></v-text-field>
                                        </v-col>
                                    </v-row>

                                </v-form>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="primary" color="blue darken-1" @click="close">Hủy</v-btn>
                            <v-btn class="primary" color="blue darken-1" @click="validate">Đồng Ý</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
                edit
            </v-icon>
            <v-icon small @click="show= !show">
                delete
            </v-icon>
        </template>
    </v-data-table>

    <v-dialog v-model="show" width="500">
        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
                Xác Nhận
            </v-card-title>

            <v-card-text>
                Bạn có đồng ý xóa cấu hình này ?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" color="blue darken-1" @click="show = !show">
                    Không
                </v-btn>
                <v-btn class="primary" color="blue darken-1" @click="deleteItem(),show = !show">
                    Có
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
import axios from 'axios'

export default {
    name: "DeviceSetting",
    data: () => ({
        snackbar: false,
        show: false,
        item: [],
        status: "",
        message: "",
        nameRules: [v => !!v || "Không được để trống trường này"],
        iconname: "",
        index: [1, 2],
        type: ["R_DIS_HZ_P", "R_DIS_SS"],
        R_DIS_HZ_P: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        R_DIS_SS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        itemConfig: [],
        headers: [{
                text: 'Chỉ Mục',
                sortable: false,
                align: "center",
                value: 'index',
            },
            {
                text: 'Tên Giá Trị',
                align: "center",
                value: 'name'
            },
            {
                text: 'Loại Giá Trị',
                align: "center",
                value: 'type'
            },
            {
                text: 'Đầu Vào',
                align: "center",
                value: 'input'
            },
            {
                text: 'Kí Hiệu',
                align: "center",
                value: 'unit'
            },
            {
                text: 'Chỉnh Sửa',
                align: "center",
                value: 'action',
                sortable: false
            },
        ],
        dialog: false,
        editedIndex: -1,
        editedItem: {
            index: '',
            name: "",
            type: "",
            input: "",
            unit: "",
        },
        defaultItem: {
            index: '',
            name: "",
            type: "",
            input: "",
            unit: "",
        },
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Thêm cấu hình' : 'Chỉnh sửa'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    created() {
        this.initialize()
    },
    methods: {
        validate() {
            if (this.$refs.form.validate()) {
                this.save()
            }
        },
        changeinput() {
            if (this.editedItem.type === "R_DIS_HZ_P") {
                this.item = this.R_DIS_HZ_P
            } else {
                this.item = this.R_DIS_SS
            }
        },
        initialize() {
            let that = this
            let data
            axios({
                url: '/record/getconfigreport',
                data: data,
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST'
            }).then(function (res) {
                that.$data.itemConfig = res.data
            }).catch(function (err) {
                return (err)
            })
        },
        sendData: function () {
            let that = this
            let data = that.$data.itemConfig
            axios({
                url: '/record/configreport',
                data: data,
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST'
            }).then(function (res) {
                if (res.data === "success") {
                    that.$data.status = "success"
                    that.$data.iconname = "check_circle_outline"
                    that.$data.message = "Cấu hình thành công"
                    that.$data.snackbar = true
                    // setTimeout(function () {
                    //     that.$data.alert = false;
                    // }, 1500);
                } else {
                    that.$data.status = "error"
                    that.$data.message = "Cấu hình không thành công"
                    that.$data.snackbar = true
                    // setTimeout(function () {
                    //     that.$data.alert = false;
                    // }, 1500);
                }
            }).catch(function (err) {
                alert(err)
                return (err)
            })
        },
        editItem(item) {
            this.editedIndex = this.itemConfig.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            const index = this.itemConfig.indexOf(item)
            this.itemConfig.splice(index, 1)
        },

        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.itemConfig[this.editedIndex], this.editedItem)
            } else {
                this.itemConfig.push(this.editedItem)
            }
            this.close()
        },
    }
};
</script>

<style scoped>
.input1 {
    margin-left: 25px;
}

#button {
    margin-left: 35px;
}

.content {
    padding-top: 30px;
    margin: auto
}

.title {
    font-family: "Muli", sans-serif
}
</style>
