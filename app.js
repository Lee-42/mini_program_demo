
App({
  onLaunch: function(){
    //小程序初始化执行一次onLaunch,先于Page页面中onLoad生命周期函数
    console.log('app------onLaunch');
  },
  globalData:{ //全局数据
    userInfo: null
  }
})

