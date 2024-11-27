/* public\components\inputMobile\inputMobile\inputMobile.js */
Component({
  data: {
    //页面数据
    englishName: "",
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    ntValidator: {
      type: Function,
    },
    //props
    label: {
      type: String,
      default: "英文姓名",
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
        englishName: this.$attrs.modelValue,
      });
    }, 500);
  },
  attached() {
    //onLoad
  },
  detached() {
  },
  //页面事件
  methods: {
  
    englishNameRule(rule, value, callback) {
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },
    handleInput(e) {
      if (e) {
        let v = e;
        

        v = v.replace(/[^a-zA-Z\s+]/g, "");

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
          englishName: val,
        });
      },
      immediate: true,
    },
    // englishName(value) {
    //   value = value.replace(/[^a-zA-Z\s+]/g, "");

    //   this.$nextTick(() => {
    //     this.$emit("update:modelValue", value);
    //     this.setData({
    //       englishName: value,
    //     });
    //     this.$emit("englishname-change", value);
    //   });
    // },
  },
});
