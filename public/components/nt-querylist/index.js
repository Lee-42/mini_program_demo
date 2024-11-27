import common from "../../common";
Component({
  data: {
    id: 0,
    currentIndex: -1, // 当前选中行的索引，默认为-1表示无选中行

    tableLoading: false,
    selectCopyRow: {},
    currentPageData: [],
    pageSize: 10,
    currentPage: 1,
    pageData: {
      pageSize: 10,
      currentPage: 1,
    },
    pageSizes: [],
    originData: [],
    filterData: {},
    parentData: [],
    formConfigs: [],
    headerClass: "",

    formModel: {
      selectValue: "",
      inputValue: "",
    },
  },
  properties: {
    // pdf文件的名字
    pdfName: {
      type: String,
      default: "pdf",
    },

    // excel文件的名字
    excelName: {
      type: String,
      default: "excel",
    },

    // 是否使用全量数据
    useFullData: {
      type: Boolean,
      value: false,
    },
    // 是否显示表格序号
    showIndex: {
      type: Boolean,
      value: false,
    },
    // 筛选表单配置
    filterConfigs: {
      type: Array,
      default: [],
    },

    // 表格配置
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    tableConfigs: {
      type: Array,
      default: [],
      required: true,
    },
    tableData: {
      type: Array,
      default: [],
    },
    // 分页配置
    total: {
      type: [String, Number],
      default: 0,
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: false,
    },
    // 是否显示导出按钮
    isExport: {
      type: Boolean,
      default: false,
    },
    // 是否显示打印按钮
    isPrint: {
      type: Boolean,
      default: false,
    },
    // 是否启用排序
    isSortable: {
      type: Boolean,
      default: true,
    },
    // 是否显示多选框
    isSelect: {
      type: Boolean,
      default: true,
    },
    // actions 插槽是否固定在右侧 - 入参与 element-plus 一致
    actionFixed: [Boolean, String],
    // 隐藏搜索框查询
    hideSearch: {
      type: Boolean,
      default: true,
    },
  },

  //生命周期
  created() {
    //created(函数只执行一次)
    const id = (window.queryListId || 0) + 1;
    window.queryListId = id;
    this.setData({
      id,
    });
  },
  ready() {
    //节点加载完成(函数只执行一次)
    if (this.data.isMultiple) {
    } else {
      this.setData({
        headerClass: "single-choose",
      });
    }

    // 获取柜面参数管理中的分页配置
    this.getPageConfigs();
    document.addEventListener("mousedown", this.handleDocumentClick);
  },
  //数据监听
  observers: {
    filterConfigs: {
      handler(val) {
        let index = val && val.length > 0;
        let fullConfig = this.data.tableConfigs.map((item) => {
          return { value: item.prop, label: item.label };
        });
        this.setData({
          formConfigs: index ? val : fullConfig,
        });
        this.data.formModel.selectValue = this.data.formConfigs[0].value;
      },
      immediate: true,
    },
    tableData: {
      handler(val) {
        this.getData();
      },
      immediate: true,
      deep: true,
    },
  },
  attached() {
    //onLoad
  },
  detached() {
    //onUnload
  },
  computed: {
    hasActions() {
      return this.$slots.actions;
    },
  },
  //页面事件
  methods: {
    handleDocumentClick(event) {
      const focusDiv = document.getElementById("focusDiv");
      if (focusDiv && !focusDiv.contains(event.target)) {
        setTimeout(() => {
          if (!focusDiv.contains(document.activeElement)) {
            this.handleBlur();
          }
        }, 0);
      }
    },
    // 表格当前行改变
    handleCurrentRowChange(row) {
      console.log(`handleCurrentRowChange - row:`, row);
    },
    // 点击表格行触发的事件
    handleRowClick(row) {
      console.log(`handleRowClick - row:`, row);
      this.$emit("handleRowClick", row);
      window.addEventListener("keydown", this.handleKeyDown);
    },
    handleKeyDown(e) {
      // 禁用上下方向键的默认行为
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
      const rowCount = this.data.currentPageData.length;
      if (!rowCount) return;

      let newIndex = this.data.currentIndex; // 使用一个临时变量来存储新的索引值

      switch (e.key) {
        case "ArrowUp": // 上
          if (this.data.currentIndex > 0) {
            newIndex -= 1;
          }
          break;
        case "ArrowDown": // 下
          if (this.data.currentIndex < rowCount - 1) {
            newIndex += 1;
          }
          break;
        // 可以根据需求处理左右键逻辑

        case "Enter": // 回车
          this.toggleSelection();
          break;
      }

      // 只有当索引确实发生变化时才调用setData
      if (newIndex !== this.data.currentIndex) {
        this.setData({
          currentIndex: newIndex,
        });
        this.highlightRow();
      }
    },
    handleFocus() {
      console.log("聚焦事件");
      // 可以在这里添加聚焦时的逻辑
      // this.stopKey();
      window.addEventListener("keydown", this.handleKeyDown);
    },
    handleBlur() {
      console.log("失焦事件");
      // 可以在这里添加失焦时的逻辑
      window.removeEventListener("keydown", this.handleKeyDown);
    },
    // 选中行
    toggleSelection() {
      if (
        this.data.currentIndex >= 0 &&
        this.data.currentIndex < this.data.currentPageData.length
      ) {
        const currentRow = this.data.currentPageData[this.data.currentIndex];
        console.log(`toggleSelection - currentRow:`, currentRow);

        // 表格前方是否有选择框
        if (this.data.isSelect) {
          this.$refs.tableRef.toggleRowSelection(currentRow);
        }
        // 判断 tableRef 是否存在
        if (this.$refs && this.$refs.tableRef) {
          // 设置当前行
          this.$refs.tableRef.setCurrentRow(
            this.data.currentPageData[this.data.currentIndex]
          );
        } else {
          console.error("tableRef 不存在，无法设置当前行");
        }

        this.$emit("selectRow", currentRow);
      }
    },
    // 高亮当前行
    highlightRow() {
      if (
        this.data.currentIndex >= 0 &&
        this.data.currentIndex < this.data.currentPageData.length
      ) {
        // 判断 tableRef 是否存在
        if (this.$refs && this.$refs.tableRef) {
          // 设置当前行
          this.$refs.tableRef.setCurrentRow(
            this.data.currentPageData[this.data.currentIndex]
          );
        } else {
          console.error("tableRef 不存在，无法设置当前行");
        }
      }
      console.log(
        `highlightRow - this.data.currentIndex:`,
        this.data.currentIndex
      );
    },
    handleCellClick(row, column, cell, event) {
      // 当点击某个单元格时，更新currentIndex为点击行的索引
      let temp = this.data.currentPageData.indexOf(row);
      this.setData({
        currentIndex: temp,
      });
    },
    /**
     * 禁用上下左右键
     */
    // stopKey() {
    //   document.addEventListener(
    //     "keydown",
    //     function (event) {
    //       let keyDirection = null; // 用于存储按键方向的变量

    //       // 检查按下的键是否是上（38）、下（40）、左（37）或右（39）方向键
    //       switch (event.keyCode) {
    //         case 37: // 左
    //           keyDirection = "左";
    //           break;
    //         case 38: // 上
    //           keyDirection = "上";
    //           break;
    //         case 39: // 右
    //           keyDirection = "右";
    //           break;
    //         case 40: // 下
    //           keyDirection = "下";
    //           break;
    //         default:
    //           // 如果不是方向键，则直接退出函数
    //           return;
    //       }

    //       // 阻止默认行为
    //       event.preventDefault();

    //       // 根据按键方向进行操作，这里是打印出方向
    //       if (keyDirection) {
    //         console.log(keyDirection);
    //       }
    //     },
    //     false
    //   );
    // },
    /**
     * 通用文件生成并下载方法
     * @param {Object} res - 接口返回的响应数据
     * @param {String} fileType - 文件类型 ('pdf' 或 'excel')
     */
    downloadFile(res, fileType, name) {
      // 从接口返回的数据中提取出文件名

      const filename = name + (fileType === "pdf" ? ".pdf" : ".xlsx");

      // 根据文件类型选择Base64编码的数据
      const base64Data =
        fileType === "pdf" ? res.data.data.data.pdf : res.data.data.data.excel;

      // 将Base64编码的字符串转换为二进制数据
      const fileData = atob(base64Data);
      const byteNumbers = new Array(fileData.length);
      for (let i = 0; i < fileData.length; i++) {
        byteNumbers[i] = fileData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // 根据文件类型设置MIME类型
      const mimeType =
        fileType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      // 使用转换后的二进制数据创建Blob对象
      const blob = new Blob([byteArray], { type: mimeType });

      // 创建临时的<a>标签用于触发下载
      let a = document.createElement("a");
      a.download = filename;
      a.style.display = "none";
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click(); // 触发下载
      document.body.removeChild(a); // 清理DOM
    },
    printPdfUnit() {
      // 使用全量数据，前端分页，打印所有的表格数据
      let data = {};
      if (this.data.useFullData) {
        data = {
          tableConfigs: this.data.tableConfigs,
          data: this.data.tableData,
        };
      } else {
        data = {
          tableConfigs: this.data.tableConfigs,
          data: this.data.currentPageData,
        };
      }
      console.log(
        "printPdfUnit - this.data.useFullData:",
        this.data.useFullData
      );
      console.log("printPdfUnit - data:", data);
      common.request({
        url: "printPdfUnit",
        method: "POST",
        // fileName: true,
        data: data,
        success: (res) => {
          this.downloadFile(res, "pdf", this.data.pdfName);
        },
      });
    },
    // 导出事件
    printExcelUnit() {
      // 使用全量数据，前端分页，打印所有的表格数据
      let data = {};
      if (this.data.useFullData) {
        data = {
          tableConfigs: this.data.tableConfigs,
          data: this.data.tableData,
        };
      } else {
        data = {
          tableConfigs: this.data.tableConfigs,
          data: this.data.currentPageData,
        };
      }
      common.request({
        url: "printExcelUnit",
        method: "POST",
        data: data,
        success: (res) => {
          this.downloadFile(res, "excel", this.data.excelName);
        },
      });
    },
    getPageConfigs() {
      common.request({
        method: "POST",
        url: "listCounterParam",
        data: {
          page: 1,
          rows: 10,
          param_name: "分页配置",
        },
        success: (res) => {
          if (res.data.data.code == 0) {
            this.setData({
              pageSizes: res.data.data.data[0].param_value
                .split(",")
                .map(Number),
            });
          } else {
          }
        },
      });
    },
    handleSelectionChange(val) {
      // 多选
      if (this.data.isMultiple) {
        this.$emit("handleSelectionChange", val);
      }
      // 单选
      else {
        // 控制单选
        if (val.length > 1) {
          let del_row = val.shift();
          this.$refs.tableRef.toggleRowSelection(del_row, false);
          this.setData({
            selectCopyRow: val[0],
          });
        } else {
          this.setData({
            selectCopyRow: val[0],
          });
        }
        this.$emit("handleSelectionChange", val);
      }
    },
    handleSizeChange(newSize) {
      this.setData({
        pageData: {
          ...this.data.pageData,
          pageSize: newSize,
        },
      });
      // 重新获取数据的方法
      if (this.data.useFullData) {
        this.getData();
      } else {
        this.$emit("pageChange", this.data.pageData);
      }
    },
    handleCurrentChange(newPage) {
      this.setData({
        pageData: {
          ...this.data.pageData,
          currentPage: newPage,
        },
      });
      // 重新获取数据的方法
      if (this.data.useFullData) {
        this.getData();
      } else {
        this.$emit("pageChange", this.data.pageData);
      }
    },

    // 分页使用所有数据
    getData() {
      // 使用全量数据，前端分页
      if (this.data.useFullData) {
        const startIndex = (this.data.currentPage - 1) * this.data.pageSize;
        const endIndex = startIndex + this.data.pageSize;
        const currentPageData = this.data.tableData.slice(startIndex, endIndex);
        const originData = JSON.parse(JSON.stringify(currentPageData)); // 深拷贝 currentPageData
        this.setData({
          currentPageData: currentPageData,
          originData: originData,
        });
      }
      // 使用后端分页
      else {
        const originData = JSON.parse(JSON.stringify(this.data.tableData)); // 深拷贝 tableData
        this.setData({
          currentPageData: this.data.tableData,
          originData: originData,
        });
      }
    },
    fuzzyFilter(val) {
      // 表格配置
      let tableConfigs = this.data.tableConfigs;
      let selectValue = this.data.formModel.selectValue;
      let inputValue = this.data.formModel.inputValue;

      // 查找当前选择字段的配置对象
      const selectedConfig = tableConfigs.find(
        (item) => item.prop === selectValue
      );

      let transformedInputValue = inputValue;

      // 如果存在options，则尝试根据inputValue找到对应的键
      if (selectedConfig && selectedConfig.options) {
        for (const [key, value] of Object.entries(selectedConfig.options)) {
          if (value === inputValue) {
            transformedInputValue = key;
            break; // 找到匹配项，跳出循环
          }
        }
      }

      const filterTemp = this.data.originData.filter((item) => {
        // 确保原始数据中该属性存在，并转换为字符串形式
        const propValue = item[selectValue] ? item[selectValue].toString() : "";
        // 使用转换后的输入值进行匹配
        return propValue.includes(transformedInputValue);
      });

      this.setData({
        currentPageData: filterTemp,
      });
    },
  },
});
