import request from '../../utils/request.js'
import commonData from "../common.js";
import GlobalVariable from '../GlobalVariable.js';
import common from '../index.js';

/**
 * 常规账户校验类
 * @method CommomCheck 账户k025常规检查
 * @method GGHCheck 共管户校验
 */
class CheckAccountInfo {
  fn = []
  results = ["confirm", "cancel"];
  /**
   * 实例化账户常规检查类
   * @param {object} data 执行检查必要的入参数据，如账号、交易码等
   * @param {object} options 检查项，key值祥见{@link CheckAccountInfo.CHECK_METHOD}，value默认为true
   */
  constructor(data, options = {}) {
    // 建议errcode
    // 默认： "0" - 成功； "1" - 有业务提示，根据各检查方法自定义； "-1" - 失败； 其它 - 各业务方法自行扩展
    this.result = { chnlRetCd: "0", chnlMsgInfo: null, data: null }
    this.data = data

    this.registerCheckMethod(options)
  }

  // private - 统一处理接口错误
  handleFail(err = {}) {
    if (typeof err === "object") {
      this.result.chnlRetCd = err.chnlRetCd || "-1"
      this.result.chnlMsgInfo = err.chnlMsgInfo || err.retMsg || "账户常规检查失败"
    } else {
      this.result.chnlRetCd = "-1"
      this.result.chnlMsgInfo = "账户常规检查失败"
    }
  }
  // private - 如果需要把接口数据置入返回对象，可以执行此方法注入数据
  handleSuccess(key, data = null) {
    this.result.chnlRetCd = "0"
    if (typeof key === "string" && key.length) {
      if (this.result.data === null) {
        this.result.data = { [key]: data }
      } else {
        this.result.data[key] = data
      }
    }
  }
  // private - 注册校验方法，把配置项解析转化为需要执行的校验方法和相关配置
  registerCheckMethod(options) {
    for (const key in options) {
      if (Object.hasOwnProperty.call(options, key)) {
        switch (key) {
          case CheckAccountInfo.CHECK_METHOD.COMMOM:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CommomCheck);
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.GGH:
            // true - 打开检查 共管户
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.GGHCheck);
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.SKZHJC:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckControledAccountMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JCKHLX:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckClientTypeMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JCZHLX:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckAccountTypeMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JCBLJG:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckBusinessKinbrMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JCBZJZHXZ:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckMarginAccountLimitMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.LSHGQ:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckTempAccountEndDateMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.XYTSDGKZHLX:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.ShowTipAccountTypeMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.ZHZTJY:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckAccountStateMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JZZTJY:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckMediaStateMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.ZHZFJY:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckStopPaymentStateMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.ZHDJJY:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckAccountFreePaymentMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.JCTCTD:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckDepositAndWithdrawalMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.DXZP:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckTelecommunicationFraudTypeMethod)
            }
            break;
          case CheckAccountInfo.CHECK_METHOD.FXQ:
            // true - 打开检查
            if (!!options[key]) {
              this.fn.push(CheckAccountInfo.CheckAntiMoneyLaunderingTypeMethod)
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // ===================================== public =================================//
  /**
   * 检查结果。原则：全部验证方法通过则返回 0 ，其一不通过则失败，后续校验不会继续执行。
   * @returns {Promise<{chnlRetCd: string, chnlMsgInfo: string, data: object}>} chnlRetCd - 错误码，成功为 0 ，失败为对应接口的错误码，
   * 如果没有，默认为 -1 ；errmsg - 错误信息；data - 相关数据，key值和内容为各校验方法自行设置
   */
  async check() {
    const arr = this.fn
    if (typeof arr === "object" && arr.length) {
      for (let index = 0; index < arr.length; index++) {
        const fn = arr[index];
        await fn.call(this, this.data, this.handleSuccess.bind(this), this.handleFail.bind(this))
        // 有一项检查不过，不进行后续检查
        if (this.result.chnlRetCd !== "0") break
      }
    }
    return { ...this.result }
  }

  /**
   * 检查配置项
   * @key COMMOM 常规账户校验
   * @key GGH 共管户校验
   * @key DXZP 电信诈骗
   * @key SKZHJC 受控账户检查
   * @key JCKHLX 检查客户类型
   * @key JCZHLX 检查账户类型
   * @key JCBLJG 检查办理机构
   * @key JCBZJZHXZ 检查保证金账户限制
   * @key LSHGQ 临时户过期
   * @key XYTSDGKZHLX 需要提示的管控账户类型
   * @key ZHZTJY 账户状态校验
   * @key JZZTJY 介质状态校验
   * @key ZHZFJY 账户止付校验
   * @key ZHDJJY 账户冻结校验
   * @key JCTCTD 检查通存通兑
   * @key FXQ 反洗钱
   */
  static CHECK_METHOD = {
    COMMOM: "commom",
    GGH: "GGH",
    DXZP: "DXZP",
    SKZHJC: "SKZHJC",
    JCKHLX: "JCKHLX",
    JCZHLX: "JCZHLX",
    JCBLJG: "JCBLJG",
    JCBZJZHXZ: "JCBZJZHXZ",
    LSHGQ: "LSHGQ",
    XYTSDGKZHLX: "XYTSDGKZHLX",
    ZHZTJY: "ZHZTJY",
    JZZTJY: "JZZTJY",
    ZHZFJY: "ZHZFJY",
    ZHDJJY: "ZHDJJY",
    JCTCTD: "JCTCTD",
    FXQ: "FXQ",
  }

  // ===================================== 检查函数在下方编写 =================================//
  // 检查方法说明： 接受三个参数 【1.校验方法需要的入参；2.校验成功回调；3.校验失败回调】
  // 检查函数的逻辑应该遵循：
  // 1.支持本类正常逻辑使用；
  // 2.遵循本类标准的 “实例化(new) - 注册检查函数(register) - 校验(check) - 注入数据结果集(handleSuccess) - 返回” 流程；
  // 3.可支持单独调用；
  // 4.原则上不应使用 this 关键字。

  /**
   * 校验账户是否存在，并输出基础账户信息
   * @field k025
   * @param {object} data 该检验方法需要的入参 - {acctNo, mainTranCd}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CommomCheck(data, onSuccess, onFail) {
    try {
      if (!data.acctNo) {
        return onFail && onFail()
      }
      const res = await request.post("k025", {
        acctNo: data.acctNo,
        mainTranCd: data.mainCd,
      })
      onSuccess && onSuccess(CheckAccountInfo.CHECK_METHOD.COMMOM, res)
    } catch (error) {
      onFail && onFail(error)
    }
  }

  /**
   * 校验共管户信息，循环调用核心K025进行检查
   * @param {object} data 共管户校验入参 - {accountList: string[], mainCd: string}
   * @param {function} onSuccess 成功回调，入参为 (type: {@link CheckAccountInfo.CHECK_METHOD.GGH}, data: null)
   * @param {function} onFail 失败回调，入参为标准接口数据
   * @returns {void}
   */
  static async GGHCheck(data, onSuccess, onFail) {
    const { accountList, mainCd } = data
    if (mainCd && accountList && accountList.length) {
      // 检查共管户
      const message = []
      let stop = false
      for (let index = 0; index < accountList.length; index++) {
        const acctNo = accountList[index];

        await CheckAccountInfo.CommomCheck({ acctNo, mainCd }, (_, res) => {
          if (res.medmOtherSt[3] === "1") {
            // 共管户
            message.push(acct)
          }
        }, (error) => {
          // 接口查不出马上阻止
          message.splice(0, message.length, error.chnlMsgInfo || error.retMsg)
          stop = true
        })

        if (stop) {
          return onFail({ chnlMsgInfo: message[0] })
        }
      }

      if (message.length) {
        const pass = await new Promise(resolve => {
          nt.showMessagebox(`账号${message.join('，')}为共管账户，是否继续？`, '提示消息', {
            type: "info",
            showCancelButton: true,
            confirmButtonText: '继续',
            cancelButtonText: '暂停',
            beforeClose: (action, _instance, done) => {
              resolve(action === 'confirm')
              done()
            }
          })
        })

        if (!pass) {
          return onFail({ chnlRetCd: "1", chnlMsgInfo: `账号${message.join('，')}为共管账户` })
        }
      }
      onSuccess(CheckAccountInfo.CHECK_METHOD.GGH, null) // 共管户校验不返回任何数据
    }
  }

  /**
   * @summary 电信诈骗
   * @param {*} data {}
   * @param {*} onSuccess 成功回调，入参为 (type: {@link CheckAccountInfo.CHECK_METHOD.SKZHJC}, data: null)
   * @param {*} onFail 失败回调，入参为标准接口数据
   */
  static async CheckTelecommunicationFraudTypeMethod({ CheckTelecommunicationFraudType, acctNo, acctNm, listTp = "200501", vrfyKndTp = "AccountNumber" }, onSuccess, onFail) {
    if (CheckTelecommunicationFraudType == commonData.TelecommunicationFraudType.Nomal || CheckTelecommunicationFraudType == commonData.TelecommunicationFraudType.AllStop) {
      const res = await request.post("6617", { acctNo, acctNm, listTp, vrfyKndTp }).catch(err => err)
      if (!res.msgCode) return onFail({ chnlRetCd: "-1", chnlMsgInfo: res.chnlMsgInfo })
      if (res.vrfyRslt == "1") {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N100 })
      } else if (res.vrfyRslt == "2") {
        if (CheckTelecommunicationFraudType == commonData.TelecommunicationFraudType.Nomal) {
          const res = await nt.showQuestionMessageBox(commonData.ErrorMessage.N090, "询问信息", 0, results).catch(err => err)
          if (res == "cancel") {
            return onFail({ chnlRetCd: "-1", chnlMsgInfo: "电信诈骗可疑账户，不允许交易" })
          }
        } else if (CheckTelecommunicationFraudType == commonData.TelecommunicationFraudType.AllStop) {
          return onFail({ chnlRetCd: "-1", chnlMsgInfo: "电信诈骗可疑账户，不允许交易" })
        }

      }
    }
  }

  /**
   * @summary 反洗钱
   * @param {*} data {acctNo} 
   * @param {*} onSuccess 成功回调，入参为 (type: {@link CheckAccountInfo.CHECK_METHOD.SKZHJC}, data: null)
   * @param {*} onFail 失败回调，入参为标准接口数据
   */
  static async CheckAntiMoneyLaunderingTypeMethod({ CheckAntiMoneyLaunderingType, acctNo, acctNm, identTp, identNo, flgCd1 = "1000000000" }, onSuccess, onFail) {
    if (CheckAntiMoneyLaunderingType == commonData.AntiMoneyLaunderingType.Nomal) {
      const param = {
        acctNm,
        identNo,
        identTp,
        acctNo,
        flgCd: flgCd1
      }
      const res = await request.post("62b3", param, { type: commonData.SysType.MBFE }).catch(err => err)
      if (!res.msgCode) return onFail({ chnlRetCd: "-1", chnlMsgInfo: res.chnlMsgInfo })
      //命中
      if (res.vrfyRslt == "1") {
        //命中政要类型，界面弹出提示
        if (res.listTp == "04") {
          const res = await nt.showQuestionMessageBox(`监控对象涉嫌${result.MZMDLXMS},是否暂停交易？`, "询问信息", 0, results).catch(err => err)
          if (res == "cancel") {
            return onFail({ chnlRetCd: "-1", chnlMsgInfo: `监控对象涉嫌${result.MZMDLXMS}` })
          }
        } else {
          return onFail({ chnlRetCd: "-1", chnlMsgInfo: `监控对象涉嫌${result.MZMDLXMS},拒绝交易、冻结资产、报告公安机关。` })
        }
      } else if (res.vrfyRslt == "2") {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: `监控对象涉嫌${result.MZMDLXMS},进行人工审核后才能继续交易。` })
      }
    }

  }

  /**
   * @summary 受控账户检查
   * @param {*} data 校验入参 {exnFlgCd: k025的 exnFlgCd,CheckControledAccountMethod ：commonData.CheckControledAccountType的数据}
   * @param {*} onSuccess 成功回调，入参为 (type: {@link CheckAccountInfo.CHECK_METHOD.SKZHJC}, data: null)
   * @param {*} onFail 失败回调，入参为标准接口数据
   * @returns {void}
   */
  static async CheckControledAccountMethod(data, onSuccess, onFail) {
    if (data.CheckControledAccount == commonData.CheckControledAccountType.All) {
      if (data.exnFlgCd && data.exnFlgCd.length > 11 && (data.exnFlgCd[11] == "1" || data.exnFlgCd[11] == "2")) {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: "受控账户不允许操作交易" })
      }
    } else if (data.CheckControledAccount == commonData.CheckControledAccountType.Nomal) {
      if (data.exnFlgCd && data.exnFlgCd.length > 11 && data.exnFlgCd[11] == "1") {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: "全渠道受控类型的账户不允许操作交易" })
      }
    }
  }

  /**
   * @summary 检查客户类型
   * @param {*} data 该检验方法需要的入参 {checkClientType，cstTp：客户类型 }
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   * @returns 
   */
  static async CheckClientTypeMethod(data, onSuccess, onFail) {
    if (data.CheckClientType == commonData.AllowClientType.Person) {
      if (data.cstTp != GlobalVariable.PersonalClient) {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N013 })
      }
    } else if (data.CheckClientType == commonData.AllowClientType.Company) {
      if (data.cstTp != GlobalVariable.CompanyClient) {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N012 })
      }
    }
  }

  /**
   * @summary 检查账户类型
   * @param {*} data {CheckAccountType: 检查账户类型, pdTp: 产品类型 }
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   * @returns 
   */
  static async CheckAccountTypeMethod(data, onSuccess, onFail) {
    if (data.CheckAccountType == commonData.AllowAccountType.Deposit && data.pdTp != GlobalVariable.DepositAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N014 })
    } else if (data.CheckAccountType == commonData.AllowAccountType.Fixed && data.pdTp != GlobalVariable.FixedAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N015 })
    } else if (data.CheckAccountType == commonData.AllowAccountType.Inner && data.pdTp != GlobalVariable.InternalAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N016 })
    } else if (data.CheckAccountType == commonData.AllowAccountType.DepositAndFixed && data.pdTp != GlobalVariable.DepositAccount && data.pdTp != GlobalVariable.FixedAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "请输入活期账户或定期账户" })
    } else if (data.CheckAccountType == commonData.AllowAccountType.DepositAndInner && data.pdTp != GlobalVariable.DepositAccount && data.pdTp != GlobalVariable.InternalAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "请输入活期账户或内部账户" })
    } else if (data.CheckAccountType == commonData.AllowAccountType.FixedAndInner && data.pdTp != GlobalVariable.FixedAccount && data.pdTp != GlobalVariable.FixedAccount) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "请输入定期账户或内部账户" })
    }
  }

  /**
   * @summary 检查办理机构
   * @param {*} data {CheckBusinessKinbrType: 检查办理机构类型，cstTp：客户类型，opnAcctBrchNo：开户机构号}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   * @returns 
   */
  static async CheckBusinessKinbrMethod(data, onSuccess, onFail) {
    if (data.CheckBusinessKinbrType == commonData.AllowBusinessKinbrType.LocalKinbr && data.opnAcctBrchNo.trim() != common.userInfo.brnNo) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "请到账户开户机构办理此业务" })
    } else if (data.CheckBusinessKinbrType == commonData.AllowBusinessKinbrType.Special && data.cstTp == GlobalVariable.CompanyClient) {
      if (data.opnAcctBrchNo.trim() != common.userInfo.brnNo && [GlobalVariable.QS_Center, GlobalVariable.CS_Center, GlobalVariable.FIN_Center].includes(common.userInfo.brnNo)) {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: "请到账户开户机构或业务处理中心办理此业务" })
      }
    }
  }

  /**
   * @summary 检查保证金账户限制
   * @param {*} data {CheckMarginType: 保证金账户限制类型,pdTp: 产品类型，accTp：账户类型, mainTranCd: 主交易码, pdNo: 产品号}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckMarginAccountLimitMethod(data, onSuccess, onFail) {
    if (data.CheckMarginType == commonData.AllowMarginType.Forbid) {
      if (data.pdTp == GlobalVariable.DepositAccount && (data.accTp == GlobalVariable.MarginAccount || data.accTp == GlobalVariable.ForeignCurMarginAccount)) {
        return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账号不能是保证金账户" })
      } else if (data.pdTp == GlobalVariable.FixedAccount) {
        const res = request.post("k042", { listCd: "A023", mainTranCd: data.mainTranCd }).catch(err => err)
        if (res.fileData.includes(data.pdNo)) {
          return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账号不能是保证金账户" })
        }
      }
    }
  }

  /**
   * @summary 临时户过期
   * @param {*} data {IsCheckTempAccountEndDate: 临时户过期, accTp: 账户类型, exnFlgCd: 扩展标志位}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckTempAccountEndDateMethod(data, onSuccess, onFail) {
    if (data.IsCheckTempAccountEndDate && data.accTp == GlobalVariable.TemporaryDepositAccount && (data.exnFlgCd && data.exnFlgCd.legnth > 5) && data.exnFlgCd[5] == "Y") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N112 })
    }
  }

  /**
   * @summary 需要提示的管控账户类型
   * @param {*} data {cstTp：客户类型, medmOtherSt: 介质扩展状态}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async ShowTipAccountTypeMethod(data, onSuccess, onFail) {
    const typeInfo = [
      { value: "1", label: "该账户为共管账户" },
      { value: "2", label: "该账户为监管账户" },
      { value: "3", label: "该账户为商品房预售资金监管户" },

    ]
    if (data.cstTp == GlobalVariable.CompanyClient && data.ShowTipAccountType == commonData.AllowShowTipAccountType.All) {
      if (data.medmOtherSt[3] == "1" || data.medmOtherSt[3] == "2" || data.medmOtherSt[3] == "3") {
        const res = await nt.showQuestionMessageBox(`${typeInfo[data.medmOtherSt[3]]}，是否继续`, "询问信息", 0, results).catch(err => err)
        if (res == "cancel") {
          return onFail({ chnlRetCd: "-1", chnlMsgInfo: typeInfo[data.medmOtherSt[3]].label })
        }
      }
    }
  }

  /**
   * @summary 账户状态校验
   * @param {*} data {CheckAccountState: 账户状态校验, }
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckAccountStateMethod(data, onSuccess, onFail) {
    if (data.CheckAccountState == commonData.AllowAccountState.Nomal && data.acctSt != "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N032 })
    } else if (data.CheckAccountState == commonData.AllowAccountState.TobeConfirmed && data.acctSt != "1" && data.acctSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是正常状态或开户待确认状态" })
    } else if (data.CheckAccountState == commonData.AllowAccountState.Handed && data.acctSt != "1" && data.acctSt != "6") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是正常状态或转久悬状态" })
    } else if (data.CheckAccountState == commonData.AllowAccountState.HandedAndTobeConfirmed && data.acctSt != "1" && data.acctSt != "6" && data.acctSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是正常状态，开户待确认状态或转久悬状态" })
    } else if (data.CheckAccountState == commonData.AllowAccountState.TobeConfirmedOnly && data.acctSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是开户待确认状态" })
    } else if (data.CheckAccountState == commonData.AllowAccountState.HandedOnly && data.acctSt != "6") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是转久悬状态" })
    }
  }

  /**
   * @summary 介质状态校验
   * @param {*} data {CheckMediaState: 介质状态校验, medmSt: 介质状态 }
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckMediaStateMethod(data, onSuccess, onFail) {
    if (data.CheckMediaState == commonData.AllowMediaState.Nomal && data.medmSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N023 })
    } else if (data.CheckMediaState == commonData.AllowMediaState.LossOnly && data.medmSt != "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是挂失状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.ActivatedOnly && data.medmSt != "#") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是未激活状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.ClosingOnly && data.medmSt != "8") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是待销户状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.Loss && data.medmSt != "0" && data.medmSt != "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态或挂失状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.Activated && data.medmSt != "0" && data.medmSt != "#") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态或未激活状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.Closing && data.medmSt != "0" && data.medmSt != "8") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态或待销户状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.LossAndActivated && data.medmSt != "0" && data.medmSt != "1" && data.medmSt != "#") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态，挂失状态或未激活状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.LossAndClosing && data.medmSt != "0" && data.medmSt != "1" && data.medmSt != "8") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态，挂失状态或待销户状态" })
    } else if (data.CheckMediaState == commonData.AllowMediaState.LossAndActivatedClosing && data.medmSt != "0" && data.medmSt != "1" && data.medmSt != "8" && data.medmSt != "#") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该介质不是正常状态，挂失状态，未激活状态或待销户状态" })
    }
  }

  /**
   * @summary 账户止付校验
   * @param {*} data {CheckStopPaymentState: 账户止付校验, accFbdPymtSt: 账户止付状态}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckStopPaymentStateMethod(data, onSuccess, onFail) {
    if (data.CheckStopPaymentState == commonData.AllowStopPaymentState.Nomal && data.accFbdPymtSt && data.accFbdPymtSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户止付状态不正常" })
    } else if (data.CheckStopPaymentState == commonData.AllowStopPaymentState.PartStop && data.accFbdPymtSt == "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N103 })
    } else if (data.CheckStopPaymentState == commonData.AllowStopPaymentState.PartStopOnly && data.accFbdPymtSt && data.accFbdPymtSt != "3") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是部分止付状态" })
    }
  }


  /**
   * @summary 账户冻结校验
   * @param {*} data {CheckFreePaymentState: 账户冻结校验, accFrzSt: 账户冻结状态}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckAccountFreePaymentMethod(data, onSuccess, onFail) {
    if (data.CheckFreePaymentState == commonData.AllowFreePaymentState.Nomal && data.accFrzSt && data.accFrzSt != "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户冻结状态不正常" })
    } else if (data.CheckFreePaymentState == commonData.AllowFreePaymentState.FreeStop && (data.accFrzSt == "1" || data.accFrzSt == "2")) {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N101 })
    } else if (data.CheckFreePaymentState == commonData.AllowFreePaymentState.FreeStopOnly && data.accFrzSt && data.accFrzSt != "3") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不是部分冻结状态" })
    } else if (data.CheckFreePaymentState == commonData.AllowFreePaymentState.NoAllFree && data.accFrzSt == "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: commonData.ErrorMessage.N101 })
    }
  }

  /**
   * @summary 检查通存通兑
   * @param {*} data {CheckDepositAndWithdrawal: 检查通存通兑，opnAcctBrchNo：开户机构号，opnFlg：开通标志}
   * @param {function} onSuccess 成功回调，入参为 (type: 该校验方法在该类中的配置映射值, data: 接口返回数据)
   * @param {function} onFail 失败回调，入参为 空 或 标准接口数据
   */
  static async CheckDepositAndWithdrawalMethod(data, onSuccess, onFail) {
    if (data.CheckDepositAndWithdrawal == commonData.AllowDepositAndWithdrawal.Withdrawal && data.opnAcctBrchNo != common.userInfo.brnNo && common.userInfo.brnNo != GlobalVariable.QS_Center && data.opnFlg && data.opnFlg.length > 4 && data.opnFlg[4] != "1") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不允许通兑,请到开户行办理" })
    } else if (data.CheckDepositAndWithdrawal == commonData.AllowDepositAndWithdrawal.Deposit && data.opnAcctBrchNo != common.userInfo.brnNo && common.userInfo.brnNo != GlobalVariable.QS_Center && data.opnFlg && data.opnFlg.length > 4 && data.opnFlg[4] == "0") {
      return onFail({ chnlRetCd: "-1", chnlMsgInfo: "该账户不允许通存,请到开户行办理" })
    }
  }


}


export default CheckAccountInfo