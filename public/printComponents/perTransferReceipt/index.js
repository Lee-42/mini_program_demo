import UserVariable from "../../common/UserVariable";
const { JZZL_DQYBT } = UserVariable
import utils from '../../utils/utils'
const { getVoucherBackground } = utils
// import common from "../../common";
Component({
  data: {
    //页面数据
    time: null,
    fileList: [
      "@ac_no",
      "@name",
      "@tx_amt1",
      "@title",
      "@opn_date",
      "@opn_br_no",
      "@cif_no",
      "@mtr_date",
      "@term",
      "@term_type",
      "@rate",
      "@av_bal",
      "@email",
      "@zy",
      "@deac_type",
      "@cur_name",
      "@tx_code",
      "@memo",
      "@ac_no1",
      "",
      "@ct_name",
      "@ac_seqn",
      "@ic_date",
      "@prt_line",
      "@prdt_no",
      "",
      "@brf",
      "@tmp_ac_no",
      "@tmp_tx_name",
      "@tel",
      "@id_name",
      "@id_no",
      "@br_name",
      "@br_tele",
      "@note_no",
      "",
      "@acc_hrt",
      "@cp_type"
    ],
    base: "",
    datas: {},
    printDatas: {}
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
    type: {
      type: String,
      default: '0'
    },
    fileData: {
      type: String,
      default: ""
    }
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
    printData: {
      handler(val) {
        console.log(val);

        const { cashDrftFlg, acctAcctNo, proxyIdentNo, acctSrlNo, acctAcctNm, acctOpnAcctBrchNm, expDt, proxyNm, payIdentNo, identNo, currencyCcy, inIntAcctNo, inIntAcctNm } = val
        const { datas } = this.data
        datas.BZ = currencyCcy
        datas.PayerAcno = acctAcctNo
        datas.PayerAcseqn = acctSrlNo;
        datas.PayerZHHM = acctAcctNm;
        datas.PayerOpnname = acctOpnAcctBrchNm;
        datas.TradeType = "子账户开户";
        datas.CtInd = "转账";
        datas.RXZH = inIntAcctNo;
        // datas.SXF = this.TradeBus.F003;// 手续费/
        datas.SKRZJ = identNo;//收款人证件
        datas.FKRZJ = payIdentNo;//付款人证件
        datas.DLRZJ = proxyIdentNo;//代理人证件  
        datas.DLRM = proxyNm;//代理人名称
        datas.DQRQ = expDt;//到期日期
        datas.RXHM = inIntAcctNm;
        datas.HZJE = HZJE;
        datas.CHBZ = cashDrftFlg
        console.log(datas, 'datas');
      },
      deep: true
    },

    fileData(val) {
      const { fileList } = this.data
      function fn(file, index) {
        let i = fileList.findIndex(f => f == index)
        console.log(i);
        if (i != -1) {
          return file[i]
        } else {
          return ''
        }
      }
      const file = val.split("|")
      file.pop()
      const { datas } = this.data
      datas.TxAmt = fn(file, '@tx_amt1')
      datas.PayeeZHHM = fn(file, '@name')
      datas.PayeeAcno = fn(file, '@ac_no')
      datas.ZDYZ = fn(file, '@zdzc')
      datas.PayerPrdtName = fn(file, '@cp_type')
      if (fn(file, '@cp_type') == "定活两便") {
        datas.CQ = "";
        datas.LV = "";
      }
      else {
        if (fn(file, '@term')) {
          datas.CQ = fn(file, '@cp_type') + fn(file, '@term') + fn(file, '@unit')
          datas.LV = fn(file, '@rate')
        }
      }
    },

    datas: {
      handler(val) {
        if (!val) return
        const { printDatas } = this.data

        printDatas.TB_PayerAcseqn1 = val.PayerAcseqn
        printDatas.TB_PayerAcno1 = val.PayerAcno
        printDatas.TB_PayerAcno2 = val.PayerAcno
        printDatas.TB_PayerHM1 = val.PayerZHHM
        printDatas.TB_PayerHM2 = val.PayerZHHM
        printDatas.TB_PayeeAcno1 = val.PayeeAcno
        printDatas.TB_PayeeAcno2 = val.PayeeAcno
        printDatas.TB_PayeeHM1 = val.PayeeZHHM
        printDatas.TB_PayeeHM2 = val.PayeeZHHM
        printDatas.TB_TxAmt1 = val.TxAmt
        printDatas.TB_TxAmt2 = val.TxAmt
        printDatas.TB_BZ = val.BZ
        printDatas.TB_BZ2 = val.BZ
        printDatas.TB_CHBZ = val.CHBZ
        printDatas.TB_CHBZ2 = val.CHBZ
        printDatas.TB_ZDYZ = val.ZDYZ
        printDatas.TB_ZDYZ2 = val.ZDYZ
        printDatas.TB_RXZH1 = val.RXZH
        printDatas.TB_RXZH2 = val.RXZH
        printDatas.LSXF = val.SXF
        printDatas.RSXF = val.SXF
        printDatas.TB_FKRZJ = val.FKRZJ
        printDatas.TB_SKRZJ = val.SKRZJ
        printDatas.TB_DLRZJ = val.DLRZJ
        printDatas.TB_DLRM = val.DLRM
        printDatas.CQ = val.CQ
        printDatas.CQ1 = val.CQ
        if (val.PrdtName && val.PrdtName.indexOf("定活两便") == 0) {
          printDatas.LV = ''
          printDatas.LV1 = ''
        } else if (!val.LV) {
          printDatas.LV = ''
          printDatas.LV1 = ''
        } else if (val.LV) {
          printDatas.LV = `${val.LV}%`
          printDatas.LV1 = `${val.LV}%`
        }
        if (val.TransferUsage) {
          printDatas.TB_TransferUsage = val.TransferUsage
        }
        if (val.DQRQ) {
          printDatas.TB_DQRQ = val.DQRQ
          printDatas.TB_DQRQ2 = val.DQRQ

        }
        if (val.RXHM) {
          printDatas.TB_RXHM = val.RXHM
          printDatas.TB_RXHM2 = val.RXHM

        }
        if (val.HZJE && Number(val.HZJE) > 0) {
          printDatas.TB_HZJE = val.HZJE
          printDatas.TB_HZJE2 = val.HZJE
        }
        const { tlr_no } = JSON.parse(localStorage.getItem("userInfo")) || {}
        printDatas.TB_Teller2 = tlr_no
        printDatas.TB_QT = "本人已阅读产品须知，充分了解且清楚知晓本产品规则及相关约定，并确认银行打印记录正确无误"

      },
      deep: true
    }
  },
});
