import utils from "../../utils/utils";
import common from "../../common";
import request from "../../utils/request";
Component({
  data: {
    //页面数据
    pageUrl: 'http://10.18.30.149:8088/yanyin/?inset=1&clkno=053006&depno=461015&accno=6002520200197&vchamount=1000&vchdate=20240617&vchno=88002001&vchType=A01&currencyno=01#/main/scan/bill',
    // pageUrl: 'https://www.baidu.com',
    baseUrl: 'http://10.18.30.149:8088',
    baseApi: '#/main/scan/bill',
    pageWidth: '100%',
    pageHeigth: '100%',
    pageParams: {
      inset: '1', // 无需登录标志 固定传 1
      clkno: common.userInfo.tlrNo, // 柜员号 必填
      depno: common.userInfo.brnNo, // 机构号 必填
      flg: true, // iframe 调用标识
    },
    urls: {
      submit: 'yanyinSaveLogs'
    }
  },
  properties: {
    /** 
      * 传入 params 参数
      * @param { String } accno - 卡账户
      * @param { String } vchamount - 金额
      * @param { String } vchdate - 出票日期
      * @param { String } vchno - 凭证号
      * @param { String } vchType - 凭证类型
      * @param { String } currencyno - 币种
       */
    params: {
      type: Object,
      default: {},
    },
  },
  observers: {
    params: {
      handler(val) {
        const str = this.handle(val);
      },
    },
  },
  //生命周期
  created() {
    // 监听 iframe 传输数据
    window.addEventListener('message', (event) => {
      // console.log('iframe 传递数据', event, JSON.parse(event.data));
      if (event.origin !== this.data.baseUrl) return
      // TODO 调用接口上报，成功后通知父组件
      this.submitData(JSON.parse(event.data))
    })
    const str = this.handle(this.data.params)
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
    // 将数据处理成字符串并组装成 url
    handle(val) {
      const pageParams = Object.assign(this.data.pageParams, val)
      const pageParamsArr = []
      Object.keys(pageParams).forEach(item => {
        pageParamsArr.push(`${item}=${pageParams[item]}`)
      })
      const PageUrlStr = this.data.baseUrl + pageParamsArr.join('&') + this.data.baseApi
      return PageUrlStr
    },

    // 提交验印系统的结果
    submitData(info) {
      this.$emit('success', info)
      request.post(this.data.urls.submit, { ...info }).then(res => {
        this.$emit('success', info)
      }).catch(err => {
        console.log('提交失败：', err);
      })
    }
  },
});
