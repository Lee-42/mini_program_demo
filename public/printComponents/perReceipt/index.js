import UserVariable from "../../common/UserVariable";
const { JZZL_DQYBT } = UserVariable
import utils from '../../utils/utils'
const { getVoucherBackground } = utils
// import common from "../../common";
Component({
  data: {
    //页面数据
    time: null,
    base: "",
  },
  properties: {

    //props

    // 打印数据
    printData: {
      type: Object,
      default: {},
    },

    type: {
      type: String,
      default: '0'
    },

  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    this.setData({
      base: await getVoucherBackground('voucher_26.jpg'),
      time: this.getTime()
    })
  },
  attached() {

  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    getTime() {
      const current = new Date()
      console.log(current.getHours());
      return {
        hour: current.getHours().toString().padStart(2, '0'),
        minutes: current.getMinutes().toString().padStart(2, '0'),
        second: current.getSeconds().toString().padStart(2, '0'),
        year: current.getFullYear(),
        month: (current.getMonth() + 1).toString().padStart(2, '0'),
        day: current.getDate().toString().padStart(2, '0')
      }
    }
  },
  //数据监听
  observers: {
  },
});
