<template>
    <div class="login-container">
        <div class="login-box"> 
       
        <!-- 头像盒子 -->
        <div class="avatar-box">
            <img src="../assets/logo.png" alt="">
        </div>

        <!-- 登录表单区域（element-ui） -->
        <!-- ref是form绑定dom对象，对这个对象声明一个函数，就可以用form-method里的方法函数，使用this可以调用 -->
         <el-form  ref="loginFormRef"  :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
           <!-- 用户名 -->
            <el-form-item  prop="username" >
             <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item  prop="password">
             <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns" >
               <el-button type="primary" @click="login">登录</el-button>
               <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
         </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data()
    {
        return{
            // 登录表单数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456',

            },
            
            // 表单验证规则对象
            loginFormRules:{
                // 验证用户名是否合法，blur：失去焦点时
                username:[ 
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                     { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }                    ],
                // 验证密码是否合法
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                     { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
        // 重置
        // 使用了form-method里的resetFields方法
        resetLoginForm(){
            // console.log(this)
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // 匿名函数小括号可以去掉
            // 使用了form-metho里的validate的表单验证方法，需要调整参数，不能直接（）调用
            this.$refs.loginFormRef.validate( async (valid) => {
                console.log(valid);
                if(!valid) return;
                // 1.因为只要result里面的data。所以要用｛｝解构方法，只要里面data并且赋值给res
                // const result=await this.$http.post('login',this.loginForm);
                // console.log(result)
                // await可以简化promise传回来的复杂函数，因为只要data，用到await就必须在这个函数外用async声明
                // this.$http可以用是因为main.js里把axios和后台交互引入
                const {data:res} =await this.$http.post('login',this.loginForm);
                 
                //  2.if(res.meta.status !== 200) return console.log('登录失败')
                //  console.log('登录成功')
                if(res.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 1.将登录成功后的token保存sessionstorage中不是localstorage中
           
                // 1.1 项目中除了登录外的api接口，必须登录后才可以访问
                // 1.2 token只在当前网站打开期间生效，所以将token保存在sessionstorage中
                         console.log(res)
                //  调用window的api
                window.sessionStorage.setItem('token',res.data.token)
                // 通过编程式导航$router.push跳转到后台主页，路由地址是/home
                this.$router.push('/home')

            })
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;
}
.login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

.avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    // 根据avatar-box宽度高度对上面进行位移，向左130px*50%，向上130px*50%

    transform: translate(-50%, -50%);

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color:#eee;
    }
        }

.login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    // 上下0，左右
    padding: 0 20px;
    box-sizing: border-box;
}


}

.btns{
    display: flex;
    // 横轴居右对齐
    justify-content: flex-end;
}
</style>
