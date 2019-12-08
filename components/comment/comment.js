var utils = require("../../utils/date.js")
Component({

  properties: {
    table: {
      type: String
    },
    object_id: {
      type: String,
      // id会有延迟传入，需要监听变化
      observer: function(newVal) {
        if (!newVal) {
          return
        }
        this.refresh()
      }
    },
  },


  data: {
    content: "",
  },

  lifetimes: {
    attached: function() {
      wx.BaaS.auth.getCurrentUser().then(user => {
        this.setData({
          uid: user.id
        })
      })
    }
  },

  methods: {

    refresh() {
      this.getComment(this.data.table, this.data.object_id)
    },
    // 读取输入
    commentInput(e) {
      this.data.content = e.detail.value
    },
    // @某用户
    atSomebody(e) {
      // let id = e.currentTarget.dataset.id
      let nickname = e.currentTarget.dataset.nickname
      let content = "@" + nickname + " " + this.data.content
      this.setData({
        content: content
      })
    },
    // 获取评论列表
    getComment(table, object_id) {
      if (table == "" || object_id == "") {
        console.log("illegal argument")
        return
      }
      let Obj = new wx.BaaS.TableObject(table)
      let query = new wx.BaaS.Query()
      query.compare('object_id', '=', object_id)

      Obj.setQuery(query)
        .orderBy('created_at') //时间倒序
        .expand(['created_by']) //拓展用户信息
        .find().then(res => {
          console.log("评论列表", res.data.objects)
          for (let i = 0; i < res.data.objects.length; i++) {
            res.data.objects[i].created_at = utils.relativeTime(res.data.objects[i].created_at)
          }

          this.setData({
            comments: res.data.objects
          })
        }, err => {
          console.log(err)
          wx.showToast({
            title: '获取评论错误',
            icon: "none"
          })
          this.setData({
            loading: false
          })
        })
    },

    // 发布评论
    addComment() {
      let table = this.data.table
      let object_id = this.data.object_id
      let content = this.data.content
      if (table == "" || object_id == "" || content == "") {
        console.log("illegal argument")
        return
      }
      if (this.data.content == "" || this.data.object_id == "") return
      let data = {
        object_id: object_id,
        content: content
      }
      let Table = new wx.BaaS.TableObject(table)
      let record = Table.create()
      record.set(data).save().then(res => {
        console.log("数据保存", res.data)
        this.setData({
          loading: false,
          content: ""
        })
        wx.showToast({
          title: '留言成功',
        })
        this.getComment(table, object_id)
      }, err => {
        this.setData({
          loading: false,
          debounce: false
        })
        wx.showToast({
          title: '留言失败' + err,
        })
      })
    },

    deleteComment(e) {
      console.log(e.currentTarget.dataset.id)
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否删除留言？',
        success(res) {
          if (res.confirm) {
            let Obj = new wx.BaaS.TableObject(that.data.table)
            Obj.delete(e.currentTarget.dataset.id).then(res => {
              that.refresh()
            })
          }
        }
      })
    }
  }

})