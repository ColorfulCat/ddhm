//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    indexImage: '',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showImage: function () {
    wx.navigateTo({
      url: '../image/image?indexImage=' + this.data.indexImage
    })
  },
  //事件处理函数
  gotoFace: function () {
    wx.navigateTo({
      url: '../face/face'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    wx.request({
      url: 'https://gank.io/api/data/%E7%A6%8F%E5%88%A9/1/1', 
      data: {},
      method: 'GET', 
      // header: {},  
      success: function (res) { 
        console.log('success') 
        //更新数据
        that.setData({
          indexImage: res.data.results[0].url
        })
      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.log('complete')
      }
    })  
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [this.data.indexImage] // 需要预览的图片http链接列表
    })
  }
})
