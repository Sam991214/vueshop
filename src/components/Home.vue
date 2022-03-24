<template>
    <!--头部 -->
    <el-container class="home-container">
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>天妇罗电商后台管理系统</span>
        </div>
         <el-button type='info' @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
  <el-container>
      <!-- 侧边栏 -->
      <!-- 根据isCollapse变化，一变换就切换width大小,true就折叠，false就不折叠 -->
    <el-aside :width="isCollapse ?'64px':'200px'">
        <!-- 侧边栏菜单区 -->

        <!-- 套索可以拉开缩放,toogleCollapse:折叠 -->
        <div class="toggle-button" @click="toogleCollapse">|||</div>

        <!-- 替换选中颜色active-text-color -->
        <!-- 调用element api 的unique-opened，必须：绑定属性bind，true才会实现打开一个菜单别的关闭，不绑定直接unique-opened=“true”，true只是字符串,collapse是布尔值，和前面设置一样 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true" :collapse="isCollapse"
       
        :collapse-transition="false" :router="true" :default-active=" activePath"> 
        <!-- 关闭折叠动画 --> 
        <!-- :router="true"----是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active="/users" 默认高亮选中对象 -->


     <!-- 一级菜单 -->
     <!-- 对menulist五个进行渲染，并且每个id绑定在key 上 -->
     <!-- 指定唯一index，如果是相同，点一个就都展开了，如果是唯一，点哪个就打开哪个 -->
     <!-- index只接受字符串不接受数字，在.id后加空字符串可以转为字符串,index要绑定，所以:语法糖绑定-->

      <el-submenu :index="item.id + '' "  v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板区 -->
        <template slot="title">
            <!-- 图标 -->
            <!-- 动态绑定图标-->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <!-- 双向绑定字段名称 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <!-- 遍历childre -->
            <!-- :index="subItem.id + '' "由数字改为英文path值，因为path中无/，所以加'/''  -->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavstate('/'+subItem.path)">
            <template slot="title">
            <!-- 图标 -->
            <!-- 图标由el-icon-location改成el-icon-menu -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
        
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
    
</template>

<script>
export default {
    data(){
        return {
            menulist:[
                
            ],
            // iconsObj绑定data的id，来决定哪个id对应哪个icon
            iconsObj:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-3702mima',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },

            // 是否折叠，需要动态绑定到collapse中
            isCollapse: false,

            // 被激活的链接default-active，双向保存
            activePath:''
           
        }

    },
    created(){
        // 通过axios获取菜单列表
        this.getMenuList()

        // 组件被执行时就要赋值,window下储存的activePath赋值给新activePath
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            // window api调用清除token然后重定向到'/login'
            window.sessionStorage.clear();
            this.$router.push("/login");

        },
        async getMenuList(){
            // 组件获取的res数据挂载到data中
            const {data:res}= await this.$http.get('menus')
            if (res.meta.status !== 200)return this.$message.console.error(res.mata.msg);
            this.menulist=res.data
            console.log(res)
        },
        
        // 折叠功能，绑定isCollapse事件
        toogleCollapse(){
            this.isCollapse = !this.isCollapse


        },

        // 保持连接激活状态，激活选中的id
        saveNavstate(activePath){
            // 设置sessionStorage的activePath
            window.sessionStorage.setItem('activePath',activePath )
            this.activePath =activePath
        }
    }
    
}
</script>

<style lang="less" scoped>
// 可直接选择组件类
.home-container
{
    // 最外页面撑满全屏
    height: 100%;
}
.el-header
{
    background-color: #373d41;
    display: flex;
    // 流动左右对齐
    justify-content:space-between;
    // 左侧无空白贴边对齐
    padding-left: 0;
    // 按钮不再上下贴边，居中
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    // 嵌套div使文本居中对齐
    >div {
        display: flex;
        align-items: center;
    span{
        // 图片和文本间隔
        margin-left: 15px;
        }
    }
}
.el-aside
{
    background-color: #373d41;
    .el-menu{
        // 去掉border右边对不齐的缺陷，因为展开右边有border实线
        border-right: none;

    }
    
}
.el-main{
    background-color: #EAEDF1;
}
.iconfont{
    // 为图标类和右边文字相隔
    margin-right: 10px;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    // 居中
    text-align: center;
    // 文字间距
    letter-spacing: 0.2em;
    cursor: pointer;


}

</style>
