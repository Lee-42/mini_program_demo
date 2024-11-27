import request from '../../../../utils/request'
import common from '../../../../common'
import UserVariable from '../../../../common/UserVariable'
import utils from '../../../../utils/utils'


Component({
  data: {
    formModel: {
      acctNo: "", // 账号
      acctSrlNo: "", // 账户序号
      acctNm: "", // 账户名称
      brchNo: "", // 开户网点
      acctTp: "", // 账户类型
      adHngDt: "", // 上挂日期
      currencyCcy: "", // 币种
      cashDrftFlg: "", // 钞汇标志
      acctBlngMainInd: "", // 账户属主标识
      mainAcctFlg: "", // 是否主账户
      acctPrvgCd: "", // 账号权限
      snglTfrAcctRstdLmt: "", // 单笔限额
      tfrAcctDayAcmRstdLmt: "", // 日累计限额
      tfrAcctSnglDayLineNum: "", // 日笔数
      limitPerMon: "", // 月累计限额
      tfrAcctYrAcmRstdLmt: "", // 年累计限额
      // 隐藏属性
      exnFlgCd: "", // 商品房监管户
      swtchNo: "", // 交换号  调用 2110esb 获取，是什么就送什么，不做任何处理
      bankAcType: "", // 账户类型  调用 2110esb 获取，是什么就送什么，不做任何处理
      bnkAcctChrctrstcAttr: "", // 银行账户性质  调用 2110esb 获取，是什么就送什么，不做任何处理
      bankSingleLimit: "", // 单笔限额（银行级）
      bankDayAdded: "", // 日累计限额（银行级）
      bankDayAccountLimit: "", // 日笔数（银行级）
      bankYearLimit: "", // 年累计限额（银行级）
    },
    acctList: UserVariable.STATIC_ACCTTP_LIST.slice(0, UserVariable.STATIC_ACCTTP_LIST.length),
    cashDrftFlgList: [],

    // 控制属性，控制表单可填、可选、隐藏、显示
    acRightReadonly: false, // 一户通二级账户,定期账户，保证金产品只能进行查询功能
  },
  properties: {
    mainCd: { type: String, required: true },
    expandFormData: { type: Object }, // 表单辅助数据，需要外部传入
    isOneStop: Boolean,
  },
  async ready() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    this.data.formModel.adHngDt = userInfo.tran_date ? userInfo.tran_date.replace(/-/g, "") : (() => {
      const now = new Date()
      return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
    })()

    await utils.getSelectData({ mainCd: this.data.mainCd, flg: '0075', name: 'cashDrftFlgList', that: this }) // 钞汇标志

    // 控制焦点
    if (this.data.isOneStop) {
      const input = document.querySelector("[myautofocus=one-stop-upload-account] > select")
      if (input) {
        input.focus()
      }
    } else {
      const input = document.querySelector(".nt-input__inner[myautofocus=upload-account]")
      if (input) {
        input.focus()
      }
    }
  },
  methods: {
    // 账号校验
    async onAccountValidate(_rule, value, callback) {
      const res = await request.post('k025', {
        acctNo: value,
        mainTranCd: this.data.mainCd,
      })
      const {
        exnFlgCd, // 标志位
        pdTp, // 产品类型
      } = res

      // 贷款户/共管户/定期/保证金产品  提示
      let accountType = []

      if (pdTp === '3') {
        // TODO 如果是贷款账号，需要调用【贷款账户信息检查接口检查贷款账户状态】
        // CXCL-0022   贷款账号列表查询
        // const res = await request.post('CXCL-0022', {
        //     acctNo: value,
        // })

        // this.data.formModel.acctSrlNo = acctSrlNo

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
        // TODO CXCL-1014 查询账户列表(包含一户通二级账户)
        const childAccountRes = await request.post('cxcl1014', {
          acctNo: value,
          acctStFlg: "1", // 账户状态标志 1:不返回已销户账户  空值:返回所有账户
          acctTp: "", // 账户类型 空值返回所有活期、定期子账户 
          cntnDepFlg: "", // 续存标志 空值:不可以
          mainTranCd: this.data.mainCd,
          listCd: "1014"
        })
        const { fileDataList } = childAccountRes
        if (!fileDataList.length) return callback(false, "没有可选的账号信息")
        const heads = ["账户序号", "开户日期", "产品名称", "账户状态", "冻结状态", "止付状态"]
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
          acctSt, // 账户状态
          acctNm, // 账户名称
          medmOtherSt, // 介质扩展状态
          pdTp, // 产品类型
          pdNo, // 产品号
          exnFlgCd, // 扩展标志位
          cstNo, // 客户号
          accTp, // 账户类型
          flgCd, // 标志位
          currencyCcy, // 币种
        } = res

        // 账户状态不是 正常 或者 开户待确认允许进行此交易
        if (acctSt !== '1' && acctSt !== '0') {
          return callback(false, "账户状态不正常！")
        }


        Object.assign(this.data.formModel, {
          acctNm: acctNm.trim(),
          // identTp: acctIdentTp,
          // identNo: identNo,
          exnFlgCd: exnFlgCd[17], // 商品房监管户
        })

        // 检查从网银获取的核心客户号和当前输入账号的核心客户号是否一致，不一致说明不是同一客户,内部户除外
        // 非内部户
        if (pdTp !== '9') {
          if (cstNo.trim() !== this.data.expandFormData.coreSeq) {
            return callback(false, "不是同一客户")
          }

          if (pdTp === '2') {
            // 定期账户
            accountType.push("定期")
            this.data.formModel.acctTp = null // 定期账户无【账户类型】
          } else {
            this.data.formModel.acctTp = accTp
          }

          // 共管户/定期/保证金产品  增加提示信息
          if (medmOtherSt[3] === '1') {
            // 共管户
            accountType.push("共管户")
          }

          // 查询保证金产品列表，收息户不能是保证金类型的
          let isA = false
          const prdResponse = await request.post('k042', {
            listCd: 'A008', // 列表编码（标识）
            bckCd: 'K042', // 备用代码（主交易代码）
            tranCd: 'K042',
            mainTranCd: this.data.mainCd,
          })
          if (prdResponse.fileData) {
            const arr = prdResponse.fileData.split(",")
            if (arr.some(pNo => pNo.includes(pdNo))) {
              isA = true
              accountType.push("保证金产品")
            }
          }

          // 一户通二级账户,定期账户，保证金产品只能进行查询功能
          if (flgCd[34] === 'Z' || pdTp === '2' || isA || this.data.expandFormData.riskLevel === '3') {
            this.data.formModel.acctPrvgCd = 'Q'
            this.data.acRightReadonly = true
          } else {
            // K018 客户信息查询是否是简易开户
            const res = await request.post('k018', {
              cstNo: cstNo.trim(),
              mainTranCd: this.data.mainCd,
            })
            const {
              exnFlgCd, // 扩展标志位
            } = res

            if (exnFlgCd[6] === '1') { // 1简易开户0非简易开户
              nt.showMessagebox(`简易开户的账号仅允许签约查询版网银`, '提示', {
                type: 'info',
                confirmButtonText: '知道了',
              })
              this.data.formModel.acctPrvgCd = 'Q'
              this.data.acRightReadonly = true
            } else {
              this.data.formModel.acctPrvgCd = null
              this.data.acRightReadonly = false
            }
          }
        }
        // 内部户
        else {
          // K132 检查内部户是否为他行代发过渡户并且和加挂的对公账户名称是否一致
          const res = await request.post('k132', {
            queryFlg: '0002', // 0002 - 根据账号查询是否为他行账号关联的内部过渡户
            ZH: this.data.formModel.acctNo,
          })
          const { qryRslt } = res

          if (qryRslt === 'Y') {
            return callback(false, "仅允许加挂已维护单位信息的他行代付过渡户")
          }
          if (this.expandFormData.clientName + "代付过渡户" !== acctNm) {
            return callback(false, "代理过渡户单位名称与当前企业网银客户名称不一致")
          }

          accountType.push("内部户")
          this.data.formModel.acctTp = null // 内部户无【账户类型】
          this.data.acRightReadonly = false
        }

        Object.assign(this.data.formModel, {
          currencyCcy,
          cashDrftFlg: flgCd[49],
        })
      }

      // 提醒
      if (accountType.length) {
        const pass = await new Promise(resolve => {
          nt.showMessagebox(`该账号为${accountType.join('/')}，是否继续？`, '询问消息', {
            type: 'info',
            showCancelButton: true,
            confirmButtonText: '继续',
            cancelButtonText: '暂停',
            beforeClose: (action, _instance, done) => {
              if (action === 'confirm') {
                resolve(true)
              } else {
                resolve(false)
              }
              done()
            }
          })
        })
        if (!pass) return callback(pass)
      }

      // 合并 账号 - 账户序号
      const { acctNo, acctSrlNo } = this.data.formModel
      let AccountNo = utils.splitOrMerge({ acctNo, acctSrlNo })

      // 2110 账户详细信息查询 
      try {
        const accountDetail = await request.post('2110esb', {
          acctNo: AccountNo, // 账号
          cnlNo: 'EIBS', // 渠道号
          coreCstNo: this.data.expandFormData.coreSeq, // 核心客户号
        })

        const {
          swtchNo, // 交换号
          acctTp, // 账户类型
          bnkAcctChrctrstcAttr, // 银行账户性质
          brchNo, // 机构号
        } = accountDetail

        Object.assign(this.data.formModel, {
          swtchNo,
          bankAcType: acctTp,
          bnkAcctChrctrstcAttr,
          brchNo,
        })
        callback(true)
      } catch (error) {
        callback(false, error.chnlMsgInfo)
      }
    },

    async onAcRightValidate(_rule, value, callback) {
      // FT  - 任意转出   Q   - 仅开通查询
      if (value === 'FT' && this.data.formModel.acctTp !== 'E') {
        // 非 外币户（E） 反显单笔限额
        // 0300 银行限额查询 
        const limitData = await request.post('0300esb', {})
        const { fileData } = limitData

        if (fileData) {
          const riskLevel = this.data.expandFormData.riskLevel
          const result = fileData.match(/BeginRstdLmtInfArr(\s|\S)+EndRstdLmtInfArr/);
          const arr = result[0].split("\r\n")
          // arr.shift() // 去掉 BeginPrdsetList
          // arr.pop() // 去掉 EndPrdsetList
          for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (['BeginRstdLmtInfArr', 'EndRstdLmtInfArr'].includes(element)) {
              continue
            }
            let [
              eqmtTp, , , , cnlGrpgNo, LmtTmDmnlt, , AmtLmt, LineNumLmt, , rskLvl
            ] = element.split("|")

            if (
              eqmtTp === "2001" // 椰盾设备编号
              && rskLvl === riskLevel // 风险等级一致
            ) {
              if (!cnlGrpgNo) {
                switch (LmtTmDmnlt) {
                  case "0":
                    this.data.formModel.bankSingleLimit = AmtLmt // 单笔限额（银行级）
                    break;
                  case "1":
                    this.data.formModel.bankDayAdded = AmtLmt // 日累计限额（银行级）
                    this.data.formModel.bankDayAccountLimit = LineNumLmt // 日笔数（银行级）
                    break;
                  case "4":
                    this.data.formModel.bankYearLimit = AmtLmt // 年累计限额（银行级）
                    break;
                  default:
                    break;
                }
              } else if (cnlGrpgNo === "2001") {
                // 直销银行
                switch (LmtTmDmnlt) {
                  case "0":
                    this.data.formModel.snglTfrAcctRstdLmt = AmtLmt // 单笔限额
                    break;
                  case "1":
                    this.data.formModel.tfrAcctDayAcmRstdLmt = AmtLmt // 日累计限额
                    this.data.formModel.tfrAcctSnglDayLineNum = LineNumLmt // 日笔数
                    break;
                  case "4":
                    this.data.formModel.tfrAcctYrAcmRstdLmt = AmtLmt // 年累计限额
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      } else {
        // 清空 限额
        Object.assign(this.data.formModel, {
          snglTfrAcctRstdLmt: "",
          tfrAcctDayAcmRstdLmt: "",
          tfrAcctSnglDayLineNum: "",
          tfrAcctYrAcmRstdLmt: "",
        })
      }
      callback(true)
    },

    // 单笔限额
    onPerTrsValidate(_rule, value, callback) {
      value = +value
      if (value === 0) {
        return callback(false, "单笔限额必须大于0")
      } else if (value > this.data.formModel.bankSingleLimit) {
        return callback(false, `不能大于银行单笔最高限额: ${this.data.formModel.bankSingleLimit}`)
      }
      callback(true)
    },

    // 日累计限额
    onPerDayValidate(_rule, value, callback) {
      value = +value
      if (value === 0) {
        return callback(false, "日累计限额必须大于0")
      }
      if (value < this.data.formModel.snglTfrAcctRstdLmt) {
        return callback(false, "单笔限额大于日累计限额")
      }
      if (value > this.data.formModel.bankDayAdded) {
        return callback(false, `不能大于银行日累计最高限额: ${this.data.formModel.bankDayAdded}`)
      }
      callback(true)
    },

    // 日笔数
    onPerTimeValidate(_rule, value, callback) {
      value = +value
      if (value > this.data.formModel.bankDayAccountLimit) {
        return callback(false, `不能大于银行最高笔数限制: ${this.data.formModel.bankDayAccountLimit}`)
      }
      callback(true)
    },

    // 月累计限额
    // onPerMonValidate(_rule, value, callback) {
    //   value = +value
    //   if (value === 0) {
    //     return callback(false, "月累计限额必须大于0")
    //   }
    //   if (value < this.data.formModel.tfrAcctDayAcmRstdLmt) {
    //     return callback(false, `月累计限额小于日累计限额`)
    //   }
    //   callback(true)
    // },

    // 年累计限额
    onYearTrsValidate(_rule, value, callback) {
      value = +value
      if (value === 0) {
        return callback(false, "年累计限额必须大于0")
      }
      if (value < this.data.formModel.tfrAcctDayAcmRstdLmt) {
        return callback(false, `日累计限额大于年累计限额`)
      }
      if (value > this.data.formModel.bankYearLimit) {
        return callback(false, `不能大于银行年累计最高限额: ${this.data.formModel.bankYearLimit}`)
      }
      callback(true)
    },

    submit() {
      const { acctNo, acctSrlNo } = this.data.formModel
      let AccountNo = utils.splitOrMerge({ acctNo, acctSrlNo }) // 生成非核心格式的账户
      this.$emit('submit', {
        ...this.data.formModel,
        AccountNo,
        limitPerMon: "", // 月累计限额  写死传空  网银要求
      })
    },

    // 账户属主标识   与企业网银控制相同  授权账户 不能为主账户
    onOwnerFlagChange(value) {
      if (value === '0') {
        // 授权账户 不能为主账户
        this.data.formModel.mainAcctFlg = '0'
      }
    },

    // Exposes
    setFields(fields) {
      if (fields) {
        const { formModel } = this.data
        for (const key in fields) {
          if (Object.hasOwnProperty.call(formModel, key)) {
            const value = fields[key];
            formModel[key] = value;
          }
        }
      }
    }
  }
})