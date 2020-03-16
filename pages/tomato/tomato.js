// pages/tomato/tomato.js
const {
  http
} = require('../../lib/http.js');
Page({

  timer: null,
  data: {
    defaultSecond: 120,
    time: "",
    timerStatus: 'stop',
    confirmVisible: false,
    againButtonVisible: false,
    finishConfirmVisible: false,
    buttons: [{
      "text": "确定"
    }],
    tomato: {},
    taskId: undefined,
    taskInfo: {}
  },
  onLoad(options) {
    this.setData({
      taskId: options.data
    })

  },
  onShow: function () {
    this.startTimer()
    console.log(typeof (this.data.taskId))
    http.put(`/todos/${this.data.taskId}`).then(response => {
      this.setData({
        taskInfo: response.data.resource
      })
      http.post('/tomatoes', {
        extra: {
          taskInfo: response.data.resource.description
        }
      }).then(response => {
        this.setData({
          tomato: response.data.resource
        })
      })
    })

  },




  startTimer() {
    this.setData({
      timerStatus: 'start'
    })
    this.changeTime()
    this.timer = setInterval(() => {
      this.data.defaultSecond = this.data.defaultSecond - 1
      this.changeTime()
      if (this.data.defaultSecond <= 0) {
        this.setData({
          againButtonVisible: true
        })
        this.setData({
          finishConfirmVisible: true
        })


        return this.clearTimer()
      }
    }, 1000)
  },

  againTimer() {
    this.data.defaultSecond = 1500
    this.setData({
      againButtonVisible: false
    })
    this.startTimer()
  },
  clearTimer() {
    clearInterval(this.timer)
    this.timer = null
    this.setData({
      timerStatus: 'stop'
    })
    http.put(`/todos/${this.data.taskId}`, {
      completed: true
    }).then(response => {
      this.setData({
        taskInfo: response.data.resource
      })
    })
    http.put(`/tomatoes/${this.data.tomato.id}`, {
      ended_at: new Date()
    }).then(response => console.log(response))
  },

  changeTime() {
    let m = Math.floor(this.data.defaultSecond / 60)
    let s = Math.floor(this.data.defaultSecond % 60)
    if (s === 0) {
      s = "00"
    }
    if ((s + "").length === 1) {
      s = "0" + s
    }
    if ((m + "").length === 1) {
      m = "0" + m
    }
    this.setData({
      time: `${m}:${s}`
    })
  },
  confirmAbandon(event) {
    let content = event.detail
    http.put(`/tomatoes/${this.data.tomato.id}`, {
        description: content,
        aborted: true,
        ended_at: new Date()
      })
      .then(response => {
        this.goBack()
      })
      .catch(response => {
        this.goBack()
      })
  },

  showConfirm() {
    this.setData({
      confirmVisible: true
    })
    this.clearTimer()
  },
  tapDialogButton() {
    this.setData({
      finishConfirmVisible: false
    })
  },
  hideConfirm() {
    this.setData({
      confirmVisible: false
    })
    this.startTimer()
  },
  goBack() {
    wx.navigateBack({
      to: -1
    })
  },
  onHide() {
    // this.clearTimer()
    // http.put(`/tomatoes/${this.data.tomato.id}`, {
    //   description: "退出放弃",
    //   aborted: true
    // })
  },
  onUnload() {
    //   this.clearTimer()
    //   http.put(`/tomatoes/${this.data.tomato.id}`, {
    //     description: "退出放弃",
    //     aborted: true
    //   })
  },
})