// pages/road/road.js

let plugin = requirePlugin("myPlugin")

let routeInfo = {
    startLat: 39.90469,    //起点纬度 选填
    startLng: 116.40717,    //起点经度 选填
    startName: "我的位置",   // 起点名称 选填
    endLat: 39.94055,    // 终点纬度必传
    endLng :116.43207,  //终点经度 必传
    endName:"来福士购物中心",  //终点名称 必传
    mode:"walk" //算路方式 选填
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameData:0,
    routeInfo: routeInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log(res.longitude) 
    var that = this;
    var routeInfo = {
      // startLat: 39.90469,    //起点纬度 选填
      // startLng: 116.40717,    //起点经度 选填
      startName: "我的位置",   // 起点名称 选填
      endLat: res.latitude,    // 终点纬度必传
      endLng :res.longitude,  //终点经度 必传
      endName:res.title,  //终点名称 必传
      mode:"walk" //算路方式 选填
  }
  that.setData({
    routeInfo:routeInfo
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})