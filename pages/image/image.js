Page({
  data: {
    bigImage: 'http://androidcat.com/img/androidcat512.png'
  },
  onLoad: function (options) {
    this.setData({
      bigImage: options.indexImage || ""
    })
    console.log('bigImage = ' + this.data.bigImage)
  }
}) 