import utils from "../../utils/utils";
Component({
  data: {
    //页面数据
    idtype: "",
    idenTypeList: [],
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    mainTranCd: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "证件类型",
    },
    fieldName: {
      type: String,
      default: "",
    },

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
    this.setData({
      idtype: this.$attrs.modelValue,
    });
    this.getIdentTpData();
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    idtypeValidator(rule, value, callback) {
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },
    async getIdentTpData() {
      await utils.getSelectData({
        mainCd: this.data.mainTranCd,
        flg: "C004",
        name: "idenTypeList",
        that: this,
      });
      if (!this.$attrs.modelValue) {
        this.$emit("update:modelValue", this.data.idenTypeList[0].value);
      }
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          idtype: val,
        });
      },
      immediate: true,
    },
    idtype(value) {
      this.$emit("update:modelValue", value);
      this.$emit("idtype-change", value);
    },
  },
});
