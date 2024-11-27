// 引入公共类的API方法（public文件夹，此为公共文件夹不需要生成）

Component({
    data: {
        cacheOnlinecheckData: {},
        checkRst: false, // 判断是否检测成功 false: 未失败；true: 通过
        dialogFormVisible: false,
    },
    properties: {
        // 弹框显隐
        visible: {
            type: Boolean,
            // default: false，
            default: true
        },
        // 联网核查弹框标题
        title: {
            type: String,
            default: '联网核查'
        },
        // 主交易码
        mainCode: {
            type: String,
            default: ''
        },
        // 需要被检查的证件号
        checkId: {
            type: String,
            default: ''
        },
        // 需要被检查的证件类型
        idType: {
            type: String,
            default: ''
        },
    },

    //生命周期
    created() {
    },
    ready() {
        this.setData({ dialogFormVisible: this.data.visible })
    },

    observers: {
        visible(val) {
            this.setData({ dialogFormVisible: val })
        },

    },

    //页面事件
    methods: {
        // 联网核查弹窗关闭
        async onOnlinecheckClose() {
            // TODO 其他业务逻辑
            const { cacheOnlinecheckData, checkRst } = this.data
            let isContinue

            if (this.data.checkRst) {
                this.$emit('close', {
                    checkRst: checkRst,
                    checkInfo: cacheOnlinecheckData,
                    isContinue: true
                })
                return
            }
            const content = "联网身份核查未通过，是否继续？";
            const caption = "";
            const focusResult = 0;
            const results = ["确定", "取消"];
            await nt.showQuestionMessageBox(content, caption, focusResult, results)
                .then((result) => {
                    if (result == results[0]) isContinue = true
                    if (result == results[1]) isContinue = false
                })
                .catch((error) => {
                    console.log("询问提示框出现错误:", error);
                });
            this.$emit('close', {
                checkRst: checkRst,
                checkInfo: cacheOnlinecheckData,
                isContinue
            })
        },
        // 联网核查 结果通知
        onOnlineCheck(result) {
            console.log('核查数据', result)
            // TODO 实际校验逻辑
            const { checkCode, checkData } = result;
            // 核查成功
            if (checkCode === 0) {
                // const {} = checkData
                // 缓存联网核查数据，等待关闭弹窗时校验
                this.setData({
                    cacheOnlinecheckData: checkData,
                    checkRst: true,
                });
            }
        },
        closeDialog() {
            this.setData({ dialogFormVisible: false })
        },
    }
})