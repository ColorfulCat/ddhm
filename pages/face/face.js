//index.js  
//获取应用实例  
var app = getApp()
const AV = require('../../utils/av-weapp-min');
Page({
  data: {
    tempFilePaths: ''
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        tempFilePaths: userInfo.avatarUrl
      })
    })
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
  "content-type":"application/x-www-form-urlencoded"
      },
      success: function (res) { 
        //更新数据
        if (res && res.data && res.data.faces && res.data.faces.length > 0){
          wx.showToast({
            title: '发现' + res.data.faces.length+"张脸",
            icon: 'success',
            duration: 1000
          });
        }else{
          wx.showToast({
            title: '啥脸也没发现啊!',
            icon: 'fail',
            duration: 1000
          });
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