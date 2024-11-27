// 引入公共类的API方法（public文件夹，此为公共文件夹不需要生成）
import common from '../../common'

// 引入公共网络请求方法
import request from '../../utils/request.js'

// 引入公共证件类型校验方法
import card from '../../utils/card.js'

Component({
    data: {
        dialogFormVisible: false,

        filterConfigs: [],
    },
    properties: {
        visible: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: function () {
                return []
            }
        },
        tableConfigs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: '集团维护查询'
        },
        total: {
            type: Number,
            default: 0
        },
        tableTitle: {
            type: String,
            default: '查询结果'
        }
    },

    observers: {
        visible(val) {
            this.setData({ dialogFormVisible: val })
        },

    },

    //生命周期
    created() {
        //created(函数只执行一次)
    },
    ready() {
        const filterConfigs = JSON.parse(JSON.stringify(this.data.tableConfigs)).map(item => {
            item.value = item.prop
            return item
        })
        this.setData({
            filterConfigs
        })
    },

    //页面事件
    methods: {
        handleBeforeClose(val) {
            console.log("关闭", val);
            this.$emit("boforeClose")
        },
        handleRowClick(val) {
            console.log('handleRowClick', val);
            this.$emit("boforeClose", val)
        },
        selectRow(val) {
            console.log(11, val);
        },
    }
})