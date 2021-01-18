import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import mdata from '../public/js/md5'
import inputData from '../public/js/input'
import utils from '../public/js/utils'
import moment from 'moment'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
const VueAwesomeSwiper = require('vue-awesome-swiper')

const md5 = require('md5')
const qs = require('qs')
// import VueJsonp from 'vue-jsonp'

require('element-ui/lib/theme-chalk/index.css')
require('swiper/dist/css/swiper.css')
require('../public/font/iconfont.css')
require('../public/css/return.scss')
require('../public/css/zy.css')

Vue.use(VueDirectiveImagePreviewer)
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
// Vue.use(VueJsonp)

Vue.prototype.$moment = moment // 时间转换js
Vue.prototype.$md5 = md5 // 加密js
Vue.prototype.$mdata = mdata // 手写加密方式
Vue.prototype.$stact = store // 缓存
Vue.prototype.$inputLen = inputData // 微信input导致页面上移问题
Vue.prototype.$utils = utils

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
    document.body.className = to.meta.className
  }
  next()
}) // 判断是否是开发模式
router.afterEach(() => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
})

const root = process.env.NODE_ENV === 'production' ? 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/' : '/apis'
axios.defaults.withCredentials = true // 存cookie的方法 该项目用不到
let axiosInstance = axios.create({
  baseURL: root,
  method: 'post',
  transformRequest: [
    function (data) {
      data = qs.stringify(data)
      return data
    }
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

Vue.prototype.$http = axiosInstance

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
