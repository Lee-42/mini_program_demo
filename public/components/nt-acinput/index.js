/* public\components\agent\agent.js */
import util from "../../utils/utils";
import common from "../../common";
import request from "../../utils/request";

Component({
    data: {

    },
    properties: {

        //props
        mainCd: { type: String, require: true },
        header: {
            type: String,
            default: "转出账户",
        },
        border: {
            type: Boolean,
            default: true,
        },
        cstInfo: Object,
        formModel: Object,
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
        async tb_Acno_LostFocus(_rule, value, callback) {
            if (value) {
                // 查询子账户列表
                try {
                    const res = await request.post("cxcl0014", {
                        acctNo: value,
                        acctNoTp: "",  //是否只查询活期
                        acctStFlg: "1", // 不返回已销户账户
                        cntnDepFlg: "",  //续存标志
                        currencyCcy: this.data.formModel.currencyCcy, // 收息账户币种与开户币种一致
                        cashDrftFlg: this.data.formModel.cashDrftFlg,
                        acctChrctrstcAttr: this.data.formModel.acctChrctrstcAttr
                    })
                    const { fileData } = res
                    if (fileData) {
                        // 选择账号
                        let data = fileData.split('\n')
                        let heads = data.shift().split('|')
                        const listData = data.shift()
                        if (!listData) {
                            return callback(false, "没有可选的账号信息")
                        }
                        const datas = listData.split('|')
                        const selectData = await new Promise(resolve => {
                            common.popTable({
                                heads,
                                datas: [datas],
                            },
                                async (item) => {
                                    let [inIntAcctSrlNo /** 账户序号 */] = item
                                    resolve({
                                        inIntAcctSrlNo
                                    })
                                })
                        })
                        console.log(selectData.inIntAcctSrlNo);
                        this.data.formModel.tb_Acseqn = selectData.inIntAcctSrlNo
                    } else {
                        return callback(false, '未找到未销户的子账户信息！')
                    }
                } catch (error) {
                    console.log(error);
                    return callback(false, '查询账户信息失败！')
                }

                // K025 账户检查 查询存款账户信息
                try {
                    const res = await request.post("k025", {
                        acctNo: value, // 账号
                        acctSrlNo: this.data.formModel.tb_Acseqn, // 账户序号
                        mainTranCd: this.data.mainCd,
                        // opnAcctBnkNo: "",
                    })
                    this.$emit("setAcBsInfo", res)
                    console.log('k025 fileData:', res);
                    const {
                        flgCd, // 标志位
                        cstNo, // 客户号
                        pdTp, // 账号类型（文档中为产品类型）
                        currencyCcy: BZ, // 币种
                    } = res
                    const {
                        cashDrftFlg, // 钞汇标志
                        currencyCcy, // 币种
                    } = this.data.formModel

                    if (flgCd[63] === '1') {
                        //该账户签约资金池
                        return callback(false, '该账户签约资金池！')
                    } else if (flgCd[66] === '1') {
                        //该账户是风险准备金账户
                        return callback(false, '该账户是风险准备金账户！')
                    }

                    console.log('客户编号', this.data.cstInfo.cstNo, cstNo);
                    if (pdTp !== '9' && this.data.cstInfo.cstNo !== cstNo) {
                        return callback(false, `入息户客户号 [${cstNo}] 与新开账号客户号 [${this.data.cstInfo.cstNo}] 不一致,不是来自同一客户`)
                    }
                    // 钞汇标志必须与开户账户一致
                    if (flgCd[49] !== cashDrftFlg) {
                        return callback(false, '入息账户钞汇标志必须与开户账户钞汇标志一致！')
                    }
                    if (BZ !== currencyCcy) {
                        return callback(false, '入息账户币种必须与开户账户币种一致！')
                    }
                } catch (error) {
                    console.log(error);
                    return callback(false, '账户检查失败')
                }

                // TODO 账户常规检查 AccountValiDateEntity.cs -> AccountValiDateEntity 缺少交易码！
                try {
                    // const res = await request.post("k025", {
                    //     acctNo: value, // 账号
                    //     acctSrlNo: this.data.formModel.inIntAcctSrlNo, // 账户序号
                    //     mainTranCd: this.data.mainCd,
                    //     // opnAcctBnkNo: "",
                    // })
                } catch (error) {
                    return callback(false, '账户常规检查失败')
                }

            } else {
                // 清空 账户序号
                this.data.formModel.tb_Acseqn = null
            }

            callback(true)
        },
    },
    //数据监听
    observers: {

    },
});
