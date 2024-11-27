import utils from '../../../../utils/utils'
import commonData from '../../../../common/common.js'

Component({
  data: {
    onlinecheckData: {
      visible: false, // 联网核查开关
      checkNo: null, // 核查号码
      checkName: null, // 核查姓名
    },
    formModel: {
      seqNo: "", // 序号 - 隐藏
      operationNo: "", // 操作员号
      operationName: "", // 操作员姓名
      // newPassword: "", // 新密码
      // oldPassword: "", // 旧密码
      identTp: "", // 证件类型
      identNo: "", // 证件号码
      gender: "", // 性别
      telphone: "", // 联系电话
      mobile: "", // 手机号码
      email: "", // Email地址
      isAdmin: "", // 是否管理员

      // 一键签约 - 证书绑定 字段
      ctfAplyDt: "", // 证书申请日期
      usbKeyNo: "", // 椰盾编号
      rsetPswdFlg: "", // 是否重置登录密码
      remarkRmk: "", // 备注
    },
    roleListFilterConfig: [],
    accountFilterConfig: [],
    roleListTableConfigs: [
      { prop: "rlNo", label: "角色序号" },
      { prop: "rlNm", label: "角色名称" },
      {
        prop: "rlTp", label: "管理角色标志", options: {
          "N": "操作员",
          "A": "管理员",
        }
      },
      // {
      //   prop: "tlr_no", label: "是否可操作", options: {
      //     "1": "是",
      //     "0": "否",
      //   }
      // },
    ],
    accountTableConfigs: [
      { prop: "acctNo", label: "账号" },
      { prop: "bankId", label: "开户网点" },
      {
        prop: "acRight", label: "账号权限", options: {
          "FT": "任意转出",
          "Q": "仅开通查询",
        }
      },
    ],
    roleListTableData: [], // 角色列表

    genderList: [], // 性别

    roleListSelection: null,
    accountSelection: null,

    isAdminFlag: false, // 能否编辑“是否管理员项”
  },
  properties: {
    mainCd: { type: String, required: true },
    expandFormData: { type: Object }, // 表单辅助数据，需要外部传入
    roleList: { type: Array }, // 角色列表
    accountList: { type: Array }, // 上挂账号列表
    isOneStop: { type: Boolean, default: false }, // 是否一键开户
  },
  computed: {
    accountTableData() {
      const acList = this.data.accountList
      let arr = []
      if (acList) {
        arr = acList.map(ac => ({
          acctNo: ac.acctNo, // TODO 一键签约时，没有账户号
          bankId: ac.brchNo,
          acRight: ac.acctPrvgCd,
        }))
      }
      return arr
    },
  },
  async ready() {
    if (this.data.isOneStop) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
      this.data.formModel.ctfAplyDt = userInfo.tran_date ? userInfo.tran_date.replace(/-/g, "") : (() => {
        const now = new Date()
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
      })()
    }

    // 反显角色列表
    setTimeout(() => {
      this.onIsAdminValidate(null, this.data.formModel.isAdmin)
    }, 1000);
    // TODO 如果是更新，反显角色列表时同时 赋值默认已选项
    // if (this.data.expandFormData.operationFlag === "U") {
    //   // MOCK
    //   this.data.roleListTableData.forEach(data => (data._checked = true))
    // }

    await utils.getSelectData({
      mainCd: this.data.mainCd,
      flg: commonData.SelectDataType.C030,
      name: 'genderList', that: this
    })

    // 控制焦点
    setTimeout(() => {
      const input = document.querySelector(".nt-input__inner[myautofocus=operation-info]")
      if (input) {
        input.focus()
      }
    }, 750);
  },
  methods: {
    submit() {
      if (!this.data.accountSelection || !this.data.accountSelection.length) {
        return nt.showMessagebox("至少需要一个可操作账号！", '拒绝', {
          type: 'error',
          confirmButtonText: '知道了',
        })
      }
      this.$emit('submit', {
        ...this.data.formModel,
        roleListTableData: JSON.parse(JSON.stringify(this.data.roleListSelection)),
        accountSelection: JSON.parse(JSON.stringify(this.data.accountSelection)),
      })
    },

    async onIdNoValidate(_rule, value, callback) {
      const cache = this.data.onlinecheckData;

      // 上一次联网核查后，是否变更过身份证号
      if (cache.checkNo === value) {
        if (cache.checkCode === 0) {
          // 联网核查已通过
          return callback(true);
        }
      }

      const { identTp, operationName } = this.data.formModel
      if (identTp === '1') {
        // 打开联网核查接口
        Object.assign(this.data.onlinecheckData, {
          visible: true,
          checkNo: value,
          checkName: operationName,
        })
      } else {
        callback(true);
      }
    },

    onIsAdminValidate(_rule, value, callback) {
      if (value === "Y") {
        // N - 操作员 A - 管理员
        const list = this.data.roleList.filter(role => role.rlTp === "A")
        this.setData({
          roleListSelection: list, // 管理员时，角色不可选，默认全部
          roleListTableData: list,
        })
      } else if (value === "N") {
        this.setData({
          roleListSelection: null,
          roleListTableData: this.data.roleList.filter(role => role.rlTp === "N")
        })
      }
      callback && callback(true)
    },

    // 角色表格多选
    onRoleListSelected(rows) {
      this.setData({
        roleListSelection: [...rows]
      })
    },
    // 可操作账号表格多选
    onAccountSelected(rows) {
      this.setData({
        accountSelection: [...rows]
      })
    },

    // 邮箱校验
    onEmailValidate(_rule, value, callback) {
      if (value && typeof value === 'string') {
        if (utils.emailValidate(value)) {
          callback(true)
        }
        else callback(false, "非法邮箱")
        return
      }
      callback(true)
    },

    // 联网核查结果
    onOnlinecheck(data) {
      const { checkCode, checkData } = data
      if (checkCode === 0) {
        // 保存联网核查结果
        Object.assign(this.data.onlinecheckData, checkData, { checkCode })
      }
    },

    // Exposes
    setFields(fields) {
      if (fields) {
        const { formModel } = this.data
        for (const key in fields) {
          const value = fields[key];
          if (Object.hasOwnProperty.call(formModel, key)) {
            // 表单数据反显
            formModel[key] = value;
          } else if (Object.hasOwnProperty.call(this.data, key)) {
            // 两个表格的数据反显
            this.setData({
              [key]: value
            })
          }
        }
      }
    }
  }
})