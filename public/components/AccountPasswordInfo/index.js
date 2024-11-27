

Component({
    data: {
        dialogFormVisible: true,

        filterConfigs: [],
        visible: false,
        // 接口
        APIS: {
            API_k021: "k021"
        },
        // formItem数据
        formItem: {
            acctNo: "",
            tranPswd: ""
        }
        
    },
    properties: {

        modelValue: {
            type: Boolean,
            default: false,
        },
        acctNo: {
            type: String,
            default: ""
        }
    },

    observers: {
        modelValue: {
            handler(val) {
                this.setData({
                    visible: val
                })
            },
            immediate: true,
        },
        visible(val) {
            this.$emit("update:modelValue", val)
            if(val) this.data.formItem.acctNo = this.data.acctNo
        },
        

    },

    //生命周期
    created() {
        //created(函数只执行一次)
        console.log("生命周期11222");
    },
    ready() {

    },

    //页面事件
    methods: {
        async tranPswdValidator(rules, value, callback) {
            const res = await request.post(this.data.APIS.API_k021, { acctNo: this.data.formItem.acctNo, pswd: value }).catch(err => err)
            if (!res.msgCode) return callback(false, res.chnlMsgInfo)

            callback(true)
        },
        getPassword(e) {

        },
        submit() {
            this.$emit("submit")
        },
        // handleBeforeClose(val) {
        //     console.log("关闭", val);
        //     this.$emit("boforeClose")
        // },
        // handleRowClick(val) {
        //     console.log('handleRowClick', val);
        //     this.$emit("boforeClose", val)
        // },
    }
})