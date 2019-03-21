// pages/footreply/footreply.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    int:2,
    fid:'',
    mid:'',
    replybox:false,
    replyarr:[],
    rid:'',
    inputfocus:false,
    replymask:false,
    holder:'评论足迹',
    ot_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      mid:options.mid,
      fid:options.fid,
      int:options.int,
      uid:options.fuid,
    })
    if(options.int == '1'){
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e1b33',
      })
    }
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var winHeight = res.windowHeight;
        that.setData({
          winheight: winHeight,
        })
      }
    });
    wx.request({
      url: "https://youyue.huiur.com/showMediaComment", //足迹总评论 展示
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: that.data.fid,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        console.log(datas);
        if (datas) {
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            datas[i].username = app.limitwords(datas[i].username);
          }
          that.setData({
            replyarr: datas,
            nonecomm: false,
          })
          console.log('有评论')
        } else { //暂无评论
          that.setData({
            nonecomm: true,
          })
        }
      }
    })
  },
  showreply:function(){
    var that = this;
    wx.request({
      url: "https://youyue.huiur.com/showMediaComment", //足迹总评论 展示
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: that.data.fid,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        console.log(datas);
        if(datas){
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            datas[i].username = app.limitwords(datas[i].username);
          }
          that.setData({
            replyarr: datas,
            nonecomm: false,
          })
          console.log('有评论')
        }else{ //暂无评论
          that.setData({
            nonecomm:true,
          })
        }
        
        
      }
    })
  },
  replyboxtap:function(){
    this.setData({
      replybox:true
    })
  },
  replyform:function(e){
    console.log(e);
    var value = e.detail.value;
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var holder = this.data.holder;
    console.log(holder);
    if (holder == '评论足迹'){ //评论
      wx.request({
        url: "https://youyue.huiur.com/footComment", //足迹总评论 评论
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          content: value,
          foot_id: that.data.fid,
          mid: that.data.mid,
          replay_id: ''
        },
        success: function (res) {
          console.log(res);
          if (res.data.data) {
            that.showreply();
          }
          that.setData({
            inputvalue: "",
            replymask: false
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      })
    }else{ //回复
      console.log('回复');
      var that = this;
      var user_id = wx.getStorageSync('user_id');
      var rid = that.data.rid;
      var replyarr = that.data.replyarr;
      let currentIndex = replyarr.findIndex(item => item.id === rid);
      var total = replyarr[currentIndex].total;
      console.log(total);
      var media_id = replyarr[currentIndex].media_id;
      if (total == 1) { //总评论回复
        wx.request({
          url: "https://youyue.huiur.com/footComment", //足迹总评论 评论
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          data: {
            user_id: user_id,
            content: value,
            foot_id: that.data.fid,
            mid: that.data.mid,
            reply_id: that.data.rid,
          },
          success: function (res) {
            console.log(res);
            if (res.data.data) {
              that.showreply();
            }
            that.setData({
              replybox: false,
              replybox_re: false,
            })
          }
        })
      } else {
        wx.request({
          url: "https://youyue.huiur.com/footMediaComment", //足迹总评论 评论
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          data: {
            user_id: user_id,
            content: value,
            foot_id: that.data.fid,
            mid: that.data.mid,
            replay_id: that.data.rid,
            media_id: media_id
          },
          success: function (res) {
            console.log(res);
            if (res.data.data) {
              that.showreply();
            }
            that.setData({
              replybox: false,
              replybox_re: false,
            })
          }
        })
      }
      that.setData({
        holder:'评论足迹'
      })
    }
    
  },
  replyform_re: function (e) {
    console.log(e);
    var value = e.detail.value.replyarea;
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var rid = that.data.rid;
    var replyarr = that.data.replyarr;
    let currentIndex = replyarr.findIndex(item => item.id === rid);
    var total = replyarr[currentIndex].total;
    console.log(total);
    var media_id = replyarr[currentIndex].media_id;
    if(total == 1){ //总评论回复
      wx.request({
        url: "https://youyue.huiur.com/footComment", //足迹总评论 评论
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          content: value,
          foot_id: that.data.fid,
          mid: that.data.mid,
          reply_id: that.data.rid,
        },
        success: function (res) {
          console.log(res);
          if (res.data.data) {
            that.showreply();
          }
          that.setData({
            replybox: false,
            replybox_re: false,
          })
        }
      })
    }else{
      wx.request({
        url: "https://youyue.huiur.com/footMediaComment", //足迹总评论 评论
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          content: value,
          foot_id: that.data.fid,
          mid: that.data.mid,
          replay_id: that.data.rid,
          media_id: media_id
        },
        success: function (res) {
          console.log(res);
          if (res.data.data) {
            that.showreply();
          }
          that.setData({
            replybox: false,
            replybox_re: false,
          })
        }
      })
    }
    
    
  },
  closemask: function () {
    console.log('mask');
    this.setData({
      replybox: false,
      replybox_re: false,
    })
  },
  replyothers:function(e){
    var fid = this.data.fid;
    var rid = e.currentTarget.dataset.rid;
    var ot_name = e.currentTarget.dataset.name;
    var user_id = wx.getStorageSync('user_id');
    var uid = e.currentTarget.dataset.uid;
    var total = e.currentTarget.dataset.total;
    var user_id = wx.getStorageSync('user_id');
    console.log(e);
    var footid = 0;
    if(total == 1){ //总的评论
      footid = 1
    }else{ //单点评论
      footid = 0
    }
    console.log(rid);
    var that = this;
    var list = ['删除']
    this.setData({
      rid:rid,
      ot_name: ot_name,
    })
    if(uid == user_id || this.data.uid == user_id){
      list = ['回复', '删除']
    }else{
      list = ['回复']
    }
    wx.showActionSheet({
      itemList: list,
      success: function (res) {
        var tapIndex = res.tapIndex;
        console.log(res);
        if (tapIndex==0){
          that.setData({
            inputfocus: true,
            holder:'回复评论'
          })
          
        }
        if (tapIndex == 1) {
          console.log('删除回复')
          wx.request({
            url: "https://youyue.huiur.com/delFootComment", //删除足迹回复
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              comment_id: rid,
              is_foot: footid,
              foot_id:fid,
              user_id: user_id,
            },
            success: function (res) {
              console.log(res);
              that.showreply();
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  inputup:function(){
    this.setData({
      replymask:true,
    })
  },
  inputdown:function(){
    this.setData({
      replymask:false,
      inputvalue:"",
      holder:'评论足迹'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  }
})