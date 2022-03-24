// main用来导入插件，导入总的，plugins具体导入插件里面的小组件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios，全局可以通过this调用
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// echart5.0以上引用方式
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 加载进度条
import NProgress from 'nprogress'
// 进度条样式
import 'nprogress/nprogress.css'


//配置请求根路径，后端api
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器，为请求加入token认证，固定写法
// 在request拦截器中展示进度条NProgress.start()
axios.interceptors.request.use(config =>{
  console.log(config)
  NProgress.start()
  // 让Authorization携带token对操作带权限，token正确才可以发起请求
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})

// 设置原型，this.$http调用，（this.$http.post或者this.$http.get）
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor,)

// 过滤器传时间数据originVal进来处理
Vue.filter('dateFormat',function(originVal){

  const dt =new Date(originVal)

  const y =dt.getFullYear()
  // 因mouth从0开始，所以需要加1
  // 不足两位前面补0，加一个空字符串
  // 不足两位用0填充
  const m =(dt.getMonth()+ 1 +'').padStart(2,'0')
  const d =(dt.getDate()+'').padStart(2,'0')
  const hh =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')
  // 返回模板字符串
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
