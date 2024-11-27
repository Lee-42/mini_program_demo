/* public\components\nt-input-mobile\index\index.js */
Component({
  data: {
    //页面数据
    mobile: "",
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    curCode: {
      type: String,
      default: "CNY",
    },

    // 焦点
    fieldName: {
      type: String,
    },
    label: {
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
  created() {
    //created(函数只执行一次)
  },
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
    phoneNumberValidate(rule, value, callback) {
      if (!value) {
        // 新增：当value为空时
        if (this.data.ntValidator) {
          this.data.ntValidator(rule, value, callback);
        } else {
          return callback(true); // 当value为空时，返回true
        }
      } else if (
        /^(13[0-9]|14[014-9]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/g.test(
          value
        )
      ) {
        if (this.data.ntValidator) {
          this.data.ntValidator(rule, value, callback);
        } else {
          return callback(true);
        }
      } else {
        callback(false, "非法手机号");
        return false; // 用于同时支持form-item.ntValidator和this.validate自定义校验
      }
    },
    //去除非数字
    clearNoNum: function (item) {
      item = item +''
      if (item != null && item != undefined) {
        // 移除非数字字符
        item = item.replace(/[^0-9]/g, "");

        // 只保留前11位数字
        item = item.slice(0, 11);
      }
      return item;
    },
    handleInput(e) {
      // let v = this.data.mobile;
      if (e) {
        let v = e

        v = this.clearNoNum(v);
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
          mobile: val,
        });
      },

      immediate: true,
    },
  },
});
