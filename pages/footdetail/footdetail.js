// pages/footdetail/footdetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    int:1,
    num:4,
    labelarr:[1,1,1],
    title:'',
    username:'',
    header:'',
    cover:'',
    page_day:'',
    fid:'',
    hlid:'',
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    footarr:[],
    evah01:true,
    evah02:true,
    evah03:true,
    sel_id:0,
    uid:'',
    user_id:'',
    botarr:[],
    replydatas:'',
    isfans:'',
    onplay:'',
    aessarr:[],
    tipoffArr: [
      { title: '广告', value: 1 },
      { title: '低俗色情', value: 0 },
      { title: '违法犯罪', value: 0 },
      { title: '我要吐槽 >', next: 1, value: 0 },
    ],
    active: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options);
    var fid = parseInt(options.id);
    this.setData({
      fid: fid
    })
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    this.setData({
      user_id:user_id
    })
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailtop", //足迹详情头部
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id:fid
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;

        var cover = datas.top_img;
        var username = app.limitwords(datas.user_nickname);
        var title = datas.title;
        var header = datas.header;
        var uid = datas.user_id;
        var topid = 1;
        if (datas.top_img_id==false){
          topid = datas.top_img_id
        }else{
          topid = 1
        }
        that.setData({
          cover:cover,
          username:username,
          title:title,
          header:header,
          int: parseInt(topid)+1,
          uid:uid,
          date: datas.create_time
        })
        if (datas.top_img_id==0){
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#1d1d2a',
          })          
        }else{
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
          })
        }
        wx.request({
          url: "https://youyue.huiur.com/flayerfootbrowsing", //足迹浏览
          method: "POST",
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
        wx.request({
          url: 'https://youyue.huiur.com/others_info',
          method: 'post',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: { user_id: user_id, others_id: uid },
          success: function (res) {
            console.log(res);
            var datas = res.data.data;
            var isfans = datas[0].isfans;
            console.log(isfans);
            that.setData({
              isfans: isfans
            })
          }
        })
      }
    })
    
    
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailbottom", //足迹详情
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        c_day:1,
        user_id: user_id
      },
      success: function (res) {
        console.log(res.data);
        var capnum = that.data.capnum;
        var datas = res.data.data;
        console.log(datas);
        var bottomarr = datas.pop();
        console.log(bottomarr);
        console.log(datas);
        var aessarr = [];
        var b = 0;
        var barr = [bottomarr.label1, bottomarr.label2, bottomarr.label3]
        var totalprog = bottomarr.label1 + bottomarr.label2 + bottomarr.label3;
        for (b = 0; b < 3; b++) {
          var percent = 0;
          var prognum = 0;
          // if (totalprog != 0) {
          //   if (Number.isInteger(barr[b] / totalprog * 100)) {
          //     prognum = barr[b] / totalprog * 100
          //   } else {
          //     percent = barr[b] / totalprog * 100;
          //     prognum = percent.toFixed(1);
          //   }
          //   aessarr.push({
          //     prog: barr[b] / totalprog * 150,
          //     percent: prognum
          //   })
          // } else {
          //   aessarr.push({
          //     prog: 0,
          //     percent: 0
          //   })
          // }
          aessarr.push({
            prog: 0,
            percent: barr[b]
          })

        }
        var footarr = [{
          dayid: 0,
          capnum: '一',
          staarr: [
            {
              staid: 0,
              capnum: '一',
              striparr: [
                // {
                //   srpid: 0,
                //   c_pos: 1,
                // }
              ]
            }
          ]
        }];
        console.log(footarr);
        var daylen = footarr.length;
        console.log(daylen);
        var l_day = footarr[daylen-1];
        console.log(l_day);
        var stalen = l_day.staarr.length;
        console.log(stalen);
        var l_sta = l_day.staarr[stalen-1];
        console.log(l_sta);
        var srplen = l_sta.striparr.length;
        console.log(srplen);
        var l_srp = l_sta.striparr[srplen-1];
        console.log(l_srp);
        var i = 0;
        for(i=0;i<datas.length;i++){
          var i_day = datas[i].c_day-1;
          var i_sta = datas[i].c_station-1;
          var i_srp = datas[i].c_position-1;
          console.log('i_day' + i_day);
          console.log('i_sta' + i_sta);
          console.log('i_srp' + i_srp);
          var daylen = footarr.length;
          if(i_day<daylen){ //0<1 有这个day
            var sta_l = footarr[i_day].staarr;
            var stalen = sta_l.length;
            if (i_sta < stalen){ //有这个站              
              sta_l[i_sta].position = datas[i].position;
              var srp_l = sta_l[i_sta].striparr;
              var defalt = 0;
              if (datas[i].title == 'Ta很懒并没有留下评论，你可以点评论进行评价哦！'){
                defalt = 1;
              }
              srp_l.push({
                title:datas[i].title,
                isvideo: datas[i].isvideo,
                media_url: datas[i].media_url,
                videoimg_name: datas[i].videoimg_name,
                clickNum: datas[i].clickNum,
                commentNum: datas[i].commentNum,
                is_click: datas[i].is_click,
                playved:false,
                media_id: datas[i].id,
                srpid: i_srp,
                defalt: defalt
              })
            }else{
              sta_l.push({
                capnum: capnum[i_sta],
                staid: i_sta,
                position: datas[i].position,
                striparr: [
                  
                ]
              })
              var defalt = 0;
              if (datas[i].title == 'Ta很懒并没有留下评论，你可以点评论进行评价哦！') {
                defalt = 1;
              }
              sta_l[i_sta].striparr.push({
                title: datas[i].title,
                isvideo: datas[i].isvideo,
                media_url: datas[i].media_url,
                videoimg_name: datas[i].videoimg_name,
                clickNum: datas[i].clickNum,
                commentNum: datas[i].commentNum,
                is_click: datas[i].is_click,
                playved: false,
                media_id: datas[i].id,
                srpid: i_srp,
                defalt: defalt
              });
            }
          }else{ //没有day push
            footarr.push({
              dayid: i_day,
              capnum: capnum[i_day],
              staarr: [ //生成新的一天，一定会生成新的一站，新的一站是第一个，索引为一
                {
                  capnum: '一',
                  staid: 0,
                  striparr: []
                }
              ]
            })
          }   
          // footarr[i_day].staarr[i_sta].striparr[i_srp].title = datas[i].title;
          
        }
        console.log(footarr);
        that.setData({
          footarr: footarr,
          page_day:1,
          botarr:bottomarr,
          aessarr: aessarr,
        })
      }
    })
    
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailcomment", //是否评价
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        user_id:user_id
      },
      success: function (res) {
        console.log(res);
        var label_id = res.data.data.label_id;
        that.setData({
          sel_id: label_id,
          ['evah0' + label_id]: false,
        })
        // console.log(label_com);
        // var label_ = label_com-1
        // if (label_com == 0){
        //   console.log('没有评价')
        //   that.setData({
        //     hlid: 'false'
        //   })
        // }else{
        //   that.setData({
        //     hlid: label_
        //   })
        // }
      }
    })
    wx.request({
      url: "https://youyue.huiur.com/gettravellabel", //热门足迹label
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var labelarr = res.data.data;
        that.setData({
          labelarr: labelarr
        })
      }
    })
  },
  previewimg:function(e){
    console.log(e);
    var idx = e.currentTarget.dataset.idx;
    var imgarr = e.currentTarget.dataset.imgarr;
    wx.previewImage({
      current: imgarr[idx], 
      urls: imgarr
    })
  },
  replytap:function(e){ //点击 底部回复弹出评论框
    console.log(e);
    var replydatas = {};
    replydatas.dayid = e.currentTarget.dataset.dayid;
    replydatas.media_id = e.currentTarget.dataset.media_id;
    replydatas.staid = e.currentTarget.dataset.staid;
    replydatas.srpid = e.currentTarget.dataset.srpid;
    console.log(replydatas);
    this.setData({
      replybox:true,
      // autofocus:true,
      replydatas:replydatas
    })
    this.setData({
      autofocus:true,
    })
  },
  singlereply:function(e){ //单点评论
    console.log(e);
    var that = this;
    var value = e.detail.value;
    var replydatas = this.data.replydatas;
    var user_id = wx.getStorageSync('user_id');
    console.log(replydatas);
    wx.request({
      url: "https://youyue.huiur.com/footMediaComment", //单点评论
      method: "GET",
      data:{
        content:value,
        user_id: user_id,
        replay_id:"",
        media_id: replydatas.media_id,
        foot_id:that.data.fid,
        mid:that.data.uid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          replybox: false,
        })
        var fid = that.data.fid;
        var user_id = wx.getStorageSync('user_id');
        wx.request({
          url: "https://youyue.huiur.com/flayerfootdetailbottom", //足迹详情
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            foot_id: fid,
            c_day: 1,
            user_id: user_id
          },
          success: function (res) {
            console.log(res.data);
            var capnum = that.data.capnum;
            var datas = res.data.data;
            console.log(datas);
            var bottomarr = datas.pop();
            console.log(bottomarr);

            that.setData({
              botarr: bottomarr,
            })
          }
        })
      }
      
    })
    
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      mapdisplay: 'none',
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  tipoffbtn: function () {
    var i = 0;
    for (i = 0; i < this.data.tipoffArr.length; i++) {
      if (this.data.tipoffArr[i].value == 1) {
        var typenum = i;
      }
    }
    var user_id = wx.getStorageSync('user_id');
    var that = this;
    wx.request({
      url: "https://youyue.huiur.com/footReport",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: that.data.fid,
        user_id: user_id,
        types: typenum,
      },
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        that.hideModal();
      }
    })

  },
  aessreashow:function(){
    var user_id = wx.getStorageSync('user_id');
    var fid = this.data.fid;
    var that = this;
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailbottom", //足迹详情
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        c_day: 1,
        user_id: user_id
      },
      success: function (res) {
        console.log(res.data);
        var capnum = that.data.capnum;
        var datas = res.data.data;
        console.log(datas);
        var bottomarr = datas.pop();
        console.log(bottomarr);
        console.log(datas);
        var aessarr = [];
        var b = 0;
        var barr = [bottomarr.label1, bottomarr.label2, bottomarr.label3]
        var totalprog = bottomarr.label1 + bottomarr.label2 + bottomarr.label3;
        console.log(totalprog);
        for (b = 0; b < 3; b++) {
          var percent = 0;
          // var prognum = 0;
          // if (totalprog != 0){
          //   if (Number.isInteger(barr[b] / totalprog * 100)) {
          //     prognum = barr[b] / totalprog * 100
          //   } else {
          //     percent = barr[b] / totalprog * 100;
          //     prognum = percent.toFixed(1);
          //   }
          //   aessarr.push({
          //     prog: barr[b] / totalprog * 150,
          //     percent: prognum
          //   })
          // }else{
          //   aessarr.push({
          //     prog: 0,
          //     percent: 0
          //   })
          // }
          aessarr.push({
            prog: 0,
            percent: barr[b]
          })
          
        }
        that.setData({
          aessarr: aessarr,
        })
      }
    })
  },
  closemask:function(){
    this.setData({
      replybox: false,
    })
  },
  jumpreply:function(){
    var fid = this.data.fid;
    var mid = this.data.uid;
    var int = this.data.int;
    var uid = this.data.uid;
    wx.navigateTo({
      url: '../footreply/footreply?fid=' + fid + '&mid=' + mid + '&int=' + int + '&fuid=' + uid,
    })
  },
  followtap:function(){
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var fans_id = this.data.uid;
    wx.request({
      url: "https://youyue.huiur.com/bfans",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        user_id: user_id,
        fans_id: fans_id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == "关注成功！") {
          that.setData({
            isfans: 1
          })
        }
      }
    })
  },
  stavedtap:function(e){
    console.log(e);
    var dayid = e.currentTarget.dataset.dayid;
    var staid = e.currentTarget.dataset.staid;
    var srpid = e.currentTarget.dataset.srpid;
    var footarr = this.data.footarr;
    var the_srp = footarr[dayid].staarr[staid].striparr[srpid];
    console.log(the_srp);
    
    var onplay = this.data.onplay;
    console.log(onplay);
    if (typeof (onplay.dayid) == "undefined"){
      
    }else{
      var on_srp = footarr[onplay.dayid].staarr[onplay.staid].striparr[onplay.srpid];
      on_srp.playved = false;
      console.log(footarr);
    }    
    onplay = {
      dayid: dayid,
      staid: staid,
      srpid: srpid,
    }
    console.log(onplay);
    console.log(footarr);
    the_srp.playved = true;
    this.setData({
      footarr: footarr,
      onplay:onplay
    })
  },
  collectfoot:function(e){
    var user_id = wx.getStorageSync('user_id');
    var fid = this.data.fid;
    var that = this;
    var botarr = this.data.botarr;
    var collect = e.currentTarget.dataset.collect;
    if(collect == 0){
      botarr.is_collections = 1;
      that.setData({
        botarr: botarr
      })
    wx.request({
      url: "https://youyue.huiur.com/footCollection", //收藏 
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        user_id: user_id,
      },
      success: function (res) {
        console.log(res);
      }
    })
    }else{
      botarr.is_collections = 0;
      that.setData({
        botarr: botarr
      })
      wx.request({
        url: "https://youyue.huiur.com/delFootCollection", //取消收藏 
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          user_id: user_id,
        },
        success: function (res) {
          console.log(res);
        }
      })
    }
  },
  
  selecteva:function(e){
    var seid = e.currentTarget.dataset.lid;
    console.log(seid);
    var that = this;
    var hlid = that.data.hlid + 1;
    var fid = this.data.fid;
    var user_id = wx.getStorageSync('user_id');
    var sel_id = that.data.sel_id;
    console.log(sel_id);
    if (sel_id == 0) { //没有评价
      wx.request({
        url: "https://youyue.huiur.com/flayerfootdecomment", //评价
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          user_id: user_id,
          label_id: seid,
          mid:that.data.uid
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            ['evah0' + seid]:false,
            sel_id: seid
          })
          that.aessreashow();
        }
      })
    } else if (seid == sel_id){ //评价过 取消评价
      console.log('评价过了 取消');
      wx.request({
        url: "https://youyue.huiur.com/delFootClog", //评价
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          user_id: user_id,
        },
        success: function (res) {
          console.log(res);
          if(res.data == 1){
            that.setData({
              ['evah0' + seid]: true,
              sel_id: 0
            })
            that.aessreashow();
          }
        }
      })
      
    }else{ //评价过了 且点击其他评价
      console.log('评价过了');
    }
    
  },
  jumpothers:function(e){
    console.log(e);
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../footothers/footothers?id='+uid,
    })
  },  
  sharefoot:function(){
    var fid = this.data.fid;
    this.onShareAppMessage();

  },
  totalfootclick:function(e){
    var that = this;
    var fid = this.data.fid;
    var mid = this.data.uid;
    var user_id = wx.getStorageSync('user_id');
    var botarr = this.data.botarr;
    var click = e.currentTarget.dataset.click;
    var clicknum = e.currentTarget.dataset.clicknum;
    if (click == 1) {
      that.setData({
        foottips: true
      })
      var t = setTimeout(function () {
        that.setData({
          foottips: false
        })
      }, 2000);
    } else {
      wx.request({
        url: "https://youyue.huiur.com/footClick", //总体点赞
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          user_id: user_id,
          mid: mid
        },
        success: function (res) {
          console.log(res);

        }
      })
      botarr.totalClickNum = parseInt(clicknum) + 1;
      botarr.is_clicks = 1;
      console.log(botarr);
      that.setData({
        botarr: botarr,
      })
    }
    
  },
  thumpsingle:function(e){
    var that = this;
    console.log(e);
    var isclick = e.currentTarget.dataset.isclick;
    var media_id = e.currentTarget.dataset.media_id;
    var dayid = e.currentTarget.dataset.dayid;
    var staid = e.currentTarget.dataset.staid;
    var srpid = e.currentTarget.dataset.srpid;
    var clickNum = e.currentTarget.dataset.clicknum;
    console.log(clickNum);
    console.log(dayid);
    console.log(staid);
    console.log(srpid);
    var user_id = wx.getStorageSync('user_id');
    var footarr = this.data.footarr;
    console.log(footarr);
    if (isclick == 0){
      footarr[dayid].staarr[staid].striparr[srpid].is_click = 1;
      footarr[dayid].staarr[staid].striparr[srpid].clickNum = parseInt(clickNum)+1;
      that.setData({
        footarr: footarr
      })
      wx.request({
        url: "https://youyue.huiur.com/footMediaClick", //单点点赞
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          media_id: media_id,
          user_id: user_id,
          mid: that.data.uid
        },
        success: function (res) {
          console.log(res);

        }
      })
    }
    
  },  
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showcompStatus:false,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        mapdisplay: 'block',
      })
    }.bind(this), 200)
  },
  tipofftap: function (e) {
    console.log(e);
    var next = e.currentTarget.dataset.next;
    var id = e.currentTarget.id;
    if (next == 1) {
      var i = 0;
      for (i = 0; i < this.data.tipoffArr.length; i++) {
        this.setData({
          ['tipoffArr[' + i + '].value']: 0,
        })
      }
      this.setData({
        ['tipoffArr[' + id + '].value']: 1,
      })
      var animation1 = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation1 = animation1
      animation1.translateX(300).step()
      this.setData({
        animationcomp: animation1.export(),
        showcompStatus: true
      })
      setTimeout(function () {
        animation1.translateX(0).step()
        this.setData({
          animationcomp: animation1.export()
        })
      }.bind(this), 200)
    } else {
      var i = 0;
      for (i = 0; i < this.data.tipoffArr.length; i++) {
        this.setData({
          ['tipoffArr[' + i + '].value']: 0,
          
        })
      }
      this.setData({
        ['tipoffArr[' + id + '].value']: 1,
      })
    }
  },
  returntap: function () {
    var animation1 = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation1 = animation1
    animation1.translateX(300).step()
    this.setData({
      animationcomp: animation1.export()
    })
    setTimeout(function () {
      animation1.translateX(0).step()
      this.setData({
        animationcomp: animation1.export(),
        showcompStatus: false
      })
    }.bind(this), 200);
    var i = 0;
    for (i = 0; i < this.data.tipoffArr.length; i++) {
      this.setData({
        ['tipoffArr[' + i + '].value']: 0,
      })
    }
    this.setData({
      ['tipoffArr[' + 0 + '].value']: 1,
    })
  },
  bindinput: function (e) {
    if (e.detail.value == "") {
      this.setData({
        active: false
      })
    } else {
      this.setData({
        active: true
      })
    }
  },
  submittap: function (e) {
    var user_id = wx.getStorageSync('user_id');
    var that = this;
    var desp = e.detail.value.comp;
    if (this.data.active == true) {
      wx.request({
        url: "https://youyue.huiur.com/footReport",
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: that.data.fid,
          user_id: user_id,
          types: 3,
          description: desp,
        },
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          that.hideModal();
        }
      })
    }
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
    var that = this;
    var fid = that.data.fid;
    var user_id = wx.getStorageSync('user_id');    
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailbottom", //足迹详情
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        c_day: 1,
        user_id: user_id
      },
      success: function (res) {
        console.log(res.data);
        var capnum = that.data.capnum;
        var datas = res.data.data;
        console.log(datas);
        var bottomarr = datas.pop();
        console.log(bottomarr);
        
        that.setData({
          botarr: bottomarr,
        })
      }
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
    console.log(this.data.page_day);
    var page_day = this.data.page_day+1;
    var that = this;
    var fid = this.data.fid;
    var capnum = this.data.capnum;
    console.log(page_day);
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailbottom", //足迹详情
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
        c_day: page_day,
        user_id: user_id
      },
      success: function (res) {
        var datas = res.data.data;

        console.log(datas);
        if(datas){
          datas.pop();
          var footarr = that.data.footarr;
          var i = 0;
          for (i = 0; i < datas.length; i++) {
            var i_day = datas[i].c_day - 1;
            var i_sta = datas[i].c_station - 1;
            var i_srp = datas[i].c_position - 1;
            console.log('i_day' + i_day);
            console.log('i_sta' + i_sta);
            console.log('i_srp' + i_srp);
            var daylen = footarr.length;
            if (i_day < daylen) { //0<1 有这个day
              var sta_l = footarr[i_day].staarr;
              var stalen = sta_l.length;
              if (i_sta < stalen) { //有这个站              
                sta_l[i_sta].position = datas[i].position;
                var srp_l = sta_l[i_sta].striparr;
                var defalt = 0;
                if (datas[i].title == 'Ta很懒并没有留下评论，你可以点评论进行评价哦！') {
                  defalt = 1;
                }
                srp_l.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  media_url: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  clickNum: datas[i].clickNum,
                  commentNum: datas[i].commentNum,
                  is_click: datas[i].is_click,
                  playved: false,
                  media_id: datas[i].id,
                  srpid: i_srp,
                  defalt: defalt
                })
              } else {
                sta_l.push({
                  capnum: capnum[i_sta],
                  staid: i_sta,
                  position: datas[i].position,
                  striparr: [

                  ]
                })
                var defalt = 0;
                if (datas[i].title == 'Ta很懒并没有留下评论，你可以点评论进行评价哦！') {
                  defalt = 1;
                }
                sta_l[i_sta].striparr.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  media_url: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  clickNum: datas[i].clickNum,
                  commentNum: datas[i].commentNum,
                  is_click: datas[i].is_click,
                  playved: false,
                  media_id: datas[i].id,
                  srpid: i_srp,
                  defalt: defalt
                });
              }
            } else { //没有day push
              footarr.push({
                dayid: i_day,
                capnum: capnum[i_day],
                staarr: [ //生成新的一天，一定会生成新的一站，新的一站是第一个，索引为一
                  {
                    capnum: '一',
                    staid: 0,
                    position: datas[i].position,
                    striparr: [],                    
                  }
                ]
              })
              var defalt = 0;
              if (datas[i].title == 'Ta很懒并没有留下评论，你可以点评论进行评价哦！') {
                defalt = 1;
              }
              footarr[i_day].staarr[0].striparr.push({
                title: datas[i].title,
                isvideo: datas[i].isvideo,
                media_url: datas[i].media_url,
                videoimg_name: datas[i].videoimg_name,
                clickNum: datas[i].clickNum,
                commentNum: datas[i].commentNum,
                is_click: datas[i].is_click,
                playved: false,
                media_id: datas[i].id,
                srpid: i_srp,
                defalt: defalt
              });
              
            }
          }
          console.log(footarr)
          that.setData({
            page_day: page_day,
            footarr: footarr,
          })
        }else{ //已经到底了
          console.log('已经到底了')
        }
        
        
        
        
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var fid = that.data.fid;
    var user_id = wx.getStorageSync('user_id');
    var uid = that.data.uid;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.title,
      path: '/pages/footdetail/footdetail?id=' + fid,
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