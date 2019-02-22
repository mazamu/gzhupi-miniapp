var app = getApp()
// var schedule = true

Page({

  data: {
    navColor: "rgba(221, 221, 221, 0.7)",
    schedule: true,
    out: "ami",
  },

  onLoad: function(options) {
    // 选择出当天星期几的课程，包括非本周的
    let weekday = new Date().getDay()
    let kbList = wx.getStorageSync("course").course_list
    let todayCourse = []
    if (kbList) {
      kbList.forEach(function (item) {
        if (item.weekday == weekday) {
          todayCourse.push(item)
        }
      })
    }
    // this.setData({
    //   todayCourse: todayCourse
    // })
  },

  tap() {
    if (this.data.schedule) {
      this.setData({
        schedule: !this.data.schedule,
        navColor: "white",
      })
    } else {
      this.setData({
        schedule: !this.data.schedule,
        navColor: "rgba(221, 221, 221, 0.7)",
      })
    }

  },

  onShow: function() {

  },


  onShareAppMessage: function() {

  }
})