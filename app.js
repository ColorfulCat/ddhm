const AV = require('./utils/av-weapp-min');
AV.init({
  appId: 'FWsyaYaBQWxWnbXLv4J9LvYe-gzGzoHsz',
  appKey: '1Dd7dckrou6H4OlY5LayIrir',
});

App({
    onLaunch: function () {
        console.log('App Launch') 
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false
    },
    getUserInfo: function (cb) {
      var that = this
      if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
        //调用登录接口
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          }
        })
      }
    }
});