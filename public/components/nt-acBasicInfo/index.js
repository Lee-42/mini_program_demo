/* public\components\agent\agent.js */
import util from "../../utils/utils";
import common from "../../common/common";

Component({
    data: {
    },
    properties: {

        //props
        mainCd: { type: String, require: true },
        header: {
            type: String,
            default: "转出账户基本信息",
        },
        border: {
            type: Boolean,
            default: true,
        },
        formModel: Object,
        acctInfo: Object
    },
    //生命周期
    created() {
        //created(函数只执行一次)
    },
    async ready() {
        //节点加载完成(函数只执行一次)
        const { mainCd } = this.data;
        // 核查结果
        // await util.getSelectData({
        //   mainCd,
        //   flg: common.SelectDataType.C031,
        //   name: "checkResultOptions",
        //   that: this,
        // });
    },
    async attached() {
        //active
    },
    detached() {
        //onUnload
    },
    //页面事件
    methods: {
        initValue() {
            let { acctInfo } = this.data
            acctInfo.cashDrftFlg = acctInfo.flgCd.substring(49, 50)
        }
    },
    //数据监听
    observers: {
        acctInfo() {
            this.initValue()
        }
    },
});
