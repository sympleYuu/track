// pages/footexit/footexit.js
var app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
function initQiniu1() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: 'https://youyue.huiur.com/uptoken',
  };
  qiniuUploader.init(options);
}
function initQiniu2() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: 'https://youyue.huiur.com/uptoken?type=1',
  };
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeshow: true,
    winheight: '',
    listanimat: {},
    listhidden: false,
    myphoto: '',
    myname: '',
    coverarr: [],
    mainfocus: false,
    coverid: 0,
    coverimg: '',
    pagetitle: '喜欢并去贯彻，就是意义，一场我的旅行，在这里记录下来！',
    footid: '',
    int: 1,
    num: 2,
    statithid: true,
    footarr: [],
    linkarr: [],
    linkhid: false,
    selectword: "",
    addexit: false,
    addtext: '点它开始添加你的足迹吧!',
    addwarn: false,
    picarr: [],
    positionwords: '',
    upinfor: [],
    titlebox: false,
    footarr: [{
      dayid: 0,
      capnum: '一',
      staarr: [
        {
          staid: 0,
          capnum: '一',
          cutadd: 0,
          spreadsta: 0,
          striparr: [
            // {
            //   srpid: 0,
            //   c_pos: 1,
            // }
          ]
        }
      ]
    }],
    dayarr: [],
    stationarr: [],
    striparr: [],
    firstadd: false,
    thenadd: true,
    totallist: [[1, 1], [1]],
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    surebtn1: true,
    fixbtn1: false,
    spreadsta: false,
    // srparea:true,
    contiques: false,
    cut_dayid: '',
    cut_staid: '',
    recall: false,
    areashow: true,
    headarr: {
      title: '',
      topimg_id: 0
    },
    vedshow: true,
    positionarr:[],
    delimgidx:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    // wx.removeStorageSync('temid');
    wx.setNavigationBarTitle({
      title: '编辑你的足迹',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0a0a0a',
    })
    var fid = parseInt(options.id);
    console.log(options);
    this.setData({
      fid: fid
    })
    
    // wx.removeStorageSync('date1');
    var temid = wx.getStorageSync('temid');
    console.log(temid);
    var date1 = wx.getStorageSync('date1');
    console.log(date1);
    if (date1) {
      var date2 = new Date();
      console.log(date2);
      var date3 = date2.getTime() - date1;
      var days = date3 / (3600 * 1000);
      // var seconds = Math.round(date3 / 1000)
      console.log(days);
      if (days > 36) { //超过1.5天 不显示继续编辑弹窗
        wx.removeStorageSync('temid');
        wx.removeStorageSync('footarr');
        wx.removeStorageSync('fixsrp');
        wx.removeStorageSync('headarr');
        wx.removeStorageSync('date1');

      } else { //在1.5天以内
        console.log(temid);
        // if (temid != "") {
        //   this.setData({
        //     contiques: true,
        //     areashow: true,
        //   })
        // } else {
        //   console.log('重新编辑');
        // }

      }
    } else {
      wx.removeStorageSync('temid');
      wx.removeStorageSync('footarr');
      wx.removeStorageSync('fixsrp');
      wx.removeStorageSync('headarr');
    }


    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var winHeight = res.windowHeight;
        that.setData({
          winheight: winHeight,
        })
      }
    });
    this.setData({
      mainfocus: true
    })
    wx.request({
      url: "https://youyue.huiur.com/updateimg", //加载头像、姓名、封面图
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: user_id
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        var topimgs = datas.top_img;
        var username = app.limitwords(datas.user_nickname);
        // topimgs.pop();
        that.setData({
          coverarr: topimgs,
          myphoto: datas.header,
          myname: username,
        })
        
      }
    })
    wx.request({
      url: "https://youyue.huiur.com/flayerfootdetailtop", //足迹详情头部
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        var coverarr = that.data.coverarr;
        console.log(coverarr);
        var cover = datas.top_img;
        var uid = datas.user_id;
        that.setData({
          cover: datas.top_img,
          titlevalue: datas.title,
          int: parseInt(datas.top_img_id) + 1,
          uid: uid
        })
      }
    })
    var footarr = this.data.footarr;
    var capnum = this.data.capnum;
    console.log(footarr);
    // wx.setStorageSync('footarr', footarr);
    wx.request({
      url: "https://youyue.huiur.com/updateflayerfootdetailbottom", //足迹详情
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        foot_id: fid,
      },
      success: function (res) {
        console.log(res.data);
        var capnum = that.data.capnum;
        var datas = res.data.data;
        console.log(datas);
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
        var l_day = footarr[daylen - 1];
        console.log(l_day);
        var stalen = l_day.staarr.length;
        console.log(stalen);
        var l_sta = l_day.staarr[stalen - 1];
        console.log(l_sta);
        var srplen = l_sta.striparr.length;
        console.log(srplen);
        var l_srp = l_sta.striparr[srplen - 1];
        console.log(l_srp);
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
              if (datas[i].isvideo==1){//视频
                srp_l.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  vedsrc: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  keep:1,
                  titlebox:true,
                  srpid: datas[i].c_position -1,
                  media_id: datas[i].id,
                })
              }else{
                srp_l.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  imgarr: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  keep: 1,
                  titlebox: true,
                  srpid: datas[i].c_position - 1,
                  media_id: datas[i].id,
                })
              }            
            } else {
              sta_l.push({
                capnum: capnum[i_sta],
                staid: i_sta,
                position: datas[i].position,
                striparr: [

                ]
              })
              if (datas[i].isvideo == 1){ //视频
                sta_l[i_sta].striparr.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  vedsrc: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  keep: 1,
                  titlebox: true,
                  srpid: datas[i].c_position - 1,
                  media_id: datas[i].id,
                });
              }else{ //图片
                sta_l[i_sta].striparr.push({
                  title: datas[i].title,
                  isvideo: datas[i].isvideo,
                  imgarr: datas[i].media_url,
                  videoimg_name: datas[i].videoimg_name,
                  keep: 1,
                  titlebox: true,
                  srpid: datas[i].c_position - 1,
                  media_id: datas[i].id,
                });
              }
              
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
                  striparr: []
                }
              ]
            })
            if (datas[i].isvideo == 1) { //视频
              footarr[i_day].staarr[0].striparr.push({
                title: datas[i].title,
                isvideo: datas[i].isvideo,
                vedsrc: datas[i].media_url,
                videoimg_name: datas[i].videoimg_name,
                keep: 1,
                titlebox: true,
                srpid: datas[i].c_position - 1,
                media_id: datas[i].id,
              });
            } else { //图片
              footarr[i_day].staarr[0].striparr.push({
                title: datas[i].title,
                isvideo: datas[i].isvideo,
                imgarr: datas[i].media_url,
                videoimg_name: datas[i].videoimg_name,
                keep: 1,
                titlebox: true,
                srpid: datas[i].c_position - 1,
                media_id: datas[i].id,
              });
            }
            // footarr[i_day].staarr[0].striparr.push({
            //   title: datas[i].title,
            //   isvideo: datas[i].isvideo,
            //   media_url: datas[i].media_url,
            //   videoimg_name: datas[i].videoimg_name,
            //   srpid: datas[i].c_position - 1,
            //   media_id: datas[i].id,
            // });
          }
          // footarr[i_day].staarr[i_sta].striparr[i_srp].title = datas[i].title;

        }
        console.log(footarr);
        that.setData({
          footarr: footarr,
        })
      }
    })
  },
  fixsub: function (e) {
    console.log(e);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp;
    var footarr = this.data.footarr;
    console.log(footarr);
    var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
    console.log(thissrp);
    wx.setStorageSync('fixsrp', thissrp);
    thissrp.keep = 0;
    thissrp.value = thissrp.title;
    this.setData({
      footarr: footarr
    })
    // wx.setStorageSync('footarr', footarr);
  },
  textinput: function (e) { //textarea输入 占位文字符隐藏
    if (e.detail.value == "") {
      this.setData({
        placeshow: true,
        pagetitle: ''
        // 喜欢并去贯彻，就是意义，一场我的旅行，在这里记录下来！
      })
    } else {
      this.setData({
        placeshow: false,
        pagetitle: e.detail.value,
      })
    }
  },
  positioninp: function (e) { //输入目的地---输入联想
    var value = e.detail.value;
    var that = this;
    var dayid = e.currentTarget.dataset.day; //当前第几天
    var staid = e.currentTarget.dataset.sta; //当前第几站
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(dayid);
    var l_day = footarr[dayid].staarr; //最后一天
    console.log(l_day);
    // var l_stalen = footarr[daylen - 1].staarr.length;
    var l_sta = l_day[staid];
    console.log(l_sta);
    l_day[staid].linkhid = true;
    l_day[staid].position = value;
    console.log(footarr);
    this.setData({
      footarr: footarr
    })
    if (value != "") {

      this.setData({
        addexit: true,
        addtext: '点它开始添加你的足迹吧!',
        addwarn: false
      })
    } else {
      this.setData({
        addexit: false,
        addtext: '请先填写地理位置',
        addwarn: true,
        listhidden: false,
        linkhid: false
      })
    }
    // wx.setStorageSync('footarr', footarr);
    wx.request({
      url: "https://youyue.huiur.com/asscity", //输入联想
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        keywords: value
      },
      success: function (res) {
        var tips = res.data.tips;
        var i = 0;
        var arr = [];
        for (i = 0; i < tips.length; i++) {
          arr.push(tips[i].name);
        }
        that.setData({
          linkhid: true,
          linkarr: arr
        })
        console.log(tips.length);
        if (tips.length == 0) {

          that.setData({
            linkhid: false,
          })
        }
      }
    })
  },

  positionblur: function (e) { //地址输入框失去焦点
    console.log(e);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var fid = this.data.fid;
    var footarr = this.data.footarr;
    var thissta = footarr[dayid].staarr[staid];
    console.log(thissta);
    console.log(thissta.position);
    var posarr = this.data.positionarr;
    if (e.detail.value != "") { //有输入
      this.setData({
        addexit: true,
        positionwords: e.detail.value
      })
      if (thissta.newsta == true){ //新增的站点位置改变
        if (thissta.p_id){ //已经将内容上传 获取到了positionid(p_id) 需要请求改变地理位置的接口
        var mediaid_arr = [];
        var m = 0;
        for (m = 0; m < thissta.striparr.length;m++){
          mediaid_arr.push(thissta.striparr[m].media_id);
        }
        console.log(mediaid_arr);

          wx.request({
            url: "https://youyue.huiur.com/updateaddflayerfoots", //修改新增的站点位置
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              p_id: thissta.p_id,
              mediaid: mediaid_arr,
              position: thissta.position
            },
            success: function (res) {
              console.log(res);
              // headarr.title = value;
              // wx.setStorageSync('headarr', headarr);
            }
          })
        }
      }else{ //原有的站点改变
        var Dayid = dayid + 1;
        var Staid = staid + 1;
        var infinitekey = 'f'+ this.data.fid + 'd'+ Dayid +'s'+Staid;
        console.log(infinitekey)
        posarr[infinitekey] = [{
          c_day: Dayid,
          c_station: Staid,
          position: thissta.position
        }]
      }
      
      this.setData({
        positionarr:posarr
      })
    } else { //没有输入
      this.setData({
        addexit: false
      })
    }
    console.log(this.data.positionarr);
    var that = this;
    var title = this.data.pagetitle;
    var coverid = this.data.int;
    var user_id = wx.getStorageSync('user_id');
    that.setData({ //输入过 站名就不能撤回了
      recall: false
    })

  },
  fixtitle: function (e) { //标题输入框失焦，修改标题
    console.log(e);
    var value = e.detail.value;
    var headarr = wx.getStorageSync('headarr');
    var fid = this.data.fid;
      wx.request({
        url: "https://youyue.huiur.com/updateflayerfoottitle", //修改标题
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          title: value,
        },
        success: function (res) {
          console.log(res);
          // headarr.title = value;
          // wx.setStorageSync('headarr', headarr);
        }
      })
  },
  selectwords: function (e) { //选择输入联想的词语
    console.log(e);
    var words = e.currentTarget.dataset.name;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = footarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);

    var t_sta = footarr[dayid].staarr[staid];
    t_sta.linkhid = false;
    t_sta.position = words;
    console.log(words);
    var posarr = this.data.positionarr;

    if (t_sta.newsta == true) { //新增的站点位置改变
      if (t_sta.p_id) { //已经将内容上传 获取到了positionid(p_id) 需要请求改变地理位置的接口
        var mediaid_arr = [];
        var m = 0;
        for (m = 0; m < t_sta.striparr.length; m++) {
          mediaid_arr.push(t_sta.striparr[m].media_id);
        }
        console.log(mediaid_arr);

        wx.request({
          url: "https://youyue.huiur.com/updateaddflayerfoots", //修改新增的站点位置
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            p_id: t_sta.p_id,
            mediaid: mediaid_arr,
            position: t_sta.position
          },
          success: function (res) {
            console.log(res);
            // headarr.title = value;
            // wx.setStorageSync('headarr', headarr);
          }
        })
      }
    }else{
      var Dayid = dayid + 1;
      var Staid = staid + 1;
      var infinitekey = 'f' + this.data.fid + 'd' + Dayid + 's' + Staid;
      console.log(infinitekey)
      posarr[infinitekey] = [{
        c_day: Dayid,
        c_station: Staid,
        position: t_sta.position
      }]

      this.setData({
        positionarr: posarr
      })
      console.log(posarr)
    }
    this.setData({
      footarr: footarr,
      linkhid: false
    })
    console.log(footarr);
    // wx.setStorageSync('footarr', footarr);
  },
  linkmasktap: function () { //点击蒙版 输入联想box关闭
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = footarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    l_sta.linkhid = false;
    //关闭所有站的联想box蒙版
    var d = 0;
    for (d = 0; d < daylen; d++) {
      var s = 0;
      var slen = footarr[d].staarr.length;
      for (s = 0; s < slen; s++) {
        footarr[d].staarr[s].linkhid = false
      }
    }
    this.setData({
      footarr: footarr,
      linkhid: false
    })
    // wx.setStorageSync('footarr', footarr);
  },
  addfoot: function () { //添加足迹按钮

    // if (this.data.addexit){
    //   this.setData({
    //     listhidden: true,
    //     addtext:'点它开始添加你的足迹吧!',
    //     addwarn:false,
    //     vedshow:false,
    //   })
    //   var that = this;
    //   var temid = wx.getStorageSync('temid');
    //   var footarr = this.data.footarr;
    //   console.log(footarr);
    //   var daylen = footarr.length; //有几天
    //   console.log(daylen);
    //   var l_day = footarr[daylen - 1].staarr; //最后一天
    //   console.log(l_day);
    //   var l_stalen = footarr[daylen - 1].staarr.length;
    //   var l_sta = l_day[l_stalen - 1];
    //   console.log(l_sta);
    //   var position = l_sta.position;
    //   l_sta.disabled = true; //点击上传加号，不能修改站地址
    //   console.log(footarr);
    //   that.setData({
    //     footarr: footarr
    //   })
    //   wx.setStorageSync('footarr', footarr);
    // }else{
    //   this.setData({
    //     addtext:'请先填写地理位置',
    //     addwarn:true
    //   })
    // }
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = footarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    var that = this;
    if (l_sta.position) {
      // l_sta.disabled = true; 可以修改地理位置
      that.setData({
        footarr: footarr
      })
      this.setData({
        listhidden: true,
        addtext: '点它开始添加你的足迹吧!',
        addwarn: false,
        vedshow: false,
      })

    } else {
      this.setData({
        addtext: '请先填写地理位置',
        addwarn: true
      })
    }
  },
  addfootcut: function (e) { //插入---点击添加我的足迹
    var that = this;
    var footarr = this.data.footarr;
    console.log(footarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    var the_srp = footarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = footarr[did].staarr.length;

    var the_sta = footarr[did].staarr[aid]
    console.log(the_sta);
    if (the_sta.position == "" || the_sta.position == undefined) { //没填写了站的地理位置
      the_sta.cutadd = 3
    } else {//填写了站的地理位置      
      the_sta.cutadd = 2
      footarr[did].staarr[aid].listshow = true;
      footarr[did].staarr[aid].disabled = true;
    }
    this.setData({
      footarr: footarr,
      vedshow: false
    })


    // footarr[did].staarr[aid].listshow = true;
    // footarr[did].staarr[aid].disabled = true;
    // console.log(footarr);
    // this.setData({
    //   footarr: footarr,
    //   vedshow: false
    // })
    // wx.setStorageSync('footarr', footarr);
  },
  addthenfoot: function () { //继续添加足迹
    this.setData({
      spreadsta: true,
      // vedshow:false,
    })
  },
  continueadd: function () { //继续本站
    var footarr = this.data.footarr;
    var daylen = footarr.length; //有几天
    var l_stalen = footarr[daylen - 1].staarr.length; //最后一天有几站
    var l_sta = footarr[daylen - 1].staarr[l_stalen - 1]; //最后一站的内容
    console.log(l_sta);
    var l_srplen = l_sta.striparr.length;
    console.log(l_srplen); //最后一站有几项
    // l_sta.striparr.push(1); //在数组中加数据项
    console.log(footarr);
    this.setData({
      listhidden: true,
      spreadsta: false,
    })
  },
  continuenextsta: function (e) { //继续下一站
    var that = this;
    var footarr = this.data.footarr;
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    console.log(did);
    console.log(aid);
    var the_srp = footarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = footarr[did].staarr.length;
    console.log(footarr);
    console.log(footarr[did]);
    var capnum = this.data.capnum;
    footarr[did].staarr[aid].spreadsta = 0;
    var i = 0;
    for (i = 0; i < stalen; i++) {
      footarr[did].staarr[i].cutadd = 0;
    }
    footarr[did].staarr.splice(aid + 1, 0, {
      capnum: capnum[aid + 1],
      staid: aid + 1,
      spreadsta: 0,
      cutadd: 2,
      cutstait: 1,
      striparr: [

      ]
    })

    console.log(footarr);

    var capnum = that.data.capnum;
    var _daylen = footarr.length;
    console.log(_daylen);
    var d = 0;
    for (d = 0; d < _daylen; d++) { //遍历day
      footarr[d].dayid = d;
      footarr[d].capnum = capnum[d];
      var _stalen = footarr[d].staarr.length;
      console.log(_stalen);
      var s = 0;
      for (s = 0; s < _stalen; s++) { //遍历station
        var _srplen = footarr[d].staarr[s].striparr.length;
        footarr[d].staarr[s].staid = s;
        footarr[d].staarr[s].capnum = capnum[s]
        var p = 0;
        for (p = 0; p < _srplen; p++) {
          var srp = footarr[d].staarr[s].striparr[p];
          console.log('修改索引')
          srp.srpid = p;
          srp.c_pos = p + 1;
          console.log(srp);
        }
      }
    }
    console.log(footarr);
    this.setData({
      footarr: footarr
    })
    // wx.setStorageSync('footarr', footarr);
    this.setData({
      footarr: footarr,
      // thenadd: false,
      // spreadsta: false,
      // firstadd: true
    })
  },
  nextsta: function () { //开始下一站
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = l_day.length;
    var capnum = this.data.capnum;
    console.log(capnum);
    l_day.push({
      capnum: capnum[l_stalen],
      staid: l_stalen,
      newsta:true, //新增的站
      striparr: [

      ]
    })
    console.log(footarr);
    this.setData({
      footarr: footarr,
      thenadd: false,
      spreadsta: false,
      firstadd: true,
      recall: true,
    })
    // wx.setStorageSync('footarr', footarr);
  },
  nextday: function () { //进入下一天
    var footarr = this.data.footarr;
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var capnum = this.data.capnum;

    footarr.push({
      dayid: daylen,
      capnum: capnum[daylen],
      staarr: [ //生成新的一天，一定会生成新的一站，新的一站是第一个，索引为一
        {
          capnum: '一',
          staid: 0,
          cutadd: 0,
          spreadsta: 0,
          striparr: [],
        }
      ]
    })
    console.log(footarr);
    this.setData({
      footarr: footarr,
      thenadd: false,
      spreadsta: false,
      firstadd: true,
      recall: true
    })
    // wx.setStorageSync('footarr', footarr);
  },
  continueaddcut: function (e) { //插入-继续本站
    var footarr = this.data.footarr;
    console.log(footarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    console.log(did);
    console.log(aid);
    var the_srp = footarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = footarr[did].staarr.length;

    console.log(footarr[did]);
    var the_sta = footarr[did].staarr[aid];
    the_sta.listshow = true;
    console.log(footarr);
    var capnum = this.data.capnum;
    this.setData({
      footarr: footarr,
      vedshow: false
    })

  },
  addcel: function () {
    this.setData({
      listhidden: false,
      listcuthidden: false
    })
  },
  covertap: function (e) { //选择封面主题
    console.log(e);
    var cid = parseInt(e.currentTarget.id);
    var coverarr = this.data.coverarr;
    var fid = this.data.fid;
    this.setData({
      int: cid + 1,
      cover: coverarr[cid]
    })
    // var headarr = wx.getStorageSync('headarr');

    //   //修改封面图
    //   var temid = wx.getStorageSync('temid');
  
      wx.request({
        url: "https://youyue.huiur.com/updateflayerfoottitle", //修改封面图
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          foot_id: fid,
          topimg_id: cid,

        },
        success: function (res) {
          console.log(res);
          // headarr.topimg_id = parseInt(cid) + 1;
          // wx.setStorageSync('headarr', headarr);
        }
      })
  },
  addpic: function () { //上传图片
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask: true,
        })
        initQiniu2();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        var picsarr = res.tempFilePaths;
        var picnum = picsarr.length;
        var staarr = [];
        staarr.push(picsarr);
        console.log(staarr); //图片key的数组
        that.setData({
          num: picnum,
          picarr: picsarr,
          listhidden: false,
          firstadd: false,
          thenadd: false,
          vedshow: true
        });
        var j = 0;
        var upinfor = [];
        var footarr = that.data.footarr;
        var daylen = footarr.length; //有几天
        var l_stalen = footarr[daylen - 1].staarr.length; //最后一天有几站
        var l_sta = footarr[daylen - 1].staarr[l_stalen - 1]; //最后一站的内容
        console.log(l_sta);
        var l_srplen = l_sta.striparr.length;
        console.log(l_srplen); //最后一站有几项
        l_sta.striparr.push(
          {
            imgarr: picsarr,
            titlebox: true,
            isvideo: 2,
            srpid: l_srplen,
            newadd:true
          }
        ); //在数组中加数据项
        console.log(footarr);
        that.setData({
          footarr: footarr,
        })
        // wx.setStorageSync('footarr', footarr);
        for (j = 0; j < picsarr.length; j++) {
          qiniuUploader.upload(picsarr[j], (res) => {
            var keys = res.key;
            console.log(res.key);
            upinfor.push(res.key);
            that.setData({
              upinfor: upinfor
            })
            // console.log(that.data.upinfor)
            wx.hideLoading();
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        }

      }
    })
  },
  addcutpic: function (e) { //插入-图片
    console.log(e);
    var that = this;
    var footarr = this.data.footarr;
    console.log(footarr);
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        initQiniu2();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        var picsarr = res.tempFilePaths;
        var picnum = picsarr.length;
        var staarr = [];
        staarr.push(picsarr);
        console.log(staarr); //图片key的数组
        that.setData({
          num: picnum,
          picarr: picsarr,
          listhidden: false,
          firstadd: false,
          thenadd: false,
        });
        var j = 0;
        var upinfor = [];
        var footarr = that.data.footarr;
        console.log(footarr);
        var staid = e.currentTarget.dataset.aid; //插入的dayid
        var dayid = e.currentTarget.dataset.did; //插入的staid
        console.log(staid);
        console.log(dayid);
        var l_stat = footarr[dayid]; //插入内容的该插入站
        console.log(l_stat);
        console.log(l_stat.staarr);
        console.log(l_stat.staarr[staid]);
        // var l_srplen = l_sta.striparr.length;
        // console.log(l_srplen); //这一站有几项
        l_stat.staarr[staid].listshow = false;
        var the_srp = footarr[dayid].staarr[staid].striparr;
        footarr[dayid].staarr[staid].listshow = false;
        footarr[dayid].staarr[staid].spreadsta = 0;
        var thesrp_l = the_srp.length;
        footarr[dayid].staarr[staid].cutadd = 0;
        the_srp.push(
          {
            imgarr: picsarr,
            titlebox: true,
            isvideo: 2,
            srpid: thesrp_l,
            newadd: true,
            cutsta:true, //标记为新插入的内容
          }
        ); //在数组中加数据项
        console.log(footarr);
        that.setData({
          footarr: footarr,
          listcuthidden: false,
          vedshow: true
        })
        wx.setStorageSync('footarr', footarr);
        for (j = 0; j < picsarr.length; j++) {
          qiniuUploader.upload(picsarr[j], (res) => {
            var keys = res.key;
            console.log(res.key);
            upinfor.push(res.key);
            that.setData({
              upinfor: upinfor
            })
            // console.log(that.data.upinfor)
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        }
      }
    })
  },
  addcutved: function (e) { //插入---视频
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      // camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask: true,
        })
        that.setData({
          listhidden: false,
          firstadd: false,
          thenadd: false,
          vedshow: true,
        })
        console.log(res);
        var vedsrc = res.tempFilePath;
        initQiniu1();
        qiniuUploader.upload(vedsrc, (res) => {
          console.log(res)
          var footarr = that.data.footarr;
          console.log(footarr);
          var staid = e.currentTarget.dataset.aid; //插入的dayid
          var dayid = e.currentTarget.dataset.did; //插入的staid
          console.log(staid);
          console.log(dayid);
          var l_stat = footarr[dayid]; //插入内容的该插入站
          console.log(l_stat);
          console.log(l_stat.staarr);
          console.log(l_stat.staarr[staid]);
          l_stat.staarr[staid].listshow = false;
          var l_srplen = footarr[dayid].staarr[staid].striparr.length;
          console.log(l_srplen); //这一站有几项
          var the_srp = footarr[dayid].staarr[staid].striparr;
          footarr[dayid].staarr[staid].listshow = false;
          footarr[dayid].staarr[staid].cutadd = 0;
          the_srp.push(
            {
              vedsrc: vedsrc,
              isvideo: 1,
              titlebox: true,
              srpid: l_srplen,
              cutsta: true,
            }
          ); //在数组中加数据项
          console.log(footarr);
          that.setData({
            footarr: footarr,
            video_size: res.fsize,
            hash: res.hash,
            video_name: res.key,
            persistentId: res.persistentId,
            listshow: true
          })
          wx.setStorageSync('footarr', footarr);
          wx.hideLoading();
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });

      }
    })
  },
  addcutcel: function (e) { //插入 选择图片还是视频list ---- 取消
    var footarr = this.data.footarr;
    console.log(footarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    var the_srp = footarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = footarr[did].staarr.length;
    footarr[did].staarr[aid].listshow = false;
    this.setData({
      footarr: footarr,
      vedshow: true
    })
  },
  addved: function () { //上传视频
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      // camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask: true,
        })
        that.setData({
          listhidden: false,
          firstadd: false,
          thenadd: false,
          vedshow: true,
        })
        console.log(res);
        var vedsrc = res.tempFilePath;
        initQiniu1();
        qiniuUploader.upload(vedsrc, (res) => {
          console.log(res)
          var footarr = that.data.footarr;
          var daylen = footarr.length; //有几天
          var l_stalen = footarr[daylen - 1].staarr.length; //最后一天有几站
          var l_sta = footarr[daylen - 1].staarr[l_stalen - 1]; //最后一站的内容
          console.log(l_sta);
          var l_srplen = l_sta.striparr.length;
          console.log(l_srplen); //最后一站有几项
          l_sta.striparr.push(
            {
              vedsrc: vedsrc,
              isvideo: 1,
              titlebox: true,
              srpid: l_srplen
            }
          ); //在数组中加数据项
          console.log(footarr);
          that.setData({
            footarr: footarr,
            video_size: res.fsize,
            hash: res.hash,
            video_name: res.key,
            persistentId: res.persistentId,
          })
          wx.setStorageSync('footarr', footarr);
          wx.hideLoading();
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });

      }
    })
  },
  inptitle: function (e) { //输入标题，第一次提交标题和主题
    console.log(e);
    var that = this;
    // console.log(e.timeStamp);
    // var stamp = wx.getStorageSync('timestamp');
    // if (stamp != ""){ //如果存在
    //   console.log(stamp);
    //   console.log('请求一次接口');
    // }else{ //如果不存在
    //   wx.setStorageSync('timestamp', e.timeStamp);
    //   console.log('不存在')
    // }

    // this.queryMultipleNodes();
    var title = this.data.pagetitle;
    var coverid = this.data.coverid;
    var user_id = wx.getStorageSync('user_id');

    var tem = wx.getStorageSync('temid');
    console.log(tem);
    if (tem != "") { //已经获取过footid 修改
      console.log('3333');
    } else {
      console.log('请求接口')
      // wx.request({
      //   url: "https://youyue.huiur.com/flayerfoottopcache", //提交tem、title
      //   method: "POST",
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   data: {
      //     user_id: user_id,
      //     title: title,
      //     topimg_id: 0,
      //   },
      //   success: function (res) {
      //     console.log(res);

      //     var temid = res.data.data.temfoot_id;
      //     wx.setStorageSync('temid', temid);
      //     that.setData({
      //       footid: temid
      //     })
      //   }
      // })
    }

  },
  // queryMultipleNodes: function () { //节点DOM  【【不能删！！！！】】
  //   var query = wx.createSelectorQuery()
  //   query.select('#dayint1').boundingClientRect()
  //   query.selectViewport().scrollOffset()
  //   query.exec(function (res) {
  //     console.log(res);
  //     res[0].top       // #the-id节点的上边界坐标
  //     res[1].scrollTop // 显示区域的竖直滚动位置
  //     wx.pageScrollTo({
  //       scrollTop: res[0].top,
  //     })
  //   })

  // },
  stainput: function (e) { //视频或图片标题输入后 占位符消失
    if (e.detail.value == "") {
      this.setData({
        statithid: true,
        pagetitle: ''
        // 喜欢并去贯彻，就是意义，一场我的旅行，在这里记录下来！
      })
    } else {
      this.setData({
        statithid: false,
        pagetitle: e.detail.value,
      })
    }
  },
  formsub: function (e) { //图片或视频 标题确认
    console.log(e);
    var that = this;
    var title = e.detail.value.title;
    var fid = this.data.fid;
    var upinfor = this.data.upinfor;
    var picarr = this.data.picarr;
    console.log(upinfor);
    // var footarr = wx.getStorageSync('footarr');
    var footarr = this.data.footarr;
    console.log(footarr);
    // var daylen = footarr.length; //有几天
    // console.log(daylen);
    // var l_day = footarr[daylen - 1].staarr; //最后一天
    // console.log(l_day);
    // var l_stalen = footarr[daylen - 1].staarr.length;
    // var l_sta = l_day[l_stalen - 1];
    // console.log(l_sta);
    // var position = l_sta.position;
    // var l_srplen = l_sta.striparr.length;
    // console.log(l_srplen);
    // var l_srp = l_sta.striparr[l_srplen-1];
    // console.log(l_srp);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp; //点击确定的当前3个id
    console.log(srpid);
    var the_srp = footarr[dayid].staarr[staid].striparr[srpid];
    console.log(footarr[dayid]);
    console.log(footarr[dayid].staarr[staid]);
    console.log(the_srp);
    var position = footarr[dayid].staarr[staid].position;
    var fixsrp = wx.getStorageSync('fixsrp');
    if (fixsrp) { //修改后的保存
      console.log('修改保存')
      // console.log(fixsrp);
      // fixsrp.title = title;
      var dayid = e.currentTarget.dataset.day;
      var staid = e.currentTarget.dataset.sta;
      var srpid = e.currentTarget.dataset.srp;
      console.log(footarr);
      console.log(dayid);
      console.log(staid);
      console.log(srpid);

      var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
      thissrp.title = title;
      thissrp.keep = 1;

      var media_id = thissrp.media_id;
      this.setData({
        footarr: footarr,
      })
      wx.setStorageSync('footarr', footarr);
      wx.removeStorageSync('fixsrp');
      wx.request({
        url: "https://youyue.huiur.com/updatesigletitle", //修改视频或图片标题
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          title: title,
          media_id: media_id
        },
        success: function (res) {
          console.log(res);
        }
      })
    } else {
      var publish_url = 'https://youyue.huiur.com/publishedmedia';
      var position_url = 'https://youyue.huiur.com/flayerfootsposition'
      if (the_srp.cutsta == true){ //判断为插入
        var next_day = footarr[dayid + 1];
        var next_sta = footarr[dayid + 1].staarr[0];
        if (next_sta.striparr.length == 0){ //未添加站的位置或只添加了站的位置
          //正常顺序
          publish_url = 'https://youyue.huiur.com/publishfmedia';
          position_url = 'https://youyue.huiur.com/flayerfootspositionf';
        }else{
          var next_srp = footarr[dayid + 1].staarr[0].striparr[0];
          if (next_srp.media_id) { //添加图片 已经上传
            //插入
            
          }else{ //添加图片 没上传
            //正常顺序
            publish_url = 'https://youyue.huiur.com/publishfmedia';
            position_url = 'https://youyue.huiur.com/flayerfootspositionf';
          }
        }
        
      }else{ //正常顺序添加
        publish_url = 'https://youyue.huiur.com/publishfmedia';
        position_url = 'https://youyue.huiur.com/flayerfootspositionf';
      }
      if (the_srp.isvideo == 1) { //【视频】 判断是视频还是图片，使用不同的上传接口参数
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        wx.request({
          url: publish_url, //上传视频
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            title: title,
            foot_id: fid,
            c_day: dayid + 1,
            c_station: staid + 1,
            c_position: srpid + 1,
            position: position,
            isvideo: 1,
            video_size: that.data.video_size,
            hash: that.data.hash,
            video_name: that.data.video_name,
            persistentId: that.data.persistentId,
            img_name: ''
          },
          success: function (res) {
            console.log('上传视频传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
            console.log(res);
            var media_id = res.data.data.media_id;
            the_srp.srpid = srpid;
            the_srp.c_pos = srpid + 1;
            var media_id = res.data.data.media_id;
            the_srp.media_id = media_id;
            the_srp.position = position;
            the_srp.title = title;
            the_srp.keep = 1; //keep是干啥用的？
            the_srp.value = title;
            console.log(footarr);
            wx.setStorageSync('footarr', footarr);
            if (footarr[dayid].insert == true) { //插入 情况 insert判断显示插入还是完成
              footarr[dayid].staarr[staid].cutadd = 1
            } else {
              footarr[dayid].staarr[staid].cutadd = 0
            }
            that.setData({
              surebtn1: false,
              fixbtn1: true,
              thenadd: true,
              firstadd: false,
              footarr: footarr,
            })
            wx.setStorageSync('footarr', footarr);
            wx.hideLoading();
          }
        });
        var dayid = e.currentTarget.dataset.day;
        var staid = e.currentTarget.dataset.sta;
        var srpid = e.currentTarget.dataset.srp;
        console.log(dayid);
        console.log(staid);
        console.log(srpid);
        var t_sta = footarr[dayid].staarr[staid];
        var position = t_sta.position;
        console.log(position);
        if (srpid == 0) { //每站的第一个 点击确定按钮 请求positioncache接口
          console.log('请求position接口')
          wx.request({
            url: position_url, //上传图片或视频
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              foot_id: fid,
              c_day: dayid + 1,
              c_station: staid + 1,
              position: position,
            },
            success: function (res) {
              console.log(res);
            }
          });
        }
      } else { //图片
        wx.request({
          url: publish_url, //上传图片
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            title: title,
            foot_id: fid,
            c_day: dayid + 1,
            c_station: staid + 1,
            c_position: srpid + 1,
            position: position,
            isvideo: 2,
            video_size: '',
            hash: '',
            video_name: '',
            persistentId: '',
            img_name: upinfor
          },
          success: function (res) {
            console.log('上传图片传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
            console.log(res);
            var media_id = res.data.data.media_id;
            the_srp.srpid = srpid;
            the_srp.c_pos = srpid + 1;
            the_srp.media_id = media_id;
            the_srp.position = position;
            the_srp.title = title;
            the_srp.img_name = upinfor;
            the_srp.keep = 1; //keep是干啥用的？
            console.log(footarr);
            // wx.setStorageSync('footarr', footarr);
            if (footarr[dayid].insert == true) { //插入 情况
              footarr[dayid].staarr[staid].cutadd = 1
            } else {
              footarr[dayid].staarr[staid].cutadd = 0
            }
            that.setData({
              surebtn1: false,
              fixbtn1: true,
              thenadd: true,
              firstadd: false,
              footarr: footarr,
            })
            wx.setStorageSync('footarr', footarr);
            wx.hideLoading();

          }
        });
        var dayid = e.currentTarget.dataset.day;
        var staid = e.currentTarget.dataset.sta;
        var srpid = e.currentTarget.dataset.srp;
        console.log(dayid);
        console.log(staid);
        console.log(srpid);
        var t_sta = footarr[dayid].staarr[staid];
        var position = t_sta.position;
        console.log(position);
        if (srpid == 0) { //每站的第一个 点击确定按钮 请求positioncache接口
          console.log('请求position接口');
          wx.request({
            url: position_url, //上传图片或视频
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              foot_id: fid,
              c_day: dayid + 1,
              c_station: staid + 1,
              position: position,
            },
            success: function (res) {
              var p_id = res.data.data.p_id;
              t_sta.p_id = p_id;
              console.log(footarr);
              that.setData({
                footarr:footarr
              })
              
            }
          });
        }

      }
      if (t_sta.cutstait == 1) { //插入的该站保存
        var stalen = footarr[dayid].staarr.length;
        var i = 0;
        for (i = 0; i < stalen; i++) {
          footarr[dayid].staarr[i].cutadd = 1;
        }
        that.setData({
          footarr: footarr,
        })
      }
    }
  },
  deleteved: function (e) { //删除视频
    console.log(e);
    var that = this;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp;
    var footarr = this.data.footarr;
    var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
    console.log(thissrp);
    thissrp.deltop = true;
    this.setData({
      footarr:footarr,
      vedshow:false,
    })
  },
  deleteimg: function (e) { //点击图片上的删除按钮，弹出确认框
    //传入data 删除的图片的索引
    console.log(e);
    var that = this;
    var fid = this.data.fid;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp;
    var footarr = this.data.footarr;
    var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
    var imgidx = e.currentTarget.dataset.imgidx;
    this.setData({
      delimgidx: imgidx
    })
    console.log(imgidx);
    console.log(thissrp);
    thissrp.deltop = true;
    console.log(footarr);
    this.setData({
      footarr: footarr
    })

  }, 
  del_cancel:function(e){ //取消删除
    console.log(e);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp;
    var footarr = this.data.footarr;
    var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
    thissrp.deltop = false;
    console.log(footarr);
    this.setData({
      footarr: footarr,
      vedshow:true,
    })
  },
  del_sure:function(e){ // 确定删除
    console.log(e);
    var that = this;
    var fid = this.data.fid;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp;
    var footarr = this.data.footarr;
    var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
    thissrp.deltop = false;
    var media_id = thissrp.media_id;
    var isvideo = e.currentTarget.dataset.isvideo;
    
    if(isvideo == 1){ //删除的是视频
      var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
      footarr[dayid].staarr[staid].striparr.splice(srpid, 1);
      wx.removeStorageSync('fixsrp');
      console.log(footarr);
      if (footarr[dayid].staarr[staid].striparr.length == 0) { //上一级 站的数组为空 需要删除天   
        if (dayid == 0 && footarr.length == 1) { //第一天,且只有一天
          console.log('是第一天')
          if (footarr[0].staarr.length == 1) { //第一天只剩一站，不能删除仅剩的第一站信息
            var obj = footarr[dayid].staarr[staid];
            console.log(obj)
            delete obj.linkhid;
            delete obj.position;

            console.log(footarr);
            that.setData({
              firstadd: true,
              thenadd: false,
              addexit: false, //判断是否填写了站的位置
            })
          } else { //第一天剩下超过一站
            footarr[dayid].staarr.splice(staid, 1); //删除该站
          }

        } else { // 不是第一天或还有其他天 需要把整天都删除
          footarr[dayid].staarr.splice(staid, 1);//删除该站
          if (footarr[dayid].staarr.length == 0) { //该天 站为空
            footarr.splice(dayid, 1); //删除该天
          }
          console.log(footarr);
        }

      }
      console.log('修改ved索引')
      var capnum = that.data.capnum;
      var _daylen = footarr.length;
      console.log(_daylen);
      var d = 0;
      for (d = 0; d < _daylen; d++) { //遍历day
        footarr[d].dayid = d;
        footarr[d].capnum = capnum[d];
        var _stalen = footarr[d].staarr.length;
        console.log(_stalen);
        var s = 0;
        for (s = 0; s < _stalen; s++) { //遍历station
          var _srplen = footarr[d].staarr[s].striparr.length;
          footarr[d].staarr[s].staid = s;
          footarr[d].staarr[s].capnum = capnum[s]
          var p = 0;
          for (p = 0; p < _srplen; p++) {
            var srp = footarr[d].staarr[s].striparr[p];
            srp.c_pos = p + 1;
            console.log(srp);
          }
        }
      }
      console.log(footarr);
      this.setData({
        footarr: footarr,
        vedshow:true
      })
    // wx.setStorageSync('footarr', footarr);
    console.log('请求删除视频接口')
    var vedtype = 1;
    if (thissrp.newadd == true) {
      vedtype = 2;
    }else{
      vedtype = 1;
    }
    wx.request({
      url: "https://youyue.huiur.com/delpublishedmedia", //删除视频
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        media_id: media_id,
        isvideo: 1,
        img_name: '',
        foot_id: fid,
        c_day: dayid + 1,
        station: staid + 1,
        c_position: srpid + 1,
        type: vedtype,
      },
      success: function (res) {
        console.log('删除视频传值');
        console.log(dayid + 1);
        console.log(staid + 1);
        console.log(srpid + 1);
        console.log(res);
      }
    })

    } else { //删除的是图片
      var thissrp = footarr[dayid].staarr[staid].striparr[srpid];
      var imgidx = this.data.delimgidx;
      console.log(imgidx);
      console.log(thissrp);
      thissrp.imgarr.splice(imgidx, 1);
      thissrp.deltop = false;
      var media_id = thissrp.media_id;
      var temid = wx.getStorageSync('temid');
      if (thissrp.imgarr === undefined || thissrp.imgarr.length == 0) { //图片都删除 删除本个内容，如果站内没有内容 就都删除
        // array empty or does not exist
        console.log('单项的图片全删除了');
        footarr[dayid].staarr[staid].striparr.splice(srpid, 1);
        wx.removeStorageSync('fixsrp');//全删除之后没有点击修改 要清除修改缓存
        console.log(footarr);
        if (footarr[dayid].staarr[staid].striparr.length == 0) { //上一级 站的数组为空 需要删除天   
          if (dayid == 0 && footarr.length == 1) { //第一天,且只有一天
            console.log('是第一天')
            if (footarr[0].staarr.length == 1) { //第一天只剩一站，不能删除仅剩的第一站信息
              var obj = footarr[dayid].staarr[staid];
              console.log(obj)
              delete obj.linkhid;
              delete obj.position;
              obj.disabled = false;
              console.log(footarr);

              that.setData({
                firstadd: true,
                thenadd: false,
                addexit: false, //判断是否填写了站
              })
            } else { //第一天剩下超过一站
              footarr[dayid].staarr.splice(staid, 1); //删除该站
            }


          } else { // 不是第一天或还有其他天 需要把整天都删除
            footarr[dayid].staarr.splice(staid, 1);//删除该站
            if (footarr[dayid].staarr.length == 0) { //该天 站为空
              footarr.splice(dayid, 1); //删除该天
            }
            console.log(footarr);
          }

        }
      }
      //修改索引 
      console.log('修改索引')
      var capnum = that.data.capnum;
      var _daylen = footarr.length;
      console.log(_daylen);
      var d = 0;
      for (d = 0; d < _daylen; d++) { //遍历day
        footarr[d].dayid = d;
        footarr[d].capnum = capnum[d];
        var _stalen = footarr[d].staarr.length;
        console.log(_stalen);
        var s = 0;
        for (s = 0; s < _stalen; s++) { //遍历station
          var _srplen = footarr[d].staarr[s].striparr.length;
          footarr[d].staarr[s].staid = s;
          footarr[d].staarr[s].capnum = capnum[s]
          var p = 0;
          for (p = 0; p < _srplen; p++) {
            var srp = footarr[d].staarr[s].striparr[p];
            console.log('修改索引')
            srp.srpid = p;
            srp.c_pos = p + 1;
            console.log(srp);
          }
        }
      }
      console.log(footarr);
      this.setData({
        footarr: footarr
      })
      // wx.setStorageSync('footarr', footarr);
      console.log('请求删除图片接口')
      if (thissrp.newadd == true){ //删除新增的
        wx.request({
          url: "https://youyue.huiur.com/delpublishedmedia", //删除图片
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            media_id: media_id,
            isvideo: 2,
            img_name: thissrp.imgarr,
            foot_id: fid,
            c_day: dayid + 1,
            station: staid + 1,
            c_position: srpid + 1,
            type: 2,
          },
          success: function (res) {
            console.log(res);
            console.log('删除图片传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
          }
        })
      }else{ //删除已有的
        wx.request({
          url: "https://youyue.huiur.com/delpublishedmedia", //删除图片
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            media_id: media_id,
            isvideo: 2,
            img_name: thissrp.imgarr,
            foot_id: fid,
            c_day: dayid + 1,
            station: staid + 1,
            c_position: srpid + 1,
            type:1,
          },
          success: function (res) {
            console.log(res);
            console.log('删除图片传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
          }
        })
      }
      
    }
    
  },
  recalltap: function () { //撤回 删除最后一个空数组
    var that = this;
    var footarr = this.data.footarr;
    console.log(footarr);
    var day_len = footarr.length;
    console.log(day_len);
    var day_l = footarr[day_len - 1];
    console.log(day_l);
    var sta_len = footarr[day_len - 1].staarr.length;
    console.log(sta_len);
    var sta_l = day_l.staarr[sta_len - 1];
    console.log(sta_l);
    if (sta_l.cutadd != undefined) { //新增为天
      footarr.pop();
    } else { //新增为站      
      day_l.staarr.pop();
    }
    that.setData({
      footarr: footarr,
      firstadd: false,
      thenadd: true
    })
    wx.setStorageSync('footarr', footarr);
  },
  compeletetap: function () { //完成制作
    var temid = wx.getStorageSync('temid');
    var that = this;
    var footarr = this.data.footarr;
    console.log(footarr);

    if (footarr[0].staarr[0].striparr.length == 0) { //'srpid不存在' 用户还未添加内容，第一站为空或者删除到第一站为空
      console.log('srpid不存在')
      wx.showModal({
        title: '提示',
        content: '您还未添加足迹，请继续编辑哦',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      var srpid = footarr[0].staarr[0].striparr[0].srpid;
      console.log(srpid);
      var fid = this.data.fid;
      // if (srpid == 0) { //第一个有视频或图片，可以提交
        wx.request({
          url: "https://youyue.huiur.com/updatedoneflayerfoot",
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            foot_id: fid,
          },
          success: function (res) {
            console.log(res);
            wx.removeStorageSync('temid');
            wx.removeStorageSync('footarr');
            wx.removeStorageSync('fixsrp');
            wx.removeStorageSync('headarr');
            wx.removeStorageSync('date1');
            var datas = res.data.data;
            // var score = datas.score;
            // var grade = datas.grade;
            // var name = datas.name;
            wx.redirectTo({
              url: '../footprint/footprint?done=' + 1,
            })
          }
        })

        // 完成制作，提交所有站的位置修改
        var posarr = this.data.positionarr;
        var fid = this.data.fid;
        for (var p in posarr) {
          wx.request({
            url: "https://youyue.huiur.com/updateflayerfoots", //提交站的位置修改
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              foot_id: fid,
              c_day: posarr[p][0]['c_day'],
              c_station: posarr[p][0]['c_station'],
              position: posarr[p][0]['position']
            },
            success: function (res) {
              console.log(res);

            }
          })
        }
        
      // } else {
      //   wx.showModal({
      //     title: '提示',
      //     content: '您还未添加足迹，请继续编辑哦',
      //     success: function (res) {
      //       if (res.confirm) {
      //         console.log('用户点击确定')
      //       } else if (res.cancel) {
      //         console.log('用户点击取消')
      //       }
      //     }
      //   })
      // }
    }

  },
  
  continueyes: function () { //选择继续编辑
    var footarr = wx.getStorageSync('footarr');
    wx.removeStorageSync('fixsrp');
    console.log(footarr);
    var daylen = footarr.length; //有几天
    console.log(daylen);
    var l_day = footarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = footarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    var headarr = wx.getStorageSync('headarr');
    console.log(headarr);
    var coverarr = this.data.coverarr;
    this.setData({
      titlevalue: headarr.title,
      int: headarr.topimg_id,
      coverimg: coverarr[headarr.topimg_id - 1]
    })
    if (l_sta.striparr.length == 0) { //已经添加了内容
      this.setData({
        footarr: footarr,
        contiques: false,
        addexit: false,
        thenadd: false,
        firstadd: true,
        areashow: true,
      })
    } else {
      this.setData({
        footarr: footarr,
        contiques: false,
        addexit: true,
        thenadd: true,
        firstadd: false,
        areashow: true
      })
    }
    if (l_sta.position) {
      this.setData({
        addexit: true
      })
    }
  },
  continueno: function () { //放弃继续编辑
    wx.removeStorageSync('temid');
    wx.removeStorageSync('footarr');
    wx.removeStorageSync('fixsrp');
    wx.removeStorageSync('headarr');
    this.setData({
      contiques: false,
      areashow: true
    })
  },
  cutaddtap: function (e) { //点击插入
    console.log(e);
    var e_dayid = e.currentTarget.dataset.bid;
    var footarr = this.data.footarr;
    console.log(footarr);
    var thisday = footarr[e_dayid];
    thisday.insert = true;
    console.log(thisday);
    var the_staarr = thisday.staarr;
    console.log(the_staarr);
    var i = 0;
    for (i = 0; i < the_staarr.length; i++) {
      the_staarr[i].cutadd = 1;
    }
    console.log(footarr);
    this.setData({
      footarr: footarr
    })
    wx.setStorageSync('footarr', footarr);
  },
  cutadddone: function (e) { //插入 -- 点击完成 
    console.log(e);
    var e_dayid = e.currentTarget.dataset.bid;
    var footarr = this.data.footarr;
    console.log(footarr);
    var thisday = footarr[e_dayid];
    thisday.insert = false;
    console.log(thisday);
    var the_staarr = thisday.staarr;
    console.log(the_staarr);
    var i = 0;
    for (i = 0; i < the_staarr.length; i++) {
      the_staarr[i].cutadd = 0;
    }
    console.log(footarr);
    this.setData({
      footarr: footarr
    })
    wx.setStorageSync('footarr', footarr);
  },
  cutaddfoot: function (e) { //插入继续 添加足迹 显示spread
    var this_staid = e.currentTarget.dataset.aid;
    var this_dayid = e.currentTarget.dataset.did;
    var footarr = this.data.footarr;
    footarr[this_dayid].staarr[this_staid].spreadsta = 1;
    this.setData({
      footarr: footarr,
      cut_dayid: this_dayid,
      cut_staid: this_staid
    })
    wx.setStorageSync('footarr', footarr);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})