/* public\components\nt-input-personidnumRule\index\index.js */
import card from "../../utils/card";
import NTDevUtils from "../../common/NTDevUtils";
Component({
  data: {
    hasConfirmed: false,
    //页面数据
    personidnum: "",
    isPopupOpen: false,
  },
  properties: {
    resetValidate: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [String, Number],
      default: 18,
    },
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

    // 证件号类型
    cardType: {
      type: String,
      default: "1", //默认身份证
    },
    // 焦点
    fieldName: {
      type: String,
    },
    // 文本
    label: {
      type: String,
      default: "个人证件号码",
    }, // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    ntValidator: {
      type: Function,
    },
    // 1:只允许调用外设
    // 2:只允许手动输入
    // 3:允许手动输入或调用外设，操作者自选
    // 4:手输且只输入一次
    operType: {
      type: [String, Number],
      default: 2,
      // required: true
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
    // 调用外设的方法
    useEquip() {
      // 调用设备
      NTDevUtils.getIdCardInfo({
        success: (res) => {
          this.$emit("useEquip", res.idNum);
          this.$emit("update:modelValue", res.idNum);
          this.setData({
            personidnum: res.idNum,
          });
          done();
        },
        fail: (err) => {},
      });
    },
    customFocus() {
      if (this.data.operType == 1 || this.data.operType == "1") {
        this.useEquip();
      } else if (this.data.operType == 3 || this.data.operType == "3") {
        nt.messageBox({
          title: "提示",
          message: "是否使用设备采集证件数据",
          showCancelButton: true,
          confirmButtonText: "是：使用设备",
          cancelButtonText: "否：手动输入",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "确认";
              // 调用设备
              this.useEquip();

              done();
            } else {
              done();
            }
          },
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    handleFocus(e) {
      const { operType, autoCollect, manualCollect } = this.data;

      switch (String(operType)) {
        case "1":
          if (autoCollect) {
            this.useEquip();
          } else if (manualCollect) {
            // 处理手动采集的逻辑
          }
          break;

        case "2":
          // 处理 case "2" 的逻辑
          break;

        case "3":
          break;

        case "4":
          break;

        default:
      }
    },
    onIdentNoValidate2(_rule, value, callback) {
      if (!value) return;
      const { cardType } = this.data;
      const { retCd, retMsg } = card.cardVerifyRule(cardType, value);
      callback(retCd, retMsg);
    },
    personidnumRule2(rule, value, callback) {
      // 执行正常校验逻辑
      let { retCd, retMsg } = card.cardVerifyRule(
        this.data.cardType,
        this.data.personidnum
      );
      if (!retCd) return callback(false, retMsg);

      if (this.data.ntValidator) {
        return this.data.ntValidator(rule, value, (pass, msg) => {
          callback(pass, msg);
        });
      }

      callback(true);
    },

    personidnumRule(rule, value, callback) {
      let temp = card.cardVerifyRule(this.data.cardType, this.data.personidnum);
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
    },

    handleInput2(e) {
      // let v = this.data.personidnum;
      if (typeof e === "object") {
        let v = e.target.value;
        if (typeof v === "string" && /^[a-zA-Z]*$/.test(v)) {
          v = v.toUpperCase(); // 将输入的字母转换为大写
        }
        if (this.data.isToUpperCase) {
          this.setData({
            personidnum: v,
          });
        }
        this.$emit("update:modelValue", v);
        if (this.data.operType == 4 && this.$refs.repeat) {
          this.$refs.repeat.dbValue = v;
          this.$refs.repeat.preValue = v;
        }
        // this.$nextTick(() => {
        //   this.$refs.inputZ.value = v;
        // });
      }
    },
    handleInput(e) {
      let v = e;
      if (typeof v === "string" && /^[a-zA-Z]*$/.test(v)) {
        v = v.toUpperCase(); // 将输入的字母转换为大写
      }
      if (this.data.isToUpperCase) {
        this.setData({
          personidnum: v,
        });
      }
      this.$emit("update:modelValue", v);
      this.$nextTick(() => {
        this.$refs.inputZ.value = v;
      });
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          personidnum: val,
        });
      },
      immediate: true,
    },
    resetValidate: {
      handler(val) {
        this.$nextTick(() => {
          const inputField = document.querySelector(
            `input[fieldname="${this.data.fieldName}"]`
          );

          if (this.data.personidnum == "") {
            if (inputField) {
              inputField.setAttribute("isvalidated", val);

              // 查找父元素是否是 某标签元素
              function findParentWithTagName(element, tagName) {
                // 如果当前元素是null或者已经到达body元素，则停止递归
                if (
                  element === null ||
                  element.tagName.toLowerCase() === "body"
                ) {
                  return null;
                }
                // 检查当前元素是否包含指定的className
                if (element.tagName.toLowerCase() === tagName.toLowerCase()) {
                  return element;
                } else {
                  // 如果当前元素不是某标签元素，则向上查找其父元素
                  return findParentWithTagName(element.parentElement, tagName);
                }
              }

              let temp = findParentWithTagName(inputField, "form");
              console.dir(temp);

              temp.customFieldInfo.clearValidate();
            } else {
            }
          } else {
          }
        });
      },

      immediate: true,
    },
  },
});
