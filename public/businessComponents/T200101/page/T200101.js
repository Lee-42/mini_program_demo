import common from '../../../common'
import request from '../../../utils/request.js'
import card from '../../../utils/card.js'
import utils from '../../../utils/utils'
import commonData from '../../../common/common.js'
import UserVariable from '../../../common/UserVariable'
import commonApi from '../../../common/commonApi'

Component({
    properties: {
        mainCd: { type: String, default: "2105" }, // 主交易码
        isOneStop: Boolean,

        // 必传表单
        formModel: {
            type: Object,
            default: () => ({
                // 不参与接口传输，只控制页面的表单项
                isOnline: '0',
                // 代理人组件所需fields
                isAgent: 'N',
                cardNoType: "",
                cardNo: "",
                licenceAuthority: "",
                checkResult: "",
                linkNet: "",
                supportType: "",
                agentName: "",
                agentContact: "",
                // 本页表单fields
                mblNo: "", // esb接口2129 手机号
                // - 网上预约信息
                bkgLsEfcyAcptNo: "", // esb接口2129 YyslNumbers 预约受理编号
                checkAgree: "", // 开户核实
                eleBusinessLicense: "", // 电子营执
                // - 证件信息
                entpTp: "", // 企业类型
                acctCtgryTp: "", // 账户类别
                identTp: "", // 证件类型
                identNo: "",  // 证件号
                acctNm: "", // 账户名称
                cptlIdentTp: "", // 证件类型（验资户）
                cptlIdentNo: "", // 证件号（验资户）
                cptlAcctNm: "", // 账户名称（验资户）
                // - 账户信息
                currencyCcy: "", // 币种
                frgnExgPpsFlg: '0', // 外汇用途，默认无外汇用途
                bsnTp: "", // 业务种类
                pdCd: "", // 产品代码
                acctTp: "", // 账户类型
                medmTp: "", // 介质种类
                clcIntTp: "", // 计息类型
                intRateTp: "", // 利率类型
                baseRate: "", // 基准利率
                fltRto: "", // 浮动比例
                execRate: "", // 执行利率
                uduwFlg: "", // 通存通兑标志
                chrgMd: "", // 收费方式
                cashDrftFlg: "", // 钞汇标志
                acctChrctrstcAttr: "", // 账户性质
                inIntAcctNo: "", // 入息账号
                inIntAcctSrlNo: "", // 账户序号
                mutlMgtFlg: "", // 管控账户标志
                aprvNo: "", // 核准号
                frgnExgMgtAprvlPORcrdsBsnNo: "", // 外汇局审批号
                lmtTp: "", // 限额类型
                lmtAmt: "", // 限额金额
                // - 联系人信息1
                identTp1: "", // 证件类型
                identNo1: "", // 证件号码
                name1: "", // 联系人姓名
                phone11: "", // 联系人电话1
                phone12: "", // 联系人电话2
                // - 联系人信息2
                identTp2: "", // 证件类型
                identNo2: "", // 证件号码
                name2: "", // 联系人姓名
                phone21: "", // 联系人电话1
                phone22: "", // 联系人电话2
            })
        },
    },
    data: {
        userInfo: {}, // 用户信息
        pdInfo: {}, // 产品信息
        cstInfo: {}, // 客户信息数据
        hasWrittenCstInfo: false, // 一键开户时，标记是否已填写完成客户信息
        hasBindCallback: false, // 一键开户时，是否已绑定过客户信息填写完毕的回调事件

        onlinecheckData: {
            visible: false, // 联网核查开关
            checkNo: "", // 核查号码
        },
        bookInfo: {}, // 预约信息

        baseTrueOrFalseList: [
            { value: '1', label: '是' },
            { value: '0', label: '否' },
        ],
        clcIntTpList: [
            { value: '0', label: "不计息" },
            { value: '1', label: "利随本清" },
            { value: '2', label: "按日计息" },
            { value: '3', label: "按月计息" },
            { value: '4', label: "按季计息" },
            { value: '5', label: "按年计息" }
        ],
        // 通存通兑标志列表
        uduwFlgList1: [
            { value: '0', label: "不通存通兑", },
            { value: '2', label: "通存不通兑" },
        ],
        // 通存通兑标志列表
        uduwFlgList: [
            { value: '0', label: "不通存通兑", },
            { value: '1', label: "通存通兑", },
            { value: '2', label: "通存不通兑" },
        ],
        // 管控账号标志列表
        mutlMgtFlgList: [
            { value: '0', label: "非管控账户", },
            { value: '1', label: "共管户", },
            { value: '2', label: "监管户", },
            { value: '3', label: "商品房预售资金监管户" },
        ],
        // 限额类型列表
        lmtTpList: [
            { value: '0', label: "无限额", },
            { value: '1', label: "余额限额", },
            { value: '2', label: "贷方流入限额" },
        ],
        entpTpList: [],
        idType: [],
        bsnTpList: [],
        pdCdList: [],
        intRateTpList: [],
        cashDrftFlgList: [],
        acctChrctrstcAttrList: [],

        // 币种列表
        currencyList: [],
        // 个人证件类型列表
        agntIdentTpList: [],

        paymentParams: {
            cstNo: "", // 客户号
        }, // 收费数据
        reqParams: {}, // 提交数据
    },
    computed: {
        // 是否人民币，人民币可以选择是否做外汇用途
        isRMB() {
            const { currencyCcy } = this.data.formModel
            return currencyCcy === '01'
        },

        canCustomizeCompanyName() {
            let { fITp } = this.data.cstInfo
            // 根据金融机构类型，判断是否可以自输 账户名称
            fITp && (fITp = fITp.trim())
            // 实际控制人证件类型
            return ["d01", "e01", "f01", "d02"].includes(fITp)
        },

        // 账户类型列表，根据 普通户/非普通户 币种 外汇用途 业务种类 产品代码 5种因素变更候选项
        acctTpList() {
            let arr = ""

            const { acctCtgryTp, currencyCcy, bsnTp, frgnExgPpsFlg, pdCd } = this.data.formModel

            // 1. 非普通户
            if (acctCtgryTp !== "1") {
                // 非普通户，账户类型 只能选择 临时存款户
                arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === '4')
            }
            // 普通户
            else {
                // 2.外币
                if (currencyCcy !== "01") {
                    // 外币+保证金
                    if (bsnTp === "2002") {
                        arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === 'G')
                    }
                    // 外币+非保证金
                    else {
                        arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === 'E')
                    }
                }
                // 3.人民币
                else {
                    // 人民币 + 外汇用途 = 一般户 
                    if (frgnExgPpsFlg === "1") {
                        arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === '1')
                    }
                    // 人民币 + 保证金
                    if (bsnTp === "2002") {
                        arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === 'F')
                    }
                }
                // 4. 财政0余额、保险公司存放资本保证金、农民工工资、农民工工资保证金 = 专用存款户
                if (["163", "1JY", "1JX"].includes(pdCd)) {
                    arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => opt.value === '3')
                }
            }

            // 默认
            arr || (arr = UserVariable.STATIC_ACCTTP_LIST.filter(opt => ["1", "2", "3", "4"].includes(opt.value)))

            return arr
        },
        // 收费方式列表
        chrgMdList() {
            const arr = [
                { value: '0', label: "实时收取", },
                { value: '1', label: "汇总收取" },
            ]
            const { bsnTp } = this.data.formModel

            // 保证金
            if (bsnTp === "2002") {
                arr.pop()
            }

            return arr
        }
    },

    ready() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
        this.setData({ userInfo })

        this.getSelectOptionsByK042()

        window.strictMode = true
    },

    methods: {
        // 查询k042接口返回的选项列表
        async getSelectOptionsByK042() {
            const mainCd = this.data.mainCd
            await utils.getSelectData({ mainCd, flg: commonData.SelectDataType.C023, name: 'entpTpList', that: this }) // 企业类型
            await utils.getSelectData({ mainCd, flg: 'C003', name: 'idType', that: this }) // 证件类型
            await utils.getSelectData({ mainCd, flg: 'R001', name: 'intRateTpList', that: this }) // 利率类型
            await utils.getSelectData({ mainCd, flg: '0075', name: 'cashDrftFlgList', that: this }) // 钞汇标志

            // 页面中未使用，但打印映射需要
            await utils.getSelectData({ mainCd, flg: commonData.SelectDataType.C004, name: 'agntIdentTpList', that: this }) // 个人证件类型
            await utils.getSelectData({
                mainCd,
                flg: "CUR_NO",
                splmtInf: this.data.userInfo.inst_no ? `{BR_NO}|${this.data.userInfo.inst_no}|` : undefined,
                name: "currencyList",
                that: this,
            })
        },

        /**
         * 处理接口返回的枚举数据
         * @param {object} res 接口数据
         * @param {boolean} reverse fileData字段的value|label是否是相反的，即label|value
         * @returns 可以供SelectOption使用的数据结构
         */
        formatSelectOptions: (res, reverse = false) => {
            let { fileData } = res
            let data = fileData.split("|\n").filter(f => f)
            let obj = data.reduce((obj, item) => {
                let arr = item.split('|')
                obj.push({ value: reverse ? arr[1] : arr[0], label: reverse ? arr[0] : arr[1] })
                return obj
            }, [])
            return obj
        },

        transformLabelByValue: (value, options) => {
            const result = options.find(opt => opt.value === value)
            if (result) {
                return result.label
            }
            else return ''
        },

        // 2479 电子营业执照更新   
        // updateBsnLic() {
        //     request.post('2479', {
        //         acctNo: "1",
        //         acctSrlNo: "2",
        //         cstNo: "3",
        //         unifdSoclCrdtCd: "4",
        //         imgPltfmNo: "5",
        //         imgBtchNo: "6"
        //     }).then(res => {
        //         console.log(res)
        //     }).catch(err => {
        //         console.warn(err)
        //     })
        // },

        // 2105 对公活期开户业务
        beforeSubmit() {
            let { formModel } = this.data
            let {
                cstNo = "", // 客户编号
                identNo: cacheIdentNo = "", // 客户证件号码
                cstNm: cacheCstNm = "", // 客户姓名
            } = this.data.cstInfo || {}
            const { isAgent } = formModel
            const {
                currencyCcy, // 币种
                pdCd, // 产品代码
                acctTp, // 账户类型
                entpTp, // 企业类型
                clcIntTp, // 计息类型
                intRateTp, // 利率类型
                medmTp, // 介质种类
                identTp, // 证件类型
                identNo, // 证件号码
                uduwFlg, // 通存通兑标志
                acctNm, // 账户名称
                acctCtgryTp, // 账户类别
                fltRto, // 浮动比例
                execRate, // 执行利率
                inIntAcctSrlNo, // 入息账户序号
                inIntAcctNo, // 其他活期保证金的收息账号
                chrgMd, // 收费方式
                mutlMgtFlg, // 共管户标志
                aprvNo, // 核准号
                cashDrftFlg, // 钞汇标志
                frgnExgMgtAprvlPORcrdsBsnNo, // 外汇局审批号
                acctChrctrstcAttr, // 账户性质
                lmtTp, // 限额类型
                lmtAmt, // 限额金额
                frgnExgPpsFlg, // 外汇用途标志
            } = formModel
            const {
                identNo1, identTp1, name1, phone11, phone12,
                identNo2, identTp2, name2, phone21, phone22
            } = formModel
            const {
                pdNm = "", // 产品名称
            } = this.data.pdInfo

            // 接口请求参数对象
            const params = {
                // -----固定入参-----
                ccy1: currencyCcy, // 1181币种
                ccy2: currencyCcy, // 1033币种
                ccy3: currencyCcy, // 102J币种
                pdCd, // 产品代码
                pdNm, // 产品名称
                acctTp, // 账户类型
                entpTp, // 企业类型
                clcIntTp, // 计息类型
                intRateTp, // 利率类型
                medmTp, // 介质种类
                uduwFlg, // 通存通兑标志
                acctCtgryTp, // 账户类别
                fltRto, // 浮动比例
                execRate, // 执行利率
                inIntAcctSrlNo, // 入息账户序号
                inIntAcctNo, // 其他活期保证金的收息账号
                chrgMd, // 收费方式
                mutlMgtFlg, // 共管户标志
                aprvNo, // 核准号
                cashDrftFlg, // 钞汇标志
                frgnExgMgtAprvlPORcrdsBsnNo, // 外汇局审批号
                acctChrctrstcAttr, // 账户性质
                lmtTp, // 限额类型
                lmtAmt, // 限额金额
                frgnExgPpsFlg, // 外汇用途标志

                // -----条件入参-----
                // cstNo: '', // 客户号
                // ctcPrsnInf: '',//联系人信息
                // cptlVfctnInf: '',//验资户证件信息
                // identTp: '',//证件类型
                // identNo: '',//证件号码
                // cstNm: '',//客户名称
                // acctNm: '',//账户名称




                // agntIdentNo: '', // 代理人证件号码
                // agntIdentTp: '', // 代理人证件类型
                // agntNm: '', // 代理人户名
                // agntCtcMd: '', // 代理人联系方式
            }

            // 联系人信息拼接
            let contactStr = ''
            let count = 0
            if (identNo1) {
                count++
                contactStr += `${identTp1}|${identNo1}|${name1}|${phone11}|${phone12 || ''}`
            }
            if (identNo2) {
                count++
                contactStr += `|${identTp2}|${identNo2}|${name2}|${phone21}|${phone22 || ''}`
            }
            if (contactStr) {
                contactStr = `0${count}|` + contactStr
                params.ctcPrsnInf = contactStr
            }


            // 代理人信息登记
            if (isAgent === 'Y') {
                const { cardNoType, cardNo, agentName, agentContact } = formModel
                params.agntIdentTp = cardNoType
                params.agntIdentNo = cardNo
                params.agntNm = agentName
                params.agntCtcMd = agentContact
                // TODO 125域数据组装，文档暂时没有
            }

            // 组织证件类型 为 营业执照
            if (identTp === 'A') {
                params.cstNo = cstNo
            }

            // 账户类别 为 验资户 ，添加验资户证件信息
            if (acctCtgryTp === '2') {
                // 01|验资户辅助证件类型|验资户辅助证件号码|账户名称||||||||
                const { cptlIdentTp, cptlIdentNo, cptlAcctNm } = formModel
                params.cptlVfctnInf = ['01', cptlIdentTp, cptlIdentNo, cptlAcctNm].join('|')
                params.identTp = 'Z' // 固定为 Z - 验资户证件
                params.identNo = cacheIdentNo // 用户信息里的证件号码
                params.cstNm = cacheCstNm // 用户信息里的客户姓名
                params.acctNm = cptlAcctNm // 账户名称
            } else {
                params.identTp = identTp // 证件类型
                params.identNo = identNo // 证件号码（营执号/组织机构代码）
                params.cstNm = cacheCstNm //  用户信息里的客户姓名
                params.acctNm = this.data.canCustomizeCompanyName ? acctNm : ((cacheCstNm || "") + acctNm) // 账户名称
            }

            // 组装打印字段
            const { mutlMgtFlgList, idType, uduwFlgList, currencyList, acctTpList, clcIntTpList, cashDrftFlgList,
                baseTrueOrFalseList, lmtTpList, acctChrctrstcAttrList, agntIdentTpList } = this.data
            const printData = {
                tranBrchNm: '',
                busiNm: "对公活期开户",
                newAcctNo: '',
                mutlMgtFlg: this.transformLabelByValue(params.mutlMgtFlg, mutlMgtFlgList),
                pdNm, // 产品名称
                cstNo,
                acctNm: params.acctNm,
                identTp: this.transformLabelByValue(params.identTp, [...idType, { value: 'Z', label: '验资户证件' }]),
                identNo: params.identNo,
                uduwFlg: this.transformLabelByValue(params.uduwFlg, uduwFlgList),
                inIntAcctNo: params.inIntAcctNo,
                busiTp: "", // 科 目 号
                currencyCcy: this.transformLabelByValue(params.ccy1, currencyList),
                isElectron: "", // 使用电子营业执照
                acctTp: this.transformLabelByValue(params.acctTp, acctTpList),
                clcIntTp: this.transformLabelByValue(params.clcIntTp, clcIntTpList),
                cashDrftFlg: this.transformLabelByValue(params.cashDrftFlg, cashDrftFlgList),
                frgnExgPpsFlg: this.transformLabelByValue(params.frgnExgPpsFlg, baseTrueOrFalseList),
                lmtTp: this.transformLabelByValue(params.lmtTp, lmtTpList),
                lmtAmt: params.lmtAmt,
                acctChrctrstcAttr: this.transformLabelByValue(params.acctChrctrstcAttr, acctChrctrstcAttrList),
                frgnExgMgtAprvlPORcrdsBsnNo: params.frgnExgMgtAprvlPORcrdsBsnNo,
                identTp1: this.transformLabelByValue(identTp1, agntIdentTpList),
                identNo1,
                name1,
                phone11,
                phone12,
                identTp2: this.transformLabelByValue(identTp2, agntIdentTpList),
                identNo2,
                name2,
                phone21,
                phone22,
                flowNo: "",
                tlrSeqNo: '',
                coreSeqNo: '',
                platSeqNo: "",
                tlrNo: ""
            }

            // 没有值的，设置为空字符串
            for (const key in printData) {
                if (Object.prototype.hasOwnProperty.call(printData, key)) {
                    if (!printData[key]) {
                        printData[key] = ''
                    }
                }
            }

            // 收费接口需要携带表单信息
            this.data.paymentParams.cstNo = params.cstNo // 客户号


            params.printData = printData

            // 组装完成后，赋值给业务提交组件
            this.setData({
                reqParams: params
            })

            return true

            // request.post('2105', params).then(res => {
            //     let { retCd, retMsg, fileData, printData } = res
            //     if (retCd === '0000' && fileData) {
            //         nt.messageBox({
            //             title: "提示",
            //             message: '业务办理成功！是否进行打印？不进行打印将退出当前交易！',
            //             showConfirmButton: true,
            //             showCancelButton: true,
            //             beforeClose: (action, _instance, done) => {
            //                 if (action === 'confirm') {
            //                     // common.print(printData, 'app510846516877987840')
            //                     console.log('打印！', printData);
            //                     this.setData({
            //                         printData
            //                     })
            //                     this.$nextTick(() => {
            //                         let pdf = document.getElementsByClassName("pdf");
            //                         common.print(pdf);
            //                     })

            //                     // TODO 开户业务种类为保证金时，不打印外部凭证

            //                 } else {
            //                     nt.close(
            //                         {
            //                             appid: 'app510846516877987840',  //当前要关闭的微应用的appid ，先去管理端获取罗
            //                             apptype: "1",   //写死 1 就行
            //                         },
            //                     );
            //                 }
            //                 done()
            //             }
            //         })
            //     } else {
            //         nt.alert(retMsg)
            //     }
            // }).catch(err => {
            //     let { retMsg } = err
            //     nt.alert(retMsg)
            // })
        },

        // 提交完成后
        afterSubmit() {
            // TODO 影像平台登记电子营业执照
            // TODO 交易完成后，跳转至 T209103 电子营业执照查询

            nt.showMessagebox("交易完成，即将关闭交易", "提 示", {
                type: 'success',
                confirmButtonText: '关 闭',
                beforeClose: (_, __, done) => {
                    const appid = window.localStorage.getItem("currentAppId") || ''
                    nt.close(
                        {
                            appid,
                            apptype: "1",   //写死 1 就行
                        },
                    );

                    done()
                }
            })
        },

        // 账户类别变更后执行
        async onAccountTypeValidate(_rule, value, callback) {
            // TODO 非验资户 反显 证件号码 = 预约信息里的证件号码（如有）
            // TODO 验资户 反显 证件号码 = 预约信息里的证件号码（如有）
            const STATIC_PDCD_LIST = {
                2: [{ value: '145', label: "验资户存款" }],
                3: [{ value: '146', label: "增资户存款" }]
            }

            // 清空
            Object.assign(this.data.formModel, {
                cptlIdentNo: "",
                cptlAcctNm: "",
                identNo: "",
                cstNm: "",
                acctNm: "",
            })

            // 1. 普通户
            if (value === '1') {
                await utils.getSelectData({ mainCd: this.data.mainCd, flg: '0020', name: 'bsnTpList', that: this }) // 业务种类 选择 账户类别 后拉取
            } else {
                // 部分非普通户的处理逻辑一致

                // 清空 业务种类， 产品代码 只能选择一项
                this.data.pdCdList = STATIC_PDCD_LIST[value]
                Object.assign(this.data.formModel, {
                    bsnTp: "",
                    pdCd: STATIC_PDCD_LIST[value][0].value,
                    acctTp: "4", // 账户类型 默认选择 临时存款户
                })

                // 验资户 
                if (value === '2') {
                    // 通过参数代码查询公共产品参数表
                    const res = await request.post("k029", {
                        parmCd: "YZ_CIF",
                        parmSrlNo: "1",
                        mainTranCd: this.data.mainCd
                    })
                    const { parmVal } = res
                    // parmVal 需要储存起来，供验资户查询用户信息
                    Object.assign(this.data.cstInfo, {
                        cstNo: parmVal.trim(), // 验资户公共参数值
                        inhbtAttrTp: '0', // 居民标志
                    })
                }
                // 增资户
                else if (value === '3') {
                    // 暂时没有差异
                }
            }

            // 非 验资户
            if (value !== '2') {
                // 反填预约信息
                const info = this.data.bookInfo
                Object.assign(this.data.formModel, {
                    acctNm: info.acctNm || "", // 账户名称
                    acctChrctrstcAttr: info.acctChrctrstcAttr || "", // 账户性质
                    currencyCcy: info.rgstrtnFndCcy || "", // 注册资金币种
                })
            }

            // 所有账户默认币种为人民币
            this.data.formModel.currencyCcy = '01' // 人民币
            callback(true)
        },

        // 双敲证件号码前置校验
        onIdentNoValidate(_rule, value, callback) {
            const { acctCtgryTp, cptlIdentTp, identTp } = this.data.formModel;
            if (!value || value.length === 0) {
                return callback(false, "请输入证件号码");
            } else {
                const { retCd, retMsg } = card.cardVerifyRule(
                    acctCtgryTp === "2" ? cptlIdentTp : identTp,
                    value,
                );
                callback(retCd, retMsg);
            }
        },

        // k020 账户类别 证件合法性验证  交易成功
        async checkId(_rule, value, callback) {
            const { identTp } = this.data.formModel;
            // 如果是组织机构代码
            if (identTp === "8") {
                const res = await request.post("k020", {
                    identTp,
                    identNo: value,
                    mainTranCd: this.data.mainCd
                })
                let { verfFlg } = res
                if (verfFlg.trim() === '3') {
                    await this.getCstByIdent(callback)
                    return callback(true)
                }
                callback(false, "机构代码证验证失败")
            } else {
                await this.getCstByIdent(callback)
                callback(true)
            }
        },
        // k020 验资户 证件合法性验证  交易成功
        async checkId1(_rule, value, callback) {
            // 如果是组织机构代码证，调用9574进行校验  整合短交易
            if (cptlIdentTp === "8") {
                const res = await request.post("k020", {
                    identTp: cptlIdentTp,
                    identNo: value,
                    mainTranCd: this.data.mainCd
                })
                let { verfFlg } = res
                if (verfFlg.trim()[0] !== '3') {
                    return callback(false, commonData.ErrorMessage.N002)
                }

            }

            // k018 查询客户信息
            const { cstNo } = this.data.cstInfo
            try {
                const cstInfo = await request.post("k018", {
                    cstNo,
                    identTp: cptlIdentTp,
                    mainTranCd: this.data.mainCd,
                })
                this.setData({
                    cstInfo,
                })

                callback(true)
            } catch (error) {
                console.error("k018-error", error);
                await new Promise((resolve) => {
                    nt.confirm('该证件尚未建立客户信息，是否建立', '提示', {
                        confirmButtonText: "是",
                        cancelButtonText: '否',
                    }).then(() => {
                        resolve()
                        callback(false)
                        this.jumpToCreateCustomerPage()
                    }).catch(() => {
                        this.data.formModel.identNo = ""
                        resolve()
                        callback(false)
                    })
                })
            }
        },

        // k022 根据证件类型证件号查询已开立的客户  交易成功  verfFlg：  1个人成功 与3 企业成功
        async getCstByIdent(callback) {
            let { identNo, identTp } = this.data.formModel
            const res = await request.post("k022", {
                identNo,
                cstTp: "2",
                identTp,
                mainTranCd: this.data.mainCd,
            })
            let { fileData } = res
            if (fileData) {
                if (this.data.isOneStop) {
                    // 一键开户 只允许新客户
                    callback(false, "该证件号码已经建立过客户号,不允许交易！")
                    return
                }

                let arr1 = fileData.split('\n')
                arr1.pop()
                const heads = arr1.shift().split('|')
                heads.pop()
                // let arr2 = ['客户编号', '客户名称', '证件号码', '企业类型']
                let arr3 = arr1.map(m => {
                    const r = m.split('|')
                    r.pop()
                    return r
                })
                await new Promise(resolve => {

                    common.popTable({
                        heads: heads,
                        datas: arr3
                    },
                        async (item) => {
                            let [cstNo, cstNm, identNo] = item

                            // TODO 账户名称 最大长度限制

                            // 涉税信息 客户涉税识别号查询
                            if (identTp !== 'G') { // 非警官证
                                const res = await request.post("4810", {
                                    cstNo,
                                })
                                if (res.revInhbtIdty.trim() == '00') { // 没有
                                    nt.showMessagebox('请先通过010102客户一般信息维护交易补录非居民金融账户涉税信息！', '交易暂停', {
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                    })
                                    return callback && callback(false, "客户没有金融账户涉税信息")
                                }
                            }

                            // 62B3-检查反洗钱监控-------根据业务需求，反洗钱检查必须在原有黑名单检查之前
                            // TODO 放入常规账户检查
                            try {
                                const res = await request.post("62b3mbfe", {
                                    acctNm: cstNm, // 账户名称
                                    identTp: identTp, // 证件类型
                                    identNo: identNo, // 证件号码
                                    flgCd: "3000000000", // 标志位
                                })
                                const { vrfyRslt } = res
                                // 命中
                                if (vrfyRslt === '1') {
                                    const { listTp, listTpDsc } = res
                                    let message = ""
                                    // 命中政要类型，界面弹出提示
                                    if (listTp === "04") {
                                        message = "监控对象涉嫌" + listTpDsc;
                                        const { retCd, retMsg } = await new Promise(resolve => {
                                            nt.showMessagebox(message + ",是否暂停交易？", '询问消息', {
                                                type: 'error',
                                                showCancelButton: true,
                                                confirmButtonText: '继续',
                                                cancelButtonText: '取消',
                                                beforeClose: (action, _instance, done) => {
                                                    if (action === 'confirm') {
                                                        resolve({ retCd: true })
                                                    } else {

                                                        resolve({ retCd: false, retMsg: message })
                                                    }
                                                    done()
                                                }
                                            })
                                        })
                                        if (!retCd) {
                                            return callback(false, retMsg)
                                        }
                                    } else {
                                        nt.showMessagebox(`监控对象涉嫌${listTpDsc},拒绝交易、冻结资产、报告公安机关。`, '警 告', {
                                            type: 'error',
                                            confirmButtonText: '确 定',
                                        })
                                        return callback(false, "交易拒绝")
                                    }
                                }
                                //疑似命中
                                else if (vrfyRslt === '2') {
                                    const { listTpDsc } = res
                                    nt.showMessagebox(`监控对象涉嫌${listTpDsc},进行人工审核后才能继续交易。`, '警 告', {
                                        type: 'error',
                                        confirmButtonText: '确 定',
                                    })
                                    return callback(false, "交易拒绝")
                                }
                            } catch (error) {
                                return callback(false, error.chnlMsgInfo || error.retMsg)
                            }


                            await this.getCstInfo({ cstNo, cstNm, identNo }, callback)
                            resolve()
                        })
                })

            } else {
                const { bkgLsEfcyAcptNo: cstBkgLsEfcyAcptNo } = this.data.cstInfo;
                const { acctCtgryTp, cptlIdentTp, cptlIdentNo, identTp, identNo, bkgLsEfcyAcptNo } = this.data.formModel;
                let localTp = acctCtgryTp === "2" ? cptlIdentTp : identTp;
                let localNo = acctCtgryTp === "2" ? cptlIdentNo : identNo;
                // 固定证件号码在客户信息维护交易的字段名
                let identNoKeyName = "";
                switch (localTp) {
                    case "8": // 组织机构代码证
                        identNoKeyName = "orgInstCd";
                        break;
                    case "A": // 营业执照
                        identNoKeyName = "bsnLic";
                        break;
                    case "V": // 文件
                        identNoKeyName = "file";
                        break;
                    case "D": // 登记证书
                        identNoKeyName = "registerCtf";
                        break;
                    default:
                        break;
                }
                if (this.data.isOneStop && this.data.hasWrittenCstInfo) {
                    // 如果变更 证件类型或者证件号码
                    if (this.data.cstInfo[identNoKeyName] !== localNo) {
                        await new Promise(resolve => {
                            nt.showMessagebox(`证件信息发生变更，请在客户信息录入界面仔细核对`, '提 醒', {
                                type: 'info',
                                confirmButtonText: '知道了',
                                beforeClose: (_action, _instance, done) => {
                                    done()
                                    resolve()
                                }
                            })
                        })
                        callback(false)
                        this.jumpToCreateCustomerPage()
                    }
                    // 如果双边预约号不一致
                    else if (cstBkgLsEfcyAcptNo !== bkgLsEfcyAcptNo) {
                        await new Promise(resolve => {
                            nt.showMessagebox(`预约信息发生变更，请在客户信息录入界面仔细核对`, '提 醒', {
                                type: 'info',
                                confirmButtonText: '知道了',
                                beforeClose: (_action, _instance, done) => {
                                    done()
                                    resolve()
                                }
                            })
                        })
                        callback(false)
                        this.jumpToCreateCustomerPage()
                    }
                } else {
                    // 首次进入创建客户号时，预填 企业类型 和 证件号码
                    if (this.data.isOneStop && !this.data.hasWrittenCstInfo) {
                        if (identNoKeyName) {
                            // 确保与 T010101 的数据格式一致
                            sessionStorage.setItem("businessCstInfo", JSON.stringify({
                                fileDataMap: {
                                    cstTp: "2", // 对公用户
                                    entpTp: this.data.formModel.entpTp,
                                    [identNoKeyName]: localNo,
                                },
                            }))
                        }
                    }
                    callback(false);
                    nt.confirm('该证件尚未建立客户信息，是否建立', '提示', {
                        confirmButtonText: "是",
                        cancelButtonText: '否',
                    }).then(() => {
                        this.jumpToCreateCustomerPage()
                    }).catch(() => {
                        this.data.formModel.identNo = ""
                    });
                }
            }
        },

        // k018 非验资户查询客户信息并校验   交易成功  需将字符串转为json 通过弹窗表格点击调用将客户信息保存
        async getCstInfo(params, callback) {
            const { entpTp, identTp } = this.data.formModel
            const res = await request.post("k018", {
                ...params,
                identTp,
                mainTranCd: this.data.mainCd,
            })

            // 对关键参数进行 trim 处理，以防后续处理报错
            res.cstNm = res.cstNm.trim()

            this.setData({
                cstInfo: res
            })
            let { flgCd, cstNm, entpTp: entpTpFromCst, cstSt, blcklistCstFlg, fITp } = this.data.cstInfo


            if (Number(entpTp) !== Number(entpTpFromCst)) {
                nt.alert("选择的企业类型与客户信息不符", "提示")
                return callback(false, "选择的企业类型与客户信息不符")
            }

            // 黑名单判断
            if (flgCd[3] === '1') {
                return callback(false, commonData.ErrorMessage.N005)
            }
            // 客户当前状态 未激活
            if (cstSt === '0') {
                return callback(false, "该证件信息存在预开户账号,不允许重新开户！")
            }
            // 黑名单客户
            if (blcklistCstFlg === '0') {
                return callback(false, commonData.ErrorMessage.N005)
            }

            // TODO 上传电子营业执照
            if (this.data.formModel.eleBusinessLicense) {

            }
        },

        // 切换币种时
        async onCurrencyChange(_rule, value, callback) {
            // 非普通户 只能选 人民币
            const { acctCtgryTp } = this.data.formModel
            if (acctCtgryTp !== '1' && value !== '01') {
                return callback(false, '非普通户必须选择人民币')
            }

            // 人民币
            if (value === '01') {
                Object.assign(this.data.formModel, {
                    frgnExgPpsFlg: '0',// 默认无外汇用途
                    cashDrftFlg: '0',// 默认钞户
                    // 清空外币相关表单项
                    acctChrctrstcAttr: "",
                    frgnExgMgtAprvlPORcrdsBsnNo: "",
                    lmtTp: "",
                    lmtAmt: ""
                })
            }
            // 外币
            else {
                Object.assign(this.data.formModel, {
                    frgnExgPpsFlg: '1',// 默认外汇用途
                    cashDrftFlg: '1',// 默认汇户
                })

                // 做外汇用途时需要查询账户性质
                // 这里需要调用是因为，币种选择外币时，外汇用途项disabled，无法触发外汇项的ntValidator
                await this.getAcctChrctrstcAttrList()
            }

            // 检查居民标志
            let { inhbtAttrTp } = this.data.cstInfo
            if (!inhbtAttrTp) {
                // 客户未维护居民/非居民标志，请通过010102交易完善客户信息
                nt.showMessagebox('客户未维护居民/非居民标志，请通过010102交易完善客户信息', '交易暂停', {
                    type: 'error',
                    confirmButtonText: '知道了',
                })
                return callback(false, "客户未维护居民/非居民标志")
            }
            // 验资户 的居民标志固定为 居民
            if (this.data.formModel.acctCtgryTp === '2') {
                inhbtAttrTp = this.data.cstInfo.inhbtAttrTp = '0'
            }
            callback(true)
        },

        // 外汇确定时
        async onForeginExchangeValidate(_rule, value, callback) {
            // 是
            if (value === '1') {
                const { currencyCcy } = this.data.formModel
                const obj = {
                    cashDrftFlg: '1',// 汇户
                }

                // 人民币 + 外汇用途 = 一般户
                if (currencyCcy === "01") {
                    obj.acctTp = "2" // 账户类型， 一般户
                }

                Object.assign(this.data.formModel, obj)

                // 做外汇用途时需要查询账户性质
                // 7366 查询账户性质列表
                await this.getAcctChrctrstcAttrList()
            } else {
                // 清空 外汇相关表单项
                this.setData({
                    acctChrctrstcAttr: "",
                    frgnExgMgtAprvlPORcrdsBsnNo: "",
                    lmtTp: "",
                    lmtAmt: "",
                })
            }
            callback(true)
        },

        // 业务种类变更时，获取产品列表下拉选项
        async getPdCdList(val) {
            // 验资户、增资户时，该项没有值，且不可选取
            if (val) {
                // 清空可能受影响的表单项
                Object.assign(this.data.formModel, {
                    uduwFlg: "", // 通存通兑标志
                    pdCd: "", // 产品代码
                })


                // 业务种类为 保证金 时，没有 通存通兑 选项
                const index = this.data.uduwFlgList.findIndex(opt => opt.value === '1')
                if (val === '2002' && index > -1) {
                    this.data.uduwFlgList.splice(index, 1)
                } else if (val !== '2002' && index === -1) {
                    this.data.uduwFlgList.splice(1, 0, { value: '1', label: '通存通兑' })
                }

                let { currencyCcy } = this.data.formModel
                const res = await request.post("cxcl0013", {
                    currencyCcy,
                    cstTp: "2",
                    bsnKndTp: val,
                    listCd: "0013", // 固定值0013
                    medmCd: '0000', // 产品可以使用的介质代码
                })
                const arr = this.formatSelectOptions(res)

                this.setData({
                    // 产品代码中屏蔽掉验资户存款，因为选择验资户时，业务种类和产品代码已经被固定
                    pdCdList: arr.filter(opt => opt.value !== '138' && opt.value !== '145'), // 产品代码列表
                    pdCd: arr[0], // 产品代码
                })
            }
        },

        // k033 产品代码确定时，查询产品信息
        async getPdInfo(_rule, value, next) {
            // let { cstLvl, EstblshCstNoDt, identExpDt } = this.data.cstInfo
            let { currencyCcy, bsnTp } = this.data.formModel
            const res = await request.post("k033", {
                mainTranCd: this.data.mainCd,
                currencyCcy,
                // efctvyExpDt: identExpDt,
                // opnAcctDt: EstblshCstNoDt,
                // cstLvl,
                pdCd: value,
            })

            let { execRate, baseRate, acctTp, clcIntTp, intRateTp } = res
            let fltRto = ((execRate * 1000000) / (baseRate * 1000000) - 1) * 100
            let { acctCtgryTp } = this.data.formModel

            // 自动选择，根据 业务种类 是否为保证金 修改 账户类型
            if (bsnTp === '2002') {
                acctTp = currencyCcy === '01' ? 'F' : 'G'
                this.data.formModel.chrgMd = "0" // 收费方式 - 实时收取，（禁用）
            } else if (bsnTp === '2012') {
                acctTp = ""
            }

            // 验资户
            if (acctCtgryTp === '2') {
                Object.assign(this.data.formModel, {
                    acctTp: res.acctTp, // 账户类型
                    clcIntTp, // 计息类型
                    intRateTp, // 利率类型
                    baseRate, // 基础利率
                    fltRto, // 浮动比例
                    execRate, // 执行利率
                })
            } else {
                Object.assign(this.data.formModel, {
                    acctTp, // 账户类型
                    clcIntTp, // 计息类型
                    intRateTp, // 利率类型
                    baseRate, // 基础利率
                    fltRto, // 浮动比例
                    execRate, // 执行利率
                })
            }
            this.data.pdInfo = res // 保存产品数据

            // 农民工工资产品
            if (["1JY", "1JX"].includes(value)) {
                //  管控账户标志 - 必须为监管户
                this.data.formModel.mutlMgtFlg = "2"
            }

            next(true)
        },

        // 校验账户类型
        checkAcctTp(_rule, value, callback) {
            let { pdCd } = this.data.formModel

            // 财政零余额存款 && 非专用存款户
            if (pdCd === '12R' && value !== '3') {
                callback(false, '财政零余额存款账户只能开专用户')
            }

            let { acctCtgryTp } = this.data.formModel
            // 非普通户，只能选择一种账户类型 - 临时存款户 校验和不校验都一样
            // if (acctCtgryTp === '1') {
            // 一键开户只有新用户才能进行，所以无需校验开户状态
            if (!this.data.isOneStop) {
                let {
                    flgCd, // 标志位
                    bscAcctNum
                } = this.data.cstInfo
                let arr = flgCd.split('')

                //查询在本机构是否开立基本户
                if (arr[6] === '1') {
                    if (value === '1') {
                        this.data.formModel.acctTp = ""
                        return callback(false, "该客户在本机构已经开设基本户")

                    } else if (value === '2') {
                        this.data.formModel.acctTp = ""
                        return callback(false, "不能在同一个机构同时开基本户和一般户")
                    }
                }
                // 查询在全行是否已开立基本户
                if (value === '1' && bscAcctNum) {
                    this.data.formModel.acctTp = ""
                    return callback(false, "该客户已经开设基本户")
                }
                //查询是否开立一般户
                if (arr[7] === '1' && value === '1') {
                    this.data.formModel.acctTp = ""
                    return callback(false, "不能在同一个机构同时开基本户和一般户")
                }
            }

            callback(true)
        },

        // 入息账号输入完毕，请求接口
        async getAcctInfo(_rule, value, callback) {
            if (value) {
                // 查询子账户列表
                try {
                    const res = await request.post("cxcl0014", {
                        acctNo: value,
                        acctStFlg: "1", // 不返回已销户账户
                        currencyCcy: this.data.formModel.currencyCcy, // 收息账户币种与开户币种一致
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

                        this.data.formModel.inIntAcctSrlNo = selectData.inIntAcctSrlNo
                    } else {
                        return callback(false, '未找到未销户的子账户信息！')
                    }
                } catch (error) {
                    return callback(false, '查询账户信息失败！')
                }

                // K025 账户检查 查询存款账户信息
                try {
                    const res = await request.post("k025", {
                        acctNo: value, // 账号
                        acctSrlNo: this.data.formModel.inIntAcctSrlNo, // 账户序号
                        mainTranCd: this.data.mainCd,
                        // opnAcctBnkNo: "",
                    })

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
                    return callback(false, '账户检查失败')
                }
            } else {
                // 清空 账户序号
                this.data.formModel.inIntAcctSrlNo = ""
            }
            callback(true)
        },

        // 7366 查询账户性质列表
        async getAcctChrctrstcAttrList() {
            const res = await request.post("7366", {
                cstTp: '2', // 客户类型 - 公司
                inhbtAttr: this.data.cstInfo.inhbtAttrTp || '0', // 居民标志
                dmdTrmFlg: "1", // 活期定期标志 - 活期
                corprtnAcctTp: this.data.isRMB === '01' ? "2" : '1', // 对公账户类型 - 2人民币：一般户，1外币：外汇账户
            })
            const arr = this.formatSelectOptions(res, true)
            this.setData({
                acctChrctrstcAttrList: arr,
                acctChrctrstcAttr: arr[0].value // 账户性质
            })
        },



        // k053 检查柜员凭证最小号  交易成功
        // checkMinVchrNo() {
        //     request.post("k053", {
        //         vchrTp: "1",
        //         vchrFlg: "1",
        //         medmCd: "1",
        //         crdNo: "1",
        //         vchrNo: "1",

        //     })
        // },

        // k046 返回印鉴卡号的关联情况  返回 
        // checkSealCrdNo() {
        //     request.post("k046", {
        //         sealCrdNo: "",
        //         acctNo: ""
        //     })
        // },

        // 网上预约编号回车校验后触发，预约受理编号--查询对公客户预约信息，准备反显数据
        async onBookIdValidate(_rule, value, callback) {
            try {
                const res = await request.post("2129esb", {
                    bkgLsEfcyAcptNo: value
                })
                console.log('查询预约信息成功：', res);
                // 文件格式：
                // 0-统一社会信用代码|1-有无组织机构代码标志|2-申请人手机号码|3-预受理地区|4-预受理网点
                // |5-账户性质|6-存款人类别|7-开户模式|8-组织机构代码|9-账户名称|10-经济类型|11-行业分类|12-公司成立日期
                // |13-开户区域|14-目标开户网点|15-资金性质|16-账户有效期开始日期|17-账户有效期结束日期|18-办公地址是否和注册地址相同
                // |19-余额对账发送方式|20-组织机构代码证有效期开始日期|21-组织机构代码证有效期结束日期|22-机构信用代码证
                // |23-机构信用代码证有效期开始日期|24-机构信用代码证有效期结束日期|25-基本账户许可证核准号|26-开户证明文件种类1
                // |27-开户证明文件编号1|28-有效日期1开始日期|29-有效日期1结束日期|30-开户证明文件批准机关1|31-开户证明文件种类2
                // |32-开户证明文件编号2|33-有效日期2开始日期|34-有效日期2结束日期|35-注册地址|36-注册地址邮编|37-注册资金币种
                // |38-注册资金|39-税务登记证编号（国税）|40-税务登记证编号（地税）|41-税务登记证有效日期开始日期
                // |42-税务登记证有效日期结束日期|43-经营范围|44-法人类型|45-法人代表名称|46-法人代表证件种类|47-法人代表证件号码
                // |48-法人代表证件有效日期开始日期|49-法人代表证件有效日期结束日期|50-法人代表固定电话号码|51-法人代表手机
                // |52-财务负责人名称|53-财务负责人证件种类|54-财务负责人证件号码|55-财务负责人证件有效日期开始日期
                // |56-财务负责人证件有效日期结束日期|57-财务负责人固定电话号码|58-财务负责人手机|59-电子邮箱
                // |60-财务负责人同法定代表人|61-账户管理人1（大额汇划联系人）同法定代表人|62-账户管理人1名称|63-账户管理人1证件种类
                // |64-账户管理人1证件号码|65-账户管理人1证件有效日期开始日期|66-账户管理人1证件有效日期结束日期
                // |67-账户管理人1固定电话号码|68-账户管理人1手机|69-账户管理人1邮箱|70-账户管理人2（大额汇划联系人）同法定代表人
                // |71-账户管理人2名称|72-账户管理人2证件种类|73-账户管理人2证件号码|74-账户管理人2证件有效日期开始日期
                // |75-账户管理人2证件有效日期结束日期|76-账户管理人2固定电话号码|77-账户管理人2手机|78-账户管理人2邮箱
                // |79-预留印鉴中个人名章|80-是否法人亲自办理|81-授权经办人姓名|82-授权经办人证件种类|83-授权经办人证件号码
                // |84-授权经办证件有效期开始日期|85-授权经办证件有效期结束日期|86-授权经办人手机号|87-上级主管单位名称
                // |88-上级基本户开户许可号|89-上级组织机构代码|90-上级主管单位负责人名称|91-上级主管单位负责人证件类型
                // |92-上级主管单位负责人证件号码|93-上级主管单位负责人证件到期日|94-控股股东1名称|95-控股股东1证件类型
                // |96-控股股东1证件号码|97-控股股东1证件到期日|98-控股股东2名称|99-办公地址|100-是否意愿核实|101-影像ID
                // |102-账户名称|103-申请人姓名|104-地区编码|105-开户银行代码|106-开户银行名称|107-营业执照正本
                // |108-法定代表人证件正面|109-法定代表人证件背面|100-基本开户许可证
                const { fileData } = res

                if (fileData) {
                    const arr = fileData.split("\n");
                    if (arr.length) { // 最少有一条数据，多条时只取第一条
                        const data = arr[0].split("|");
                        // 3种账户类别通用的表单字段在此反显
                        Object.assign(this.data.formModel, {
                            entpTp: data[6], // 存款人类别
                            name1: data[62], // 账户管理人1名称
                            phone11: data[68], // 账户管理人1手机
                            name2: data[71], // 账户管理人2名称
                            phone21: data[77], // 账户管理人2手机
                            aprvNo: data[25], // 基本账户许可证核准号
                            checkAgree: data[100], // 是否意愿核实
                        })

                        this.setData({
                            // 只取本页面需要使用的字段
                            bookInfo: {
                                depstrCtgry: data[6], // 存款人类别
                                acctAdmn1Nm: data[62], // 账户管理人1名称
                                acctAdmnMbl1No: data[68], // 账户管理人1手机
                                acctAdmn2Nm: data[71], // 账户管理人2名称
                                acctAdmnMbl2No: data[77], // 账户管理人2手机
                                bscAcctPrmtAprvNo: data[25], // 基本账户许可证核准号
                                unifdSoclCrdtCd: data[0], // 统一社会信用代码
                                orgInstCdFlg: data[1], // 有无组织机构代码标志
                                orgInstCd: data[8], // 组织机构代码
                                opnAcctWishVfctn: data[100], // 是否意愿核实
                                acctNm: data[9], // 账户名称
                                acctChrctrstcAttr: data[5], // 账户性质
                                rgstrtnFndCcy: data[37], // 注册资金币种
                                // 以下为一键开户需要使用的字段
                                lglPrsnRprsMbl: data[51], // 法人代表手机
                            },
                        })

                        // 有无组织机构代码标志
                        if (data[1] === 'N') {
                            // 没有，使用营执号 
                            this.data.formModel.identTp = 'A';
                            this.data.formModel.identNo = data[0]; // 统一社会信用代码
                        } else {
                            this.data.formModel.identTp = '8';
                            this.data.formModel.identNo = data[8];  // 组织机构代码
                        }

                        if (data[100] === 'Y') {
                            // TODO 如果意愿核实，询问是否需要下载客户核实视频
                        }
                        return callback(true);
                    }
                }
                throw { chnlMsgInfo: "未查询到预约信息" };
            } catch (error) {
                callback(false, error.chnlMsgInfo);
            }
        },

        // 执行利率确定时
        onExecRateValidate(_rule, value, callback) {
            const { fltLwrLmtRto, fltUprLmtRto } = this.data.pdInfo
            const { intRateTp, baseRate } = this.data.formModel
            // 不是议价利率，不计算
            if (intRateTp !== '1') return callback(true)

            // 计算浮动比例
            let fltRto = ((value * 1000000) / (baseRate * 1000000) - 1)

            if (value) {
                let alert
                if (fltRto > fltUprLmtRto) {
                    alert = `大于利率最高浮动比例【${fltUprLmtRto * 100}%】`
                }
                if (fltRto < -fltLwrLmtRto) {
                    alert = `小于利率最低浮动比例【${-fltLwrLmtRto * 100}%】`
                }
                if (alert) {
                    this.data.formModel.execRate = ""
                    callback(false, alert)
                } else {
                    this.data.formModel.fltRto = fltRto * 100
                    callback(true)
                }
            }
        },

        // 身份证号输入框调取设备事件
        handleUseEquip(event) {
            console.log('身份证号输入框调取设备事件');
        },

        // 校验4个联系人电话
        noRepeatMobile(_rule, _value, callback) {
            const { phone11, phone12, phone21, phone22 } = this.data.formModel
            const arr = [phone11, phone12, phone21, phone22].filter(value => !!value)

            if (arr.length !== new Set(arr).size) {
                return callback(false, '联系人电话不能重复')
            }
            callback(true)
        },

        // 联网核查结果
        onOnlinecheck(data) {
            const { checkCode, checkData } = data
            if (checkCode === 0) {
                // 保存联网核查结果
                Object.assign(this.data.onlinecheckData, checkData, { checkCode })

                // 反显数据
                const { checkNo, checkName } = checkData
                const { identNo1, identNo2 } = this.data.formModel
                // 如果联网核查的是联系人1
                if (identNo1 === checkNo) {
                    this.data.formModel.name1 = checkName
                }
                // 如果联网核查的是联系人2 
                else if (identNo2 === checkNo) {
                    this.data.formModel.name2 = checkName
                }
            }
        },

        async validateOnlinecheckResult(type, value, callback) {
            const cache = this.data.onlinecheckData;

            // 上一次联网核查后，是否变更过身份证号
            if (cache.checkNo === value) {
                if (cache.checkCode === 0) {
                    // 联网核查已通过
                    return callback(true);
                }
            }

            if (type === '1') {
                // 打开联网核查接口
                this.setData({
                    onlinecheckData: {
                        visible: true, // 联网核查开关
                        checkNo: value, // 核查号码
                    }
                })
            } else {
                callback(true)
            }
        },
        onValidatePersonIdCardNo(_rule, value, callback) {
            if (value) {
                this.validateOnlinecheckResult(this.data.formModel.identTp1, value, callback)
            } else {
                Object.assign(this.data.formModel, {
                    name1: "",
                    phone11: "",
                    phone12: "",
                })
            }
        },
        onValidatePersonIdCardNo2(_rule, value, callback) {
            if (value) {
                const { identNo1 } = this.data.formModel
                if (identNo1 === value) {
                    return callback(false, "证件号码重复,请重新输入")
                }
                this.validateOnlinecheckResult(this.data.formModel.identTp2, value, callback)
            } else {
                Object.assign(this.data.formModel, {
                    name2: "",
                    phone21: "",
                    phone22: "",
                })
            }
        },
        onCompanyNumEquip(event) {
            console.log("onCompanyNumEquip", event);
            this.data.formModel.cptlIdentNo = event
        },

        clearAcct() {
            Object.assign(this.data.formModel, {
                cptlIdentTp: "",
                cptlIdentNo: "",
                identTp: "",
                identNo: "",
                acctNm: "",
            })
        },

        // 跳转至 创建客户号
        async jumpToCreateCustomerPage() {
            if (this.data.isOneStop) {
                commonApi.jumpMiniprog("010101", {
                    // url参数
                    isJumpDeal: "1",
                }, (res) => {
                    if (!this.data.hasBindCallback) {
                        // TODO 不确定是否有 nt.off ，可能造成多次绑定和重复触发的问题
                        nt.off && nt.off("business-create-customer-done")
                        nt.on("business-create-customer-done", (formData) => {
                            console.log("创立客户号，消息总线回调信息：", formData);
                            if (formData) {
                                this.setData({
                                    hasWrittenCstInfo: true, // 标记已填写过客户信息
                                    cstInfo: {
                                        ...formData,
                                        ...formData.fileDataMap, // 把fileDataMap的数据摊平，与k018返回的数据字段一致
                                    },
                                })
                                // 保存 原始数据 在 session 再次打开时可反显
                                sessionStorage.setItem("businessCstInfo", JSON.stringify(formData))
                            }
                        });
                        this.setData({
                            hasBindCallback: true,
                        })
                        console.log("消息总线回调已绑定");
                    }
                });
            } else {
                commonApi.jumpMiniprog("010101", { isJumpDeal: "3" });
            }
        },
    },
})
