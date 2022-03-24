import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users  from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'



Vue.use(VueRouter)


const router= new VueRouter({
  routes: [
    // 路由/重定向到Login中
    {path: '/' ,  redirect: 'Login'},
    {path:'/Login', component: Login},
    // 设置home的子路由
    {path:'/Home', 
    component: Home,
    redirect:'/welcome',
    children:[
      // 子路由可以不跳转，就在home中显示,path表示监听到跳转的地址
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report}
      
      

    ]}

    
  ]
})

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to表示将要访问的路径
  // from代表从哪个路径跳转来
  // next是一个函数表示放行
  // next（）放行，next（'/login'）强制跳转

  if(to.path==='/login')return next()
  // 获取token
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
 export default router
