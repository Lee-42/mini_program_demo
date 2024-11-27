/* public\components\inputMobile\inputMobile\inputMobile.js */
Component({
  data: {
    //页面数据
    telphone: "",
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
      default: "固定电话",
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
        telphone: this.$attrs.modelValue,
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
    phoneNumberValidate(rule, value, callback) {
      const reg = /^(\d{3,4}-)?\d{7,8}$/;
      if (value && typeof value === "string") {
        if (reg.test(value)) {
          if (this.data.ntValidator) {
            this.data.ntValidator(rule, value, callback);
          } else {
            callback(true);
          }
        } else {
          callback(false, "非法固定电话");
        }
        return;
      }
      callback(true);
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          telphone: val,
        });
      },
      immediate: true,
    },
    telphone(value) {
      if (value) {
        value = value.replace(/[^\d-]/g, "");

        this.$nextTick(() => {
          this.$emit("update:modelValue", value);

          this.setData({
            telphone: value,
          });
          this.$emit("telphone-change", value);
        });
      }
    },
  },
});
