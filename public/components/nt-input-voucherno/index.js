/* public\components\inputVoucherno\index\index.js */
Component({
  data: {
    //页面数据
    voucherno: "",
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
      default: "凭证号",
    },
    fieldName: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  ready() {
    //节点加载完成(函数只执行一次)

    setTimeout(() => {
      this.setData({
        voucherno: this.$attrs.modelValue,
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
    validate(rule, value, callback) {
      if (value) {
        if (this.data.ntValidator) {
          this.data.ntValidator(rule, value, callback);
        } else {
          return callback(true);
        }
      } else {
        callback(false, "非法凭证号");
        return false; // 用于同时支持form-item.ntValidator和this.validate自定义校验
      }
    },
    handleInputEvent(value) {},
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          voucherno: val,
        });
      },
      immediate: true,
    },
    voucherno(value) {
      this.$emit("voucherno-change", value);
      this.$emit("update:modelValue", value);
    },
  },
});
