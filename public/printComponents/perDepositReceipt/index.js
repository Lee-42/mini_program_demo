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
      "@end_day",
      "@term",
      "@unit",
      "@rate",
      "@tx_amt1",
      "@email",
      "@zy",
      "@deac_type",
      "@cur_name",
      "@tx_code",
      "@memo",
      "@ac_no1",
      "@intr",
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
      "@zdzc",
      "@acc_hrt",
      "@draw_type_yq",
      "",
      "",
      "",
      "",
      "@tctd",
      "@cp_type",
      ""
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
    printData: {
      handler(val) {
        console.log(val);

        const { cashDrftFlg, expDt, proxyNm, payIdentNo, identNo, currencyCcy, inIntAcctNo, inIntAcctNm, medmCd } = val
        const { datas } = this.data
        datas.BZ = currencyCcy
        datas.RXZH = inIntAcctNo
        datas.RXHM = inIntAcctNm
        datas.HZJE = ''
        datas.TradeType = medmCd == JZZL_DQYBT ? "定期一本通开户" : "卡内定期开户"
        datas.OpnName = ""
        datas.HasJZ = true
        datas.DisplayHasJZ = false
        datas.BRZJ = identNo
        datas.DLRZJ = payIdentNo
        datas.DLRM = proxyNm
        datas.DQRQ = expDt
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
      datas.Bal = fn(file, '@tx_amt1')
      datas.ZHHM = fn(file, '@name')
      datas.Acno = fn(file, '@ac_no')
      datas.PrdtName = fn(file, '@cp_type') || ''
      datas.Term = `${fn(file, '@cp_type')}${fn(file, '@term')}${fn(file, '@unit')}`
      datas.Rate = fn(file, '@rate')
      datas.ZDYZ = fn(file, '@zdzc')
      datas.ZHXH = fn(file, '@ac_seqn')
      datas.NoteNo = fn(file, '@note_no')
    },

    datas: {
      handler(val) {
        if (!val) return
        const { printDatas } = this.data
        printDatas.TB_Acno1 = val.Acno
        printDatas.TB_Acno2 = val.Acno
        printDatas.TB_ZHXH = val.ZHXH
        printDatas.TB_HM1 = val.ZHHM
        printDatas.TB_HM2 = val.ZHHM
        printDatas.TB_RXZH1 = val.RXZH
        printDatas.TB_RXZH2 = val.RXZH
        printDatas.TB_TxAmt1 = val.TxAmt
        printDatas.TB_TxAmt2 = val.TxAmt
        printDatas.TB_BZ = val.BZ
        printDatas.TB_BZ2 = val.BZ
        printDatas.TB_CHBZ = val.CHBZ
        printDatas.TB_CHBZ2 = val.CHBZ
        printDatas.TB_ZDYZ = val.ZDYZ
        printDatas.TB_BRZJ = val.BRZJ
        printDatas.TB_DLRZJ = val.DLRZJ
        printDatas.TB_DLRM = val.DLRM
        if (val.PrdtName && val.PrdtName.indexOf("定活两便") == 0) {
          printDatas.TB_Rate1 = ''
          printDatas.TB_Rate2 = ''
        } else {
          printDatas.TB_Rate1 = `${val.Rate}%`
          printDatas.TB_Rate2 = `${val.Rate}%`
        }
        printDatas.TB_Term1 = val.Term
        printDatas.TB_Term2 = val.Term
        if (val.DQRQ) {
          printDatas.TB_DQRQ = val.DQRQ
          printDatas.TB_DQRQ2 = val.DQRQ
        }
        if (val.RXHM) {
          printDatas.TB_RXHM = val.RXHM
          printDatas.TB_RXHM = val.RXHM
        }
        if (val.HZJE && Number(val.HZJE) != 0) {
          printDatas.TB_HZJE = val.HZJE
          printDatas.TB_HZJE2 = val.HZJE
        }
        printDatas.TB_QT = val.depositTermTp == 'F' ? "本人已阅读产品须知，充分了解且清楚知晓本产品规则及相关约定，并确认银行打印记录正确无误" : ""
        const { tlr_no } = JSON.parse(localStorage.getItem("userInfo")) || {}
        printDatas.TB_Teller2 = tlr_no
      },
      deep: true
    }
  },
});
