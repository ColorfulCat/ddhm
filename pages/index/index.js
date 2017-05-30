//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    indexImage: '',
    items: [],
    chats:[
      {
        url:"../../images/cat_0.png",
        isCat:true,
        title:"大花猫",
        content:"哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！1111111234"
      },
      {
        url: "../../images/cat_1.png",
        isCat: false,
        title: "哈哈哈",
        content: "哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！哈喽哇！"
      },
      {
        url: "../../images/cat_2.png",
        isCat: true,
        title: "哈哈哈",
        content: "hello world"
      }
    ],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
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
      url: 'https://gank.io/api/data/%E7%A6%8F%E5%88%A9/15/1', 
      data: {},
      method: 'GET', 
      // header: {},  
      success: function (res) { 
        console.log('success') 
        if (res == null ||
          res.data == null ||
          res.data.results == null ||
          res.data.results.length <= 0) {
          console.error('success but data is error');
          return;
        }
        var itemList = [];
        for (var i = 0; i < res.data.results.length; i++){
          itemList.push(res.data.results[i].url)
        }
        //更新数据
        that.setData({
          items: itemList
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
      urls: this.data.items // 需要预览的图片http链接列表
    })
  }
})
