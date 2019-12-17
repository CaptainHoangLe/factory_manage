<template>
<v-container>
    <v-card>
        <div class="flex-row">
            <v-card flat id="menu">
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40">
                    <template v-slot:activator="{ on }">
                        <v-text-field v-model="date" label="Chọn ngày" prepend-icon="event" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" @input="menu = false" :no-title="true"></v-date-picker>
                </v-menu>
            </v-card>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary btExcel" color="blue darken-1">
                    <v-icon>cloud_download</v-icon>Xuất Excel
                </v-btn>
            </v-card-actions>
        </div>

        <v-data-table height="30vh" :headers="headers1" :items="flowpressure" :items-per-page="10" loading="true" :loading-text="Text1" disable-sort>
        </v-data-table>
    </v-card>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" color="blue darken-1">
            <v-icon>cloud_download</v-icon>
            Xuất Excel
        </v-btn>
    </v-card-actions>

    <v-card>
        <v-data-table height="30vh" :headers="headers2" :items="runningservice" :items-per-page="10" loading="true" :loading-text="Text2" disable-sort>
        </v-data-table>
    </v-card>
</v-container>
</template>

<script>
import axios from "axios";
import {
    async
} from 'q';
export default {
    name: "ReportPressure",
    components: {},
    mounted: function () {
        this.loadData();
    },

    data() {
        return {
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            dialog: 0,
            target: "",
            Text1: "",
            Text2: "",
            headers1: [],
            flowpressure: [],
            runningservice: [],
            headers2: [{
                text: ""
            }],
            data: [],
            modalData: []
        };
    },
    watch: {
        date: function () {
            this.loadData();
        }
    },
    methods: {
        loadData() {
            let that = this;
            let [year, month, day] = that.$data.date.split('-')
            let data = {
                time: `${month}/${day}/${year}`

            };
            axios({
                    url: "record/getdatareport",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                })
                .then(function (res) {
                    that.$data.flowpressure = res.data.flowPressure;
                    that.$data.runningservice = res.data.runningService
                    let tmp1 = []
                    let tmp2 = []
                    if (that.$data.flowpressure.length === 0) {
                        that.$data.Text1 = "Không có dữ liệu"
                    } else {
                        tmp1 = Object.keys(that.$data.flowpressure[0])
                        let head1 = []
                        for (let i = 0; i < tmp1.length; i++) {
                            let obj1 = {
                                text: tmp1[i],
                                value: tmp1[i]
                            }
                            head1.push(obj1)
                        }
                        that.$data.headers1 = head1
                    }
                    if (that.$data.runningservice.length === 0) {
                        that.$data.Text2 = "Không có dữ liệu"
                    } else {
                        tmp2 = Object.keys(that.$data.runningservice[0])
                        let head2 = []
                        for (let j = 0; j < tmp2.length; j++) {
                            let obj2 = {
                                text: tmp2[j],
                                value: tmp2[j]
                            }
                            head2.push(obj2)
                        }
                        that.$data.headers2 = head2
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    return err;
                });
        },
        exportData: function () {
            const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];

                for (
                    let offset = 0; offset < byteCharacters.length; offset += sliceSize
                ) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, {
                    type: contentType
                });
                return blob;
            };
            var saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, name) {
                    var blob = b64toBlob(
                            data,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ),
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            })();
            let that = this;
            let [year, month, day] = that.$data.date.split('-')
            let data = {
                time: `${month}/${day}/${year}`

            };
            axios({
                    url: "http://localhost:8298/api/record/export",
                    data: data,
                    headers: {
                        "Content-Type": "Accept"
                    },
                    method: "POST"
                })
                .then(function (res) {
                    saveByteArray([res.data], data + ".xlsx");
                    return res;
                })
                .catch(function (err) {
                    console.log(err);
                    return err;
                });
        },

    }
};
</script>

<style scoped>
#menu {
    padding-top: 10px;
    margin-left: 10px;
    max-width: 150px;
}

.btExcel {
    position: absolute;
    right: 8px
}
</style>
