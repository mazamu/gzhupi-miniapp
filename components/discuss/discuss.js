var utils = require("../../utils/date.js")
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    object_id: {
      type: String,
      // id会有延迟传入，需要监听变化
      observer: function (newVal) {
        if (!newVal) {
          return
        }
        this.refresh()
      }
    },
    // 目标表 t_topic广大墙 / t_teach_evaluation 教评
    object: {
      type: String,
      value: "t_topic"
    },

    // 页面路径
    page_url: {
      type: String,
      value: ""
    },

    // 楼主用户id
    owner_id: {
      type: Number,
      value: 0
    },

  },


  data: {
    reply_id: 0, //回复评论id
    reply_nickname: "", //回复对象昵称
    reply_open_id: "", //回复对象openid

    mark: 0, //评分
    content: "",
    authorized: true,
    debounce: false,
    anonymous_pic: "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/anonmous_avatar.png"
  },

  lifetimes: {
    attached: function () {
      this.data.user = wx.getStorageSync("gzhupi_user")
    }
  },

  methods: {

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

    /*
     * 伪双向绑定
     * wxml input 定义属性：data-field="field1.field2" value="{{field1.field2}}"
     * 输入内容将绑定到：this.data.field1.field2 = e.detail.value
     */
    inputBind(e) {
      if (typeof e.currentTarget.dataset.field != "string") return
      let field = e.currentTarget.dataset.field
      // console.log("数据绑定：key：", field, " value:", e.detail.value)

      let data = {}
      data[field] = e.detail.value
      this.setData(data)
    },

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

    refresh() {
      this.query(this.data.object_id)
    },
    // 读取输入
    commentInput(e) {
      this.data.content = e.detail.value
    },
    // @某用户
    atSomebody(e) {
      let item = e.currentTarget.dataset.item
      this.setData({
        reply_item: item,
        focus: true
      })
    },
    removeReply() {
      this.setData({
        reply_item: null
      })
    },

    // 违规检测
    async checkComment() {
      if (await wx.$checkText(this.data.content + this.data.anonymity)) {
        return
      }
      this.addComment()
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
      let object_id = this.data.object_id
      let content = this.data.content
      if (object_id.replace(/ /g,"") == "" || content.replace(/ /g,"") == "") {
        console.log("illegal argument")
        return
      }

      if (this.data.anonymous) {
        this.data.anonymity = this.data.anonymity ? this.data.anonymity : this.data.placeholder
      }

      let data = {
        object: this.data.object,
        object_id: Number(this.data.object_id),
        content: this.data.content,
        anonymous: this.data.anonymous,
        anonymity: this.data.anonymity,
        mark: this.data.mark
      }
      // 回复用户id
      if (this.data.reply_item && this.data.reply_item.id) {
        data["reply_id"] = this.data.reply_item.id
      }
      this.create(data)
    },

    deleteComment(e) {

      let item = e.currentTarget.dataset.item
      let row_id = item.id

      if (this.data.user.id != item.created_by) {
        this.atSomebody(e)
        return
      }
      var content = '是否删除评论？'
      let that = this
      wx.showModal({
        title: '提示',
        content: content,
        success(res) {
          if (res.confirm) {
            wx.$ajax({
                url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_discuss?id=$eq." + row_id,
                method: "delete",
                loading: true,
              })
              .then(res => {
                console.log(res)

                if (res.statusCode == 200 && res.data.rows_affected == 1) {
                  wx.showToast({
                    title: '删除成功！',
                  })
                  that.query(that.data.object_id)
                } else {
                  wx.showModal({
                    title: '失败提示',
                    content: JSON.stringify(res.data),
                  })
                }
              }).catch(err => {
                console.error(err)
              })
          }
        }
      })
    },

    create(data) {
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
            loading: false,
            content: ""
          })
          wx.showToast({
            title: '留言成功',
          })

          this.query(this.data.object_id)
          this.triggerEvent('success', res.data)
          this.replyNotice(data.content)
        })
    },

    query(object_id) {
      let query = {
        object: this.data.object,
        object_id: object_id,
        _order: "created_at",
      }
      if (this.data.object == 't_teach_evaluation') {
        query["_order"] = "-created_at"
      }

      query = wx.$objectToQuery(query)

      wx.$ajax({
          url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/v_discuss" + query,
          method: "get",
          header: {
            "content-type": "application/json"
          }
        })
        .then(res => {
          console.log("评论列表", res.data)
          for (let i = 0; i < res.data.length; i++) {
            let time = new Date(res.data[i].created_at)
            res.data[i].created_at = utils.relativeTime(time.getTime() / 1000)
          }
          this.setData({
            comments: res.data
          })
        })
    },

    // 评论回复，发送通知给层主
    replyNotice(content) {
      if (!this.data.reply_item) return
      let item = this.data.reply_item

      let sender = wx.getStorageSync('gzhupi_user').nickname
      if (this.data.anonymity) {
        sender = this.data.anonymity //使用匿名信息
      }
      if (!sender) return

      let data = {
        touser: item.open_id,
        page: this.data.page_url,
        content: content,
        title: "回复：" + item.content,
        type: "comment",
        sender: sender,
      }
      if (!data.touser || !data.page || !data.content || !data.sender || !item.content) {
        console.log("通知参数不完整：", data)
        return
      }
      console.log("通知参数", data)
      this.removeReply()

      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'sendMsg',
        // 传给云函数的参数
        data: data,
        complete: function (res) {
          console.log(res.result)
          if (res.result && res.result.errCode == 43101) {
            console.log("该用户未订阅通知")
          }
        }
      })
    },
  }

})