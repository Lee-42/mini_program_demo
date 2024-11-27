import card from "../../utils/card";
import NTDevUtils from "../../common/NTDevUtils";
Component({
  data: {
    //页面数据
    isUseEquipTriggered: false,

    companynum: "",
    isPopupOpen: false,
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
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
    //props
    // 是否开启证件号码字母自动转为大写
    isToUpperCase: {
      type: Boolean,
      default: false,
    },
    // 输入时是否显示文本内容长度
    isShowTextLength: {
      type: Boolean,
      default: false,
    },
    // 是否使用设备采集证件数据
    isUseEquip: {
      type: Boolean,
      default: false,
    },
    // 证件号类型
    cardType: {
      type: String,
      default: "1", //默认身份证
    },
    // 文本
    label: {
      type: String,
      default: "对公证件号码",
    },
    // 焦点
    fieldName: {
      type: String,
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    ntValidator: {
      type: Function,
    },
  },
  //生命周期
  created() {},
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
    companynumRule(rule, value, callback) {
      let v = this.data.companynum;
      if (v.length == 0) {
        return callback(true);
      } else {
        let temp = card.cardVerifyRule(
          this.data.cardType,
          this.data.companynum
        );
        if (temp.retCd) {
          if (this.data.ntValidator) {
            this.data.ntValidator(rule, value, callback);
          } else {
            return callback(true);
          }
        } else {
          callback(false, temp.retMsg);
          return false;
        }
      }
    },
    handleBlur(val) {},
    handleInput(e) {
      if (e) {
        // let v = this.data.companynum;
        let v = e

        if (typeof v === "string" && /^[a-zA-Z]*$/.test(v)) {
          v = v.toUpperCase(); // 将输入的字母转换为大写
        }
        if (this.data.isToUpperCase) {
          this.setData({
            companynum: v,
          });
        }

        this.$emit("update:modelValue", v);
        this.$nextTick(() => {
          this.$refs.inputZ.value = v;
        });
      }
    },
    useEquip() {
      if (this.data.isUseEquip && !this.data.isPopupOpen) {
        nt.messageBox({
          title: "提示",
          message: "是否使用设备采集证件数据",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "确认";
              // 调用设备
              NTDevUtils.getIdCardInfo({
                success: (res) => {
                  this.$emit("useEquip", res.idNum);
                  this.setData({
                    companynum: res.idNum,
                  });
                },
                fail: (err) => {
                  console.log(err, "获取信息失败");
                },
              });
            } else {
              done();
            }
          },
        })
          .then((action) => {
            this.setData({
              isPopupOpen: false,
            });
          })
          .catch(() => {
            this.setData({
              isPopupOpen: false,
            });
          });

        this.setData({
          isPopupOpen: true,
        });
      }
    },

    handleFocus() {
      if (this.data.autoCollect && !this.data.isUseEquipTriggered) {
        this.useEquip();
        this.setData({
          isUseEquipTriggered: true,
        });
      }
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          companynum: val,
        });
      },
      immediate: true,
    },
  },
});
