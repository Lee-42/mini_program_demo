Component({
  properties: {
    roleList: {
      type: Object,
      default: () => []
    },
    formModel: {
      type: Object,
    }
  },
  data: {
    roleTableConfigs: [
      { prop: "onlyIndSrlNo", label: "序号", attrs: { width: "130" } },
      { prop: "rlNm", label: "角色名称", attrs: { width: "130" } },
    ],
  },
});
