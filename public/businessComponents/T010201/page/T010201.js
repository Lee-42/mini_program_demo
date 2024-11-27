// import coreRequest from '../../mypublic/coreRequest/api.js'
import common from '../../../common'
import request from '../../../utils/request.js'
import utils from '../../../utils/utils'
import changeIdentityType, { TYPE_ZH_MAP as identTpZhMap } from '../../../common/functions/changeIdentityType'
import CheckAccountInfo from '../../../common/functions/checkAccount'
import { getUKType, getUKNo } from "../../../common/functions/UKHead"
import commonApi from "../../../common/commonApi";

const DEFAULT_SERVICE_NAME = "客户服务";

Component({
    properties: {
        mainCd: {
            type: String,
            default: "2003", // 主交易码
        },
        isOneStop: {
            type: Boolean,
            default: false, // 是否 一键开户模式
        },
        isEdit: {
            type: Boolean,
            default: false, // 是否签约变更模式，优先级低于 一键开户模式
        },
        showClean: Boolean, // 是否显示清空按钮
    },
    data: {
        paymentParams: {
            cstNo: null, // 客户号
        }, // 收费数据
        reqParams: {}, // 提交数据
        localPrintData: {
            aplyDt: null, // 变更时 打印申请日期
            sgntrBnkNm: null, // 变更时 打印签约行名称
            prdStr: null, // 开通网银业务
            operationPrintTable: [], // 操作员信息
            acPrintTable: [], // 加挂账号列表
            changedAcPrintTable: [], // 变更时 加挂账号变更信息
        },
        userInfo: {}, // 柜员信息
        // cstInfo: {}, // 客户信息数据
        dialogVisible: false,
        dialogFormType: null, // 弹窗表单类型
        operationFlag: null, // C-增 R-查 U-更 D-删

        // - 搜索条件
        formModel: {
            eleCstNo: "", // 电子银行客户号
            acctNo: "", // 银行账号
            acctSrlNo: "", // 账户序号
            acctNm: "", // 账户名称
            identTp: "", // 证件类型
            identNo: "", // 证件号码
            cstRiskLevel: "", // 风险等级
            // },
            // formModel: {
            ctcPrsnIdentTp: "", // 证件类型
            ctcPrsnIdentNo: "", // 证件号码
            ctcPrsnNm: "", // 姓名
            ctcPrsnMblNo: "", // 手机号
            ctcPrsnTelNo: "", // 电话
            ctcPrsnEmail: "", // Email地址
            // - 业务开通信息
            mgtTpTranTkEffMd: "", // 管理类交易生效模式
            tfrAcctPyeRstd: "", // 转账收款人限制
            dsbrPltfmMrchNo: "", // 商户号(支付平台)
            mrchNo: "", // 商户号(其他平台)
            // - 客户经理
            cstMgrNm1: "", // 客户经理1姓名
            cstMgrWrkNo: "", // 客户经理1工号
            recomPrsnNm: "", // 客户经理2姓名
            recomPrsnWrkNo: "", // 客户经理2工号
            // - 隐藏的数据
            prntCoCstNo: "", // 母公司客户号
            coreSeq: "", // 核心客户号
            clientName: "", // 主账户客户名称
            addMrchNoFlg: "0", // 是否添加商户号 1-添加   0-不添加
            // - 一键开户专有变量
            vchrTp: "", // 凭证类型
            // SellCalculator 组件变量（出售信息）
            cashTfrAcctFlg: "", // 现转标志
            count: 0, // 凭证数量
            costOfPdnAmt: "", // 工本费
            pcdFeeAmt: "", // 手续费
            allCostOfPdnAmt: "", // 总工本费
            allPcdFeeAmt: "", // 总手续费
        },
        // 此表单用于存放一键开户时的账户数据，无法从接口获取
        extendModel: {
            acctTp: "", // 账户类型
            currencyCcy: "", // 币种
            cashDrftFlg: "", // 钞汇标志
            smtOpnAcct: "", // 是否简易开户
            bsnTp: "", // 业务种类
        },
        // 账号查询 table
        accountFilterConfig: [],
        acListFilterConfig: [],
        operationFilterConfig: [],
        accountTableConfigs: [
            // { prop: "onlyIndSrlNo", label: "唯一标识序号" },
            { prop: "cstNo", label: "银行客户号", attrs: { width: "130" } },
            // { prop: "MdulNo", label: "模块id" },
            { prop: "cstNm", label: "客户名称" },
            // { prop: "entpNmPhntNm", label: "名称拼音" },
            {
                prop: "cnlSt", label: "渠道状态", attrs: { width: "120" }, options: {
                    "N": "正常",
                    "C": "注销",
                    "P": "潜在",
                    "L": "锁定",
                    "F": "冻结",
                }
            },
            { prop: "identTp", label: "证件类型", attrs: { width: "120" }, options: { ...identTpZhMap } },
            { prop: "lglPrsnCstNo", label: "证件号码" },
            // { prop: "cnlNo", label: "渠道号" },
            { prop: "lglPrsnNm", label: "法人姓名", attrs: { width: "120" } },
            { prop: "lglPrsnTelNo", label: "法人电话", attrs: { width: "150" } },
            { prop: "mainAcctNo", label: "主账号" },
            { prop: "entpCtcTel", label: "企业联系电话", attrs: { width: "150" } },
            { prop: "coreCstNo", label: "核心客户号", attrs: { width: "130" } },
        ],
        prdListTableConfigs: [
            { prop: "svcFcnNm", label: "服务功能名称" },
            // { prop: "cnlNo", label: "渠道号" },
            // { prop: "instNm", label: "机构名称" },
            // { prop: "brchNo", label: "机构号" },
        ],
        acListTableConfigs: [
            { prop: "acctNo", label: "账号" }, // 一键开户是没有账号的
            // { prop: "acctSrlNo", label: "账户序号" },
            { prop: "acctNm", label: "户名" },
            { prop: "brchNo", label: "开户网点" },
            // { prop: "acctTp", label: "账户类型" },
            // { prop: "tlr_no", label: "账户性质" },
            { prop: "adHngDt", label: "上挂日期" },
            // { prop: "currencyCcy", label: "币种" },
            // { prop: "cashDrftFlg", label: "钞汇标志" },
            // { prop: "mainAcctFlg", label: "是否主账户" },
            // { prop: "tlr_no", label: "交换号" },
            // { prop: "acctBlngMainInd", label: "账户属主标识" },
            // { prop: "acctPrvgCd", label: "账号权限" },
            { prop: "tfrAcctDayAcmRstdLmt", label: "日累计限额" },
            { prop: "snglTfrAcctRstdLmt", label: "单笔限额" },
            { prop: "tfrAcctYrAcmRstdLmt", label: "年累计限额" },
            { prop: "tfrAcctSnglDayLineNum", label: "日笔数" },
            // { prop: "limitPerMon", label: "月累计限额" },
        ],
        operationTableConfigs: [
            { prop: "operationNo", label: "操作员号", attrs: { width: "120" } },
            { prop: "operationName", label: "操作员名称", attrs: { width: "130" } },
            // { prop: "tlr_no", label: "新密码" },
            // { prop: "tlr_no", label: "旧密码" },
            { prop: "identTp", label: "证件类型", attrs: { width: "120" }, options: { ...identTpZhMap } },
            { prop: "identNo", label: "证件号码", attrs: { width: "180" } },
            // { prop: "gender", label: "性别" },
            { prop: "telphone", label: "联系电话", attrs: { width: "130" } },
            { prop: "mobile", label: "手机号", attrs: { width: "130" } },
            { prop: "email", label: "Email地址", attrs: { width: "180" } },
            {
                prop: "isAdmin", label: "是否管理员", attrs: { width: "130" }, options: {
                    "Y": "是",
                    "N": "否",
                }
            },
            // { prop: "tlr_no", label: "授权级别" },
            // // 以下属性只有 一键开户时 才会存在
            // { prop: "ctfAplyDt", label: "证书申请日期" },
            // { prop: "usbKeyNo", label: "椰盾编号" },
            // { prop: "rsetPswdFlg", label: "是否重置登录密码" },
            // { prop: "remarkRmk", label: "备注" },
            // { prop: "vchrTp", label: "凭证类型" }, // 隐藏属性，用于标记该条操作员的凭证类型，用于校验，不参与任何接口入参
        ],
        accountTableData: [], // 账户列表
        prdListTableData: [], // 网银业务
        acListTableData: [], // 上挂账号
        operationTableData: [], // 操作员信息

        roleList: [], // 保存角色列表数据
        selectionPrdList: [], // 开通业务/产品列表 已选数据

        // 限额类型列表
        cstRiskLevelList: [
            { value: '0', label: "未分级", },
            { value: '1', label: "低", },
            { value: '2', label: "中" },
            { value: '3', label: "高" },
        ],
        accountTypeList: [],
        idTypeList: [],
        pdCdList: [], // 保证金产品列表
        currencyOptions: [], // 币种映射

        // 临时变量
        cacheIdentNo: null, // 临时储存证件号，与输入的证件号比对
        acctList: [], // 变更时，临时储存的 账号列表
        oldAcList: [], // 变更时，临时保存 原已开通服务
        editPrintData: {}, // 变更时，打印“加挂账号变更信息”
        oldAcRowData: {}, // 变更时，保存旧加挂数据

        // 凭证类数据
        myUKey: [], // 柜员可以绑定的椰盾编号数组
    },
    computed: {
        // 开通上挂账号账号权限
        onlyQuery() {
            const { smtOpnAcct, bsnTp } = this.data.extendModel
            // 一键开户时，简易开户 或者 保证金 账户，上挂账号仅能选择“仅开通查询”
            return this.data.isOneStop && (smtOpnAcct === "1" || bsnTp === "2002")
        },
    },
    observers: {
    },

    async ready() {
        let userInfo = JSON.parse(localStorage.getItem('userInfo') || "{}")
        this.setData({ userInfo })

        this.getSelectOptionsByK042()

        window.strictMode = true

        // 一键开户时，无法查询账户，角色列表在此处查询
        if (this.data.isOneStop) {
            await this.initProductTableList()
            await this.initRoleTableList()

            setTimeout(() => {
                // 控制焦点
                const input = document.querySelector("[myautofocus=one-stop-signing] select")
                if (input) {
                    input.focus()
                }
            }, 1000);
        }
    },

    methods: {

        // 查询k042接口返回的选项列表
        async getSelectOptionsByK042() {
            const mainCd = this.data.mainCd
            await utils.getSelectData({ mainCd, flg: 'C003', name: 'accountTypeList', that: this }) // 证件类型
            await utils.getSelectData({ mainCd, flg: 'C004', name: 'idTypeList', that: this }) // 证件类型
            await utils.getSelectData({ mainCd, flg: 'CUR_SIGN', name: "currencyOptions", that: this }) // 币种
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

        // 作为组件使用时，不自动触发提交行为
        async onSubmit() {
            const pass = await this.beforeSubmit()
            if (pass) {
                const formModel = this.data.formModel
                this.$emit("submit", {
                    ...this.data.reqParams,
                    cashTfrAcctFlg: formModel.cashTfrAcctFlg, // 现转标志
                    costOfPdnAmt: formModel.costOfPdnAmt, // 工本费
                    pcdFeeAmt: formModel.pcdFeeAmt, // 手续费
                    vchrTp: formModel.vchrTp, // 凭证类型
                    localPrintData: JSON.parse(JSON.stringify(this.data.localPrintData)),
                    isOk: true,
                })
            }
        },

        // 作为页面使用时，直接提交
        async beforeSubmit() {
            if (!this.checkUploadAccount()) return false
            const { isEdit } = this.data

            // 开通网银业务数据处理
            const prdList = [...this.data.selectionPrdList]
            let defualtService = false // 是否勾选了【客户服务功能】

            for (let index = 0; index < prdList.length; index++) {
                const prd = prdList[index];
                if (prd.svcFcnNm === DEFAULT_SERVICE_NAME) {
                    defualtService = true
                } else if (["结售汇", "挂单结售汇"].includes(prd.svcFcnNm)) {
                    const { retCd, retMsg } = await new Promise(resolve => {
                        nt.showMessagebox(`客户是否已阅读签署电子渠道${prd.svcFcnNm}协议`, "提示消息", {
                            type: 'info',
                            showCancelButton: true,
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                            beforeClose: (action, _instance, done) => {
                                if (action === 'confirm') {
                                    resolve({ retCd: true })
                                } else {
                                    resolve({ retCd: false, retMsg: `请客户阅读并签署电子渠道${prd.svcFcnNm}协议` })
                                }
                                done()
                            }
                        })
                    })
                    if (!retCd) {
                        nt.showMessagebox(retMsg, "提示消息", {
                            type: 'error',
                        })
                        return false
                    }
                }
            }

            // 检查客户是否勾选了【客户服务功能】,如果没有勾选的，后台强制勾选
            if (!defualtService) {
                prdList.push({ svcFcnNm: DEFAULT_SERVICE_NAME })
            }
            // 拼接产品数据 fileData
            // let strPrdsetList =
            //    "BeginPrdsetList\n" + prdList.map(row => row.svcFcnNm).join("|\n") + "|\nEndPrdsetList\n" // 最后一行数据补上分隔符号

            const operationList = this.data.operationTableData
            // 变更时，没有操作员数据，所以也不需要检查
            if (!isEdit) {
                if (!operationList.length) {
                    nt.showMessagebox("至少需要申请1个管理员！", "交易拒绝", {
                        type: 'error',
                    })
                    return false
                } else {
                    // 管理类交易生效模式 为 【一记一复】时，需要至少需要两个管理员
                    if (this.data.formModel.mgtTpTranTkEffMd === "D") {
                        const len = operationList.filter(row => !!row.isAdmin).length
                        if (len < 2) {
                            nt.showMessagebox("管理类交易生效模式为【一记一复】时,至少需要申请2个管理员！", "交易拒绝", {
                                type: 'error',
                            })
                            return false
                        }
                    }
                }
            } else {
                await new Promise(resolve => {
                    nt.showMessagebox("若有新增上挂账号，请到操作员维护及审核流程配置中对新增账号进行维护。", "温馨提示", {
                        type: 'info',
                        confirmButtonText: '知道了',
                        beforeClose: (_, __, done) => {
                            done();
                            resolve();
                        }
                    })
                })
            }

            // 参数处理
            const { identTp: acctIdentTp, identNo: acctIdentNo } = this.data.formModel
            const { coreSeq, eleCstNo, prntCoCstNo, clientName,
                tfrAcctPyeRstd, mgtTpTranTkEffMd, ctcPrsnNm, ctcPrsnTelNo, ctcPrsnMblNo, ctcPrsnEmail,
                ctcPrsnIdentTp, ctcPrsnIdentNo, cstMgrNm1, cstMgrWrkNo, recomPrsnNm, recomPrsnWrkNo,
                addMrchNoFlg, mrchNo, dsbrPltfmMrchNo
            } = this.data.formModel

            const params = {
                // -----固定入参-----
                sgntrCnl: "EIBS", // 签约渠道 EIBS - 企业网银
                identTp: changeIdentityType(acctIdentTp), // 证件类型
                identNo: acctIdentNo, // 证件号码
                coreCstNo: coreSeq, // 核心客户号
                eleCstNo: eleCstNo, // 电子银行客户号
                prntCoCstNo: prntCoCstNo, // 母公司客户号
                eleBnkCstNm: clientName, // 电子银行客户名称
                tfrAcctPyeRstd, // 转账收款人限制
                mgtTpTranTkEffMd, // 管理类交易生效模式
                ctcPrsnNm, // 联系人姓名
                ctcPrsnTelNo, // 联系人电话
                ctcPrsnMblNo, // 联系人手机
                ctcPrsnEmail, // 联系人Email地址
                ctcPrsnRltnpCd: "C", // 联系人关系
                ctcPrsnIdentTp: changeIdentityType(ctcPrsnIdentTp), // 联系人证件类型
                ctcPrsnIdentNo, // 联系人证件号码
                cstMgrNm1, // 客户经理姓名
                cstMgrWrkNo, // 客户经理工号
                recomPrsnNm, // 推荐人姓名
                recomPrsnWrkNo, // 推荐人工号
                cnterPswdOprtnInd: "1", // 柜面密码操作标识 - 柜面使用，默认1，当为1时Pwd和OldPwd为非必输
                addMrchNoFlg, // 是否添加商户号

                // -----条件入参-----
                mrchNo: "", // 商户号
                dsbrPltfmMrchNo: "", // 支付平台商户号

                // 文件数据
                fileDataMap: {},
            }

            // 企业网银变更时，参数稍微有些不一致
            if (isEdit) {
                params.eleCstNo = prntCoCstNo
                params.prntCoCstNo = undefined
            }

            if (params.addMrchNoFlg === "1") {
                params.mrchNo = mrchNo
                params.dsbrPltfmMrchNo = dsbrPltfmMrchNo
            }

            // ======================================== 处理列表数据 ========================================
            // 开通渠道服务功能列表信息
            params.fileDataMap.prdsetList = prdList.map(p => ({ svcFcnNm: p.svcFcnNm }))
            // 上挂账号列表信息
            params.fileDataMap.acList = this.data.acListTableData.map(ac => ({
                acctNo: utils.splitOrMerge({ acctNo: ac.acctNo, acctSrlNo: ac.acctSrlNo }), // 账号
                acctNm: ac.acctNm, // 户名
                opnAcctOtlts: ac.brchNo, // 开户网点
                acctTp: ac.bankAcType, // 账户类型
                acctChrctrstcAttr: ac.bnkAcctChrctrstcAttr, // 账户性质
                upHngDt: ac.adHngDt, // 上挂日期
                currencyCcy: utils.transformLabelByValue(ac.currencyCcy, this.data.currencyOptions, true), // 币种
                cashDrftFlg: utils.transformLabelByValue(ac.cashDrftFlg, [
                    { label: "R", value: "1" }, // 汇
                    { label: "C", value: "0" }, // 钞
                ]), // 钞汇标志 - transformLabelByValue 不仅仅可以用来转换成中文
                entpMainAcctNoFlg: ac.mainAcctFlg, // 企业主账号标志
                swtchNo: ac.swtchNo, // 交换号
                acctBlngMainInd: ac.acctBlngMainInd, // 账户属主标识
                acctNoPrvgCd: ac.acctPrvgCd, // 账号权限
                dayAcmRstdLmt: ac.tfrAcctDayAcmRstdLmt, // 日累计限额
                daySnglRstdLmt: ac.snglTfrAcctRstdLmt, // 日单笔限额
                yrAcmRstdLmt: ac.tfrAcctYrAcmRstdLmt, // 年累计限额
                dayLineNum: ac.tfrAcctSnglDayLineNum + '', // 日笔数
                moAcmRstdLmt: ac.limitPerMon, // 月累计限额
            }))
            // 操作员信息处理
            if (!isEdit) {
                params.fileDataMap.userList = [] // 操作员信息列表
                params.fileDataMap.roleList = [] // 操作员所属角色列表
                params.fileDataMap.userAcList = [] // 操作员可操作账户列表
                for (let index = 0; index < operationList.length; index++) {
                    const op = operationList[index];
                    params.fileDataMap.userList.push(Object.assign({
                        srlNo: op.seqNo + '', // 序号
                        oprNo: op.operationNo, // 操作员号
                        oprNm: op.operationName, // 操作员名称
                        pswd: "", // 密码
                        oldPswd: "", // 旧密码
                        identTp: changeIdentityType(op.identTp), // 证件类型
                        identNo: op.identNo, // 证件号码
                        gndTp: op.gender, // 性别
                        ctcTel: op.telphone, // 联系电话
                        mblNo: op.mobile, // 手机号
                        emailAdr: op.email, // Email地址
                        admnFlg: op.isAdmin, // 是否管理员
                        authLvl: "", // 授权级别
                    }, this.data.isOneStop ? {
                        remarkRmk: op.remarkRmk, // 备注
                        usbKeyNo: op.usbKeyNo, // 椰盾编号
                        ctfAplyDt: op.ctfAplyDt, // 证书申请日期
                        rsetPswdFlg: op.rsetPswdFlg, // 是否重置登录密码
                    } : {}))
                    if (op.roleListTableData) {
                        params.fileDataMap.roleList.push(...op.roleListTableData.map(role => ({
                            srlNo: op.seqNo + '', // 序号
                            tlrNo: role.rlNo, // 角色id
                            tlrNm: role.rlNm, // 角色名
                        })))
                    }
                    if (op.accountSelection) {
                        params.fileDataMap.userAcList.push(...op.accountSelection.map(ac => ({
                            srlNo: op.seqNo + '', // 序号
                            acctNo: ac.acctNo,  // 账号                     
                        })))
                    }
                }
            }

            // ======================================== 处理打印数据 ========================================
            const printData = this.composePrintData(params)
            params.printData = printData

            const YN_MAP = { "1": "是", "0": "否" }
            const PRVG_MAP = { "FT": "任意转出", "Q": "仅开通查询" }
            // 处理本地拓展打印数据，不需要服务端填写的部分
            const localPrintData = {
                ...this.data.localPrintData,
                prdStr: prdList.map(prd => prd.svcFcnNm).join(","),
                operationPrintTable: operationList.map(op => ({
                    oprNo: op.operationNo, // 操作员号
                    oprNm: op.operationName, // 操作员名称
                    identTp: utils.transformLabelByValue(op.identTp, this.data.idTypeList), // 证件类型
                    identNo: op.identNo, // 证件号码
                    mblNo: op.mobile, // 手机号
                    roles: op.roleListTableData.map(role => role.rlNm).join(","),
                    accounts: op.accountSelection.map(ac => ac.acctNo).join(","),
                })),
                acPrintTable: this.data.acListTableData.map(ac => ({
                    acctNo: ac.acctNo, // 账号
                    entpMainAcctNoFlg: YN_MAP[ac.mainAcctFlg], // 企业主账号标志
                    acctNoPrvgCd: PRVG_MAP[ac.acctPrvgCd], // 账号权限
                    daySnglRstdLmt: ac.snglTfrAcctRstdLmt, // 日单笔限额
                    dayAcmRstdLmt: ac.tfrAcctDayAcmRstdLmt, // 日累计限额
                    yrAcmRstdLmt: ac.tfrAcctYrAcmRstdLmt, // 年累计限额
                    dayLineNum: ac.tfrAcctSnglDayLineNum, // 日笔数
                    upHngDt: ac.adHngDt, // 上挂日期
                }))
            }

            if (this.data.isEdit) {
                // 对比新旧产品列表，不一致的话打印的文案需要修改
                if (!this.isArrayLike(this.data.oldAcList, prdList)) {
                    localPrintData.prdStr = `原[${this.data.oldAcList.map(prd => prd.svcFcnNm).join(",")}] 现 [${localPrintData.prdStr}]`
                }
                for (const AccountNo in this.data.editPrintData) {
                    if (Object.hasOwnProperty.call(this.data.editPrintData, AccountNo)) {
                        const changesDataList = this.data.editPrintData[AccountNo];
                        changesDataList.forEach(data => {
                            localPrintData.changedAcPrintTable.push({
                                acctNo: AccountNo,
                                property: data.property,
                                info: data.info,
                            })
                        })
                    }
                }
            }

            // 默认功能文字修改
            localPrintData.prdStr = localPrintData.prdStr.replaceAll(
                DEFAULT_SERVICE_NAME,
                `${DEFAULT_SERVICE_NAME}[默认开通功能]`
            )

            console.log("变更打印：", localPrintData);

            this.setData({
                localPrintData: localPrintData,
            })

            // 更新参数
            this.setData({
                reqParams: params,
                paymentParams: {
                    cstNo: params.eleCstNo,
                }
            })

            return true // 一定要返回 true 让提交组件继续
        },

        // 提交完成后
        afterSubmit() {
            nt.showMessagebox("交易完成，是否前往审核流程配置（010205）？", "提 示", {
                type: 'success',
                showCancelButton: true,
                confirmButtonText: '前往',
                cancelButtonText: "关闭",
                beforeClose: (action, _, done) => {
                    if (action === "confirm") {
                        commonApi.jumpMiniprog("010205");
                    } else {
                        commonApi.closeMiniprog(localStorage.getItem("tranCd"));
                    }
                    done();
                }
            })
        },

        // 组装打印数据
        composePrintData(params) {
            const printData = {
                // 待服务器回填参数
                tranBrchNm: "",
                busiNm: "",
                tranCd: localStorage.getItem("tranCd"),
                flowNo: "",
                coreSeqNo: "",
                tlrNo: "",
                tlrSeqNo: "",
                // 表单数据
                coreCstNo: params.coreCstNo,
                eleCstNo: params.eleCstNo,
                identTp: utils.transformLabelByValue(params.identTp, this.data.accountTypeList), // 企业证件类型
                identNo: params.identNo,
                eleBnkCstNm: params.eleBnkCstNm,
                ctcPrsnNm: params.ctcPrsnNm,
                ctcPrsnIdentTp: utils.transformLabelByValue(params.ctcPrsnIdentTp, this.data.idTypeList), // 个人证件类型
                ctcPrsnIdentNo: params.ctcPrsnIdentNo,
                ctcPrsnMblNo: params.ctcPrsnMblNo,
                ctcPrsnTelNo: params.ctcPrsnTelNo,
                ctcPrsnEmail: params.ctcPrsnEmail,
                cstMgrNm1: params.cstMgrNm1,
                cstMgrWrkNo: params.cstMgrWrkNo,
                recomPrsnNm: params.recomPrsnNm,
                recomPrsnWrkNo: params.recomPrsnWrkNo,
                mgtTpTranTkEffMd: utils.transformLabelByValue(params.mgtTpTranTkEffMd, [{ label: "一记一复", value: "D" }, { label: "单人通过", value: "S" },]),
                dsbrPltfmMrchNo: params.dsbrPltfmMrchNo,
                tfrAcctPyeRstd: params.tfrAcctPyeRstd === "O" ? "开放式" : "",
                mrchNo: params.mrchNo,
            }

            return printData
        },

        // k025 通过帐号 查询帐号信息
        async onAccountValidate(_rule, value, callback) {
            // 先清空
            Object.assign(this.data.formModel, {
                acctSrlNo: "",
                acctNm: "",
                identTp: "",
                identNo: "",
            })

            const { isEdit } = this.data
            try {
                const res = await request.post('k025', {
                    acctNo: value,
                    mainTranCd: this.data.mainCd,
                })

                const {
                    cstTp, // 客户类型 - 1个人2公司
                    exnFlgCd, // 标志位
                    pdTp, // 产品类型
                    identNo, // 证件号码
                } = res
                if (cstTp !== "2") {
                    return callback(false, "请输入对公账户！")
                }

                // 海南银行单位账户分类分级管理业务需求
                this.data.formModel.cstRiskLevel = exnFlgCd[10]

                // 变更时，只查询账户号是否正确，不走其他逻辑
                if (isEdit) return callback(true)

                this.setData({
                    cacheIdentNo: identNo.trim()
                })


                // 贷款户/共管户/定期/保证金产品  提示
                let accountType = []

                if (pdTp === '3') {
                    // TODO 如果是贷款账号，需要调用【贷款账户信息检查接口检查贷款账户状态】
                    // CXCL-0022   贷款账号列表查询
                    // const res = await request.post('CXCL-0022', {
                    //     acctNo: value,
                    // })

                    // TODO K015 贷款账户信息
                    const res = await request.post('k015', {
                        // acctNo: value,
                        // acctSrlNo: acctSrlNo,
                        // mainTranCd: this.data.mainCd
                    })

                    // Object.assign(this.data.formModel, {
                    //     acctNm: acctNm,
                    //     identTp: acctIdentTp,
                    //     identNo: identNo,
                    // })
                } else {
                    // 非贷款账号
                    // CXCL-1014 查询账户列表(包含一户通二级账户)
                    const childAccountRes = await request.post('cxcl1014', {
                        acctNo: value,
                        acctStFlg: "1", // 账户状态标志 1:不返回已销户账户  空值:返回所有账户
                        acctTp: "", // 账户类型 空值返回所有活期、定期子账户 
                        cntnDepFlg: "", // 续存标志 空值:不可以
                        mainTranCd: this.data.mainCd,
                        listCd: "1014"
                    })
                    // 选择子账户序号
                    const { fileDataList } = childAccountRes
                    if (!fileDataList.length) return callback(false, "没有可选的账号信息")
                    const heads = ["账户序号", "开户日期", "产品名称", "账户状态", "冻结状态", "止付状态"]
                    fileDataList.shift(); // 除掉第一行的header
                    const listData = fileDataList.map(data => {
                        const { acctSrlNo, opnAcctDt, pdNm, acctTp, frzSt, fbdPymtSt } = data
                        return [acctSrlNo, opnAcctDt, pdNm, acctTp, frzSt, fbdPymtSt]
                    })
                    const [acctSrlNo] = await new Promise(resolve => {
                        common.popTable({
                            heads,
                            datas: listData,
                        }, (selected) => {
                            resolve(selected)
                        })
                    })

                    this.data.formModel.acctSrlNo = acctSrlNo

                    // K025 再次查询账户信息，检查非贷款账户信息
                    const res = await request.post('k025', {
                        acctNo: value,
                        acctSrlNo: acctSrlNo,
                        mainTranCd: this.data.mainCd
                    })
                    const {
                        cstTp, // 客户类型 - 1个人2公司
                        acctSt, // 账户状态
                        acctNm, // 账户名称
                        acctIdentTp, // 账户证件类型
                        identNo, // 账户证件号码
                        medmOtherSt, // 介质扩展状态
                        pdTp, // 产品类型
                        pdNo, // 产品号
                    } = res
                    // 再次检查是否对公账户
                    if (cstTp !== '2') {
                        return callback(false, "请输入对公账户！")
                    }
                    // 账户状态不是 正常 或者 开户待确认允许进行此交易
                    if (acctSt !== '1' && acctSt !== '0') {
                        return callback(false, "账户状态不正常！")
                    }

                    Object.assign(this.data.formModel, {
                        acctNm: acctNm.trim(),
                        identTp: acctIdentTp,
                        identNo: identNo.trim(),
                    })

                    // 共管户/定期/保证金产品  增加提示信息
                    if (medmOtherSt[3] === '1') {
                        // 共管户
                        accountType.push("共管户")
                    }
                    if (pdTp === '2') {
                        // 定期账户
                        accountType.push("定期")
                    }

                    // 查询保证金产品列表，收息户不能是保证金类型的
                    // const map = await utils.getSelectData({ mainCd: this.data.mainCd, flg: 'A008' })
                    // if (Reflect.has(map, pdNo)) {
                    //     accountType.push("保证金产品")
                    // }
                    const prdResponse = await request.post('k042', {
                        listCd: 'A008', // 列表编码（标识）
                        bckCd: 'K042', // 备用代码（主交易代码）
                        tranCd: 'K042',
                        mainTranCd: this.data.mainCd,
                    })
                    if (prdResponse.fileData) {
                        const arr = prdResponse.fileData.split(",")
                        if (arr.some(pNo => pNo.includes(pdNo))) {
                            accountType.push("保证金产品")
                        }
                    }
                }

                // 提醒
                if (accountType.length) {
                    nt.showMessagebox(`该账号为${accountType.join('/')}，是否继续？`, '询问消息', {
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonText: '继续',
                        cancelButtonText: '暂停',
                        beforeClose: (action, _instance, done) => {
                            if (action === 'confirm') {
                                callback(true)
                            } else {
                                callback(false)
                            }
                            done()
                        }
                    })
                } else {
                    callback(true)
                }
            } catch (error) {
                callback(false, error.chnlMsgInfo || error.retMsg)
            }
        },

        // 校验 对公账号 （1.签约时，校验是否与账户一致；2.变更时，校验三选一必填）
        identNoValidate(_rule, value, callback) {
            if (this.data.isEdit) {
                const { eleCstNo, acctNm, acctNo, identNo } = this.data.formModel
                if (!eleCstNo && !acctNm && !acctNo && !identNo) {
                    return callback(false, "至少输入一项")
                }
            } else if (this.data.cacheIdentNo !== value) {
                return callback(false, "证件号码与账号不符")
            }
            callback(true)
        },

        // 2016 企业网银签约信息查询
        async queryAccountInfo() {
            // TODO 清除下方表单数据

            const { acctNo, acctSrlNo, identTp, identNo } = this.data.formModel
            // 2016 查询
            let AccountNo = utils.splitOrMerge({ acctNo, acctSrlNo })
            try {
                const res = await request.post('2016esb', {
                    acctNo: AccountNo,
                    identNo: identNo, // 证件号
                    identTp: changeIdentityType(identTp), // 证件类型
                    cnlNo: 'EIBS', // 渠道号 - 企业网银渠道标识
                })
                const {
                    fileData,
                    eleCstNo, // 电子银行客户号
                    prntCoCstNo, // 母公司客户号
                    coreCstNo, // 核心客户号
                    list, // 客户数据
                } = res

                if (fileData) {
                    this.setData({
                        accountTableData: list.filter(v => !!v.cstNo)
                    })
                } else {
                    nt.showMessagebox('未查询到任何数据', '消息提示', {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }

                Object.assign(this.data.formModel, {
                    eleCstNo: eleCstNo,
                    prntCoCstNo: prntCoCstNo,
                    coreSeq: coreCstNo
                })
            } catch (error) {
                nt.showMessagebox(error.chnlMsgInfo, "错误提示", {
                    type: 'error',
                    confirmButtonText: '知道了',
                })
            }
        },

        // 签约变更 -  2001  网银签约信息查询
        async queryChangeAccountInfo() {
            try {
                const { eleCstNo, acctNm, acctNo, identTp, identNo } = this.data.formModel
                const res = await request.post('2001esb', {
                    eleCstNo, // 电子银行客户号
                    entpNm: acctNm, // 企业名称
                    entpCorprtnAcctNo: acctNo, // 企业对公账号
                    identNo, // 证件号
                    identTp: changeIdentityType(identTp), // 证件类型
                    cnlNo: 'EIBS', // 渠道号 - 企业网银渠道标识
                })
                const { fileData } = res
                if (fileData) {
                    const parsed = utils.parseFileData(fileData, { beginFlag: "BeginList", endFlag: "EndList" })
                    const parsed2 = utils.parseFileData(fileData, { beginFlag: "BeginAcList", endFlag: "EndAcList" })
                    this.setData({
                        accountTableData: parsed.filter(v => !!v[0]).map(m => {
                            const [eleCstNo, eleCstNm, entpAprcPrsnNm, cnlSt, identTp, identNo, cnlNo, entpCtcTel, coreCstNo] = m
                            return {
                                cstNo: eleCstNo,
                                cstNm: eleCstNm,
                                cnlSt,
                                identTp: changeIdentityType(identTp, 2),
                                lglPrsnCstNo: identNo,
                                lglPrsnNm: entpAprcPrsnNm,
                                entpCtcTel,
                                coreCstNo,
                                lglPrsnTelNo: "",
                                mainAcctNo: "",
                            }
                        })
                    })
                    this.setData({
                        acctList: parsed2.map(ac => {
                            const [
                                cstNo, // 客户号
                                acct, // 账户
                                acctNm, // 账户名称
                                acctTp, // 账户类型
                                acctChrctrstcAttr, // 账户性质
                                upHngDt, // 上挂日期
                                loanAcctFlg, // 是否贷款户
                            ] = ac
                            return {
                                cstNo, acct, acctNm, acctTp: changeIdentityType(acctTp, 2), acctChrctrstcAttr, upHngDt, loanAcctFlg
                            }
                        }),
                    })
                } else {
                    throw { chnlMsgInfo: "未查找到可签约数据" }
                }
            } catch (error) {
                nt.showMessagebox(error.chnlMsgInfo || error.retMsg, '拒绝', {
                    type: 'error',
                    confirmButtonText: '关闭',
                })
            }
        },

        // 点击查询时，根据签约和变更选择不同的交易码
        onSearch() {
            // 搜索前清空
            this.data.accountTableData.splice(0, this.data.accountTableData.length)
            this.clean()

            if (this.data.isEdit) {
                this.queryChangeAccountInfo()
            } else {
                this.queryAccountInfo()
            }
        },

        //  签约变更 - 2002 - 企业网银签约详细信息查询， 反显表单数据
        async getSignInfo(row) {
            const { cstNo, identTp, lglPrsnCstNo, coreCstNo } = row
            const res = await request.post('2002esb', {
                eleCstNo: cstNo, // 电子银行客户号
                cnlNo: 'EIBS', // 渠道号 - 企业网银渠道标识
            })

            const { prntCoCstNo, cstCtgry, tfrAcctPyeRstd, mrchNo, dsbrPltfmMrchNo, fileData } = res

            Object.assign(this.data.formModel, {
                identTp, // 证件类型
                identNo: lglPrsnCstNo, // 证件号码
                eleCstNo: cstNo, // 电子银行客户号
                prntCoCstNo, // 母公司客户号
                coreSeq: coreCstNo, // 核心客户号
                clientName: row.cstNm, // 主账户客户名称
                tfrAcctPyeRstd, // 转账收款人限制
                dsbrPltfmMrchNo, // 商户号(支付平台)
                mrchNo, // 商户号
            })

            if (fileData) {
                // 反显联系人信息
                const persList = utils.parseFileData(fileData, { beginFlag: "BeginOrgPers", endFlag: "EndOrgPers" })
                if (persList) {
                    for (let i = 0; i < persList.length; i++) {
                        // 文件格式：联系人关系（C - 联系人 L - 法人）|联系人名称|联系人电话|联系人手机|Email地址|证件类型|证件号码|
                        const person = persList[i];
                        // C - 联系人
                        if (person[0] === "C") {
                            const [, ctcPrsnNm, ctcPrsnTelNo, ctcPrsnMblNo, ctcPrsnEmail, ctcPrsnIdentTp, ctcPrsnIdentNo] = person
                            Object.assign(this.data.formModel, {
                                ctcPrsnNm, ctcPrsnTelNo, ctcPrsnMblNo, ctcPrsnEmail, ctcPrsnIdentTp, ctcPrsnIdentNo
                            })
                            break
                        }
                    }
                }

                // 获取客户签约渠道列表信息
                // 从这个里面取出【两个客户经理】的信息，进行反显
                const MCList = utils.parseFileData(fileData, { beginFlag: "BeginMCList", endFlag: "EndMCList" })
                if (MCList) {
                    for (let i = 0; i < MCList.length; i++) {
                        // 文件格式：0唯一标识序号|1签约渠道|2销户重开标志|3管理类交易生效模式|4客户经理工号|5客户经理姓名
                        // |6客户经理联系电话|7客户经理所属机构 |8客户经理所属机构ID|9客户经理所属机构名称|10推荐人类型 
                        // |11推荐人姓名|12推荐人工号|13推荐人客户号|14月累计限额|15日累计限额 |16单笔限额|17渠道状态
                        // |18签约行名称|19冻结状态|20冻结日期|21注销日期|22申请日期|23启用日期|24经办人用户名|25经办人工号
                        // |26经办人手机号|27经办人电话|28经办人单位号
                        const data = MCList[i];
                        // 保证数据完整
                        if (data.length >= 20) {
                            Object.assign(this.data.formModel, {
                                cstMgrNm1: data[5],
                                cstMgrWrkNo: data[4],
                                recomPrsnNm: data[11],
                                recomPrsnWrkNo: data[12],
                            })
                            Object.assign(this.data.localPrintData, {
                                aplyDt: data[22], // 申请日期
                                sgntrBnkNm: data[18], // 签约行名称
                            })
                            // 注意：只取一次数据，取过之后通过Break跳出循环，不再进行处理第二条数据
                            break
                        }
                    }
                }

                // 获取渠道签约属性规则列表信息
                // 文件格式：唯一标识序号(与McList中SeqNo保持一致)|名称|具体值
                // 注意：从这个里面取出【管理类交易生效模式】，进行反显
                const propertiesList = utils.parseFileData(fileData, { beginFlag: "BeginProperties", endFlag: "EndProperties" })
                if (propertiesList) {
                    const property = propertiesList.find(property => property.length >= 3 && property[1].trim() === "EIBS.MgmtPrdSet.AuthMode")
                    if (property) {
                        this.data.formModel.mgtTpTranTkEffMd = property[2]
                    }
                }

                // 获取客户所有的渠道产品组列表(包括已经开通的[状态为N],和没有开通的功能)
                // 文件格式:唯一标识序号|服务功能名称|渠道|机构名称|状态|机构号
                const prdsetList = utils.parseFileData(fileData, { beginFlag: "BeginPrdsetList", endFlag: "EndPrdsetList" })
                if (prdsetList) {
                    this.setData({
                        prdListTableData: prdsetList.map(v => {
                            const [, svcFcnNm, cnlNo, instNm, , brchNo] = v
                            return { svcFcnNm, cnlNo, instNm, brchNo }
                        })
                    })
                }

                // 获取客户已经开通的产品组列表
                // 文件格式:唯一标识序号|服务功能名称|渠道|机构名称|机构号
                const checkedPrdList = utils.parseFileData(fileData, { beginFlag: "BeginCifPrdSetList", endFlag: "EndCifPrdSetList" })
                if (checkedPrdList) {
                    // 已选数据 回填
                    // this.data.selectionPrdList = checkedPrdList.map(prd => ({ svcFcnNm: prd[1] }))
                    // 等待表格渲染完毕，反显已选产品
                    this.$nextTick(() => {
                        setTimeout(() => {
                            for (let i = 0; i < checkedPrdList.length; i++) {
                                const selected = checkedPrdList[i];
                                const found = this.data.prdListTableData.find(prd => prd.svcFcnNm === selected[1])
                                if (found) {
                                    this.$refs.prdTable.toggleRowSelection(found)
                                    this.data.oldAcList.push({ ...found })
                                }
                            }
                        }, 500)
                    })
                }

                // 获取上挂账户列表
                // 文件格式：唯一标识序号|账号|户名|账户类型|银行账户性质|加挂日期|是否贷款户|币种|钞汇标志|开户网点
                // |机构序列号|机构名称|是否主账户|账户属主标识|账户权限|单笔限额|转账日累计限额|年累计限额|日笔数
                const acList = utils.parseFileData(fileData, { beginFlag: "BeginAcList", endFlag: "EndAcList" })
                if (acList) {
                    // acctTp 特殊处理：上挂帐号中的账号类型并不传入提交接口，因此反显时并没有相关数据，需要使用 bankAcType 字段转换
                    const map = {
                        EBAS: "1", // 企业基本结算户
                        ECHK: "2", //  企业一般结算户
                        ETMP: "4", //  企业临时户
                        // "?": "3", //  转用户 ?
                    }
                    this.setData({
                        acListTableData: acList.map(ac => {
                            const [
                                , AccountNo, acctNm, acctTp, bnkAcctChrctrstcAttr, adHngDt, , currencyCcy,
                                cashDrftFlg, brchNo, , , mainAcctFlg, acctBlngMainInd, acctPrvgCd, snglTfrAcctRstdLmt,
                                tfrAcctDayAcmRstdLmt, tfrAcctYrAcmRstdLmt, tfrAcctSnglDayLineNum
                            ] = ac
                            // 非核心账号 分解为核心账号和序号
                            const [acctNo, acctSrlNo] = utils.splitOrMerge({ acctNo: AccountNo, isSplit: true })
                            return {
                                acctNo, acctSrlNo, acctNm, acctTp: map[acctTp], bankAcType: acctTp, bnkAcctChrctrstcAttr,
                                adHngDt: adHngDt.replace(/-/g, ""), currencyCcy: utils.transformLabelByValue(currencyCcy, this.data.currencyOptions),
                                cashDrftFlg: utils.transformLabelByValue(cashDrftFlg, [
                                    { label: "1", value: "R" }, // 汇
                                    { label: "0", value: "C" }, // 钞
                                ]), brchNo, mainAcctFlg, acctBlngMainInd, acctPrvgCd, snglTfrAcctRstdLmt, tfrAcctDayAcmRstdLmt,
                                tfrAcctYrAcmRstdLmt, tfrAcctSnglDayLineNum
                            }
                        })
                    })
                }
            }
        },

        // 网银签约信息表格 - 选中
        async onAccountSelected(row) {
            console.log('onAccountSelected', row);
            const { isEdit } = this.data

            // 签约时，查询 开通服务信息
            if (!isEdit) {
                // 保存选择的主账户客户名称
                this.data.formModel.clientName = row.cstNm

                // 合并账号 - 账户序号
                const { acctNo, acctSrlNo, identTp, identNo } = this.data.formModel
                const { eleCstNo, prntCoCstNo } = this.data.formModel
                let AccountNo = utils.splitOrMerge({ acctNo, acctSrlNo })
                // 2017
                const res = await request.post('2017esb', {
                    acctNo: AccountNo, // 账号
                    identNo, // 证件号
                    identTp, // 证件类型
                    cnlNo: 'EIBS', // 渠道号 - 企业网银渠道标识
                    eleCstNo, // 电子银行客户号
                    prntCoCstNo, // 母公司客户号
                })

                const { fileData } = res

                if (fileData) {
                    // 处理产品列表
                    const prdMatchResult = fileData.match(/BeginPrdsetList(\s|\S)+EndPrdsetList/);
                    const prdArr = prdMatchResult[0].split("\r\n")
                    prdArr.shift() // 去掉 BeginPrdsetList
                    prdArr.pop() // 去掉 EndPrdsetList
                    this.setData({
                        prdListTableData: prdArr.map(v => {
                            const [svcFcnNm, cnlNo, instNm, brchNo] = v.split("|")
                            return { svcFcnNm, cnlNo, instNm, brchNo }
                        })
                    })

                    // 处理角色列表
                    const roleMatchResult = fileData.match(/BeginRoleList(\s|\S)+EndRoleList/);
                    const roleArr = roleMatchResult[0].split("\r\n");
                    (roleArr.shift(), roleArr.pop());
                    this.setData({
                        roleList: roleArr.map(r => {
                            const [rlNo, rlNm, rlTp] = r.split("|")
                            return { rlNo, rlNm, rlTp }
                        })
                    })
                } else {
                    nt.showMessagebox('未查询到任何数据', '消息提示', {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }
            }
            // 变更时，做更复杂的校验
            else {
                const { cstNo, cnlSt } = row
                if (cnlSt !== "N") {
                    // FIXME selectRow 事件中无法弹出messagebox
                    return nt.showMessagebox("渠道状态非正常，不可进行变更！", "拒绝", {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }

                // 校验共管户
                const list = this.data.acctList.filter(ac => ac.cstNo === cstNo)
                try {
                    await new Promise((resolve, reject) => {
                        CheckAccountInfo.GGHCheck(
                            {
                                accountList: list.map(ac => ac.acct),
                                mainCd: this.data.mainCd,
                            },
                            resolve,
                            (error) => {
                                if (error.retCd === "-1") {
                                    nt.showMessagebox(error.chnlMsgInfo, '拒 绝', {
                                        type: 'error',
                                        confirmButtonText: '知道了',
                                    })
                                }
                                reject(error)
                            })
                    })
                } catch (error) {
                    console.error(error)
                    // DO NOTHING
                }
                this.getSignInfo(row)
            }
        },

        // 一键开户时，查询可开通产品数据
        async initProductTableList() {
            try {
                const { fileData } = await request.post("2006esb", {
                    cnlNo: "EIBS",
                })
                if (fileData) {
                    const tableData = []
                    const list = fileData.split("\r\n")
                    list.forEach(data => {
                        const arr = data.split("|")
                        if (arr.length > 3) {
                            const [
                                fcnOrgNm, // 功能组名称
                                cnlNo, // 渠道号
                                instNm, // 机构名称
                                brchSrlNo, // 机构顺序号
                            ] = arr
                            tableData.push({ svcFcnNm: fcnOrgNm, cnlNo, instNm, brchNo: brchSrlNo })
                        }
                    })
                    this.setData({
                        prdListTableData: tableData,
                    })
                }
            } catch (error) {
                return nt.showMessagebox(error.chnlMsgInfo || error.retMsg, '错 误', {
                    type: 'error',
                    confirmButtonText: '关 闭',
                })
            }
        },

        // 一键开户时，查询企业网银默认角色
        async initRoleTableList() {
            try {
                const { fileData } = await request.post("2023esb", {
                    cnlNo: "EIBS",
                })
                if (fileData) {
                    const tableData = []
                    const list = fileData.split("\r\n")
                    list.forEach(data => {
                        const arr = data.split("|")
                        if (arr.length > 2) {
                            const [
                                rlNo, // 角色编号
                                rlNm, // 角色名字
                                cstCtgry, // 客户类别
                            ] = arr
                            tableData.push({ rlNo, rlNm, rlTp: cstCtgry })
                        }
                    })
                    this.setData({
                        roleList: tableData,
                    })
                }
            } catch (error) {
                return nt.showMessagebox(error.chnlMsgInfo || error.retMsg, '错 误', {
                    type: 'error',
                    confirmButtonText: '关 闭',
                })
            }
        },

        // 开通网银业务 - 选中
        async onPrdListSelectionChange(rows) {
            this.setData({
                selectionPrdList: rows.map(r => r)
            })

            // 是否需要输入商户号判断
            const flag = this.data.selectionPrdList.some(row => row.svcFcnNm === "商户退款")
            if (flag) {
                this.data.formModel.addMrchNoFlg = "1"
            } else {
                Object.assign(this.data.formModel, {
                    addMrchNoFlg: "0",
                    dsbrPltfmMrchNo: null,
                    mrchNo: null,
                })
            }
        },

        // 新增上挂账号
        addAcList() {
            this.setData({
                dialogVisible: true,
                dialogFormType: "Account",
                operationFlag: "C"
            })

            const extendFields = {
                acctNm: this.data.formModel.acctNm, // 户名
                brchNo: this.data.userInfo.inst_no, // 开户网点，一键预约时为本机构
            }

            // 新增前先检查，是否已经新增上挂账号，如果还没有新增，则第一次必须为主账号，并且账号不能修改；
            // 如果已经新增账号，那么账号为空，必输项
            if (this.data.acListTableData.length > 0) {
                setTimeout(() => {
                    this.$refs.uploadAccount.setFields({
                        // 一键开户时，账户还没有创立，账户数据需要从T200101传入
                        ...(this.data.isOneStop ? Object.assign(extendFields, this.data.extendModel) : extendFields),
                        mainAcctFlg: "0"
                    })
                }, 800);
            } else {
                const { acctNo, acctSrlNo } = this.data.formModel

                setTimeout(() => {
                    this.$refs.uploadAccount.setFields({
                        // 一键开户时，账户还没有创立，账户数据需要从T200101传入
                        ...(this.data.isOneStop ? Object.assign(extendFields, this.data.extendModel) : extendFields),
                        acctNo,
                        acctSrlNo,
                        acctBlngMainInd: "1",
                        mainAcctFlg: "1",
                    })
                }, 800);
            }
        },

        // 修改上挂账号
        updateAcList(row) {
            this.setData({
                dialogVisible: true,
                dialogFormType: "Account",
                operationFlag: "U"
            })

            // 签约变更 修改时，记录旧的上挂账号数据，以生成变更打印数据
            if (this.data.isEdit) {
                this.setData({
                    oldAcRowData: { ...row },
                })
            }

            setTimeout(() => {
                this.$refs.uploadAccount.setFields({ ...row })
            }, 800);
        },

        // 删除上挂账号
        deleteAcList(row) {
            if (row.mainAcctFlg === "1") {
                return nt.showMessagebox('主账户不允许删除！', '拒绝', {
                    type: 'error',
                    confirmButtonText: '知道了',
                })
            }

            this.setData({
                dialogVisible: true,
                dialogFormType: "Account",
                operationFlag: "D"
            })

            setTimeout(() => {
                this.$refs.uploadAccount.setFields({ ...row })
            }, 800);
        },

        // 新增操作员
        addOperation() {
            if (this.data.isOneStop) {
                if (!this.data.myUKey.length) {
                    return nt.showMessagebox("柜员无此类椰盾凭证！", "拒 绝", {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }
            } else {
                if (!this.data.formModel.eleCstNo) {
                    return nt.alert("请先补充账户信息")
                }
            }


            if (!this.checkUploadAccount()) return

            this.setData({
                dialogVisible: true,
                dialogFormType: "Operation",
                operationFlag: "C",
            })

            const seqNo = Date.now() // 标记序号，因为除了 seqNo 其他的表单项都可修改

            // 操作员号递增 1
            // NOTE 注意，一键开户时只有序号，客户号为空
            const operationNo = `${this.data.formModel.eleCstNo}${String((this.data.operationTableData.length + 1)).padStart(2, '0')}`

            // 新增前先检查，是否已经新增操作员，如果还没有新增，则第一次必须为管理员，并且【是否管理员】不能修改；
            // 如果已经新增操作员，那么【是否管理员】可选择
            if (this.data.operationTableData.length > 0) {
                setTimeout(() => {
                    this.$refs.operationInfo.setFields({
                        seqNo,
                        operationNo,
                        isAdminFlag: false,
                    })
                }, 800);
            } else {
                setTimeout(() => {
                    this.$refs.operationInfo.setFields({
                        seqNo,
                        operationNo,
                        isAdmin: "Y",
                        isAdminFlag: true,
                    })
                }, 800);
            }
        },

        // 修改操作员
        updateOperation(row) {
            this.setData({
                dialogVisible: true,
                dialogFormType: "Operation",
                operationFlag: "U",
            })

            setTimeout(() => {
                this.$refs.operationInfo.setFields({ ...row })
            }, 800);
        },

        // 删除操作员
        deleteOperation(row) {
            if (this.data.isOneStop) {
                // 一键开户时，直接删除
                const index = this.data.operationTableData.findIndex(op => op.seqNo === row.seqNo);
                this.data.operationTableData.splice(index, 1)
            } else {
                // 普通签约时，打开弹窗
                this.setData({
                    dialogVisible: true,
                    dialogFormType: "Operation",
                    operationFlag: "D"
                })

                setTimeout(() => {
                    this.$refs.operationInfo.setFields({ ...row })
                }, 800);
            }
        },

        // 上挂账号表单提交
        onUploadAccountSubmit(formData) {
            const { operationFlag, isEdit } = this.data

            const index = this.data.acListTableData.findIndex(row => row.acctNo === formData.acctNo && row.acctSrlNo === formData.acctSrlNo)
            if (operationFlag === 'C') {
                // 增加
                if (index < 0) {
                    if (formData.mainAcctFlg === "1" && this.data.acListTableData.some(ac => ac.mainAcctFlg === "1")) {
                        return nt.showMessagebox('只能设置一个企业主账户！', '拒绝', {
                            type: 'error',
                            confirmButtonText: '知道了',
                        })
                    } else if (formData.mainAcctFlg !== "1" && !this.data.acListTableData.some(ac => ac.mainAcctFlg === "1")) {
                        return nt.showMessagebox('请先设置企业主账户！', '拒绝', {
                            type: 'error',
                            confirmButtonText: '知道了',
                        })
                    }

                    this.data.acListTableData.push(formData)

                    // 变更时新增，处理打印数据
                    if (isEdit) {
                        if (!this.data.editPrintData[formData.AccountNo]) {
                            this.data.editPrintData[formData.AccountNo] = [{ property: "加挂账号", info: "新增" }]
                        } else {
                            this.data.editPrintData[formData.AccountNo].push({ property: "加挂账号", info: "新增" })
                        }
                    }
                } else {
                    return nt.showMessagebox('上挂列表中已经存在该账户！', '拒绝', {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }
            } else if (operationFlag === 'U') {
                // 修改
                if (index > -1) {
                    this.data.acListTableData.splice(index, 1, formData)

                    // 变更信息打印
                    if (isEdit) {
                        this.dealEditAccountPrintTableData(formData)
                    }
                }
            } else if (operationFlag === 'D') {
                // 删除
                if (index > -1) {
                    this.data.acListTableData.splice(index, 1)
                    // 变更时删除，处理打印信息
                    if (isEdit) {
                        if (!this.data.editPrintData[formData.AccountNo]) {
                            this.data.editPrintData[formData.AccountNo] = [{ property: "解挂账号", info: "删除" }]
                        } else {
                            this.data.editPrintData[formData.AccountNo].push({ property: "解挂账号", info: "删除" })
                        }
                    }
                }
            }
            this.setData({
                dialogVisible: false
            })
        },

        // 操作员信息表单提交
        onOperationInfoSubmit(formData) {
            console.log(">>>", formData);
            const usbKeyType = getUKType(formData.usbKeyNo);
            const usbKeyNo = +getUKNo(formData.usbKeyNo);
            formData.vchrTp = usbKeyType; // 计算凭证类型

            const { operationFlag } = this.data

            const index = this.data.operationTableData.findIndex(row => row.seqNo === formData.seqNo)
            let retMsg = ""
            for (let i = 0; i < this.data.operationTableData.length; i++) {
                const data = this.data.operationTableData[i];
                if (data.identNo === formData.identNo) {
                    retMsg = "该证件号已存在！"
                    break
                }
                if (data.mobile === formData.mobile) {
                    retMsg = "该手机号码已存在！"
                    break
                }
            }

            if (operationFlag === 'D') {
                // 删除
                if (index > -1) {
                    this.data.operationTableData.splice(index, 1)
                }
            } else {
                if (retMsg) {
                    return nt.showMessagebox(retMsg, '拒绝', {
                        type: 'error',
                        confirmButtonText: '知道了',
                    })
                }

                if (operationFlag === 'C') {
                    // 增加
                    if (index < 0) {
                        // 去掉已被使用的最小凭证号
                        if (this.data.isOneStop) {
                            if (this.data.myUKey[0] !== usbKeyNo) {
                                return nt.showMessagebox(`凭证最小号为：${this.data.myUKey[0]} 请检查！`, "拒 绝", {
                                    type: 'error',
                                    confirmButtonText: '知道了',
                                })
                            }

                            const index = this.data.myUKey.findIndex(number => number === usbKeyNo)
                            if (index > -1) {
                                this.data.myUKey.splice(index, 1)
                            }
                            this.data.formModel.count += 1
                        }

                        this.data.operationTableData.push(formData)
                    } else {
                        return nt.showMessagebox("该序号已存在！", '拒绝', {
                            type: 'error',
                            confirmButtonText: '知道了',
                        })
                    }
                } else if (operationFlag === 'U') {
                    // 修改
                    if (index > -1) {
                        this.data.operationTableData.splice(index, 1, formData)
                    }
                }
            }
            this.setData({
                dialogVisible: false
            })
        },

        // 检查上挂账号
        checkUploadAccount() {
            if (!this.data.acListTableData.length) {
                nt.showMessagebox("上挂账号不能为空！", "交易拒绝", {
                    type: 'error',
                })
                return false
            }
            return true
        },

        // 邮箱校验
        onEmailValidate(_rule, value, callback) {
            if (value && typeof value === 'string') {
                if (utils.emailValidate(value)) {
                    callback(true)
                }
                else callback(false, "非法邮箱")
                return
            }
            callback(true)
        },

        // 客户经理工号校验
        onManagerSeqValidate(_rule, _value, callback) {
            const { cstMgrWrkNo, recomPrsnWrkNo } = this.data.formModel
            const arr = [cstMgrWrkNo, recomPrsnWrkNo].filter(value => !!value)

            if (arr.length !== new Set(arr).size) {
                return callback(false, '客户经理不能重复！')
            }
            callback(true)
        },

        isArrayLike(oldArr, newArr) {
            if (oldArr.length !== newArr.length) {
                return false
            }
            for (let i = 0; i < oldArr.length; i++) {
                const source = oldArr[i];
                if (newArr.some(data => data.svcFcnNm === source.svcFcnNm)) {
                    continue
                } else {
                    return false
                }
            }
            return true
        },

        // 循环对比更改，打印变更时信息
        dealEditAccountPrintTableData(newData) {
            const labelMap = {
                mainAcctFlg: { name: "是否主账户", options: [{ label: "是", value: "1" }, { label: "否", value: "0" }] },
                acctPrvgCd: { name: "账号权限", options: [{ label: "任意转出", value: "FT" }, { label: "仅开通查询", value: "Q" }] },
                tfrAcctDayAcmRstdLmt: { name: "日累计限额" },
                tfrAcctYrAcmRstdLmt: { name: "年累计限额" },
                snglTfrAcctRstdLmt: { name: "单笔限额" },
                tfrAcctSnglDayLineNum: { name: "日笔数" },
                acctBlngMainInd: { name: "账户属主标识", options: [{ label: "自身账户", value: "1" }, { label: "授权账户", value: "0" }] },
            }
            const old = this.data.oldAcRowData
            for (const key in newData) {
                if (Object.hasOwnProperty.call(newData, key)) {
                    const value = newData[key];
                    // 新旧不一致，要打印变更信息
                    if (old[key] !== value) {
                        const config = labelMap[key]
                        if (!config) continue
                        const data = {
                            property: config.name,
                        }
                        if (config.options) {
                            data.info = `原[${utils.transformLabelByValue(old[key], config.options)
                                }] 现 [${utils.transformLabelByValue(value, config.options)
                                }]`
                        } else {
                            data.info = `原[${old[key]}] 现 [${value}]`
                        }
                        if (!this.data.editPrintData[newData.AccountNo]) {
                            this.data.editPrintData[newData.AccountNo] = [data]
                        } else {
                            this.data.editPrintData[newData.AccountNo].push(data)
                        }
                    }
                }
            }
        },

        // 一键签约时，凭证类型变换时校验
        async handleUKeyTypeChange(_rule, value, callback) {
            // 已经绑定操作员时，才会进行限制
            if (this.data.operationTableData.length) {
                // 任意一条操作员椰盾类型
                const first = this.data.operationTableData[0]
                if (first.vchrTp !== value) {
                    // 椰盾数据必须都一样，不许改变
                    return callback(false, "不允许绑定不同类型的凭证")
                }
            }

            // 椰盾数据只查询一次
            if (this.data.myUKey.length) return callback(true)

            // 8302 查询柜员可用椰盾数据
            const { inst_no, tlr_no } = this.data.userInfo
            try {
                const res = await request.post("8302", {
                    vchrSt: "0", // 凭证状态
                    vchrTp: value, // 凭证类型
                    brchNo: inst_no, // 机构号
                    tlrNo: tlr_no, // 柜员号
                })
                const { fileDataList } = res
                // 附件格式：@柜员|@凭证种类|@起始号码|@终止号码|@凭证状态|数量|@机构编码|
                if (fileDataList) {
                    const stack = new Set() // number[]
                    for (let i = 0; i < fileDataList.length; i++) {
                        const data = fileDataList[i];
                        const { begNo, endNo } = data;
                        for (let j = +begNo; j <= +endNo; j++) {
                            stack.add(j);
                        }
                    }
                    this.setData({ myUKey: Array.from(stack) })
                    callback(true)
                } else {
                    throw { chnlMsgInfo: "椰盾信息" }
                }
            } catch (error) {
                callback(false, "柜员无此凭证：" + (error.chnlMsgInfo || error.retMsg))
            }
        },

        // 清空所有数据
        clean() {
            // this.$refs.formRef
            Object.assign(this.data.formModel, {
                clientName: "",
                ctcPrsnIdentTp: "",
                ctcPrsnIdentNo: "",
                ctcPrsnNm: "",
                ctcPrsnMblNo: "",
                ctcPrsnTelNo: "",
                ctcPrsnEmail: "",
                mgtTpTranTkEffMd: "",
                tfrAcctPyeRstd: "",
                addMrchNoFlg: "0",
                dsbrPltfmMrchNo: "",
                mrchNo: "",
                cstMgrNm1: "",
                cstMgrWrkNo: "",
                recomPrsnNm: "",
                recomPrsnWrkNo: "",
                vchrTp: "",
                cashTfrAcctFlg: "", // 现转标志
                count: 1, // 凭证数量
                costOfPdnAmt: "", // 工本费
                pcdFeeAmt: "", // 手续费
                allCostOfPdnAmt: "", // 总工本费
                allPcdFeeAmt: "", // 总手续费
            })
            this.data.prdListTableData.splice(0, this.data.prdListTableData);
            this.data.acListTableData.splice(0, this.data.acListTableData);
            this.data.operationTableData.splice(0, this.data.operationTableData);
        },

        // expose
        setFields(data) {
            for (const key in data) {
                const value = data[key];
                if (Object.hasOwnProperty.call(this.data.formModel, key)) {
                    this.data.formModel[key] = value;
                } else if (Object.hasOwnProperty.call(this.data.extendModel, key)) {
                    this.data.extendModel[key] = value;
                }
                else if (Object.hasOwnProperty.call(this.data, key)) {
                    this.setData({
                        [key]: value
                    })
                }
            }
        },
        // TODO 修改户名时，同时修改已上挂账号账户名称
    }
})
