var app = getApp()
var Config = require("../../../utils/config.js")
var Setting = require("../../../utils/setting.js")

Page({

  data: {
    navColor: "rgba(221, 221, 221, 0.7)",
    schedule: true,
    out: "ami",
    showDrawer: true,
    arrowUrl: "cloud://gzhu-pi-f63be3.677a-gzhu-pi-f63be3/images/icon/right-arrow.svg"
  },

  onLoad: function(options) {

  },
  onShareAppMessage: function() {

  },
  
  // 切换课表模式
  switchModel() {
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

  // 打开抽屉弹窗
  openDrawer() {
    this.setData({
      showDrawer: true
    })
  },

  // 更换背景
  changeBg() {
    if (this.data.test) {
      this.setData({
        test: false
      })
    } else {
      this.setData({
        test: true
      })
    }
    // const schedule = this.selectComponent('#schedule');
    // Setting.setBg().then(res => {
    //   Config.set("schedule_bg", res)
    //   schedule.update()
    // })


  }






})