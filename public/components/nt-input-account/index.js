/* public\components\nt-input-account\index\index.js */
import NTDevUtils from "../../common/NTDevUtils";
import checkARQC from "../../common/functions/checkARQC";
// 是否展示弹窗
let showDialog = false
Component({
  data: {
    //页面数据
    account: ""
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    // 外设的入参
    ICJson: {
      type: Object,
    },
    // 焦点
    fieldName: {
      type: String,
    },
    label: {
      type: String,
    },
    ntValidator: {
      type: Function,
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    // 1：只读设备
    // 2：只手输
    // 3：询问 
    operType: {
      type: [Number, String],
      default: 2
    },

    // 1：启用IC卡与磁条卡
    // 2：只启用IC卡
    // 3：只启用磁条卡
    deviceType: {
      type: [Number, String],
      default: 1
    },

    // 同号换卡标志
    changeCardFlg: {
      type: [String, Number],
      default: "0"
    }
  },
  //生命周期
  created() { },
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
    useEquip() {
      const { operType } = this.data
      if (operType == 1) return this.handlerDevice()
      if (operType == 3) {
        nt.messageBox({
          title: "提示",
          message: "是否使用设备采集证件数据",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          beforeClose: async (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "确认";
              await this.handlerDevice().then(res => { console.log(res); }).catch(err => { console.log(err); }).finally(() => {
                instance.confirmButtonLoading = false;
                done()
              })
            } else {
              done();
            }
          },
        })
      }

    },

    handlerPromise(fun, resolve, reject) {
      fun().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    },

    // 调用设备
    handlerDevice() {
      const { deviceType } = this.data
      return new Promise((resolve, reject) => {
        if (deviceType == 1) {
          nt.showMessagebox("请选择需要启用的设备", "询问提示", {
            distinguishCancelAndClode: true,
            showCancelButton: true,
            confirmButtonText: "IC卡",
            cancelButtonText: "磁条卡",
            type: "info",
          }).then(() => {
            this.handlerPromise(this.handlerICDevice, resolve, reject)
          }).catch(action => {
            if (action == "cancel") {
              this.handlerPromise(this.handlerMSDeivice, resolve, reject)
            }
          })
        } else if (deviceType == 2) {
          this.handlerPromise(this.handlerICDevice, resolve, reject)
        } else if (deviceType == 3) {
          this.handlerPromise(this.handlerMSDeivice, resolve, reject)
        }
      })
    },

    // 调用IC设备
    handlerICDevice() {
      return new Promise(async (resolve, reject) => {
        // const data = '6236216601000007897'
        // this.setData({ account: data })
        // resolve(data)
        // return
        NTDevUtils.getICCardInfo({
          jsonData: {
            ...this.data.ICJson,
          },
          success: (res) => {
            console.log(res, "获取的IC卡信息");
            // 卡号
            this.setData({
              account: res.A,
            });
            this.$emit("getCardInfo", res)
            checkARQC({
              acctNo: res.A,
              smNoRplcCrdFlg: this.data.changeCardFlg,
              crdDataFd: res.arqcInfo.ARQC,
              crdSeqNo: res.J
            }).then(res => {
              if (res.chnlRetCd != '0000') return reject(res.chnlMsgInfo)
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          },
          fail: (err) => {
            nt.alert(err).then(() => {
              this.$refs.inputZ.focus()
            })
            reject(err)
          }
        });
      })
    },

    // 调用磁条设备
    handlerMSDeivice() {
      return new Promise((resolve, reject) => {
        NTDevUtils.getMSCardInfo({
          jsonData: {},
          success: (res) => {
            this.setData({ account: res })
            resolve(res)
          },
          fail: (err) => {
            nt.alert(err).then(() => {
              this.$refs.inputZ.focus()
            })
            reject(err)
          }
        })
      })
    },

    customFocus() {
      this.useEquip();
    },

    handleFocus() {
      if (!showDialog && this.data.operType != 2) {
        showDialog = true
        this.useEquip();
      }

    },

    accountRule(rule, value, callback) {
      let v = this.data.account;
      if (v.length == 0) {
        return callback(true);
      }
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, (pass, msg) => {
          if (pass) {
            showDialog = false
            callback(pass)
          } else {
            callback(pass, msg)
          }
        });
      } else {
        showDialog = false
        return callback(true);
      }
    },

    handleInput(e) {
      if (e) {
        let v = e
        // let v = this.data.account;
        this.$emit("update:modelValue", v);
        this.$nextTick(() => {
          this.$refs.inputZ.value = v;
        });
      }
    },

  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          account: val,
        });
      },
      immediate: true,
    },
  },
});
