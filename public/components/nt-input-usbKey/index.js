import request from "../../utils/request"
import NTDevUtils from "../../common/NTDevUtils";
import { checkUKHead, getUKType, getUKNo } from "../../common/functions/UKHead";
import GlobalVariable from '../../common/GlobalVariable'

Component({
  data: {
    isReadonly: true,
  },
  properties: {
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean },
    mainTranCd: {
      type: String,
      require: true,
    },
    maxlength: {
      type: [Number, String],
      default: GlobalVariable.PersonUkeyLength,
    },
    //主动采集
    manualCollect: {
      type: Boolean,
      default: false,
    },
    // 自动采集
    autoCollect: {
      type: Boolean,
      default: false,
    },
    // 是否使用设备采集证件数据
    isUseEquip: {
      type: Boolean,
      default: false,
    },
    // 焦点
    fieldName: {
      type: String,
    },
    // 文本
    label: {
      type: String,
      default: "椰盾编号",
    }, // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    ntValidator: {
      type: Function,
    },
    noCheck: {
      type: Boolean,
      default: false,
    }
  },
  ready() {
    this.setData({
      isReadonly: !!this.data.readonly,
    })
  },
  methods: {
    useEquip() {
      if (this.data.isUseEquip) {
        nt.messageBox({
          title: "提示",
          message: "请选择UK输入方式",
          showCancelButton: true,
          confirmButtonText: "设备读取读取",
          cancelButtonText: "手工输入",
          beforeClose: (action, _instance, done) => {
            if (action === "confirm") {
              // TODO 没有相关读取设备方法
              // setTimeout(() => {
              //   // 调用设备
              //   NTDevUtils.getIdCardInfo({
              //     success: (res) => {
              //       console.log("调取设备成功", res);
              //       this.$emit("update:modelValue", res);
              //     },
              //     fail: (err) => {
              //       console.error("调取设备失败", err);
              //        nt.showMessagebox(`读取失败，请选择重新读取！`, '提示', {
              //          type: 'error',
              //          confirmButtonText: '关闭',
              //        })
              //     },
              //   });
              // }, 800);
              // this.setData({ isReadonly: true })
            } else {
              // 手工
              if (!this.data.readonly) {
                // 只有外部传入 不指定 只读 时， 才能取消只读
                this.setData({ isReadonly: false })
              }
            }
            done();
          },
        })
      }
    },
    async validate(rule, value, callback) {
      if (value) {
        if (value.length !== +this.data.maxlength) {
          return callback(false, "椰盾编号长度不正确！");
        }
        if (!checkUKHead(value)) {
          return callback(false, "请输入正确的冠字头");
        }

        if (!this.data.noCheck) {
          try {
            // 查询最小位
            const type = getUKType(value)
            await request.post("k053", {
              vchrNo: getUKNo(value),
              vchrTp: type,
              mainTranCd: this.data.mainTranCd,
            })
          } catch (error) {
            callback(false, error.chnlMsgInfo || error.retMsg)
          }
        }
        if (this.data.ntValidator) {
          this.data.ntValidator(rule, value, callback);
        } else {
          callback(true);
        }
      } else {
        callback(true)
      }
    },
    // 聚焦第一次自动采集
    handleFocus() {
      if (this.data.isUseEquip && this.data.autoCollect) {
        this.useEquip();
      }
    },
    // 手动采集
    onmanual() {
      if (this.data.isUseEquip && this.data.manualCollect) {
        this.useEquip();
      }
    }
  }
})