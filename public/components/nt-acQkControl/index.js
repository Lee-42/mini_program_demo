/* public\components\agent\agent.js */
import utils from "../../utils/utils";
import request from "../../utils/request";
import common from "../../common/common";

const { ErrorMessage } = common
const { isAmountCheckPass } = utils
const PwdflagList = [
    { label: "密码支取", value: "Y" },
    { label: "证件支取", value: "ZJ" },
    { label: "密码证件支取", value: "MMZJ" },
    { label: "无密不凭证件", value: "NZJ" },
]

const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}
const { tran_date } = userInfo

Component({
    data: {
        XZBZ: null,
        _zqfs: "",
        showTranTp: false,
        pwdDisabled: false,
        idDisabled: false,
        idTpDisabled: false,
        pwdflagLt: [],
        _BZ: "",
        _dTot_amt: "",
        Bzfu_Gj: ""

    },
    properties: {

        //props
        mainCd: { type: String, require: true },
        header: {
            type: String,
            default: "转出账户操作信息",
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
        console.log(isAmountCheckPass);
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
            let { pswdDrwFlg, cstMainIdentNo, currencyCcy, identDrwFlg } = this.data.acctInfo
            let { cmb_CashFlag } = this.data.formModel
            this.data.formModel.tb_Idno = cstMainIdentNo
            if (pswdDrwFlg == 'Y') {
                if (identDrwFlg == 'Y') {
                    this.setData({
                        _zqfs: "MMZJ"
                    })
                } else {
                    this.setData({
                        _zqfs: "Y"
                    })
                }

            } else {
                if (identDrwFlg == 'Y') {
                    this.setData({
                        _zqfs: "ZJ"
                    })
                } else {
                    this.setData({
                        _zqfs: "NZJ"
                    })
                    nt.showMessagebox("该账户是无密且不凭证件支取户", '提示', { type: 'info' })
                }

            }
            console.log(this.data._zqfs);
            let list = PwdflagList.find(f => f.value == this.data._zqfs)
            this.setData({
                pwdflagLt: [list],
            })
            console.log(this.data.pwdflagLt, 'pwdflagLt');
            this.setData({
                _BZ: currencyCcy
            })
        },

        cmb_CashFlag_LostFocus(rules, value, callback) {
            let { isFTAcc } = this.data.acctInfo
            if (isFTAcc == '1' && value == '1') {
                return callback(false, "账户不支持任何形式的现金存取操作")
            }
            this.setData({
                XZBZ: value
            })
            if (value == '1') {
                this.setData({
                    showTranTp: false
                })
            } else {
                this.setData({
                    showTranTp: false
                })
            }
            callback(true)
        },

        cmb_Pwdflag_LostFocus(rules, value, callback) {
            let { _zqfs } = this.data
            if (_zqfs == 'NZJ') {
                this.data.formModel.pb_Password = ""
                this.setData({
                    pwdDisabled: true
                })
            }
            if (["MMZJ", "Y"].includes(value)) {
                this.setData({
                    pwdDisabled: false
                })
            } else {
                this.data.formModel.pb_Password = ""
                this.setData({
                    pwdDisabled: true
                })
            }
            callback(true)
        },

        pb_Password_GotFocus() {
            this.data.formModel.pb_Password = ''
        },

        async tb_Amt_LostFocus(rules, value, callback) {
            let { _BZ, _zqfs } = this.data
            let { acctNo, identDrwFlg, adsBal, sgntrCanUseAmt, pdTp, expDt } = this.data.acctInfo
            let { cmb_CashFlag, tb_Amt, currencyCcy } = this.data.formModel
            let res = isAmountCheckPass(value, _BZ)
            if (!res.retCd) return callback(false, res.retMsg)

            try {
                let res = await request.post("1740", {
                    currencyCcy: _BZ,
                    amountAmt: value
                })
            } catch (error) {
                return callback(false, error)
            }
            const amt = Number(value)
            const avaibleamt = Number(adsBal) + Number(sgntrCanUseAmt)
            if (amt <= 0) return callback(false, "交易金额不能为0，请检查!")
            if (amt > avaibleamt) return callback(false, "交易金额超过账户可用余额，请检查!")
            //TODO: 检查金额是否超限
            try {
                // let res = await request.post("k039",{
                //     acctNo,

                // })
            } catch (error) {
                return callback(false, error.chnlMsgInfo)
            }

            try {
                let res = await request.post("k031", {
                    acctNo: acctNo.trim(),
                    cycTp: "1",
                    cyc: "1",
                    qryTp: "0",
                    staTy: "1",
                    tranTp: "3",
                    currencyCcy: _BZ,
                    mainTranCd: this.data.mainCd

                })
                this.setData({
                    _dTot_amt: res.tranTotAmt
                })
                if (res.tranTotAmt > 50000) {
                    await nt.showMessagebox(`截止至该笔交易之前，该账户当日累计交易金额为:${res.tranTotAmt}`)
                }
                this.data.formModel.tb_Idno = ""
                if (cmb_CashFlag == '2') {
                    let index = Number(tb_Amt) >= 50000 || Number(res.tranTotAmt) + Number(tb_Amt) >= 500000 || identDrwFlg == 'Y'
                    this.setData({
                        idDisabled: index ? false : true
                    })
                } else {
                    let index = Number(tb_Amt) >= 50000 || Number(res.tranTotAmt) + Number(tb_Amt) >= 200000 || identDrwFlg == 'Y'
                    this.setData({
                        idDisabled: index ? false : true
                    })
                }

                // TODO：部提必须证件验证


                // 
                if (["ZJ", "MMZJ"].includes(_zqfs)) {
                    this.setData({
                        idTpDisabled: false,
                        idDisabled: false
                    })
                } else if (_zqfs == 'NZJ') {
                    this.data.formModel.tb_Idno = ""
                    this.setData({
                        idDisabled: true
                    })
                }

                if (_BZ != '01') {
                    this.setData({
                        idDisabled: false,
                        Bzfu_Gj: currencyCcy
                    })
                }

                if (pdTp == '2') {
                    if (Date(tran_date) < Date(expDt)) {
                        this.setData({
                            idTpDisabled: false,
                            idDisabled: false
                        })
                    }
                }

            } catch (error) {
                return callback(false, error.chnlMsgInfo)
            }

            callback(true)

        },

        cmb_Idtype_LostFocus(rules, value, callback) {
            callback(true)
        },

        async tb_Idno_LostFocus(rules, value, callback) {
            let { mainCd, _dTot_amt } = this.data
            let { cmb_Idtype } = this.data.formModel
            let { identNo, acctIdentTp } = this.data.acctInfo
            if (identNo.trim() != value || cmb_Idtype != acctIdentTp) return callback(false, "与开户时证件信息不符!")
            if (mainCd == '2201' || _dTot_amt >= 50000) {
                if (['1', 'E'].includes(cmb_Idtype)) {
                    try {
                        let res = await request.post("k020", {
                            identTp: cmb_Idtype,
                            identNo: value,
                            mainTranCd: mainCd
                        })
                        if (res.verfFlg[0] != '1') return callback(false, ErrorMessage.N002)
                    } catch (error) {
                        return callback(false, error.chnlMsgInfo)
                    }
                }
            }
            callback(true)
        },

        async pb_Password_LostFocus(rules, value, callback) {
            let res = await request.post("k021", {
                pswd: value,
                acctNo: this.data.acctInfo.acctNo
            }).catch(err => {
                this.data.formModel.pb_Password = ""
                return callback(err.chnlMsgInfo)
            })
            callback(true)
        },
        getPwdInfo(info) {
            this.data.formModel.pwdList.push(info)
        }
    },

    //数据监听
    observers: {
        acctInfo() {
            this.initValue()
        }
    },
});
