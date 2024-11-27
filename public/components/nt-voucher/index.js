import GlobalVariable from '../../common/GlobalVariable'
import UserVariable from '../../common/UserVariable'
import common from '../../common'
import commonData from "../../common/common.js"
import utils from '../../utils/utils'
import request from '../../utils/request'
Component({
    data: {
        VoucherNum_required: true, // 凭证号码
        Cdate_required: true, // 出票日期
        APIS: {
            API_K035: 'k035'
        },
        tellno: '',
        info: '',
        _isDoScanner: true,

        /** 构造函数 */
        // MinDays: 10,
        /** 控制属性 */
        // Account: '', // 账号
        // Amt: '', // 金额
        // Cur: '', // 币种
        // ForceValidate: '', // 强制验印
        // KindNo: '', // 
        // TellNo: '', // 
    },
    // 接受的参数
    properties: {
        mainCd: {
            type: String,
            require: true
        },
        formModel: Object, // 数据
        options_VoucherType: { // 凭证种类
            type: Array,
            // require: true,
            default: []
        },
        MinDays: {  // 传递的天数
            type: Number,
            default: 10
        },
        Account: {      // 账号
            type: String,
            require: true,
            default: ''
        },
        Amt: {       // 金额
            type: String,
            require: true,
            default: ''
        },
        Cur: {      // 币种
            type: String,
            require: true,
            default: GlobalVariable.CUR_RMB
        },
        ForceValidate: {// 强制验印
            type: Boolean,
            default: false
        },
        KindNo: {   // 机构号
            type: String,
            // require: true,
            default: ''
        },
        TellNo: {  // 柜员号
            type: String,
            // require: true,
            default: ''
        },
        ntValidatorTp: {    // 凭证种类方法
            type: Function
        },
        ntValidatorNum: {  // 凭证号码
            type: Function
        },
        ntValidatorDate: {  // 出票日期
            type: Function
        }
    },
    //数据监听
    observers: {

    },
    ready() {

    },
    async attached() {
        //active
    },
    detached() {
        //onUnload
    },
    // 页面事件
    methods: {
        // 凭证种类
        VoucherValidator(rule, value, callback) {
            // 新增外币户不能使用现金与转账支票的限制
            if (this.data.Cur != GlobalVariable.CUR_RMB) {
                if (
                    value == UserVariable.PZZL_XJZP ||
                    value == UserVariable.PZZL_ZZZP
                ) {
                    if (!this.data.Cur) {
                        return callback(false, '需要确认对公户币种!')
                    }
                    return callback(false, '对公外币户不允许用现金支票或者转账支票!')
                }
            }
            // 其它凭证的情况下，无需进行凭证号/出票日期的必输验证
            if (value == '299') {
                this.setData({
                    VoucherNum_required: false,
                    Cdate_required: false
                })
            } else {
                this.setData({
                    VoucherNum_required: true,
                    Cdate_required: true
                })
            }
            // 自定义方法
            // if (this.data.ntValidatorTp) return this.data.ntValidatorTp(rule, value, (pass, msg) => {
            //     if (pass) {
            //         callback(pass)
            //     } else {
            //         callback(pass, msg)
            //     }
            // })
            if (this.data.ntValidatorTp) {
                return this.data.ntValidatorTp(rule, value, callback)
            }
            callback(true)
        },
        // 凭证号码 TODO
        async VoucherNumValidator(rule, value, callback) {
            if (
                this.data.formModel.vchrKndTp != UserVariable.PZZL_QTPZ &&
                this.data.formModel.vchrKndTp != UserVariable.PZZL_JSYESQS
            ) {
                if (value.trim().length != 8) {
                    callback(false, '请输入8位凭证号码！')
                }
                // 验证凭证状态  TODO k035
                const param_035 = {
                    acctNo: this.data.Account, // 账号
                    '0580': this.data.formModel.vchrNo, // 凭证号码
                    '0890': this.data.formModel.vchrKndTp, // 凭证种类
                }
                const res_035 = await request.post(
                    this.data.APIS.API_K035,
                    param_035
                ).catch(err => err)
                if (!res_035.msgCode) {
                    return callback(false, res_035.chnlMsgInfo)
                }
                if (res_035['0700'] != '1') {
                    return callback(false, '该凭证号码无法使用')
                }
            }
            // if (this.data.ntValidatorNum) return this.data.ntValidatorNum(rule, value, (pass, msg) => {
            //     if (pass) {
            //         callback(pass)
            //     } else {
            //         callback(pass, msg)
            //     }
            // })
            if (this.data.ntValidatorNum) {
                return this.data.ntValidatorNum(rule, value, callback)
            }
            callback(true)
        },
        // 出票日期
        async CdateValidator(rule, value, callback) {
            if (value) {
                if ((Number(value) - Number(utils.convertMonth(common.userInfo.tranDate, true))) > 0) {
                    return callback(false, commonData.ErrorMessage.N040)
                }
                let days = Number(utils.convertMonth(common.userInfo.tranDate, true)) - Number(value)

                if (
                    this.data.formModel.vchrKndTp == 'A01' ||
                    this.data.formModel.vchrKndTp == 'A02'
                ) {
                    if (
                        this.data.MinDays != '0' &&
                        days >= Number(this.data.MinDays)
                    ) {
                        const date_CP = this.data.formModel.dwBillDt //出票日
                        //有效的最后一天即到期日 
                        let lastDate_YX = utils.addDate(date_CP, '', '', (Number(this.data.MinDays) - 1))
                        let isV = await this.checkHoliday(lastDate_YX)
                        while (isV) {
                            lastDate_YX = utils.addDate(date_CP, '', '', 1)
                            isV = await this.checkHoliday(lastDate_YX)
                        }
                        if (
                            Number(utils.convertMonth(common.userInfo.tranDate, true)) >
                            Number(lastDate_YX)
                        ) {
                            return callback(false, '该支票已过期！')
                        }
                    }
                }
            }
            // 调用验印 TODO 
            if (this.data._isDoScanner) {

            }

            // if (this.data.ntValidatorDate) return this.data.ntValidatorDate(rule, value, (pass, msg) => {
            //     if (pass) {
            //         callback(pass)
            //     } else {
            //         callback(pass, msg)
            //     }
            // })
            if (this.data.ntValidatorDate) {
                return this.data.ntValidatorDate(rule, value, callback)
            }
            callback(true)
        },
        // 判断某天日期是否为节假日
        async checkHoliday(dateArr) {
            let date = utils.extractDate(dateArr)
            const res = await request.post(
                'checkHoliday',
                {
                    year: date.year,
                    month: date.month,
                    day: date.day
                }
            ).catch(err => err)
            if (res.isHoliday) {
                return false
            } else {
                return true
            }
        }
    }
})