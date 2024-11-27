

Component({
  data: {
  },
  computed: {
  },
  properties: {
    data: {
      type: Object,
    },
    expandData: {
      type: Object,
    },
    isEdit: { type: Boolean, default: false }
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
