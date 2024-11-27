/* public\components\selectCurrency\index\index.js */
import utils from "../../utils/utils";

Component({
  data: {
    //页面数据
    currencyValue: "",
    currencyList: [],
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    required: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    label: {
      type: String,
      default: "币种",
    },
    fieldName: {
      type: String,
      default: "",
    },
    ntValidator: {
      type: Function,
    },
    mainCd: {
      type: String,
      default: "public"
    },
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    // 该柜员所属机构启用的币种
    const splmtInf = userInfo.inst_no ? `{BR_NO}|${userInfo.inst_no}|` : undefined

    await utils.getSelectData({
      mainCd: this.data.mainCd,
      flg: "CUR_NO",
      splmtInf,
      name: "currencyList",
      that: this,
    })

    const firstValue =
      this.$attrs.modelValue || this.data.currencyList[0].value;
    this.setData({
      currencyValue: firstValue,
    });
    this.$emit("update:modelValue", firstValue);
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    currencyValidator(rule, value, callback) {
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },

    changeEvent(value) {
      this.$emit("change", value);
      this.$emit("update:modelValue", value);
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          currencyValue: val,
        });
      },
      immediate: true,
    },
  },
});
