//index.js
const AV = require('../../utils/av-weapp-min');
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    count: 30,
    page: 1,
    loading: false,
    items: []
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.getItems();
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  getItems: function () {
    var that = this
    if (that.data.loading){
      return;
    }
    that.setData({
      loading: true
    })
    wx.request({
      url: 'https://m2.qiushibaike.com/article/list/latest?count=' + that.data.count + '&page=' + that.data.page,
      data: {},
      method: 'GET',
      // header: {},  
      success: function (res) {
        console.log('success')
        console.log(res)
        if (res == null ||
          res.data == null ||
          res.data.items == null ||
          res.data.items.length <= 0) {
          console.error('success but data is error');
          return;
        }
        console.log('data is ok')
        var tempList = that.data.items;
        for (var i = 0; i < res.data.items.length; i++) {
          tempList.push(res.data.items[i])
        }
        that.setData({
          items: tempList 
        })
      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.log('complete')
        that.setData({
          loading: false
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  loadMore: function(e){
    console.log('loadMore');
    var that = this;
    var currentPage = that.data.page + 1
    that.setData({
      page: currentPage
    })
    that.getItems();
  }
})
