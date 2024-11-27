import utils from "../../utils/utils"

Component({
  data: {
    //页面数据
    base64: null,
  },
  properties: {

    //props

    // 打印数据
    printData: {
      type: Object,
      default: {},
    },

    //
    name: {
      type: String,
      default: "",
    },
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    this.setData({
      base64: await utils.getVoucherBackground("voucher_59.jpg")
    })
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {},
  //数据监听
  observers: {},
});
