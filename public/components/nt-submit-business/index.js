import common from "../../common";
import request from "../../utils/request";
import utils from "../../utils/utils";
import CheckAccountInfo from "../../common/functions/checkAccount";

const SYSTEM_MAP = {
  core: "",
  esb: "esb",
  spc: "", // 特殊模式（整合接口）
}

/* public\components\table\table\table.js */
Component({
  data: {
    //页面数据
    feeVisible: false,
    tableList: [], // 收费明细表
    // 收费方式列表
    chargeTypeList: [],
    // 收费弹窗表单
    dialogForm: {
      smzgChrgFlg: "0000", // 是否允许汇总收费 0000实时收费 
      chrgTotAmt: null, // 总金额
      chrgMd: null, // 收费方式
      wthdAcctNo: null, // 扣费账号 - 收费方式选择3时必输
      wthdAcctNm: null, // 扣费户名 - 收费方式选择3时必输
      accltnFlg: null, // 加急标志
      wthdAcctSrlNo: null, // 扣费账户序号 - 收费方式选择3时必输
      wthdAcctPswd: null, // 扣费账号密码 - 收费方式选择3时必输
    },
    // TODO 对接设备时开发
    ICJson: {}, // 收费方式为3时，收费账号读取设备的入参
    passwordJson: {}, // 收费方式为3时，密码读取设备的入参

  
    logFlag: false, // 是否打印
    printData: {}, // 打印数据
  },
  properties: {
    // 是否自动校验当前聚焦的表单
    isValidate: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeSubmit: {
      type: Function,
      default: () => {
        return true;
      }, // 默认返回 true
    },
    // 新增 afterSubmit 属性
    afterSubmit: {
      type: Function,
      default: () => {
        return true;
      }, // 默认返回 true
    },
    //props
    // 按钮位置
    align: {
      type: String,
      default: 'right'
    },
    // 收费交易接口参数
    paymentParams: {
      type: Object,
      default: () => {
        return {
          tranCd: "", // 如果是非核心系统（system !== "core"），该值必传，具体的收费接口
          cstNo: "", // 客户号
        };
      },
    },
    // Important 系统标识
    system: {
      type: String,
      default: "core",
    },
    // 交易码
    reqCode: {
      type: String,
      require: true,
    },
    // 交易参数
    reqParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 成功回调
    completeCallback: {
      type: Function,
    },
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  ready() {
    //节点加载完成(函数只执行一次)
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    initData(result) {
      const arr = result.split("\n")
      arr.pop() // 最后一行一定为空
      console.log("收费：", arr);

      if (arr[0]) {
        const chargeTypeList = [];
        const [
          chrgMd,  // 收费方式
          chrgBlacklistFlg,  // 收费黑名单标志
          acctNo,  // 交易账号
        ] = arr.shift().split("|")
        // 收费方式处理
        const map = [{ value: "1", label: "现金" }, { value: "2", label: "转账" }, { value: "3", label: "其他账号" }, { value: "4", label: "不收" }]
        for (let i = 0; i < chrgMd.length; i++) {
          const flag = chrgMd[i];
          if (flag === "1") {
            chargeTypeList.push(map[i])
          }
        }
        this.setData({ chargeTypeList })
      }

      // let total = 0;
      if (arr.length) {
        this.setData({
          tableList: arr.map(m => {
            const [
              costNm, // 费用名称
              rcvblsAmt,  // 应收金额
              ofclRcptsAmt // 实收金额
            ] = m.split("|")

            // total += Number(ofclRcptsAmt)

            return { costNm, rcvblsAmt, ofclRcptsAmt }
          })
        })
      }

      // 收费数据使用9986接口返回，不需要自行计算
      // this.setData({
      //   dialogForm: Object.assign(this.data.dialogForm, {
      //     chrgTotAmt: this.formatRoundNum(total, 2),
      //   }),
      // });
    },

    formatRoundNum(num, pre) {
      return (Math.floor(num * Math.pow(10, pre)) / Math.pow(10, pre)).toFixed(
        pre
      );
    },

    // initButton() {
    //   this.setData({
    //     disabled: false,
    //   });
    // },

    async handleClickEvent(e) {
      // 触发 beforeSubmit 钩子函数
      const beforeSubmitResult = await this.data.beforeSubmit();
      console.log(`handleClickEvent - beforeSubmitResult:`, beforeSubmitResult);
      if (!beforeSubmitResult) {
        return; // 如果 beforeSubmit 返回 false，则阻止提交
      }

      // this.setData({
      //   disabled: true,
      // });

      const tran_code = localStorage.getItem("tranCd"); // 交易码
      // const tran_code = "800204";
      // 获取菜单数据
      common.request({
        url: "getTlrMenuByTranCode",
        data: {
          tran_code,
        },
        success: async (res) => {
          // const data = res?.data?.data?.data || {};
          const data = res.data.data.data;
          console.log(`handleClickEvent - data:`, data);
          console.log(`handleClickEvent - data.logFlag:`, data.log_flag);
          console.log(`handleClickEvent - data.feeFlag:`, data.fee_flag);

          // 是否打印 0:不打印 1:打印
          this.setData({
            logFlag: data.log_flag === "1",
          });
          // 是否收费 0:不收费 1:收费
          // 收费的话直接走收费流程，自定义交易在收费弹窗的确定按钮里
          if (data.fee_flag === "1") {
            const feeItems = await this.feeEvent() // 判断该交易是否有收费项
            if (feeItems) {
              this.initData(feeItems);
              this.setData({
                feeVisible: true,
              });
            } else {
              this.reqCustom();
            }
          }
          // 不收费的话直接调用自定义交易事件
          else {
            this.reqCustom();
          }
        },
        fail: (err) => {
          // this.data.failCallback(err);
          // this.initButton();
        },
        complete() { },
      });
    },
    // 自定义交易
    async reqCustom() {
      const options = {}
      // 如果要收费，把收费参数传进 pubMap 公共参数
      if (this.data.dialogForm.chrgTotAmt) {
        if (this.data.system === "spc") {
          // 如何是整合接口，需要下传到对应的收费接口码下的pubmap里
          Object.assign(this.data.reqParams[this.data.paymentParams.tranCd].pubMap, {
            ...this.data.dialogForm, chrgTotAmt: +this.data.dialogForm.chrgTotAmt
          })
          // 不修改options,让它保持为空对象，不一会影响后面的逻辑
        } else {
          options.pubMap = { ...this.data.dialogForm, chrgTotAmt: +this.data.dialogForm.chrgTotAmt }
        }
      }
      try {
        const res = await request.authpost(
          this.data.reqCode + SYSTEM_MAP[this.data.system],
          this.data.reqParams,
          options
        );
        let { printData } = res
        let { chnlRetCd } = res.pubMap
        if (chnlRetCd !== '0000') {
          if (this.data.completeCallback) {
            try {
              const pass = await this.data.completeCallback(res);
              if (!pass) return
            } catch (error) {
              console.error(error);
            }
          } else {
            // 默认失败行为
            utils.showInfoBox({ isSuccess: "error", remider: res.chnlMsgInfo })
          }
          // this.initButton();
        } else {
          // 打印数据赋值
          this.setData({
            printData: printData || {},
          });
          if (this.data.completeCallback) {
            try {
              const pass = await this.data.completeCallback(res);
              if (!pass) return
            } catch (error) {
              console.error(error);
              return
            }
          } else {
            // 默认成功行为
            await nt.alert(`提交成功${this.data.logFlag ? '，即将进行打印' : ''}`, "提 示", {
              type: 'success',
            })
          }
          // 打印
          setTimeout(async () => {
            await this.print();
            await this.handleAfterSubmit();
          }, 300)
        }
      } catch (error) {
        if (this.data.completeCallback) {
          try {
            await this.data.completeCallback(error);
          } catch (error) {
            console.error(error);
          }
        } else {
          // 默认失败行为
          utils.showInfoBox({ isSuccess: "error", remider: error.chnlMsgInfo || "业务办理失败" })
        }
        // this.initButton();
      }
    },
    async handleAfterSubmit() {
      if (this.data.afterSubmit) {
        // 在适当的位置（例如请求成功后），触发 afterSubmit 钩子函数
        const afterSubmitResult = await this.data.afterSubmit();

        if (!afterSubmitResult) {
          // 如果需要在 afterSubmit 阻止后续流程，可以在这里添加相关逻辑
          return;
        }
      }
    },
    // 是否收费
    async feeEvent() {
      // 如果是核心系统，9986的收费交易为主交易码；否则为 各交易自行配置的 tranCd
      const retCd9986 = this.data.system === "core" ? this.data.reqCode : this.data.paymentParams.tranCd
      if (retCd9986) {
        let params = { ...this.data.reqParams }

        // 整合接口，具体的表单数据在整合接口参数内特定接口字段名里（例如，{ "2139": {...}, "2020esb": {...} }）
        if (this.data.system === "spc") {
          params = params[retCd9986]
        }

        delete params.printData

        let res = await request.post('9986', {
          // 核心交易和整合接口里的核心交易需要传表单数据，非核心不需要
          ...(["core", "spc"].includes(this.data.system) ? params : {}),
          cstNo9986: this.data.paymentParams.cstNo,
          retCd9986, // 收费检查的交易码
        }).catch(err => {
          // this.initButton();
        })

        // P047成功且需要收费
        if (res.pubMap && res.pubMap.retCd === "P047") {
          Object.assign(this.data.dialogForm, {
            smzgChrgFlg: res.smzgChrgFlg || "0000", // 是否允许汇总收费 - 0000实时收费 0001汇总收取
            chrgTotAmt: res.chrgTotAmt ? this.formatRoundNum(res.chrgTotAmt) : "0.00",
          })

          return res.fileData
        }
      } else {
        console.error("没有找到收费交易码");
      }
    },

    // 收费方式失焦事件
    onChrgMdValidate(_rule, value, callback) {
      // 清空收费数据
      if (value !== "3") {
        Object.assign(this.data.dialogForm, {
          wthdAcctNo: null, // 扣费账号 - 收费方式选择3时必输
          wthdAcctNm: null, // 扣费户名 - 收费方式选择3时必输
          wthdAcctSrlNo: null, // 扣费账户序号 - 收费方式选择3时必输
          wthdAcctPswd: null, // 扣费账号密码 - 收费方式选择3时必输
        })
      }
      callback(true)
    },

    // 扣费账号失焦事件
    async onWthdAcctNoValidate(_rule, value, callback) {
      const checker = new CheckAccountInfo(
        { acctNo: value, mainCd: this.data.reqCode },
        { [CheckAccountInfo.CHECK_METHOD.COMMOM]: true }
      )
      const { chnlRetCd, chnlMsgInfo, data } = await checker.check()
      if (chnlRetCd === "0") {
        this.setData({
          wthdAcctSrlNo: data.acctSrlNo,
          wthdAcctNm: data.acctNm,
        })
      }
      callback(chnlRetCd === "0", chnlMsgInfo)
    },

    // 校验密码
    async onPwdValidate(_rule, value, callback) {
      // TODO K021
      callback(true);
    },

    // 打印
    print() {
      // 是否需要打印
      if (!this.data.logFlag) return;
      let pdf = document.getElementsByClassName("pdf");
      return common.print(pdf);
    },
    // 收费弹窗提交事件
    dialogSubmit() {
      this.setData({
        feeVisible: false,
      });

      this.reqCustom();
    },
    // 收费弹窗关闭事件
    handleClose() {
      this.setData({
        // disabled: false,
        feeVisible: false,
        tableList: [],
        chargeTypeList: [],
        dialogForm: {
          smzgChrgFlg: "0000", // 是否允许汇总收费 0000实时收费 
          chrgTotAmt: null, // 总金额
          chrgMd: null, // 收费方式
          wthdAcctNo: null, // 扣费账号 - 收费方式选择3时必输
          wthdAcctNm: null, // 扣费户名 - 收费方式选择3时必输
          accltnFlg: null, // 加急标志
          wthdAcctSrlNo: null, // 扣费账户序号 - 收费方式选择3时必输
          wthdAcctPswd: null, // 扣费账号密码 - 收费方式选择3时必输
        },
        ICJson: {}, // 收费方式为3时，收费账号读取设备的入参
        passwordJson: {}, // 收费方式为3时，密码读取设备的入参
      });
    }
  },
  //数据监听
  observers: {},
});
