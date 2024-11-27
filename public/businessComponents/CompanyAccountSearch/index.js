import utils from '../../utils/utils'
import request from '../../utils/request.js'
import CheckAccountInfo from "../../common/functions/checkAccount"
import changeIdentityType, { TYPE_ZH_MAP as identTpZhMap } from '../../common/functions/changeIdentityType'

Component({
  properties: {
    formModel: {
      type: Object,
      default: () => ({
        eleCstNo: "", // 电子银行客户号
        acctNo: "", // 银行账号
        identTp: "", // 证件类型
        identNo: "", // 证件号码
        acctNm: "", // 账户名称
      })
    },
    mainTranCd: {
      type: String,
      default: '',
    }
  },
  data: {
    accountTableConfigs: [
      { prop: "eleCstNo", label: "银行客户号", attrs: { width: "130" } },
      { prop: "eleCstNm", label: "客户名称" },
      { prop: "entpAprcPrsnNm", label: "法人姓名", attrs: { width: "120" } },
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
      { prop: "identNo", label: "证件号码" },
      // { prop: "cnlNo", label: "渠道号" },
      { prop: "entpCtcTel", label: "企业联系电话", attrs: { width: "150" } },
      { prop: "coreCstNo", label: "核心客户号", attrs: { width: "130" } },
    ],
    accountTableData: [],

    accountTypeList: [],

    acctList: [],
  },
  computed: {
  },
  ready() {
    this.getSelectOptionsByK042()
  },
  methods: {
    // 查询k042接口返回的选项列表
    async getSelectOptionsByK042() {
      const mainCd = this.data.mainTranCd
      await utils.getSelectData({ mainCd, flg: 'C003', name: 'accountTypeList', that: this }) // 证件类型
    },
    // 常规账户校验
    async onAccountValidate(_rule, value, callback) {
      // 变更时先清空
      Object.assign(this.data.formModel, {
        // eleCstNo: "", // 电子银行客户号
        identTp: "", // 证件类型
        identNo: "", // 证件号码
        acctNm: "", // 账户名称
      })

      const checker = new CheckAccountInfo(
        { acctNo: value, mainCd: this.data.mainTranCd },
        { [CheckAccountInfo.CHECK_METHOD.COMMOM]: true }
      )
      const { chnlRetCd, chnlMsgInfo } = await checker.check()
      callback(chnlRetCd === "0", chnlMsgInfo)
    },
    async onSearch() {
      // 搜索前清空
      this.data.accountTableData.splice(0, this.data.accountTableData.length)
      this.$emit('clean')

      const { eleCstNo, acctNo, identNo, acctNm, identTp } = this.data.formModel

      if (!([eleCstNo, acctNo, identNo, acctNm].some(v => !!v))) {
        return nt.showMessagebox('至少输入一项', '拒绝', {
          type: 'error',
          confirmButtonText: '知道了',
        })
      }

      try {
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
          // 获取 签约信息
          const parsed = utils.parseFileData(fileData, { beginFlag: "BeginList", endFlag: "EndList" })
          this.setData({
            accountTableData: parsed.map(m => {
              const [
                eleCstNo, eleCstNm, entpAprcPrsnNm, cnlSt, identTp, identNo, cnlNo, entpCtcTel, coreCstNo
              ] = m
              return {
                eleCstNo,
                eleCstNm,
                cnlSt,
                identTp: changeIdentityType(identTp, 2),
                identNo,
                entpAprcPrsnNm,
                entpCtcTel,
                coreCstNo,
              }
            })
          })

          // 客户下挂的账户列表
          const acList = utils.parseFileData(fileData, { beginFlag: "BeginAcList", endFlag: "EndAcList" })
          this.setData({
            acctList: acList.map(ac => {
              const [
                cstNo, acct, acctNm, acctTp, acctChrctrstcAttr, upHngDt, loanAcctFlg,
              ] = ac
              return {
                cstNo, acct, acctNm, acctTp, acctChrctrstcAttr, upHngDt, loanAcctFlg
              }
            })
          })
        } else {
          throw { chnlMsgInfo: "未查询到任何数据" }
        }
      } catch (error) {
        nt.showMessagebox(error.chnlMsgInfo || error.retMsg, '拒 绝', {
          type: 'error',
          confirmButtonText: '关闭',
        })
      }
    },

    onAccountSelected(row) {
      const { cnlSt } = row
      if (cnlSt !== "N") {
        // FIXME selectRow 事件中无法弹出messagebox
        return nt.showMessagebox("渠道状态非正常，不可进行变更！", "拒绝", {
          type: 'error',
          confirmButtonText: '知道了',
        })
      }
      if (this.data.acctList.length) {
        // 校验共管户
        CheckAccountInfo.GGHCheck(
          {
            accountList: this.data.acctList.map(ac => ac.acct),
            mainCd: this.data.mainTranCd,
          },
          () => {
            this.$emit("dataSelect", row)
          },
          (error) => {
            if (error.retCd === "-1") {
              nt.showMessagebox(error.chnlMsgInfo, '拒绝', {
                type: 'error',
                confirmButtonText: '知道了',
              })
            }
          })
      } else {
        nt.showMessagebox("该账户没有可变更的签约信息", '拒绝', {
          type: 'error',
          confirmButtonText: '知道了',
        })
      }
    },
  },
});
