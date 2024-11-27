/* public\components\nt-input-money\index\index.js */
Component({
  data: {
    //页面数据
    money: "",
    show: false,
    showSum: false,
    sum: {
      money1: 0, money2: 0, money3: 0, money4: 0, money5: 0, money6: 0, money7: 0, money8: 0, money9: 0
    }
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "0.00",
    },
    //props
    curCode: {
      type: String,
      default: "CNY",
    },

    useQuota: {
      type: Boolean,
      default: false
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
  computed: {
    sum1() {
      const index = { money1: 100, money2: 50, money3: 20, money4: 10, money5: 5, money6: 1, money7: 0.5, money8: 0.1, money9: 0.01 }
      const obj = {}
      for (const s in this.data.sum) {
        obj[s] = ((this.data.sum[s] || 0) * index[s]).toFixed(2)
      }
      return obj
    },
    money_sum() {
      let money = 0
      for (const s in this.data.sum1) {
        money += Number(this.data.sum1[s])
      }
      return money.toFixed(2)
    }
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
    confirm() {
      this.setData({
        money: this.data.money_sum,
        showSum: false
      })
    },
    focus() {
      if (this.data.useQuota && !this.data.show) {
        this.setData({
          show: true
        })
        nt.showMessagebox("是否使用配款？", "提示", {
          type: "info",
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
        }).then(() => {
          this.setData({
            showSum: true
          })
        })
      }
    },
    moneyRule(rule, value, callback) {
      let v = this.data.money;
      if (v.length == 0) {
        this.setData({
          show: false
        })
        return callback(true);
      }
      if (this.data.ntValidator) {
        this.setData({
          show: false
        })
        this.data.ntValidator(rule, value, callback);
      } else {
        this.setData({
          show: false
        })
        return callback(true);
      }
    },
    //去除非数字
    clearNoNum: function (item) {
      item = item + "";
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
      // let v = this.data.money;
      if (e) {
        let v = e;

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
      let v = this.data.money;
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
          money: val,
        });
      },
      immediate: true,
    },
  },
});
