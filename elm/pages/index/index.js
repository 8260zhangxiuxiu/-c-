//index.js
//获取应用实例

var postData = require('../../data-api/api.js');
const app = getApp();
Page({
  data: {
    listData: [],
    postData: [],
    addData: [],
    goodsData: [],
    clickdata: [0],
    nav: [{
        title: '商品'
      },
      {
        title: '评价'
      },
      {
        title: '商家'
      }
    ],
    images: 0,
    pay: 0,
    money: 0,
    number: '1',
    activeIndex: 0,
    navactive: '0',
    value: '0',
    scrllTop: 0,
    scrollHeight: 650,
    maskFlag: true,
    oilchooseFlag: false
  },
  //事件处理函数
  bindViewTap: function() {


  },
  onLoad: function(options) {
    var that = this;
    var listData = postData;
    that.setData({
      listData: postData.postList,
      assessdata: postData.assess,
      assessimg: postData.assessimg,
      comment: postData.comment,
      notice: postData.notice
    });
    that.setData({
      postData: postData.postList[0],
    });
    wx: wx.getSavedFileInfo({
      filePath: '',
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  getpostid: function(event) {
    let that = this;
    var postId = event.currentTarget.dataset.postid;
    that.data.value = postId;
    that.setData({
      postData: postData.postList[postId],
      activeIndex: postId,
      clickdata: postId
    });
  },
  //
  getupscrollower: function(event) {
    var that = this;
    that.setData({
      addData: postData.postList,
    })
  },
  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  //跳转
  jumpup(event) {
    let that = this;
    let postid = event.currentTarget.dataset.index;
    let value = that.data.value;
    wx.navigateTo({
      url: '../details/details?push=' + postid + "&value=" + value,
    });
  },
//选项卡
  bindchange: function(e) {
    const that = this;
    let index = e.detail.current;
    that.setData({
      navactive: index
    })
  },
  checkCurrent: function(e) {
    const that = this;
    if (that.data.navactive === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        navactive: e.target.dataset.current,
      })
    }
  },
  //购物车
  addlistdata(event) {
    let that = this;
    var index = event.currentTarget.dataset.index;
    let difference = true;
    let clickdata = that.data.clickdata;
    let arrdata = postData.postList[clickdata].list[index];
    let goodslist = that.data.goodsData;
    if (that.data.goodsData.length < 0) {
      that.setData({
        goodsData: [arrdata, ...that.data.goodsData]
      });
    } else {
      that.data.goodsData.map((item, index) => {
        if (arrdata.id === item.id) {
          goodslist[index].number++;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
          that.setData({
            goodsData: goodslist
          });
          difference = false;
        }
      })
      if (difference) {
        that.setData({
          goodsData: [arrdata, ...that.data.goodsData]
        });
      }
    }
    that.money();
    that.showup();
  },
  addnum(event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    let num = that.data.goodsData;
    num[index].number++;
    that.setData({
      goodsData: num,
    });
    that.money();
  },
  deladdlist(event) {
    let that = this;
    let num = that.data.goodsData;
    let index = event.currentTarget.dataset.index;
    let goodsData = that.data.goodsData;
    if (num[index].number > 1) {
      num[index].number--;
      that.setData({
        goodsData: num,
      });
      that.money();
    } else {
      if (num[index].number == 1) {
        goodsData.splice(index, 1);
        that.setData({
          goodsData: goodsData,
        });
        that.total();
        that.showup();
        that.remove();
        that.money();
      }
    }
  },
  removeup() {
    let that = this;
    let goodsData = that.data.goodsData;
    that.setData({
      goodsData: []
    });
    that.total();
    that.showup();
    that.money();
    that.remove();
  },
  showment() {
    let that = this;
    let goodsData = this.data.goodsData;
    let imgdata = this.data.imgdata;
    if (goodsData.length > 0) {
      that.showFlag();
    } else {
      that.setData({
        maskFlag: true,
        oilchooseFlag: false,
      })
    }
  },
  showup() {
    let that = this;
    let imgdata = this.data.imgdata;
    let goodsData = this.data.goodsData;
    if (goodsData.length > 0) {
      that.setData({
        images: 1
      });
    } else {
      that.setData({
        images: 0
      });
    }
  },
  showFlag: function() {
    let that = this;
    let maskFlag = this.data.maskFlag;
    if (maskFlag === true) {
      that.setData({
        maskFlag: false,
        oilchooseFlag: true
      });
    } else {
      that.setData({
        maskFlag: true,
        oilchooseFlag: false
      })
    }
  },
  remove() {
    let that = this;
    let goodsData = that.data.goodsData;
    if (goodsData.length === 0) {
      that.setData({
        maskFlag: true,
        oilchooseFlag: false,
      });
      that.showment();
    }
  },
  money() {
    let that = this;
    let allPrice = 0;
    that.data.goodsData.map((item, index) => {
      allPrice = item.number * item.rate + allPrice;
    })
    that.setData({
      money: allPrice
    });
    that.pay();
  },
  total() {
    let that = this;
    let money = that.data.money
    that.setData({
      money: ['0']
    })
  },
  pay() {
    let that = this;
    let num = that.data.money;
    if (num > 20) {
      that.setData({
        pay: 1
      });
    } else {
      that.setData({
        pay: 0
      })
    }
  },
});