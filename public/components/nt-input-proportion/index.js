/* public\components\nt-input-proportion\index\index.js */
Component({
  data: {
    //页面数据
    proportion: "",
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
    proportionRule(rule, value, callback) {
      let v = this.data.proportion;
      if (v.length == 0) {
        return callback(true);
      }
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },
    //去除非数字
    clearNoNum: function (item) {
      item = item +''

      if (item != null && item != undefined) {
        //先把非数字的都替换掉，除了数字和.
        item = item.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        item = item.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        item = item.replace(/\.{2,}/g, "");
        //保证.只出现一次，而不能出现两次以上
        item = item.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        //最多保留小数点后一位
        var arr = item.split(".");
        if (arr.length > 1)
          item =
            arr[0] + "." + (arr[1].length > 1 ? arr[1].substr(0, 2) : arr[1]);
      }
      return item;
    },
    handleInput(e) {
      // let v = this.data.proportion;
      if (e) {
        let v = e

        v = this.clearNoNum(v);
        this.$emit("update:modelValue", v);
        this.$nextTick(() => {
          this.$refs.inputZ.value = v;
        });
      }
    },
    completeZero: function (item) {
      if (!item) {
        return item;
      }
      if (item != null && item != undefined) {
        // 先替换非数字和.，包括开头的0
        item = item.replace(/[^0-9.]/g, "");
        // 去除开头多余的0
        item = item.replace(/^0+(\d)/, "$1");
        // 必须保证第一个为数字而不是.
        item = item.replace(/^\./g, "0.");
        // 保证只有出现一个.而没有多个.
        item = item.replace(/\.{2,}/g, ".");
        // 保证.只出现一次，而不能出现两次以上
        item = item.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // 最多保留小数点后两位
        var arr = item.split(".");
        if (arr.length > 1) {
          item =
            arr[0] +
            "." +
            (arr[1].length > 2 ? arr[1].substr(0, 2) : arr[1].padEnd(2, "0"));
        } else {
          item += ".00";
        }
      }
      return item;
    },

    // 自动补齐0
    handleBlur() {
      let v = this.data.proportion;
      v = this.completeZero(v);
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
          proportion: val,
        });
      },
      immediate: true,
    },
  },
});
