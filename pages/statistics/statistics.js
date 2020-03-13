// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';
const {
  http
} = require('../../lib/http.js')
Page({


  /**
   * 页面的初始数据
   */
  data: {
    ecLine: {
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        const chartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartLine);

        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白，体验不好，所有我先set。
        var xData = [1, 2, 3, 4, 5]; // x轴数据 自己写
        var option = getOption(xData);
        chartLine.setOption(option);
      }
    },
    tomatoList: {},
    tomatoNumber: null
  },
  fetchTomatoes() {
    http.get('/tomatoes', {

    }).then(response => {
      let rawMonthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0]))]
      let monthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0].substring(5, 10).replace('-', '')))]
      let result = {}
      for (let i in rawMonthList) {
        result[monthList[i]] = response.data.resources.filter(item => item.started_at.indexOf(rawMonthList[i]) >= 0)
      }
      this.setData({
        tomatoList: result
      })
    });

  },
  today() {
    return (new Date().toISOString().split('T')[0].substring(5, 10).replace('-', ''))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    console.log(this.today())
    console.log(this.data.tomatoList)

    this.setData({
      tomatoNumber: this.data.tomatoList[this.today()].length
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(this.data.tomatoList)
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

function getOption(xData, data_cur, data_his) {
  var option = {
    backgroundColor: "#f5f4f3",
    color: ["#37A2DA", "#f2960d", "#67E0E3", "#9FE6B8"],
    title: {
      text: '实时运行速度',
      textStyle: {
        fontWeight: '500',
        fontSize: 15,
        color: '#000'
      },
      x: 'center',
      y: '0'
    },
    legend: {
      data: ['今日', '昨日'],
      right: 10
    },
    grid: {
      top: '15%',
      left: '1%',
      right: '3%',
      bottom: '60rpx',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData || [],
      axisLabel: {
        interval: 11,
        formatter: function (value, index) {
          return value.substring(0, 2) * 1;
        },
        textStyle: {
          fontsize: '10px'
        }
      }
    },
    yAxis: {
      x: 'center',
      name: 'km/h',
      type: 'value',
      min: 0,
      max: 120
    },
    series: [{
      name: '今日',
      zIndex: 2,
      type: 'line',
      smooth: true,
      symbolSize: 0,
      data: data_cur || []
    }, {
      name: '昨日',
      zIndex: 1,
      type: 'line',
      smooth: true,
      symbolSize: 0,
      data: data_his || []
    }]
  };
  return option;
}