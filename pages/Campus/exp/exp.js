var request = require("../../../utils/request.js")
var Data = require("../../../utils/data.js")
var Config = require("../../../utils/config.js")
var Setting = require("../../../utils/setting.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colors: Data.colors,
    checked: Config.get("showExp")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    Setting.setBg().then(res=>{
      console.log(res)
      this.setData({
        src:res
      })
    })
    
    // function getSomething() {
    //   var r = 0;
    //   return new Promise(function(resolve) {
    //     wx.getStorage({
    //       key: 'account',
    //       success: function(res) {
    //         resolve(res)
    //       },
    //     })
    //   });
    // }

    // function compute(x) {
    //   // console.log(x);
    // }
    // getSomething().then(compute);
  },

  onShow: function() {
    this.setData({
      exp: wx.getStorageSync("exp"),
    })


    // wx.getSavedFileList({
    //   success(res) {
    //     for  (let i=0;i<res.fileList.length;i++) {
    //       wx.removeSavedFile({
    //         filePath: res.fileList[i].filePath,
    //         complete(res) {
    //           console.log(res)
    //         }
    //       })
    //     }
    //   }
    // })
    // Config.initConfig()
    // Config.setConfig("test", 123)
    // console.log(Config.getConfig("test"))
  },

  switchChange(e) {
    let that = this
    if (this.data.exp == "") {
      wx.showToast({
        title: '未同步实验',
        icon: 'none'
      })
      this.setData({
        checked: false
      })
      return
    }
    if (this.data.checked) {
      Config.set("showExp", false)
      this.data.checked = false
      return
    }
    wx.showModal({
      title: '提示',
      content: '加到课表中有可能会覆盖其它课程或被其它课程覆盖,如课表上有对应实验大课程，可先将其删除！',
      success: function(res) {
        if (res.confirm) {
          Config.set("showExp", true)
        } else {
          that.setData({
            checked: false
          })
        }
      }
    })
  },

  onShareAppMessage: function() {}
})