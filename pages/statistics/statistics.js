// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';
const {
  http
} = require('../../lib/http.js')

let chart = null;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true

    },
    ecComponent: '',
    tomatoList: {},
    tomatoNumber: null,
    time: null,
    tomatoThisWeekNumber: null,
    nameList: [],
    valueList: []
  },
  initChart() {
    this.ecComponent.init((canvas, width, height) => {
      let chart = echarts.init(canvas, null, {
        width: width,
        height: height,

      });
      this.setOption(chart);
      canvas.setChart(chart);
      return chart;
    })

  },
  renderChart() {
    http.get('/tomatoes', {

    }).then((response) => {
      let rawMonthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0]))]
      let monthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0].substring(5, 10).replace('-', '')))]
      let result = {}
      let valueList = []
      let nameList = []
      let dates = getDates()
      for (let i in rawMonthList) {
        result[monthList[i]] = response.data.resources.filter(item => item.started_at.indexOf(rawMonthList[i]) >= 0 && !item.aborted)
      }

      for (let date of dates) {

        let month = date.split('/')[1]
        let day = date.split('/')[2]
        if (month.length === 1) {
          month = '0' + month
        }
        if (day.length === 1) {
          day = '0' + day
        }
        let key = month + day
        if (result[key]) {
          valueList.push(result[key].length)
          nameList.push(date.split('/')[1] + '-' + date.split('/')[2])
          this.setData({
            valueList
          })
          this.setData({
            nameList
          })
        }

      }
      this.setData({
        tomatoThisWeekNumber: valueList.reduce((sum, value) => sum + value, 0)
      })

      this.initChart()

    })
  },
  setOption(chart) {
    let bar = {
      grid: {
        x: 15,
        y: 40,
        x2: 20,
        y2: 30,
        borderWidth: 1
      },

      xAxis: {

        type: 'category',
        data: this.data.nameList,
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#F5F4F9'],
          }
        },

        axisLine: { //坐标线

          lineStyle: {
            type: 'solid',
            color: '#F5F4F9', //轴线的颜色
            width: '1', //坐标线的宽度
          }
        },
        axisTick: { //刻度

          show: false //不显示刻度线
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#000', //坐标值的具体的颜色
            fontSize: 8,
          }
        },

      },
      yAxis: {
        splitLine: {
          show: false
        },
        axisLine: { //线
          show: false
        },
        axisTick: { //刻度
          show: false
        },
        axisLabel: {
          show: false
        },
      },
      series: [{
        type: "bar",
        data: this.data.valueList,


        itemStyle: {
          normal: {
            barBorderRadius: [20, 10, 0, 0],
            color: '#FD6B71', //设置柱子颜色
            label: {
              show: true, //柱子上显示值
              position: 'top', //值在柱子上方显示
              textStyle: {
                color: '#FD6B71', //值得颜色

              }
            }
          }
        },
        barWidth: 10 //设置柱子宽度，单位为px
      }],
    }
    chart.setOption(bar);
  },
  initData() {

    http.get('/tomatoes', {

    }).then(response => {
      let rawMonthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0]))]
      let monthList = [...new Set(response.data.resources.map(item => item.started_at.split('T')[0].substring(5, 10).replace('-', '')))]
      let result = {}

      for (let i in rawMonthList) {
        result[monthList[i]] = response.data.resources.filter(item => item.started_at.indexOf(rawMonthList[i]) >= 0 && !item.aborted)
      }

      this.setData({
        tomatoList: result
      })
      if (result[this.today()]) {
        this.setData({
          tomatoNumber: result[this.today()].length
        })
        this.setData({
          time: this.computeTime(result[this.today()])
        })
      }



    });


  },

  today() {
    return (new Date().toISOString().split('T')[0].substring(5, 10).replace('-', ''))
  },
  day(string) {
    return (new Date(string).toISOString().split('T')[0].substring(5, 10).replace('-', ''))
  },
  computeTime(todayList) {
    const timeList = todayList.map(item => parseInt((new Date(item.ended_at).getTime() - new Date(item.created_at).getTime()) / (1000 * 60)) + 1)
    //有误差，parseInt后被截断，所以+1
    return timeList.reduce((x, y) => x + y)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ecComponent = this.selectComponent('#mychart-bar');
    this.renderChart()
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

    this.initData()





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


function getDates() {
  var new_Date = new Date()
  var timesStamp = new_Date.getTime();
  var currenDay = new_Date.getDay();
  var dates = [];
  for (var i = 0; i < 7; i++) {
    dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, ''));
  }
  return dates
}