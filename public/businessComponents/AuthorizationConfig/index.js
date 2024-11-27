import request from '../../utils/request.js'
import utils from '../../utils/utils'

Component({
  properties: {
    type: String,
    idEdit: Boolean,
    scene: {
      type: String,
      default: "authConfig",
    },
    accountOptions: {
      type: Object,
      default: () => []
    },
    productOptions: {
      type: Object,
      default: () => []
    },
    formModel: {
      type: Object,
      default: () => ({
        acctNo: "", // 账号 - 隐藏
        acctSrlNo: "", // 账户序号
        pdNo: "", // 产品号
        lvl1ChkTms: "", // 一级复核次数
        lvl2ChkTms: "", // 二级复核次数
        lvl3ChkTms: "", // 三级复核次数
        lvl4ChkTms: "", // 四级复核次数
        lvl5ChkTms: "", // 五级复核次数
        lvl6ChkTms: "", // 六级复核次数

        // 辅助表单数据，不参与实际接口提交
        oprNm: "", // 操作员姓名
        oprNo: "", // 操作员号
        usrNo: "", // 用户号
        acctNoSrlNo: "", // 账户序号
        chkLvl: "", // 复核级别
        oprRl: "", // 角色名称
        minCnChkAMt: "", // 最少可复核金额(含)
        maxCnChkAMt: "", // 最大可复核金额(含)
        drctExtrnlDsbrAmt: "", // 对外支付金额(含)

        eleCstNo: "", // 电子银行客户号
      })
    },
    roleList: {
      type: Array,
      default: () => [],
    }
  },
  data: {
    accountConfigs: [
      // { prop: "usrNo", label: "用户号" },
      { prop: "oprNo", label: "操作员号" },
      { prop: "oprNm", label: "操作员姓名" },
      { prop: "chkLvl", label: "复核级别" },
      // { prop: "acctNoSrlNo", label: "账号序号" },
      { prop: "minCnChkAMt", label: "最少可复核金额(含)", attrs: { width: "200" } },
      { prop: "maxCnChkAMt", label: "最大可复核金额(含)", attrs: { width: "200" } },
      { prop: "drctExtrnlDsbrAmt", label: "直接对外支付金额(含)", attrs: { width: "210" } },
      { prop: "oprRl", label: "操作员角色" },
    ],
    productConfigs: [
      // { prop: "usrNo", label: "用户号" },
      { prop: "oprNo", label: "操作员号" },
      { prop: "oprNm", label: "操作员姓名" },
      { prop: "chkLvl", label: "复核级别" },
    ],
  },
  methods: {
    // 2316 待复核业务确认
    async ifHasRecheckInfo() {
      try {
        const res = await request.post("2316esb", {
          acctNo: "", // 账号
          oprNo: "", // 操作员号
        });
        // 操作员是否有待复合交易 0 - 有  1 - 无
        if (res.flg.trim() !== "1") {
          await new Promise((resolve, reject) => {
            nt.showMessagebox(`该客户存在待复核业务，请客户确认，是否删除后继续？`, '询问消息', {
              type: 'info',
              showCancelButton: true,
              confirmButtonText: '是',
              cancelButtonText: '否',
              beforeClose: (action, _instance, done) => {
                if (action === 'confirm') {
                  resolve();
                } else {
                  reject({ chnlMsgInfo: "" });
                }
                done();
              }
            })
          });
        }
      } catch (error) {
        return Promise.reject(error.chnlMsgInfo);
      }
    },
    // 选择账号时
    async onAccountValidate(_rule, value, callback) {
      if (this.data.scene === "authConfig") {
        // 待复核交易查询
        try {
          await this.ifHasRecheckInfo();
        } catch (error) {
          return callback(false, error);
        }
      }

      const opt = this.data.accountOptions.find(opt => opt.value === value)
      this.data.formModel.acctNo = opt.label

      try {
        // 非编辑状态
        if (!this.data.idEdit) {
          const res = await request.post("2108esb", {
            acctNoSrlNo: value, // 账号序号
            cstNo: this.data.formModel.eleCstNo, // 客户号
          })

          const {
            lvl1ChkTms, // 一级复核次数
            lvl2ChkTms, // 二级复核次数
            lvl3ChkTms, // 三级复核次数
            lvl4ChkTms, // 四级复核次数
            lvl5ChkTms, // 五级复核次数
            lvl6ChkTms, // 六级复核次数
            fileData,
          } = res

          if (!lvl1ChkTms) {
            // 仅提示
            nt.showMessagebox("未设置审核流程配置！", "提 示", {
              type: 'info',
              confirmButtonText: '知道了',
            })
            Object.assign(this.data.formModel, {
              lvl1ChkTms: "0", // 一级复核次数
              lvl2ChkTms: "0", // 二级复核次数
              lvl3ChkTms: "0", // 三级复核次数
              lvl4ChkTms: "0", // 四级复核次数
              lvl5ChkTms: "0", // 五级复核次数
              lvl6ChkTms: "0", // 六级复核次数
            })
          } else {
            Object.assign(this.data.formModel, {
              lvl1ChkTms: lvl1ChkTms.trim(), // 一级复核次数
              lvl2ChkTms: lvl2ChkTms.trim(), // 二级复核次数
              lvl3ChkTms: lvl3ChkTms.trim(), // 三级复核次数
              lvl4ChkTms: lvl4ChkTms.trim(), // 四级复核次数
              lvl5ChkTms: lvl5ChkTms.trim(), // 五级复核次数
              lvl6ChkTms: lvl6ChkTms.trim(), // 六级复核次数
            })
          }

          if (fileData) {
            const parsed = utils.parseFileData(fileData, { beginFlag: "BeginList", endFlag: "EndList" })

            this.data.roleList.splice(0, this.data.roleList.length, ...parsed.map(data => {
              const [
                usrNo, // 用户号
                oprNo, // 操作员号
                oprNm, // 操作员姓名
                chkLvl, // 复核级别
                acctNoSrlNo, // 账号序号
                minCnChkAMt, // 最少可复核金额
                maxCnChkAMt, // 最多可复核金额
                drctExtrnlDsbrAmt, // 直接对外支付金额
                oprRl, // 操作员角色
              ] = data
              return {
                usrNo, oprNo, oprNm, chkLvl, acctNoSrlNo, minCnChkAMt, maxCnChkAMt, drctExtrnlDsbrAmt, oprRl,
              }
            }))
          }
        }
      } catch (error) {
        return callback(false, error.chnlMsgInfo || error.retMsg)
      }

      callback(true)
    },
    // 选择产品时
    async onProductValidate(_rule, value, callback) {
      if (this.data.scene === "authConfig") {
        // 待复核交易查询
        try {
          await this.ifHasRecheckInfo();
        } catch (error) {
          return callback(false, error);
        }
      }

      try {
        // 非编辑状态
        if (!this.data.idEdit) {
          const res = await request.post("2109esb", {
            pdNo: value, // 产品编号
            cstNo: this.data.formModel.eleCstNo, // 客户号
          })

          const {
            lvl1ChkTms, // 一级复核次数
            lvl2ChkTms, // 二级复核次数
            lvl3ChkTms, // 三级复核次数
            lvl4ChkTms, // 四级复核次数
            lvl5ChkTms, // 五级复核次数
            lvl6ChkTms, // 六级复核次数
            fileData,
          } = res

          if (!lvl1ChkTms) {
            // 仅提示
            nt.showMessagebox("未设置审核流程配置！", "提 示", {
              type: 'info',
              confirmButtonText: '知道了',
            })
            Object.assign(this.data.formModel, {
              lvl1ChkTms: "0", // 一级复核次数
              lvl2ChkTms: "0", // 二级复核次数
              lvl3ChkTms: "0", // 三级复核次数
              lvl4ChkTms: "0", // 四级复核次数
              lvl5ChkTms: "0", // 五级复核次数
              lvl6ChkTms: "0", // 六级复核次数
            })
          } else {
            Object.assign(this.data.formModel, {
              lvl1ChkTms: lvl1ChkTms.trim(), // 一级复核次数
              lvl2ChkTms: lvl2ChkTms.trim(), // 二级复核次数
              lvl3ChkTms: lvl3ChkTms.trim(), // 三级复核次数
              lvl4ChkTms: lvl4ChkTms.trim(), // 四级复核次数
              lvl5ChkTms: lvl5ChkTms.trim(), // 五级复核次数
              lvl6ChkTms: lvl6ChkTms.trim(), // 六级复核次数
            })
          }

          if (fileData) {
            const parsed = utils.parseFileData(fileData, { beginFlag: "BeginList", endFlag: "EndList" })

            this.data.roleList.push(...parsed.map(data => {
              const [
                usrNo, // 用户号
                oprNo, // 操作员号
                oprNm, // 操作员姓名
                chkLvl, // 复核级别
              ] = data
              return { usrNo, oprNo, oprNm, chkLvl }
            }))
          }
        }
      } catch (error) {
        return callback(false, error.chnlMsgInfo || error.retMsg)
      }

      callback(true)
    },

    // 复核次数规则校验
    onReCheckValidate(_rule, _value, callback) {
      const { lvl1ChkTms, lvl2ChkTms, lvl3ChkTms, lvl4ChkTms, lvl5ChkTms, lvl6ChkTms } = this.data.formModel
      const arr = [lvl1ChkTms, lvl2ChkTms, lvl3ChkTms, lvl4ChkTms, lvl5ChkTms, lvl6ChkTms]
      const message = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        const lv = +arr[i];
        if (Number.isNaN(lv)) {
          return callback(false, "请输入纯数字")
        }
        if (lv > 0) {
          for (let j = 0; j < i; j++) {
            const beforeLv = arr[j];
            if (beforeLv <= 0) {
              message.push(`${j + 1}级`)
            }
          }
        } else if (i === 0) {
          message.push(`${i + 1}级`)
        }
      }

      if (message.length) {
        callback(false, `${message.join("、")}复核次数须大于0`)
      } else {
        callback(true)
      }
    },

    // 账户相关 - 修改
    onAccountUpdate(row) {
      Object.assign(this.data.formModel, {
        oprNm: row.oprNm, // 操作员姓名
        oprNo: row.oprNo, // 操作员号
        usrNo: row.usrNo, // 用户号
        acctNoSrlNo: row.acctNoSrlNo, // 账号序号
        chkLvl: row.chkLvl, // 复核级别
        oprRl: row.oprRl, // 角色名称
        minCnChkAMt: row.minCnChkAMt, // 最少可复核金额(含)
        maxCnChkAMt: row.maxCnChkAMt, // 最大可复核金额(含)
        drctExtrnlDsbrAmt: row.drctExtrnlDsbrAmt, // 对外支付金额(含)
      })
      this.setFocus()
    },
    // 账户相关 - 删除
    onAccountRemove(row) {
      const index = this.data.roleList.findIndex(role => role.oprNo === row.oprNo)

      this.data.roleList.splice(index, 1)

      // 清空
      Object.assign(this.data.formModel, {
        oprNm: "", // 操作员姓名
        oprNo: "", // 操作员号
        usrNo: "", // 用户号
        acctNoSrlNo: "", // 账号序号
        chkLvl: "", // 复核级别
        oprRl: "", // 角色名称
        minCnChkAMt: "", // 最少可复核金额(含)
        maxCnChkAMt: "", // 最大可复核金额(含)
        drctExtrnlDsbrAmt: "", // 对外支付金额(含)
      })
    },
    // 非账户相关 - 修改
    onProductUpdate(row) {
      Object.assign(this.data.formModel, {
        oprNm: row.oprNm, // 操作员姓名
        oprNo: row.oprNo, // 操作员号
        usrNo: row.usrNo, // 用户号
        chkLvl: row.chkLvl, // 复核级别
      })
      this.setFocus()
    },
    // 非账户相关 - 删除
    onProductRemove(row) {
      const index = this.data.roleList.findIndex(role => role.oprNo === row.oprNo)

      this.data.roleList.splice(index, 1)

      // 清空
      Object.assign(this.data.formModel, {
        oprNm: "", // 操作员姓名
        oprNo: "", // 操作员号
        usrNo: "", // 用户号
        chkLvl: "", // 复核级别
      })
    },

    // 最大可复核金额 校验
    onMaxAmtValidate(_rule, value, callback) {
      const { minCnChkAMt } = this.data.formModel

      if (minCnChkAMt > 0 && value > 0 && value <= minCnChkAMt) {
        callback(false, "最大可复核金额必须大于最少可复核金额！")
      } else {
        callback(true)
      }
    },
    // 对外支付金额 校验
    onPayAmtValidate(_rule, value, callback) {
      const { maxCnChkAMt } = this.data.formModel
      if (value > maxCnChkAMt) {
        callback(false, "直接对外支付金额必须小于该操作员的最大可复核金额");
        return;
      }
      if (value < 0 && value != -1) {
        callback(false, "只能输入-1");
        return;
      }
      callback(true)
    },

    onConfirm() {
      if (this.data.type === "A") {
        const { oprNo, chkLvl, minCnChkAMt, maxCnChkAMt, drctExtrnlDsbrAmt } = this.data.formModel
        const target = this.data.roleList.find(role => role.oprNo === oprNo)
        Object.assign(target, {
          chkLvl, // 复核级别
          minCnChkAMt,
          maxCnChkAMt,
          drctExtrnlDsbrAmt,
        })
      }
      else if (type === "P") {
        const { oprNo, chkLvl } = this.data.formModel
        const target = this.data.roleList.find(role => role.oprNo === oprNo)
        Object.assign(target, {
          chkLvl, // 复核级别
        })
      }

      // 清空
      Object.assign(this.data.formModel, {
        oprNm: "", // 操作员姓名
        oprNo: "", // 操作员号
        usrNo: "", // 用户号
        acctNoSrlNo: "", // 账号序号
        chkLvl: "", // 复核级别
        oprRl: "", // 角色名称
        minCnChkAMt: "", // 最少可复核金额(含)
        maxCnChkAMt: "", // 最大可复核金额(含)
        drctExtrnlDsbrAmt: "", // 对外支付金额(含)
      })
    },

    setFocus() {
      setTimeout(() => {
        // 控制焦点
        const input = document.querySelector("[myautofocus=authorization-lv] select")
        if (input) {
          input.focus()
        }
      }, 500);
    }
  },
});
