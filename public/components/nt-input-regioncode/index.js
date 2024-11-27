/* public\components\inputMobile\inputMobile\inputMobile.js */
Component({
  data: {
    //页面数据
    regioncode: "",
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
      default: "地区编码",
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
    console.log(this);
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    codeNumberValidate(rule, value, callback) {
      if (value && typeof value === "string") {
        if (value.length === 4) {
          if (this.data.ntValidator) {
            this.data.ntValidator(rule, value, callback);
          } else {
            callback(true);
          }
        } else {
          callback(false, "非法地区编码");
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
          regioncode: val,
        });
      },
      immediate: true,
    },
    regioncode(value) {
      value = value.replace(/[^\d]/g, "");

      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      // this.$nextTick(()=> {

      this.$emit("update:modelValue", value);
      this.setData({
        regioncode: value,
      });
      this.$refs.inputRef.value = value;
      this.$emit("regioncode-change", value);
      // })
    },
  },
});
