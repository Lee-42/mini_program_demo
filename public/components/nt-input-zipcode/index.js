/* public\components\nt-input-zipcode\index\index.js */
Component({
  data: {
    //页面数据
    zipcode: "",
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    code: {
      typeof: [String],
    },
    //props
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    // 焦点
    fieldName: {
      type: String,
    },
    label: {
      type: String,
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
    zipcodeRule(rule, value, callback) {
      let v = this.data.zipcode;
      if (v.length == 0) {
        return callback(true);
      }
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },
    handleInput(e) {
       if (e) {
        // debugger;
        let v = e
         // let v = this.data.zipcode;
        // 是否纯数字输入 小数点也不允许
        v = v.replace(/[^0-9]/g, "");
        // 限制输入为6位数字
        if (v.length > 6) {
          v = v.slice(0, 6);
        }
        this.setData({
          zipcode: v,
        });
        // 通知到表单组件修改值
        this.$emit("update:modelValue", v);
        // 修改子组件input框内的显示内容
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
          zipcode: val,
        });
      },
      immediate: true,
    },
  },
});
