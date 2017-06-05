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
    scrollTop: 0,
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
      that.addChatItem(true, "../../images/cat_n1.png", "你好啊！" + userInfo.nickName, "")
      var x = Math.round(Math.random() * 10)
      console.log("x = " + x)
      if(x >= 8 && x < 10){ 
        that.addChatItem(true, "", "回复我'成语接龙'，我可以陪你玩哦~", "")
      }else if(x == 10){
        that.addChatItem(true, "../../images/cat_shy.png", "回复我'讲个笑话'，我就给你讲个笑话~", "") 
      }else{
        that.addChatItem(true, "../../images/cat_shy.png", userInfo.gender == 1 ? "小帅哥，天气这么热，送你个妹子吧~" : "妞，天气这么热，送你个帅哥养养眼吧~", "")
        that.sendMessage(userInfo.gender == 1 ? "给我一张美女图片" : "给我一张帅哥图片")
      }
      
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
          that.addChatItem(true, that.getRandomAvatar(), "大妹子，你今天真好看哟~ 给你看个好东西！", "")
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
  sendMessage: function (message) {
    var that = this
    wx.showNavigationBarLoading()
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
        wx.hideNavigationBarLoading()
        console.log('success')
        console.log(res)
        if (res == null ||
          res.statusCode != 200 ||
          res.data == null ||
          res.data.data == null
        ) {
          console.error('success but data is error');
          that.addChatItem(true, "../../images/cat_sleep.png", "我竟然无言以对~", "")
          return;
        }
        if (res.data.data.length > 0) {
          for (var i = 0; i <= res.data.data.length; i++) {
            var avatarUrl = ""
            if (i == 0) {
              avatarUrl = that.getRandomAvatar(res.data.emotion)
            }
            if (res.data.data[i].type != null && (res.data.data[i].cmd == "picture" || res.data.data[i].cmd == "image")) {
              that.addChatItem(true, avatarUrl, "", res.data.data[i].value)
            } else {
              that.addChatItem(true, avatarUrl, res.data.data[i].value, "")


            }
          }
        } else {
          that.addChatItem(true, "../../images/cat_sleep.png", "不知道你在说啥~", "")
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
  sendImageClick: function(e){
    console.log("sendImageClick ~ ")
  },
  //通过设置滚动条位置实现画面滚动  
  scrollBottom: function () {
    console.log("scrollBottom !")
    this.setData({
      scrollTop: this.data.scrollTop + 30,
      toView: 'list-bottom'
    })
  },
  getRandomAvatar: function (motionData) {
    var motion = ""
    if (motionData != null && motionData.length > 0) {
      motion = motionData[0].value
      console.log("motion = " + motion)
    }
    if (motion == "高兴" ||
      motion == "喜欢" ||
      motion == "感动" ||
      motion == "称赞" ||
      motion == "开心" ||
      motion == "喜欢") { // 高兴
      return "../../images/cat_h" + Math.round(Math.random() * 4) + ".png"
    } else if (motion == "愤怒" ||
      motion == "生气"
    ) { //很生气
      return "../../images/cat_angry.png"
    } else if (motion == "恐惧") {//害怕
      return "../../images/cat_scared.png"
    } else if (motion == "沮丧" ||
      motion == "伤心" ||
      motion == "难过" ||
      motion == "寂寞") {//伤心
      return "../../images/cat_cry.png"
    } else if (motion == "反感" ||
      motion == "不喜欢") {//反感
      return "../../images/cat_outu.png"
    } else if (motion == "烦躁" ||
      motion == "不开心" ||
      motion == "厌烦" ||
      motion == "厌恶" ||
      motion == "自责" ||
      motion == "疲惫" ||
      motion == "不满") {//不开心
      return "../../images/cat_whiteeye.png"
    } else { //其他
      return "../../images/cat_n" + Math.round(Math.random() * 7) + ".png"
    }
  },
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            _this.getFaceInfo(file.url())
            console.log("file url =  " + file.url())
            _this.addChatItem(false, "", "", file.url())
          }
          // 
          ).catch(console.error);

      }
    })
  },
  getFaceInfo: function (urlstr) {
    var _this = this;
    wx.request({
      url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
      data: {
        api_key: "yHY_2VJXatUsUVnWuJsaYop9uawZTJLK",
        api_secret: "VpkmIyrasGmpnptsdIGzk9vdp347H4b9",
        image_url: urlstr,
        return_attributes: "gender,age,smiling,headpose,facequality,blur,eyestatus,ethnicity"
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //更新数据
        if (res && res.data && res.data.faces && res.data.faces.length > 0) {
          _this.addChatItem(true, "../../images/cat_n1.png", '哈哈，我发现了' + res.data.faces.length + "张脸", "")
        } else {
          _this.addChatItem(true, "../../images/cat_n2.png", "看不出来，这图里都是啥呀？", "")
        }

      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.log('complete')
      }
    })
  }
})
