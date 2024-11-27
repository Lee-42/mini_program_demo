/* public\components\inputMobile\inputMobile\inputMobile.js */
Component({
  data: {
    //页面数据
    dbValue: "",
    preValue: "", // 第一次输入
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    ntValidator: {
      type: Function,
    },
    label: {
      type: String,
      default: "双敲输入框",
    },
    fieldName: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    // 双敲第一次校验
    preValidator: {
      type: Function,
    }
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  ready() {
    //节点加载完成(函数只执行一次)
    setTimeout(() => {
      this.setData({
        dbValue: this.$attrs.modelValue,
        preValue: this.$attrs.modelValue,
      });
    }, 500);
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    dbRule(rule, value, callback) {
      // let temp = this.data.dbValue;
      let temp = value;
      if (!this.data.preValue) {
        this.setData({
          preValue: temp,
          dbValue: "",
        });
        if (this.data.preValidator) {
          this.data.preValidator(rule, value, (pass, msg) => {
            if (pass) {
              callback(false, "请再输入一次");
            } else {
              this.setData({
                preValue: "",
                dbValue: "",
              });
              callback(pass, msg)
            }
          })
        } else {
          callback(false, "请再输入一次");
        }
      } else if (this.data.preValue === temp) {
        if (this.data.ntValidator) {
          return this.data.ntValidator(rule, value, (pass, msg) => {
            if (pass) {
              this.setData({
                preValue: "",
              });
              callback(pass)
            }
            callback(pass, msg)
          })
        }
        this.setData({
          preValue: "",
        });
        callback(true);
      } else if (this.data.preValue !== temp) {
        callback(false, "双敲验证失败");
        this.setData({
          preValue: "",
          dbValue: "",
        });
      }
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          dbValue: val,
        });
      },
      immediate: true,
    },
    dbValue(value) {
      this.$emit("repeat-change", value);

      this.$emit("update:modelValue", value);
    },
  },
});
