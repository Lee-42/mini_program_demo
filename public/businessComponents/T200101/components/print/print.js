const fieldMap = [
  { key: 'newAcctNo', label: '账    号', value: null },
  { key: 'mutlMgtFlg', label: '管控账户标志', value: null },
  { key: 'pdNm', label: '产品名称', value: null },
  { key: 'cstNo', label: '客 户 号', value: null },
  { key: 'acctNm', label: '户    名', value: null, meta: { block: true } },
  { meta: { br: true } },
  { key: 'identTp', label: '证件类型', value: null },
  { key: 'identNo', label: '证件号码', value: null },
  { key: 'uduwFlg', label: '通存通兑标志', value: null },
  { key: 'inIntAcctNo', label: '入息账号', value: null },
  { key: 'busiTp', label: '科 目 号', value: null },
  { key: 'currencyCcy', label: '币    种', value: null },
  { key: 'isElectron', label: '使用电子营业执照', value: null },
  { key: 'acctTp', label: '账户类型', value: null },
  { key: 'clcIntTp', label: '计息类型', value: null },
  { key: 'cashDrftFlg', label: '钞汇标志', value: null },
  { key: 'frgnExgPpsFlg', label: '做外汇用途', value: null },
  { key: 'lmtTp', label: '限额类型', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "acctChrctrstcAttr" && !!row.value) < 0 } },
  { key: 'lmtAmt', label: '限额金额', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "acctChrctrstcAttr" && !!row.value) < 0 } },
  { key: 'acctChrctrstcAttr', label: '账户性质', value: null, meta: { hidden: (_, value) => !value } },
  { key: 'frgnExgMgtAprvlPORcrdsBsnNo', label: '外汇审批编号', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "acctChrctrstcAttr" && !!row.value) < 0 } },
  { key: 'identTp1', label: '证件类型', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo1" && !!row.value) < 0 } },
  { key: 'identNo1', label: '证件号码', value: null, meta: { hidden: (_, value) => !value } },
  { key: 'name1', label: '联系人姓名', value: null, meta: { block: true, hidden: rows => rows.findIndex(row => row.key === "identNo1" && !!row.value) < 0 } },
  { key: 'phone11', label: '联系人电话1', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo1" && !!row.value) < 0 } },
  { key: 'phone12', label: '联系人电话2', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo1" && !!row.value) < 0 } },
  { key: 'identTp2', label: '证件类型', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo2" && !!row.value) < 0 } },
  { key: 'identNo2', label: '证件号码', value: null, meta: { hidden: (_, value) => !value } },
  { key: 'name2', label: '联系人姓名', value: null, meta: { block: true, hidden: rows => rows.findIndex(row => row.key === "identNo2" && !!row.value) < 0 } },
  { key: 'phone21', label: '联系人电话1', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo2" && !!row.value) < 0 } },
  { key: 'phone22', label: '联系人电话2', value: null, meta: { hidden: rows => rows.findIndex(row => row.key === "identNo2" && !!row.value) < 0 } },
]

Component({
  data: {
  },
  computed: {
    printData() {
      const data = this.data.data;
      const arr = [];

      if (data) {
        for (const index in fieldMap) {
          const field = fieldMap[index];
          if (!!field.key) {
            const obj = { key: field.key, label: field.label, value: data[field.key] }
            if (field.meta) {
              const { block, hidden } = field.meta
              if (block) {
                obj.block = true
              }
              if (typeof hidden === "function") {
                obj.hidden = hidden(fieldMap, obj.value)
              }
            }
            arr.push(obj)
          } else if (field.meta) {
            const { br } = field.meta
            if (br) {
              arr.push({ isBr: true })
            }
          }
        }
      }

      return arr
    },
  },
  properties: {
    data: {
      type: Object,
    }
  },
  //生命周期
  created() {
    //created(函数只执行一次)
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
  },
  //数据监听
  observers: {
  },
});
