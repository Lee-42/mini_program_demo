/* public\components\inputSingledate\index\index.js */
Component({
  data: {
    //页面数据
    date: "",
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
      default: "日期",
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

  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    dateValidator(rule, value, callback) {
      const regExp =
        /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
      if (!regExp.test(value)) {
        return callback(false, "日期格式不正确");
      } else if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },

    handleInput(e) {
      // let v = this.data.date;
      if (e) {
        let v = e;
        // 是否纯数字输入 小数点也不允许
        v = v.replace(/[^0-9]/g, "");
        // 限制输入为8位数字
        if (v.length > 8) {
          v = v.slice(0, 8);
        }
        this.$nextTick(() => {
          this.setData({
            date: v,
          });
          // 通知到表单组件修改值
        });
        this.$emit("update:modelValue", v);
      }
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          date: val,
        });
      },
      immediate: true,
    },
  },
});
