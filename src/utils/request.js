import axios from 'axios'
import {
  MessageBox,
  Message,
  Notification,
  Loading
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
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
    if (typeof (func) === 'function') {
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
        CreateMessageBox(res.message, 'Confirm logout', 'warning', store.dispatch('user/resetToken').then(() => {
          location.reload()
        }))
        break
      case 50012:
        CreateMessageBox(res.message, 'Confirm logout', 'warning', store.dispatch('user/resetToken').then(() => {
          location.reload()
        }))
        break
      case 50014:
        CreateMessageBox(res.message, 'Confirm logout', 'warning', store.dispatch('user/resetToken').then(() => {
          location.reload()
        }))
        break
      case 2000:
        CreateNotify(res.message, '成功', 'success')
        break
      case -1:
        CreateNotify(res.message, '失败', 'error')
        break
      default:
        break
    }
    loadingInstance.close()
    return res
    // if (res.code === 50000) {
    //   Message({
    //     message: res.message || 'success',
    //     type: 'success',
    //     duration: 5 * 1000
    //   })
    // } else {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 2000) {

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;

    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    loadingInstance.close()
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
