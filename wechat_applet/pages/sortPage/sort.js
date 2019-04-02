var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5LYBZ-QC53D-NAA4G-HJN4A-V26MZ-OEB7H'//申请的开发者秘钥key
});

var app = getApp();

Page({
    data:{
        address: app.globalData.defaultCity

    }
    , onLoad:function(){
       
    },
  onShow: function () {
   
  },
  
   
    switchCity:function()
    {
        wx.navigateTo({
            url: '/libs/citySelector/switchcity/switchcity',
        });
    }
    






})