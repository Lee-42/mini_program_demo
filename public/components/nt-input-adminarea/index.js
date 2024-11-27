import common from "../../common";

/* public\components\selectIndustryclass\index\index.js */
Component({
  data: {
    //页面数据

    area: [],
    value: "",
    options: [
      {
        value: "100000",
        label: "中国",
        children: [
          {
            value: "110000",
            label: "北京市",
          },
          {
            value: "440000",
            label: "广东省",
          },
        ],
      },
    ],
  },
  computed: {
    props() {
      return {
        //       lazy: true,
        //       lazyLoad: (node, resolve) => {
        //         // node 节点数据 node.value => 当前节点的值
        //         // level: 层级 => 1,2,3,4
        //         const { level } = node;
        //         // 动态节点
        //         const nodes = [];
        //         // 为1代表第一次请求
        //         let type = level == 0 ? "1" : node.value;
        //         this.provinceFn(type)
        //           .then((res) => {
        //             res.data.map((item) => {
        //               let obj = {
        //                 value: item.city_id,
        //                 label: item.city_name,
        //                 leaf: node.level >= 3,
        //               };
        //               nodes.push(obj);
        //             });
        //             // resolve 节点返回
        //             resolve(nodes);
        //           })
        //           .catch((error) => {
        //             console.log(error);
        //           });
        //       },
      };
    },
  },
  properties: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    //props
    label: {
      type: String,
      default: "行政区划",
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
    modelValue: {
      type: Array,
      default: () => {
        return new Array();
      },
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
        area: this.$attrs.modelValue,
      });
    }, 500);
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    adminiareaRule(rule, value, callback) {
      console.log(`adminiareaRule - callback:`, callback);
      console.log(`adminiareaRule - value:`, value);
      console.log(`adminiareaRule - rule:`, rule);
      if (this.data.ntValidator) {
        this.data.ntValidator(rule, value, callback);
      } else {
        return callback(true);
      }
    },
    provinceFn() {
      return new Promise((resolve, reject) => {
        let data = {
          id: "0001",
        };
        common.request({
          url: "xxx",
          data,
          success: (res) => {
            const datas = res.data.data;

            resolve(datas);
          },
          fail: (error) => {
            reject(error);
          },
        });
      });
    },
    handleChange(value) {
      this.$emit("change", value);
      this.$emit("update:modelValue", value);
    },
  },
  //数据监听
  observers: {
    modelValue: {
      handler(val) {
        this.setData({
          area: val,
        });
      },
      immediate: true,
    },
  },
});
