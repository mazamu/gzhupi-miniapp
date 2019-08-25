Page({

  data: {
    brick_option: {
      showFullContent: true,
      backgroundColor: "rgb(235, 246, 250)",
      forceRepaint: true,
      defaultExpandStatus: false,
      imageFillMode: 'aspectFill',
      columns: 1,
      icon: {
        fill: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
        default: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
      },
      fontColor: 'black'
    },
    dataSet: [{
        id: '5b61575a4256350d332d03a1',
        title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
        content: 'Lorem ipsum do officia deserunt mollit anim id est laborum.',
        time: 1565806010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: 'Lorem ipsum dolor sit am'
        },
        likedCount: 122,
        liked: true,
        images: [
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hxPSBPwED9uJwXs.jpg',
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hxPSBf969HeQuAK.jpg'
        ]
      },
      {
        id: '123123123',
        content: 'Lorem ient, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        time: 1565906010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: '知晓妹'
        },
        likedCount: 0,
        liked: true,
        images: [
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hxPQFpnSjutfZSe.jpg',
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hxPV0jKb1pH52Pk.jpg',
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hvmYPwwYoTFB3Kt.jpg'
        ]
      },
      {
        id: '5b61575a4256weqwe350d332d03a1',
        content: 'Lorem ipsum dnon proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        time: 1533106010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: '知晓妹'
        },
        likedCount: 0,
        images: [
          'https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hvmSBqZYN3tiCUQ.jpg'
        ]
      },
      {
        id: '5b61575a42dasda56350d332d03a1',
        content: '爱范儿，让未来触手可及。',
        time: 1533106010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: '知晓妹'
        },
        likedCount: 0,
        images: ['https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hxPV0jKb1pH52Pk.jpg']
      },
      {
        id: '5b61575weweqa4256350d332d03a1',
        content: '爱范儿，让未来触手可及。',
        time: 1533106010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: '知晓妹'
        },
        likedCount: 0,
        images: ['https://cloud-minapp-29114.cloud.ifanrusercontent.com/1hvmWydpfrJyKDSF.jpg']
      }
    ],
  },
  tapCard:function(e){
    console.log(e)
  },
  onLoad: function(options) {},

  onShareAppMessage: function() {

  },

})