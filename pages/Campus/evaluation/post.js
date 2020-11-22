const Page = require('../../../utils/sdk/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:null,//判断入口页面是否为课表处进入的
    score: null,
    authorized: true,
    labels: ['老师人很好', '很少考勤', '通过率高', '作业很少','给分很高', '课堂气氛活跃','一定要选这个老师', ],
    level: '',
    evaluation: '',
    anonymous: false, //匿名
    debounce: false,
    anonymous_pic: "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/anonmous_avatar.png"
  },
  //点击到详情页面
  todetail(){
    //从详情页进入的就直接返回上一页即可
    if(this.data.from)
    {
      wx.navigateBack({
        delta: 1,
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/Campus/evaluation/detail?course_id='+this.data.course_id+'&teacher_id='+this.data.teacher_id,
      })
    }
  },
  // 发布评论
  addComment() {
    wx.$subscribe()
    let that = this
    // 防抖处理
    if (this.data.debounce) return
    this.data.debounce = true
    setTimeout(() => {
      that.data.debounce = false
    }, 2000)
    // let object_id = this.data.object_id
    let content = this.data.evaluation
    if (content == "") {
      console.log("illegal argument")
      wx.showToast({
        title: '请输入评价~',
        icon: 'none'
      })
      return
    }
    if(this.data.score==null)
    {
      wx.showToast({
        title: '请选择评分~',
        icon: 'none'
      })
      return
    }
    if (this.data.anonymous) {
      this.data.anonymity = this.data.anonymity ? this.data.anonymity : this.data.placeholder
    }

    let data = {
      object: 't_teach_evaluation',
      object_id: this.data.object_id,
      content: this.data.evaluation,
      anonymous: this.data.anonymous,
      anonymity: this.data.anonymity,
      mark: this.data.score
    }
    this.create(data)
  },
  create(data) {
    var that = this
    wx.$ajax({
        url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_discuss",
        method: "post",
        data: data,
        header: {
          "content-type": "application/json"
        }
      })
      .then(res => {
        this.setData({
          evaluation: ""
        })
        wx.showToast({
          title: '评论成功',
        })
        if(that.data.from)
        {
          let pages=getCurrentPages();
          let prePage=pages[pages.length-2];//上一页
          prePage.setData({
            hasnewElva:true
          })
          wx.navigateBack({
            delta: 1,
          })
        }
        else{
          wx.navigateTo({
            url: '/pages/Campus/evaluation/detail?course_id='+this.data.course_id+'&teacher_id='+this.data.teacher_id,
          })
        }

        // this.query(1)
        this.triggerEvent('success', res.data)
      })
  },
  //发布课评
  async checkComment(e) {
    if (await wx.$checkText(this.data.evaluation + this.data.anonymity)) {
      return
    }
    this.addComment()
  },
  //输入匿名
  inputBind(e) {
    if (typeof e.currentTarget.dataset.field != "string") return
    let field = e.currentTarget.dataset.field
    // console.log("数据绑定：key：", field, " value:", e.detail.value)

    let data = {}
    data[field] = e.detail.value
    this.setData(data)
  },
  //用户授权
  userInfoHandler(data) {
    let that = this
    wx.showLoading({
      title: '授权中...',
    })
    wx.BaaS.auth.loginWithWechat(data, {
      createUser: true,
      syncUserProfile: "overwrite"
    }).then(user => {
      console.log(user)
      this.setData({
        authorized: true
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  //开启匿名
  anonymousSwitch(e) {
    this.setData({
      anonymous: e.detail.value
    })
    if (e.detail.value) {
      let profile_pic = wx.getStorageSync('gzhupi_user').profile_pic
      if (typeof (profile_pic) == "string" && profile_pic != "") {
        this.setData({
          anonymous_pic: profile_pic
        })
      }
    }
    wx.BaaS.auth.getCurrentUser().then(user => {
      console.log("user", user)
      // if (user.gender == 0) this.data.placeholder = "匿名童鞋"
      // if (user.gender == 1) this.data.placeholder = "匿名小哥哥"
      // if (user.gender == 2) this.data.placeholder = "匿名小姐姐"
      this.data.placeholder = user.nickname
      this.setData({
        placeholder: this.data.placeholder
      })
    }).catch(err => {
      this.setData({
        placeholder: "匿名童鞋"
      })
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })

  },
  //获取评价内容
  get_evaluation(e) {
    this.setData({
      evaluation: e.detail.value
    })
  },
  //获取添加的标签
  getLabel(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var _evaluation = this.data.evaluation + this.data.labels[index] + '！'
    this.setData({
      evaluation: _evaluation
    })
  },
  //获取评分
  getScore(e) {
    console.log("被评价的object：", e.detail.rateObj, "评分：", e.detail.value);
    var level = ''
    switch (e.detail.value) {
      case 1:
        level = '差'
        break
      case 2:
        level = '较差'
        break
      case 3:
        level = '一般'
        break
      case 4:
        level = '好'
        break
      case 5:
        level = '很好'
        break
    }
    this.setData({
      score: e.detail.value,
      level: level
    })
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
    if(Object.keys(options).length==3)
    {
      this.data.from='from_detail'
    }
    if (this.fake()) return
    this.data.course_id=options.course_id;
    this.data.teacher_id=options.teacher_id;
    //查询改课程号和教师号是否已经被创建
    wx.$ajax({
      url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/v_teach_evaluation?course_id=$eq." + options.course_id + "&teacher_id=$eq." + options.teacher_id,
      method: "get",
    }).then(res => {
      console.log(res.data)
      //不存在该老师和课程号则创建
      if (res.data.length == 0) {
        // prest 不能直接处理jsonb需要转字符串
        let addi = {
          course_name: options.course_name,
          teacher: options.teacher
        }
        var _addi = JSON.stringify(addi)
        //创建评价
        wx.$ajax({
          url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_teach_evaluation",
          method: "post",
          data: {
            course_id: options.course_id,
            teacher_id: options.teacher_id,
            addi: _addi
          },
          header: {
            "content-type": "application/json"
          }
        }).then(res => {
          console.log(res)
          this.data.object_id = res.data.id; //获取评论主键id
          if (res.statusCode >= 400) {
            wx.showToast({
              title: '课评创建失败，请检查网络！',
              icon: 'none'
            })
          }
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '课评创建失败，请检查网络！',
            icon: 'none'
          })
        })
      } else {
        this.data.object_id = res.data[0].id
      }
    })

  }
})