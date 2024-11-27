import request from '../../utils/request.js'

Component({
  properties: {
    disabled: {
      type: Boolean,
      default: false,
    },
    vchrTp: {
      type: String,
      default: "",
    },
    formModel: {
      type: Object,
      default: () => ({
        cashTfrAcctFlg: null, // 现转标志
        count: 1, // 凭证数量
        costOfPdnAmt: null, // 工本费
        pcdFeeAmt: null, // 手续费
        allCostOfPdnAmt: null, // 总工本费
        allPcdFeeAmt: null, // 总手续费
      })
    }
  },
  data: {
  },
  methods: {
    async validate(_rule, value, callback) {
      if (value === "0") {
        Object.assign(this.data.formModel, {
          // count: 0, // 不要重置 count
          costOfPdnAmt: 0, // 工本费
          pcdFeeAmt: 0, // 手续费
          allCostOfPdnAmt: 0, // 总工本费
          allPcdFeeAmt: 0, // 总手续费
        })
      } else {
        try {
          const count = +this.data.formModel.count
          //  1733 收费金额
          const res = await request.post("1733", {
            vchrTp: this.data.vchrTp, // 凭证类型
            vchrNum: count, // 凭证数量
          })

          const { costOfPdnAmt, pcdFeeAmt } = res

          Object.assign(this.data.formModel, {
            costOfPdnAmt, // 工本费
            pcdFeeAmt, // 手续费
            allCostOfPdnAmt: costOfPdnAmt * count, // 总工本费
            allPcdFeeAmt: pcdFeeAmt * count, // 总手续费
          })
        } catch (error) {
          return callback(false, error.chnlMsgInfo || error.retMsg)
        }
      }
      callback(true)
    },
    onCountValidate(_rule, value, callback) {
      const { costOfPdnAmt, pcdFeeAmt } = this.data.formModel
      value = +value;

      Object.assign(this.data.formModel, {
        allCostOfPdnAmt: costOfPdnAmt * value, // 总工本费
        allPcdFeeAmt: pcdFeeAmt * value, // 总手续费
      })

      callback(true);
    },
  },
});
