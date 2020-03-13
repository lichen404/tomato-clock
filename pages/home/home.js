// pages/home/home.js
const {
  http
} = require('../../lib/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    visibleConfirm: false,
    visibleUpdateConfirm: false,
    updateContent: "",
    animationData: {}

  },
  confirmCreate(event) {
    let content = event.detail
    if (content) {
      http.post('/todos', {
        completed: false,
        description: content
      }).then(response => {
        let todo = response.data.resource
        this.data.list.push(todo)
        this.setData({
          list: this.data.list
        })
        this.hideConfirm()
        console.log(this.data.list)
      })

    }
  },
  destroyTodo(event) {
    let index = event.currentTarget.dataset.index
    let id = event.currentTarget.dataset.id
    this.data.list[index].completed = true
    this.setData({
      list: this.data.list
    })
    http.delete(`/todos/${id}`).then(response => {
      console.log(response)
    })

  },
  hideConfirm() {
    this.setData({
      visibleConfirm: false
    })
  },
  showConfirm() {
    this.setData({
      visibleConfirm: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    http.get('/todos?completed=false').then(response => {
      this.setData({
        list: response.data.resources
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})