//index.js
const AV = require('../../utils/av-weapp-min');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    indexImage: '',
    items: [],
    userInfo: {},
    chats: [],
    inputValue: "",
    scrollTop:0,
    toView: 'list-bottom'
  },
  //事件处理函数
  addChatItem: function (isCat, avatarUrl, content, imageUrl) {
    console.log("addChatItem !")
    var tempChatItem = {}
    tempChatItem.avatar = isCat ? avatarUrl : this.data.userInfo.avatarUrl;
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
  gotoDemo: function () {
    wx.navigateTo({
      url: '../../example/index'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      that.addChatItem(true, "../../images/cat_0.png", "你好啊！" + userInfo.nickName, "")
      that.addChatItem(true, "../../images/cat_shy.png", userInfo.gender == 1 ? "小帅哥，天气这么热，送你个妹子吧~" :"妞，天气这么热，送你个帅哥养养眼吧~", "")
      that.sendMessage(userInfo.gender == 1 ? "给我一张美女图片":"给我一张帅哥图片")
    })


  },
  getImage: function () {
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
        if (that.data.userInfo.gender == 1) {
          that.addChatItem(true, "../../images/cat_shy.png", "小帅哥，天气这么热，送你个妹子吧~", "")
          that.addChatItem(true, "", "", itemList[0])
        } else {
          that.addChatItem(true, that.getRandomAvatar(), "大妹子，你今天真好看哟~", "")
        }

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
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  sendButtonClick: function (e) {
    var that = this
    if (that.data.inputValue.length == 0) {
      console.log("sendButtonClick empty")
      return
    }
    if (that.data.inputValue == "demo" ||
      that.data.inputValue == "DEMO" ||
      that.data.inputValue == "Demo"
    ) {
      wx.navigateTo({
        url: '../../example/index'
      })
      return
    }

    that.addChatItem(false, "", that.data.inputValue, "")
    that.scrollBottom()

    that.sendMessage(that.data.inputValue)
    //更新数据
    that.setData({
      inputValue: ""
    })
  },
  sendMessage: function(message){
    var that = this
    // 对话
    wx.request({
      url: "https://idc.emotibot.com/api/ApiKey/openapi.php",
      data: {
        cmd: "chat",
        appid: "3f04846805cbbf1bd9d06aa6a2bc06f6",
        userid: that.data.userInfo.nickName,
        text: message
      },
      method: 'GET',
      // header: {},  
      success: function (res) {
        console.log('success')
        console.log(res)
        if (res == null ||
          res.statusCode != 200 ||
          res.data == null ||
          res.data.data == null
        ) {
          console.error('success but data is error');
          that.addChatItem(true, "../../images/cat_cry.png", "我竟然无言以对~", "")
          return;
        }
        if (res.data.data.length > 0) {
          for (var i = 0; i <= res.data.data.length; i++) {
            if (res.data.data[i].type != null && res.data.data[i].type == "url") {
              that.addChatItem(true, that.getRandomAvatar(), "", res.data.data[i].value)
            } else {
              if (i == 0) {
                that.addChatItem(true, that.getRandomAvatar(), res.data.data[i].value, "")
              } else {
                that.addChatItem(true, "", res.data.data[i].value, "")
              }

            }
          }
        } else {
          that.addChatItem(true, that.getRandomAvatar(), "不知道你在说啥~", "")
        }
        //滚动到底部
        that.scrollBottom()
      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.log('complete')
      }
    })
  },
  //通过设置滚动条位置实现画面滚动  
  scrollBottom: function () {
    console.log("scrollBottom !")
    this.setData({
      scrollTop: -1000
    })
  },
  getRandomAvatar: function () {
    return "../../images/cat_" + Math.round(Math.random() * 12) + ".png"
  }
})
