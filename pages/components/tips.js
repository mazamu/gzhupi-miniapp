// pages/Components/tips.js
Component({

  properties: {

  },

  data: {
    res: {}
  },

  methods: {
    close() {
      let now = new Date().getTime()
      wx.setStorageSync("last_time", now)

      let res = {
        show: false
      }
      this.setData({
        res: res
      })
    },
    nav() {
      wx.navigateTo({
        url: this.data.res.url,
      })
    },
    sync() {
      let now = new Date().getTime()
      let loc = wx.getStorageSync("last_time")
      let intv = 0
      if (loc != "") intv = now - Number(loc)

      let data = wx.$param["tips"]
      if (data && intv > data["time"] || intv == 0) {
        this.setData({
          res: data
        })
      }
    }

  },
  lifetimes: {
    attached: function () {
      this.sync()
      setTimeout(() => {
        this.sync()
      }, 3000);
    }
  },
})