Page({

  data: {

  },

  onLoad: function (options) {
    let that = this
    // 更新图书馆进馆信息
    wx.request({
      url: 'https://myapi.iego.net:5000/library',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          lib: res.data
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})