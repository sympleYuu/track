// pages/footprint/footprint.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData1: {},
    screenwidth:'',
    ptab:1,
    selectanimation:{},
    timghid:true,
    hotarr:[],
    myfootarr:[],
    labelarr:[],
    mydefault:false,
    sex:0,
    hotpage:1,
    mypage:1,
    pulldown:false,
    user_id:'',
    footexta:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fbc800',
    })
    if (app.logincheck() == false) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    var user_id = wx.getStorageSync('user_id');
    this.setData({
      user_id: user_id
    })
    
    if(options.done == 1){
      this.footmytap();
      this.setData({
        ptab:1
      })
      this.setData({
        uptopshow1: true,
        uptopmask: true
      })
      var score = options.score;
      var name = options.name;
      var grade = options.grade;
      console.log(score);
      console.log(name);
      console.log(grade);
      // if (score) {
      //   if (grade != "undefined" && grade != undefined) { //如果升级
      //     if (name != "undefined" && name != undefined) {
      //       this.setData({
      //         uptopshow3: true,
      //         uptopmask: true
      //       })
      //     } else {
      //       this.setData({
      //         uptopshow2: true,
      //         uptopmask: true
      //       })
      //     }
      //     wx.setStorageSync('grade', grade);
      //   } else {
      //     this.setData({
      //       uptopshow1: true,
      //       uptopmask: true
      //     })
      //   }
      // }

      this.setData({
        score: score,
        grade: grade,
        name: name
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var winHeight = res.windowHeight;
        that.setData({
          screenwidth: winWidth,
        });
      }
    });
    
    
  },

  myfootjump:function(e){
    console.log(e);
    var myfootid = e.currentTarget.id;
    wx.navigateTo({
      url: '../footdetail/footdetail?id=' + myfootid,
    }) 
  },
  jumpothers:function(e){
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../footothers/footothers?id=' + uid,
    })
  },
  jumpindex:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: "https://youyue.huiur.com/myflayerfoot", //我的足迹
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: user_id,
        page: 1
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        console.log(datas);
        if (datas.length == 0) {
          // wx.request({
          //   url: "https://youyue.huiur.com/myumessage", //我的足迹列表为空，我的个人信息 
          //   method: "POST",
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   data: {
          //     user_id: user_id,
          //   },
          //   success: function (res) {
          //     console.log(res);
          //     that.setData({
          //       footnum: 0,
          //       myname: app.limitwords(res.data.data.user_nickname),
          //       myheader: res.data.data.header,
          //       sex: res.data.data.sex,
          //       mydefault: true,
          //     })
          //   }
          // })
        } else {
          var footnum = datas[0].count;
          var myname = app.limitwords(datas[0].user_nickname);
          var myheader = datas[0].header;
          var mysex = datas[0].sex
          that.setData({
            myfootarr: datas,
            footnum: footnum,
            myname: myname,
            myheader: myheader,
            sex: mysex
          })
        }

      }
    })
  },
  foothottap:function(){ //点击顶部标题栏热门足迹

    if(this.data.ptab == 1){
      // var animation = wx.createAnimation({
      //   duration: 300,
      //   timingFunction: 'ease',
      // })

      // this.animation = animation
      // var width = this.data.screenwidth;
      // animation.translateX(0).step();
      // this.setData({
      //   animationData1: animation.export()
      // })
    }else{ //点击标题 下拉出分类标签
      var animation1 = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
      this.animation = animation1;
      animation1.height('186rpx').step();

      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
      this.animation = animation;
      animation.height('226rpx').step();

      var selectanima = wx.createAnimation({
        duration: 150,
        timingFunction: 'ease',
        delay:300,
      })
      selectanima.opacity(1).step();

      var selectanima1 = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease',

      })
      selectanima1.opacity(0).step();
      
      var pulldown = this.data.pulldown;
      if (pulldown) { //下拉状态
        this.setData({
          titleanimation: animation1.export(),
          selectanimation: selectanima1.export(),
          pulldown: false
        })
      }else{ //没有下拉
        this.setData({
          titleanimation: animation.export(),
          selectanimation: selectanima.export(),
          pulldown:true
        })
      }
    }
    this.setData({
      ptab:0,
    })
  },
  footmytap:function(){ //点击顶部标题栏我的足迹
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    if (this.data.ptab == 0) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })

      this.animation = animation
      var width = this.data.screenwidth;
      animation.translateX(-width).step();
      this.setData({
        animationData1: animation.export()
      })

      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out',
        delay: 100,
      })
      this.animation = animation;
      animation.height('186rpx').step();

      var selectanima = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease',
        
      })
      selectanima.opacity(0).step();
      this.setData({
        titleanimation: animation.export(),
        selectanimation: selectanima.export(),
        pulldown: false
      })
    }
    this.setData({
      ptab: 1,
      mypage:1
    })

    // if (user_id) {
      wx.request({
        url: "https://youyue.huiur.com/myflayerfoot", //我的足迹
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          page: 1
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          console.log(datas);
          if (datas.length == 0) {
            // wx.request({
            //   url: "https://youyue.huiur.com/myumessage", //我的足迹列表为空，我的个人信息 
            //   method: "POST",
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   data: {
            //     user_id: user_id,
            //   },
            //   success: function (res) {
            //     console.log(res);
            //     that.setData({
            //       footnum: 0,
            //       myname: app.limitwords(res.data.data.user_nickname),
            //       myheader: res.data.data.header,
            //       sex: res.data.data.sex,
            //       mydefault: true,
            //     })
            //   }
            // })
          } else {
            var footnum = datas[0].count;
            var myname = app.limitwords(datas[0].user_nickname);
            var myheader = datas[0].header;
            var mysex = datas[0].sex
            that.setData({
              myfootarr: datas,
              footnum: footnum,
              myname: myname,
              myheader: myheader,
              sex: mysex
            })
          }

        }
      })

    // } else {
    //   // app.onLaunch();
    //   // this.footmytap();
    // }
  },
  deltap:function(e){
    var fid = e.currentTarget.dataset.fid;
    var user_id = wx.getStorageSync('user_id');
    var that = this;
    wx.showActionSheet({
      itemList: ['删除足迹'],
      success: function (res) {
        var tapIndex = res.tapIndex;
        console.log(res);
        if (tapIndex == 0) {
          wx.request({
            url: "https://youyue.huiur.com/delMyFoot", //删除足迹
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              user_id: user_id,
              foot_id: fid
            },
            success: function (res) {
              console.log(res);
              that.footmytap();
            }
          })

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  morebtntap:function(e){
    var fid = e.currentTarget.dataset.fid;
    var user_id = wx.getStorageSync('user_id');
    var that = this;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        var tapIndex = res.tapIndex;
        console.log(res);
        if (tapIndex == 0) {
          wx.request({
            url: "https://youyue.huiur.com/delMyFoot", //删除足迹
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              user_id: user_id,
              foot_id: fid
            },
            success: function (res) {
              console.log(res);
              that.footmytap();
            }
          })

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  uploadpic:function(){ //测试上传图片API
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  hotdowntap:function(){ //点击下拉出足迹分类标签
    
  },
  footlabel:function(e){ //点击足迹标签进行筛选分类、loading
    //loading
    // this.setData({
    //   timghid: false
    // })
    
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.height(0).step();
    this.setData({
      selectanimation: animation.export()
    })
    var that = this;
    // setTimeout(function () {
    //   that.setData({
    //     timghid: true
    //   })
    // }, 1000)

    var lid = e.currentTarget.dataset.lid;
    
    this.setData({
      label_id: lid,
      ptab:2
    })
    //回到顶部，体验相当不稳定
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
    wx.request({
      url: "https://youyue.huiur.com/hotflayerfoot", //热门足迹
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        label_id: lid,
        page: 1
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        var i = 0;
        for (i = 0; i < datas.length; i++) {
          datas[i].user_nickname = app.limitwords(datas[i].user_nickname);
          if (datas[i].score == 0) {
            datas.splice(i--, 1);
          }
        }
        that.setData({
          ptab:0,
          hotarr: datas,
          hotpage:1
        })
      }
    })

  },
  hotdetjump:function(e){ //点击进入足迹详情页
    var fid = e.currentTarget.dataset.hid;

    wx.navigateTo({
      url: '../footdetail/footdetail?id='+fid,
    })
  },
  jumpexit:function(){ //我也制作一个 跳转
    wx.navigateTo({
      url: '../footexit/footexit',
    })
  },
  jumpfalse:function(){
    return false
  },
  upmasktap:function(){ //点击蒙版关闭弹窗
    this.setData({
      uptopmask:false,
      uptopshow1:false,
      uptopshow2:false,
      uptopshow3:false,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var ptab = this.data.ptab;
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    if (ptab == 0){ //触底加载热门足迹
      var label_id = this.data.label_id;
      var hotpage = this.data.hotpage;
      var hotarr = this.data.hotarr;
      console.log(label_id);
      console.log(hotpage);
      console.log(hotarr);
      
      wx.request({
        url: "https://youyue.huiur.com/hotflayerfoot", //热门足迹
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          label_id: label_id,
          page: hotpage+1,
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          console.log(datas);
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            if (datas[i].score == 0) {
              datas.splice(i--, 1);
            }
          }
          if (datas != undefined){
            console.log('下拉加载新的数组')
            that.setData({
              hotarr: hotarr.concat(datas),
              hotpage: hotpage + 1,
            })
          }
          
        }
      })

    }else{ //加载我的足迹
      var mypage = this.data.mypage;
      wx.request({
        url: "https://youyue.huiur.com/myflayerfoot", //我的足迹
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          page: mypage+1
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          console.log(datas);
          var myfootarr = that.data.myfootarr;
          that.setData({
            myfootarr: myfootarr.concat(datas),
            mypage:mypage+1
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res);
    var fid = res.target.dataset.fid;
    console.log(fid);
    var uid = res.target.dataset.uid;
    var title = res.target.dataset.title;
    var img = res.target.dataset.img
    var user_id = wx.getStorageSync('user_id');
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: '/pages/footdetail/footdetail?id=' + fid,
      imageUrl:img,
      success: function (res) {
        // 转发成功
        wx.request({
          url: "https://youyue.huiur.com/shareAddScore", //足迹浏览
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          data: {
            foot_id: fid,
            user_id: user_id,
            mid: uid
          },
          success: function (res) {
            console.log(res);

          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})