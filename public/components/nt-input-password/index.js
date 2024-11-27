/* public\components\nt-input-password\index\index.js */
import NTDevUtils from "../../common/NTDevUtils";
import { isSamplePassword } from "../../common/functions/checkSimplePwd"
let showDialog = false
Component({
  data: {
    isUseEquipTriggered: false,

    //页面数据
    password: "",
    isPopupOpen: false,
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    // 焦点
    fieldName: {
      type: String,
    },
    label: {
      type: String,
    }, // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    ntValidator: {
      type: Function,
    },
    acctNm: {
      type: String,
      required: true
    },
    // 是否需要二次确认密码
    confirmTwice: {
      type: Boolean,
      default: false
    },
    // 是否进行弱密码检查
    weakCheck: {
      type: Boolean,
      deafault: false
    },

    // 密码检查配置
    pwdOptions: {
      type: Object,
      default: {
        /**
         * @param {string} data.identNo 证件号码
         * @param {string} data.mblNo 手机号
         * @param {string} data.acctNo 账号
         * @param {?string} data.verifyData1 [可选]账号2
         * @param {?string} data.verifyData2 [可选]非身份证的证件号码
        */
      }
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
      this.pwd_confirm()
    },

    customFocus() {
      this.useEquip();
    },

    // 获取密码
    async pwd_confirm() {
      const { confirmTwice } = this.data
      // 第一次获取密码
      let pwd_fist = await this.handlerDevice({ Speech: "请输入密码" })
      if (!pwd_fist) return

      // 判断是否需要二次输入密码
      if (!confirmTwice) return this.setData({ password: pwd_fist })

      // 第二次获取密码
      let pwd_twice = await this.handlerDevice({ Speech: "请再次输入密码" })
      if (pwd_fist === pwd_twice) return this.setData({ password: pwd_twice })
      nt.showMessagebox('两次输入密码不一致，请再次输入', '密码键盘调用失败,是否重新调用？', {
        type: "error",
        showCancelButton: true,
        confirmButtonText: "是",
        cancelButtonText: "否"
      }).then(() => {

        // 两次输入密码不一致，重新调用本方法
        this.pwd_confirm()
      }).catch(() => {

      })

    },

    // 调用密码外设
    handlerDevice(param) {
      return new Promise((resolve, reject) => {
        NTDevUtils.getPassword({
          params: {
            AccNo: this.data.pwdOptions.acctNo || "000000000000",
            ...param
          },
          success: (password) => {
            console.log(password, "读取的密码");
            resolve(password)
          },
          fail: (err) => {
            nt.alert(err).finally(() => {
              reject(err)
              console.log(err, "读取密码失败");
            })
          },
        });
      })
    },

    handleFocus() {
      if (!showDialog) {
        showDialog = true
        this.useEquip();
      }
    },

    async passwordRule(rule, value, callback) {
      const { weakCheck, pwdOptions } = this.data
      let v = this.data.password;
      if (v.length == 0) {
        return callback(true);
      }
      if (weakCheck && pwdOptions) {
        let res = await isSamplePassword(true, { ...pwdOptions, pinBlock: this.data.password })
        if (res) return callback(false, "当前输入密码过于简单，按f2重新调起设备")
      }
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, (pass, msg) => {
          if (pass) {
            showDialog = false
            const pwdMap = {}
            pwdMap[this.data.fieldName] = value
            pwdMap[this.data.acctNm] = pwdOptions.acctNo
            this.$emit("getPwdMap", pwdMap)
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
      if (typeof e === "object") {
        // let v = this.data.password;
        let v = e.target.value;

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
          password: val,
        });
      },
      immediate: true,
    },
    password(val) {
      this.$emit("update:modelValue", val);
    }
  },
});
