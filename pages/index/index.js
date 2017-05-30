//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    indexImage: '',
    items: [],
    userInfo: {},
    chats:[]
  },
  //事件处理函数
  addChatItem: function(isCat, avatarUrl, content, imageUrl) {
    console.log("addChatItem !")
    var tempChatItem = {}
    tempChatItem.avatar = isCat ? "../../images/cat_2.png" : this.data.userInfo.avatarUrl;
    tempChatItem.isCat = isCat;
    tempChatItem.title = "";
    tempChatItem.image = imageUrl;
    tempChatItem.content = content;

    var tempChats = this.data.chats;
    tempChats.push(tempChatItem);
    //更新数据
    this.setData({
      chats: tempChats
    });
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
      that.addChatItem(true, userInfo.avatarUrl, "你好啊！" + userInfo.nickName, "")
      that.addChatItem(false, "", "会我hiHi好  ", "")
      that.addChatItem(true, "", "啦啦啦啦啦绿啦啦啦啦啦绿了了了解多少发家里束带结发了 了但是荆防颗粒世纪东方技术点水电费", "")
      that.addChatItem(false, "", "啦啦啦啦啦绿啦啦啦啦啦绿了了了解多少发家里束带结发了 了但是荆防颗粒世纪东方技术点水电费", "")
      that.getImage();
    }) 
    
    
  },
  getImage:function(){
    var that = this
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
        for (var i = 0; i < res.data.results.length; i++) {
          itemList.push(res.data.results[i].url)
        }
        //更新数据
        that.setData({
          items: itemList
        })
        that.addChatItem(true, "", "", itemList[0])
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
      urls: [e.currentTarget.dataset.id] // 需要预览的图片http链接列表
    })
  }
})
