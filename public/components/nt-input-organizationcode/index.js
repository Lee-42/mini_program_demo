/* public\components\nt-input-organizationcode\index\index.js */
import card from "../../utils/card";

Component({
  data: {
    //页面数据
    organizationcode: "",
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    // 自定义规则
    customRule: {
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
    handleInput(e) {
      if (e) {
        // let v = this.data.organizationcode;
        let v = e
        
        this.$emit("update:modelValue", v);
        this.$nextTick(() => {
          this.$refs.inputZ.value = v;
        });
      } 
    },

    organizationcodeRule(rule, value, callback) {
      if (value) {
        let temp = card.cardVerifyRule("8", value);
        if (temp.retCd) {
          if (this.data.ntValidator) {
            this.data.ntValidator(rule, value, callback);
          } else {
            return callback(true);
          }
        } else {
          return callback(false, temp.retMsg);
        }
      } else {
        return callback(true);
      }
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          organizationcode: val,
        });
      },
      immediate: true,
    },
  },
});
