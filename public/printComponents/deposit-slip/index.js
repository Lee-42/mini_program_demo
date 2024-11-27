import utils from '../../utils/utils'
const { getVoucherBackground } = utils
// import common from "../../common";
Component({
  data: {
    base: ""
  },
  properties: {

    datas: {
      type: Object,
      default: {
      }
    }
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    this.setData({
      base: await getVoucherBackground('voucher_06.jpg'),
    })
  },
  attached() {

  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
  },
  //数据监听
  observers: {

  },
});
