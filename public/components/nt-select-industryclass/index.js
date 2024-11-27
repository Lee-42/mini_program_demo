import common from "../../common";

/* public\components\selectIndustryclass\index\index.js */
Component({
  data: {
    //页面数据
    industryclass: [],
    value: "",
    options: [
      {
        value: "A",
        label: "农、林、牧、渔业",
        children: [
          {
            value: "01",
            label: "农业",
          },
          {
            value: "02",
            label: "林业",
          },
          {
            value: "03",
            label: "牧业",
          },
          {
            value: "04",
            label: "渔业",
          },
          {
            value: "05",
            label: "农、林、牧、渔专业及辅助性活动",
          },
        ],
      },
      {
        value: "B",
        label: "采矿业",
        children: [
          {
            value: "06",
            label: "煤炭开采",
          },
          {
            value: "07",
            label: "石头天然气",
          },
          {
            value: "08",
            label: "黑色金属",
          },
          {
            value: "09",
            label: "有色金属",
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
      default: "行业分类",
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
        industryclass: this.$attrs.modelValue,
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
    industryclassValidator(rule, value, callback) {
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
          industryclass: val,
        });
      },
      immediate: true,
    },
  },
});
