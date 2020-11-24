const Page = require('../../../utils/sdk/ald-stat.js').Page;
let discuss=null;//评论组件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasnewElva:false,//是否有新评论，有则要刷新
    object: {},
    from:null//判断从哪个页面进入详情的
  },
  //点击打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.object.phone,
    })
  },
  //参与教评
  post() {
    //从列表进入详情
    if(this.data.from){
      wx.$subscribe()
      wx.navigateTo({
        url: "/pages/Campus/evaluation/post?course_id=" + this.data.object.course_id + '&teacher_id=' + this.data.object.teacher_id+'&from='+'from_detail'+'&course_name='+this.data.object.course_name+'&teacher='+this.data.object.teacher,
      })
    }
    else{
      //从评价页进入详情直接回退上一页
      wx.navigateBack({
        delta: 1,
      })
    }

  },
  fake() {
    let mode = wx.$param["mode"]
    this.setData({
      mode: mode
    })
    if (mode == "prod") {
      return false
    } else return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      page_url: wx.$pageUrl()
    })
    if(Object.keys(options).length===3){
      this.data.from=options.from
    }
    if (this.fake()) return
    var that=this
    wx.$ajax({
      url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/v_teach_evaluation?course_id=$eq." + options.course_id + "&teacher_id=$eq." + options.teacher_id,
      method: "get",
      loading: true
    }).then(res => {
      console.log(res.data)
      if(res.data.length!=0)
      {
        that.setData({
          object:res.data[0]
        })
      }
      else{
        wx.showToast({
          title: '跳转失败，请检查网络！',
          icon:'none'
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    discuss=this.selectComponent('#discuss')
  },
  // true 说明在防抖期间，应该停止执行
  isDebounce(timeout = 2000) {
    let that = this
    if (this.data.debounce) {
      console.log("触发防抖")
      return true
    }
    this.data.debounce = true
    setTimeout(() => {
      that.data.debounce = false
    }, timeout)
    return false
  },
  //操作点赞
  like() {
    if (this.isDebounce()) return
    var that = this
    let cur_uid = wx.getStorageSync('gzhupi_user').id
    let list = this.data.object.star_list
    for (let i in list) {
      if (list[i].created_by == cur_uid) {
        wx.$ajax({
            url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_relation?id=$eq." + list[i].id,
            method: "delete",
          })
          .then(res => {
            list.splice(i, 1)
            this.setData({
              ["object." + "star_list"]: list
            })
          }).catch(err => {
            console.error(err)
          })
        return
      }
    }
    wx.$ajax({
      url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_relation",
      method: "post",
      data: {
        object_id: Number(that.data.object.id),
        object: 't_teach_evaluation',
        type: 'star'
      },
      header: {
        "content-type": "application/json"
      }
    }).then(res => {
      if (typeof list != "object" || list == null) list = []
      if (res.data && res.data.id) {
        res.data.avatar = wx.getStorageSync('gzhupi_user').avatar
        list.push(res.data)
        this.setData({
          ["object." + "star_list"]: list
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    setTimeout(function () {
      that.setData({
        wait: true,
        uid: wx.getStorageSync('gzhupi_user').id
      })
    }, 500)
    if(this.data.hasnewElva)
    {
      discuss.query(this.data.object.id)
    }

  },
  onShareAppMessage: function () {
    return {
      title: this.data.object.course_name + ": " + this.data.object.teacher,
      desc: '',
      path: wx.$pageUrl(),
      imageUrl: 'https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/rili.png',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: "none"
        })
      }
    }
  }
})