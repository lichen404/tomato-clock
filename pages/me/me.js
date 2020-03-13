// pages/me/me.js
const {
  http
} = require('../../lib/http.js')

Page({
  data: {
    tab: "tomato",
    todoFinishedList: {},
    tomatoList: {}
  },
  onShow: function () {
    this.fetchTomatoes()
    this.fetchTodoList()

  },
  onHide() {


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
  fetchTodoList() {
    http.get('/todos', {
      is_group: "yes"
    }).then(response => {
      let dataList = response.data.resources
      let result = {}
      //筛选已完成的任务
      for (let item in dataList) {
        dataList[item] = dataList[item].filter(i => i.completed === true)
      }
      //去掉空数组
      for (let i in dataList) {
        if (dataList[i].length >= 1) {
          result[i] = dataList[i]
        }
      }

      this.setData({
        todoFinishedList: result
      })

    })
  },
  changeTab(event) {
    let name = event.currentTarget.dataset.name
    this.setData({
      tab: name
    })
  },
  computeSecond() {
    console.log(123)
  }
})