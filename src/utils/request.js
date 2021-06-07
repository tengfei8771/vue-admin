import axios from 'axios'
import { MessageBox, Message, Notification, Loading } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken, setToken } from '@/utils/auth'
import { refreshToken } from '@/api/user'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 遮罩层服务
let loadingInstance
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadingInstance = Loading.service({
      lock: true,
      text: '请等待',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Bear'] = getToken()
    }
    return config
  },
  error => {
    loadingInstance.close()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

function CreateMessageBox(message, messageTitle, type, func) {
  MessageBox.confirm(message, messageTitle, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type
  }).then(() => {
    if (typeof func === 'function') {
      func()
    }
  })
}

function CreateNotify(message, title, type) {
  Notification({
    title: title,
    message: message,
    type: type,
    position: 'bottom-right'
  })
}
/**
 * 下面的拦截器主要处理所有的请求返回显示,并且实现通过用refreashtoken刷新requettoken的功能
 * 现在是所有的请求失败之后都会放到缓存队列中等待重新请求,后续可以考虑在发起请求时直接拦截，然后再发起请求
 */
// 是否正在刷新的标记
let isRefreshing = false
// 把所有正在刷新过程中进入的请求缓存到这里,等token刷新完成后再继续执行请求
let retryRequests = []
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    const res = response.data
    switch (res.code) {
      case 50000:
        Message({
          message: res.message || 'success',
          type: 'success',
          duration: 5 * 1000
        })
        break
      case 50008:
        CreateMessageBox(
          res.message,
          'Confirm logout',
          'warning',
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        )
        break
      case 50012:
        CreateMessageBox(
          res.message,
          'Confirm logout',
          'warning',
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        )
        break
      case 50014:
        CreateMessageBox(
          res.message,
          'Confirm logout',
          'warning',
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        )
        break
      case 2001:
        CreateNotify(res.message, '成功', 'success')
        break
      case -1:
        CreateNotify(res.message, '失败', 'error')
        break
      default:
        break
    }
    loadingInstance.close()
    console.log(response)
    return response
  },
  error => {
    // 令牌过期
    if (error.response.data.code === 50016) {
      const config = error.config
      if (!isRefreshing) {
        isRefreshing = true
        let temp = {
          refreshToken: getRefreshToken()
        }
        refreshToken(temp)
          .then(res => {
            if (res.data.code === 60000) {
              setToken(res.data.items)
              // 获取token后立刻把刷新状态重置
              isRefreshing = false
            }
          })
          .catch(error => {
            // 获取token失败强制下线
            console.log('err' + error)
          })
          .then(() => {
            // 然后执行队列所有的请求
            retryRequests.forEach(cb => cb(getToken()))
            // 清空队列
            retryRequests = []
            // 重新执行认证失败的请求
            config.baseURL = ''

            return service.request(config)
          })
      } else {
        // 正在刷新状态吧所有的请求缓存
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          // @ts-ignore
          retryRequests.push(token => {
            config.baseURL = ''
            config.headers['Bear'] = token
            resolve(service.request(config))
          })
        })
      }
    } else {
      console.log('err' + error) // for debug
      loadingInstance.close()
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      // return Promise.reject(error)
    }
  }
)

export default service
