// components/user-modal/user-modal.js
Component({

  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {
    action: {
      // modal: {
      //   valid: true,
      //   cancel: true,
      //   confirm:false,
      //   img:"",
      //   title: "活动推荐",
      //   sub_title: "义工",
      //   content: ["经历了一个漫长的假期,你一定想出去走走，外面的世界那么大"],
      //   btn_text: "我想去看看",
      //   nav_to: "/pages/Setting/webview/webview?src=https://mp.weixin.qq.com/s/NbVEBpvlPgpfbAf_tRh09w",
      // }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    modalConfirm(){
      wx.$navTo(this.data.action.modal.nav_to)
      this.setData({
        "action": {}
      })
    },

    navTo(e) {
      this.setData({
        "action": {}
      })
      wx.$navTo(e)
    }

  },

  lifetimes: {
    attached: function () {
      wx.$ajax({
          url: wx.$param.server["prest"] + "/param",
          // url: "http://192.168.2.214:9000/api/v1/param",
          method: "get",
          showErr: false,
          header: {
            "content-type": "application/json"
          }
        })
        .then(res => {
          console.log("param", res)
          this.setData({
            action: res.data
          })
        })
    }
  },
})