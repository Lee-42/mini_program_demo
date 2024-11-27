import utils from '../../utils/utils'
const { getVoucherBackground } = utils
// import common from "../../common";
Component({
  data: {
    base_start: "",
    base_content: "",
    test: {
      acctNo: "测试数据",
      acctSeqn: "测试数据",
      currency: "测试数据",
      amt: "测试数据",
      acctDate: "测试数据",
      endDate: "测试数据",
      period: "测试数据",
      rate: "测试数据",
      autoFlag: "测试数据",
    }
  },
  properties: {

    datas: {
      type: Object,
      default: {
        acctNo: "", //账号
        acctNm: "", //户名
        currency: "",//币种
        acctDate: "",//签发日期
        openBrNo: "",//开户网点
        rate: "",//利率
        depositType: "",//存款种类
        drawMode: "",//支取方式
        TCTD: "",//通存通兑标识
        list: [
          {
            index: 0,       //索引
            date: "",       //日期
            summary: "",    //总额
            withdrawals: "",//
            deposit: "",    //
            balance: "",    //
            remark: "",     //
            cashier: "",    //
          }
        ]
      }
    }
  },
  computed: {
    start() {
      let { list } = this.data.datas
      if (!list || list.length == 0) return
      return list.filter(s => s.index < 10).map(m => {
        return { ...m, index: m.index % 10 }
      })
    },

    firstAcTitle() {
      const acTitle = this.data.datas?.acTitle || []
      return acTitle.find(f => f.index == 0) || {}
    },
    // contentAcTitle() {
    //   const acTitle = this.data.datas?.acTitle || []
    //   const arr = acTitle.filter(f => f.index != 0)
    //   const arrq = arr.filter(f => f % 2 == 1)
    //   const arro = arr.filter(f => f % 2 == 0)

    // },

    content() {
      let { list } = this.data.datas
      if (!list || list.length == 0) return
      const arr = list.filter(s => s.index >= 10 && s.index < 70)
      const res = []
      const res1 = this.fn(10, 29, arr)
      if (res1) res.push(res1)
      const res2 = this.fn(30, 49, arr)
      if (res2) res.push(res2)
      const res3 = this.fn(50, 69, arr)
      if (res3) res.push(res3)
      return res
    },
  },
  //生命周期
  created() {
    //created(函数只执行一次)
  },
  async ready() {
    //节点加载完成(函数只执行一次)
    this.setData({
      base_start: await getVoucherBackground('voucher_18.jpg'),
      base_content: await getVoucherBackground('voucher_19.jpg'),
    })
  },
  attached() {

  },
  detached() {
    //onUnload
  },
  //页面事件
  methods: {
    fn(start, end, data) {
      let arr = data.filter(f => f.index >= start && f.index <= end)
      let top = []
      let bottom = []
      for (const i in arr) {
        const index = arr[i].index
        if (Math.floor(index / 10) % 2) {
          // arr[i].index = index % 10
          top.push({ ...arr[i], index: index % 10 })
        } else {
          // arr[i].index = index % 10
          bottom.push({ ...arr[i], index: index % 10 })
        }
      }
      if (top.length > 0 || bottom.length > 0) {
        return { top, bottom }
      }

    }
  },
  //数据监听
  observers: {

  },
});
